import React, {  useState, } from "react";
import {
    Image,
    Text,
    TouchableOpacity,
    View,
    Alert,
} from "react-native";
import { connect } from "react-redux";
import { formatCurrency } from "../../common";
import io from 'socket.io-client';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import baseURL from "../../services/const";
function ItemTable(props) {
    const item = props.item;
    const navigation = props.navigation;
    console.log(item)
    return (   
        <View style={{ height: 100, width: '40%', backgroundColor: item.isHollow ? '#bbffec57' :'white', margin: 10, borderRadius: 20, alignItems: 'center', flexDirection: 'row' }}>
           <TouchableOpacity onPress={() => navigation.navigate('ManageOrder',{ order: item })} style={{height:'100%', width:'100%',justifyContent:'center',alignItems:'center'}}>
            <Text>{item.name}</Text>
           </TouchableOpacity>
        </View>
    )
}
export default connect(state => {
    return state
  })(ItemTable);