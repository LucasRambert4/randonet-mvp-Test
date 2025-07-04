import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { useAuth } from '../context/AuthContext';

import HomeScreen from '../screens/SharedActivity';
import ChatScreen from '../screens/Chat';
import ExploreScreen from '../screens/Explore';
import LoginScreen from '../screens/Login';
import LoaderScreen from '../screens/Loader';
import ProfileScreen from '../screens/Profile';
import MyRoutesScreen from '../screens/MyRoutes';
import PrivacyScreen from '../screens/Privacy';
import ActivityDetailScreen from '../screens/ActivityDetail';
import UserSearchScreen from '../screens/UserSearch';
import UserProfileScreen from '../screens/UserProfile';
import RecordActivityScreen from '../screens/RecordActivity';
import SaveActivityScreen from '../screens/SaveActivity';
import TrailDetailsScreen from '../screens/TrailDetail';
import CustomDrawerContent from '../components/Drawer';
import SOSModalTrigger from '../components/SOS';

import {
  HomeStackParamList,
  ChatStackParamList,
  RecordStackParamList,
  ExploreStackParamList,
  MainTabParamList,
} from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();
const Drawer = createDrawerNavigator();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const ChatStack = createNativeStackNavigator<ChatStackParamList>();
const RecordStack = createNativeStackNavigator<RecordStackParamList>();
const ExploreStack = createNativeStackNavigator<ExploreStackParamList>();

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

function ChatStackNavigator() {
  return (
    <ChatStack.Navigator screenOptions={{ headerShown: false }}>
      <ChatStack.Screen name="ChatMain" component={ChatScreen} />
      <ChatStack.Screen name="UserSearch" component={UserSearchScreen} />
    </ChatStack.Navigator>
  );
}

function RecordStackNavigator() {
  return (
    <RecordStack.Navigator screenOptions={{ headerShown: false }}>
      <RecordStack.Screen name="RecordMain" component={RecordActivityScreen} />
      <RecordStack.Screen name="SaveActivity" component={SaveActivityScreen} />
    </RecordStack.Navigator>
  );
}

function ExploreStackNavigator() {
  return (
    <ExploreStack.Navigator screenOptions={{ headerShown: false }}>
      <ExploreStack.Screen name="ExploreMain" component={ExploreScreen} />
      <ExploreStack.Screen name="TrailDetails" component={TrailDetailsScreen} />
    </ExploreStack.Navigator>
  );
}

function DummyScreen() {
  return null;
}

function MainTabs() {
  const [modalVisible, setModalVisible] = useState(false);
  const { t } = useTranslation();

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
          tabBarLabel:
            {
              Home: t('nav.home'),
              Record: t('nav.record'),
              Chat: t('nav.chat'),
              Explore: t('nav.explore'),
              SOS: t('nav.sos'),
            }[route.name] || route.name,
        })}
      >
        <Tab.Screen
          name="Home"
          component={HomeStackNavigator}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              if (navigation.isFocused()) {
                navigation.navigate('Home', {
                  screen: 'HomeMain',
                  key: Math.random().toString(),
                });
              }
            },
          })}
        />

        <Tab.Screen
          name="Chat"
          component={ChatStackNavigator}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              if (navigation.isFocused()) {
                navigation.navigate('Chat', {
                  screen: 'ChatMain',
                  key: Math.random().toString(),
                });
              }
            },
          })}
        />

        <Tab.Screen
          name="Record"
          component={RecordStackNavigator}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              if (navigation.isFocused()) {
                navigation.navigate('Record', {
                  screen: 'RecordMain',
                  key: Math.random().toString(),
                });
              }
            },
          })}
        />

        <Tab.Screen
          name="Explore"
          component={ExploreStackNavigator}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              if (navigation.isFocused()) {
                navigation.navigate('Explore', {
                  screen: 'ExploreMain',
                  key: Math.random().toString(),
                });
              }
            },
          })}
        />

        <Tab.Screen
          name="SOS"
          component={DummyScreen}
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

  if (loading || showLoader) {
    return <LoaderScreen />;
  }

  return user ? <AppDrawer /> : <LoginScreen />;
}
