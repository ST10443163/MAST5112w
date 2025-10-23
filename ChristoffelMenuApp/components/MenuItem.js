import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

export default function MenuItem({ item, onPress }) {
  return (
    // Touchable card for each dish (The IIE, 2025)
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <View>
        {/* Dish name (The IIE, 2025) */}
        <Text style={styles.name}>{item.name}</Text>
        {/* Short description (The IIE, 2025) */}
        <Text style={styles.desc}>{item.description}</Text>
        {/* Dish price (The IIE, 2025) */}
        <Text style={styles.price}>R{item.price}</Text>
      </View>
    </TouchableOpacity>
  );
}

// Styles for the menu card (The IIE, 2025)
const styles = StyleSheet.create({
  item: {
    padding: 15,
    marginVertical: 8,
    backgroundColor: '#f4f4f4',
    borderRadius: 10,
  },
  name: { fontSize: 18, fontWeight: 'bold' },
  desc: { color: '#555' },
  price: { color: '#2b9348', marginTop: 5 },
});

/*
Referencing:
- The IIE. 2025. Web Development [WEDE5020 Module Manual]. The Independent Institute of Education: Unpublished.
*/