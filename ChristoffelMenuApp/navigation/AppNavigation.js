// Import required modules for screen navigation (The IIE, 2025)
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import AddMenuScreen from '../screens/AddMenuScreen';
import EditMenuScreen from '../screens/EditMenuScreen';

// Create the navigation stack (The IIE, 2025)
const Stack = createStackNavigator();

// Define the routes (The IIE, 2025)
export default function AppNavigator() {
  return (
    <Stack.Navigator>
      {/* Home screen showing the current menu (The IIE, 2025) */}
      <Stack.Screen name="Home" component={HomeScreen} />
      {/* Screen to add new menu items (The IIE, 2025) */}
      <Stack.Screen name="AddMenu" component={AddMenuScreen} />
      {/* Screen to edit or delete existing dishes (The IIE, 2025) */}
      <Stack.Screen name="EditMenu" component={EditMenuScreen} />
    </Stack.Navigator>
  );
}
