// App.tsx
import './src/i18n';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-gesture-handler';
import Navigation from './src/navigation/types/navigation';
import { AuthProvider } from './src/context/AuthContext';
import ErrorBoundary from './src/components/ErrorBoundary';

export default function App() {
  return (
    <AuthProvider>
      <ErrorBoundary>
        <SafeAreaProvider>
          <NavigationContainer>
            <Navigation />
          </NavigationContainer>
        </SafeAreaProvider>
      </ErrorBoundary>
    </AuthProvider>
  );
}
