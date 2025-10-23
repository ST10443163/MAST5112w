// Import React and NavigationContainer to enable navigation across screens (The IIE, 2025)
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';

// App entry point (The IIE, 2025)
export default function App() {
  return (
    // Wraps all screens in a NavigationContainer (The IIE, 2025)
    <NavigationContainer>
      {/* Calls our navigation setup (The IIE, 2025) */}
      <AppNavigator />
    </NavigationContainer>
  );
}
