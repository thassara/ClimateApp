import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import React, { use } from 'react';
import { Colors } from '../../constants/Color';
import Ionicons from '@expo/vector-icons/Ionicons';

type Props = {};

const Header: React.FC<Props> = props => {
  return (
    <View style={styles.container}>
      <View style={styles.useInfo}>
        <Image
          source={{ uri: 'https://example.com/logo.png' }}
          style={styles.useImg}
        />
        <View style={{ gap: 3 }}>
          <Text style={styles.welcomeTxt}>WelCome!</Text>
          <Text style={styles.userName}>Madush</Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => {}}>
        <Ionicons name="notifications-outline" size={24} color={Colors.black} />
      </TouchableOpacity>
    </View>
  );
};
export default Header;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  useImg: {
    width: 50,
    height: 50,
    borderRadius: 30,
  },
  useInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  welcomeTxt: {
    fontSize: 12,
    color: Colors.darkGray,
  },
  userName : {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.black,
  },
});
