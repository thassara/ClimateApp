import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Search, X } from 'lucide-react-native';

export function SearchBar() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <View style={styles.container}>
      <Search size={18} color="#888" style={{ marginRight: 8 }} />
      <TextInput
        style={styles.input}
        placeholder="Search location..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      {searchQuery.length > 0 && (
        <TouchableOpacity onPress={() => setSearchQuery('')}>
          <X size={18} color="#888" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
  },
});
