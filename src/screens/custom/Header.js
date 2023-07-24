import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/dist/Ionicons';
const Header = ({ title }) => {
    const navigation = useNavigation();
  return (
    <View style={styles.header}>
        {title.localeCompare('Trang chủ')!=0 ?
         <TouchableOpacity style={{position:'relative',zIndex:1,left:-120}}
         onPress={()=>navigation.goBack()}
         ><Icon name='arrow-back' size ={30} color={'black'}></Icon></TouchableOpacity>: null
        }
      <Text style={[styles.headerText]}>{title}</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: '#f7f7f773',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection:'row'
  },
  headerText: {
    // paddingLeft:120,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
});

export default Header;