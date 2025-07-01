// ====================
// Imports
// ====================

import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../../context/AuthContext';

// Screens
import HomeScreen from '../../screens/SharedActivity';
import ChatScreen from '../../screens/Chat';
import ExploreScreen from '../../screens/Explore';
import LoginScreen from '../../screens/Login';
import LoaderScreen from '../../screens/Loader';
import ProfileScreen from '../../screens/Profile';
import MyRoutesScreen from '../../screens/MyRoutes';
import PrivacyScreen from '../../screens/Privacy';
import ActivityDetailScreen from '../../screens/ActivityDetail';
import UserSearchScreen from '../../screens/UserSearch';
import UserProfileScreen from '../../screens/UserProfile';
import RecordActivityScreen from '../../screens/RecordActivity';
import SaveActivityScreen from '../../screens/SaveActivity';
import TrailDetailsScreen from '../../screens/TrailDetail';
import CustomDrawerContent from '../../components/Drawer/CustomDrawerContent';
import SOSModalTrigger from '../../components/SOS/SOSModalTrigger';

// Shared types for nested stacks
import {
  HomeStackParamList,
  ChatStackParamList,
  RecordStackParamList,
  ExploreStackParamList,
  MainTabParamList,
} from './types';

// ====================
// Navigator Instances
// ====================

const Tab = createBottomTabNavigator<MainTabParamList>();
const Drawer = createDrawerNavigator();

const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const ChatStack = createNativeStackNavigator<ChatStackParamList>();
const RecordStack = createNativeStackNavigator<RecordStackParamList>();
const ExploreStack = createNativeStackNavigator<ExploreStackParamList>();

// ====================
// Home Stack Navigator
// ====================

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeMain" component={HomeScreen} />
      <HomeStack.Screen name="MyRoutes" component={MyRoutesScreen} />
      <HomeStack.Screen name="Profile" component={ProfileScreen} />
      <HomeStack.Screen name="Privacy" component={PrivacyScreen} />
      <HomeStack.Screen name="UserProfile" component={UserProfileScreen} />
      <HomeStack.Screen
        name="ActivityDetail"
        component={ActivityDetailScreen}
      />
    </HomeStack.Navigator>
  );
}

// ====================
// Chat Stack Navigator
// ====================

function ChatStackNavigator() {
  return (
    <ChatStack.Navigator screenOptions={{ headerShown: false }}>
      <ChatStack.Screen name="ChatMain" component={ChatScreen} />
      <ChatStack.Screen name="UserSearch" component={UserSearchScreen} />
    </ChatStack.Navigator>
  );
}

// ====================
// Record Stack Navigator
// ====================

function RecordStackNavigator() {
  return (
    <RecordStack.Navigator screenOptions={{ headerShown: false }}>
      <RecordStack.Screen name="RecordMain" component={RecordActivityScreen} />
      <RecordStack.Screen name="SaveActivity" component={SaveActivityScreen} />
    </RecordStack.Navigator>
  );
}

// ====================
// Explore Stack Navigator
// ====================

function ExploreStackNavigator() {
  return (
    <ExploreStack.Navigator screenOptions={{ headerShown: false }}>
      <ExploreStack.Screen name="ExploreMain" component={ExploreScreen} />
      <ExploreStack.Screen name="TrailDetails" component={TrailDetailsScreen} />
    </ExploreStack.Navigator>
  );
}

// ====================
// Dummy Screen for SOS
// ====================

function DummyScreen() {
  return null;
}

// ====================
// Main Tabs Navigator
// ====================

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
          tabBarLabelStyle: { fontSize: 12 },
          tabBarItemStyle: { paddingVertical: 5 },
          tabBarStyle: {
            backgroundColor: '#013220',
            height: 115,
            paddingBottom: 45,
            borderTopWidth: 0,
          },
          headerShown: false,
          tabBarIcon: ({ color }) => {
            const iconName =
              {
                Home: 'home',
                Record: 'add-circle-outline',
                Chat: 'chatbox-ellipses',
                Explore: 'compass',
                SOS: 'alert-circle',
              }[route.name] || 'ellipse';

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
        <Tab.Screen name="Chat" component={ChatStackNavigator} />
        <Tab.Screen name="Record" component={RecordStackNavigator} />
        <Tab.Screen name="Explore" component={ExploreStackNavigator} />
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

// ====================
// App Drawer Navigator
// ====================

function AppDrawer() {
  return (
    <Drawer.Navigator
      screenOptions={{ headerShown: false }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="HomeTabs" component={MainTabs} />
    </Drawer.Navigator>
  );
}

// ====================
// Root Navigation
// ====================

export default function Navigation() {
  const { user, loading } = useAuth();
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowLoader(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading || showLoader) {
    return <LoaderScreen />;
  }

  return user ? <AppDrawer /> : <LoginScreen />;
}
