import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function EditMenuScreen({ route, navigation }) {
  // Receive selected dish from previous screen (The IIE, 2025)
  const { item } = route.params;

  // Initialize states with existing dish info (The IIE, 2025)
  const [name, setName] = useState(item.name);
  const [description, setDescription] = useState(item.description);
  const [price, setPrice] = useState(item.price);

  // Update dish info in AsyncStorage (The IIE, 2025)
  const updateItem = async () => {
    const storedMenu = await AsyncStorage.getItem('menu');
    let menu = storedMenu ? JSON.parse(storedMenu) : [];

    // Replace the dish that matches the selected ID (The IIE, 2025)
    menu = menu.map((dish) =>
      dish.id === item.id ? { ...dish, name, description, price } : dish
    );

    // Save updated menu (The IIE, 2025)
    await AsyncStorage.setItem('menu', JSON.stringify(menu));
    navigation.goBack();
  };

  // Delete dish from the menu (The IIE, 2025)
  const deleteItem = async () => {
    const storedMenu = await AsyncStorage.getItem('menu');
    let menu = storedMenu ? JSON.parse(storedMenu) : [];

    // Remove dish by ID (The IIE, 2025)
    menu = menu.filter((dish) => dish.id !== item.id);

    // Save updated menu without the deleted item (The IIE, 2025)
    await AsyncStorage.setItem('menu', JSON.stringify(menu));
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Editable input fields for dish (The IIE, 2025) */}
      <TextInput style={styles.input} value={name} onChangeText={setName} />
      <TextInput style={styles.input} value={description} onChangeText={setDescription} />
      <TextInput style={styles.input} value={price} onChangeText={setPrice} />

      {/* Buttons for update and delete (The IIE, 2025) */}
      <Button title="Update Dish" onPress={updateItem} />
      <Button title="Delete Dish" color="red" onPress={deleteItem} />
    </View>
  );
}

// Styles for the edit screen (The IIE, 2025)
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
});

/*
Referencing:
- The IIE. 2025. Web Development [WEDE5020 Module Manual]. The Independent Institute of Education: Unpublished.
*/