import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';

import { useAuth } from '../../context/AuthContext';

// Screens
import HomeScreen from '../../screens/SharedActivity/SharedActivityScreen ';
import ChatScreen from '../../screens/Chat/ChatScreen';
import ExploreScreen from '../../screens/Explore/ExploreScreen';
import LoginScreen from '../../screens/Login/LoginScreen';
import LoaderScreen from '../../screens/Loader/LoaderScreen';
import ProfileScreen from '../../screens/Profile/ProfileScreen';
import MyRoutesScreen from '../../screens/MyRoutes/MyRoutesScreen';
import PrivacyScreen from '../../screens/Privacy/PrivacyScreen';
import ActivityDetailScreen from '../../screens/ActivityDetail/ActivityDetailScreen';
import UserSearchScreen from '../../screens/UserSearch/UserSearchScreen';
import UserProfileScreen from '../../screens/UserSearch/UserProfileScreen';
import RecordActivityScreen from '../../screens/RecordActivity/RecordActivityScreen';
import SaveActivityScreen from '../../screens/RecordActivity/SaveActivityScreen';
import TrailDetailsScreen from '../../screens/Explore/TrailDetailScreen';

import CustomDrawerContent from '../../components/Drawer/CustomDrawerContent';
import SOSModalTrigger from '../../components/SOS/SOSModalTrigger';

export type RootStackParamList = {
  MainApp: undefined;
  Login: undefined;
  ActivityDetail: undefined;
  UserSearch: undefined;
  UserProfile: undefined;
  SaveActivity: {
    route: Location.LocationObjectCoords[];
    distance: number;
    startTime: Date | null;
    endTime: Date;
  };
  TrailDetails: { trail: any };
};

const HomeStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator();

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeMain" component={HomeScreen} />
      <HomeStack.Screen name="MyRoutes" component={MyRoutesScreen} />
    </HomeStack.Navigator>
  );
}

function DummyScreen() {
  return null;
}

function MainTabs() {
  const [modalVisible, setModalVisible] = useState(false);

  const handleComplete = () => {
    setModalVisible(false);
    console.log('🚨 Emergency contacted!');
  };

  return (
    <>
      <SOSModalTrigger
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onComplete={handleComplete}
      />
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={({ route }) => ({
          tabBarActiveTintColor: 'white',
          tabBarInactiveTintColor: 'gray',
          tabBarLabelStyle: { fontSize: 12, marginBottom: 0 },
          tabBarItemStyle: { paddingVertical: 5 },
          tabBarStyle: {
            backgroundColor: '#013220',
            height: 115,
            paddingBottom: 45,
            borderTopWidth: 0,
          },
          headerShown: false,
          tabBarIcon: ({ color }) => {
            let iconName;
            switch (route.name) {
              case 'Home':
                iconName = 'home';
                break;
              case 'Record':
                iconName = 'add-circle-outline';
                break;
              case 'Chat':
                iconName = 'chatbox-ellipses';
                break;
              case 'Explore':
                iconName = 'compass';
                break;
              case 'SOS':
                iconName = 'alert-circle';
                break;
              default:
                iconName = 'ellipse';
            }
            return (
              <Ionicons
                name={iconName as any}
                size={22}
                color={color}
                style={{ padding: 4, borderRadius: 22 }}
              />
            );
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeStackNavigator} />
        <Tab.Screen name="Chat" component={ChatScreen} />
        <Tab.Screen name="Record" component={RecordActivityScreen} />
        <Tab.Screen name="Explore" component={ExploreScreen} />
        <Tab.Screen
          name="SOS"
          component={DummyScreen}
          options={{ tabBarLabel: 'SOS' }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              setModalVisible(true);
            },
          }}
        />
      </Tab.Navigator>
    </>
  );
}

function AppDrawer() {
  return (
    <Drawer.Navigator
      screenOptions={{ headerShown: false }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="HomeTabs" component={MainTabs} />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
      <Drawer.Screen name="MyRoutes" component={MyRoutesScreen} />
      <Drawer.Screen name="Privacy" component={PrivacyScreen} />
    </Drawer.Navigator>
  );
}

export default function Navigation() {
  const { user, loading } = useAuth();
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowLoader(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading || showLoader) return <LoaderScreen />;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <>
          <Stack.Screen name="MainApp" component={AppDrawer} />
          <Stack.Screen name="SaveActivity" component={SaveActivityScreen} />
          <Stack.Screen
            name="ActivityDetail"
            component={ActivityDetailScreen}
          />
          <Stack.Screen name="UserSearch" component={UserSearchScreen} />
          <Stack.Screen name="UserProfile" component={UserProfileScreen} />
          <Stack.Screen name="TrailDetails" component={TrailDetailsScreen} />
        </>
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
}
