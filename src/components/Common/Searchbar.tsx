import { StyleSheet,Text,View,TextInput } from "react-native";
import React from "react";
import { Colors } from "../../constants/Color";
import Ionicons from '@expo/vector-icons/Ionicons';


type Props = {};

const SearchBar: React.FC<Props> = (props) => {
  return (
    <View style={styles.container}>
    <View >
        <Ionicons name='search-outline' size={20} color={Colors.lightGray} />
        <TextInput placeholder="Search"
          placeholderTextColor={Colors.lightGray} 
          style={styles.searchTxt}
          autoCapitalize="none"/>
    </View>
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  container: {
   marginHorizontal: 20,
  },
  SearchBar:{
    backgroundColor: '#E4E4E4',
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchTxt: {
    fontSize: 12,
    color: Colors.darkGray,
    flex: 1,
  },
});