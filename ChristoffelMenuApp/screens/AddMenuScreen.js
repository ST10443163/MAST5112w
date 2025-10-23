import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

export default function AddMenuScreen({ navigation }) {
  // Input states for dish details (The IIE, 2025)
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');

  // Function to save new dish to AsyncStorage (The IIE, 2025)
  const saveItem = async () => {
    const newItem = { id: uuidv4(), name, description, price };

    // Get existing menu (if any) (The IIE, 2025)
    const storedMenu = await AsyncStorage.getItem('menu');
    const menu = storedMenu ? JSON.parse(storedMenu) : [];

    // Add new dish to menu array (The IIE, 2025)
    menu.push(newItem);

    // Save updated menu
    await AsyncStorage.setItem('menu', JSON.stringify(menu));

    // Navigate back to home (The IIE, 2025)
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Input fields for dish details (The IIE, 2025) */}
      <TextInput
        placeholder="Dish Name"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />
      <TextInput
        placeholder="Description"
        style={styles.input}
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        placeholder="Price (R)"
        style={styles.input}
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />
      {/* Save button (The IIE, 2025) */}
      <Button title="Save Dish" onPress={saveItem} />
    </View>
  );
}

// Styles for the Add Menu screen (The IIE, 2025)
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
