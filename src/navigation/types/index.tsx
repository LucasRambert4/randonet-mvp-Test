import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../../context/AuthContext';

import HomeScreen from '../../screens/Home/HomeScreen';
import ChatScreen from '../../screens/Chat/ChatScreen';
import SavedScreen from '../../screens/Saved/SavedScreen';
import LoginScreen from '../../screens/Login/LoginScreen';
import LoaderScreen from '../../screens/Loader/LoaderScreen';
import ProfileScreen from '../../screens/Profile/ProfileScreen';
import MyRoutesScreen from '../../screens/MyRoutes/MyRoutesScreen';
import AccountScreen from '../../screens/Account/AccountScreen';
import PrivacyScreen from '../../screens/Privacy/PrivacyScreen';
import ActivityDetailScreen from '../../screens/ActivityDetail/ActivityDetailScreen';
import UserSearchScreen from '../../screens/UserSearch/UserSearchScreen';
import UserProfileScreen from '../../screens/UserSearch/UserProfileScreen';
import RecordActivityScreen from '../../screens/RecordActivity/RecordActivityScreen';
import SaveActivityScreen from '../../screens/RecordActivity/SaveActivityScreen';

import CustomDrawerContent from '../../components/Drawer/CustomDrawerContent';
import SOSModalTrigger from '../../components/SOS/SOSModalTrigger';

import * as Location from 'expo-location';

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
};

const HomeStack = createNativeStackNavigator();

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeMain" component={HomeScreen} />
      <HomeStack.Screen name="MyRoutes" component={MyRoutesScreen} />
    </HomeStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator();

function MainTabs() {
  const [modalVisible, setModalVisible] = React.useState(false);

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
          tabBarLabelStyle: { fontSize: 12 },
          tabBarStyle: {
            backgroundColor: '#013220',
            height: 110,
            paddingTop: 5,
            borderTopWidth: 0.5,
            borderTopColor: 'transparent',
          },
          headerShown: false,
          tabBarIcon: ({ color }) => {
            let iconName: string;
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
              case 'Saved':
                iconName = 'bookmark';
                break;
              case 'SOS':
                iconName = 'alert-circle';
                break;
              default:
                iconName = 'ellipse';
            }
            return <Ionicons name={iconName as any} size={24} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeStackNavigator} />
        <Tab.Screen name="Chat" component={ChatScreen} />
        <Tab.Screen name="Record" component={RecordActivityScreen} />
        <Tab.Screen name="Saved" component={MyRoutesScreen} />
        <Tab.Screen
          name="SOS"
          component={() => null}
          options={{
            tabBarLabel: 'SOS',
          }}
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
      <Drawer.Screen name="Account" component={AccountScreen} />
      <Drawer.Screen name="Privacy" component={PrivacyScreen} />
    </Drawer.Navigator>
  );
}

export default function Navigation() {
  const { user, loading } = useAuth();
  const [showLoader, setShowLoader] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 2000);
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
        </>
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
}
