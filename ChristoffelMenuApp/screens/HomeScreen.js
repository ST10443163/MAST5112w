import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MenuItem from '../components/MenuItem';

export default function HomeScreen({ navigation }) {
  // Holds the list of dishes (The IIE, 2025)
  const [menu, setMenu] = useState([]);

  // Load menu data whenever screen is focused (The IIE, 2025)
  useEffect(() => {
    const loadMenu = async () => {
      const storedMenu = await AsyncStorage.getItem('menu');
      if (storedMenu) setMenu(JSON.parse(storedMenu));
    };

    // Refreshes the menu whenever the user returns to the Home screen (The IIE, 2025)
    const unsubscribe = navigation.addListener('focus', loadMenu);
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* App title (The IIE, 2025) */}
      <Text style={styles.title}>Christoffel’s Menu</Text>

      {/* Displays the dishes as a scrollable list (The IIE, 2025) */}
      <FlatList
        data={menu}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          // Clicking a dish opens the edit screen (The IIE, 2025)
          <MenuItem item={item} onPress={() => navigation.navigate('EditMenu', { item })} />
        )}
      />

      {/* Button to add a new dish (The IIE, 2025) */}
      <Button title="Add New Dish" onPress={() => navigation.navigate('AddMenu')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
});
