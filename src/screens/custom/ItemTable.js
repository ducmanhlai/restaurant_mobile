import React, { useState, } from "react";
import {
    Image,
    Text,
    TouchableOpacity,
    View,
    Alert,
    StyleSheet,
} from "react-native";
import { connect } from "react-redux";
import { formatCurrency } from "../../common";
import io from 'socket.io-client';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import baseURL from "../../services/const";
function ItemTable(props) {
    const item = props.item;
    const navigation = props.navigation;
    const user = props.user
    return (
        <TouchableOpacity onPress={() => { user.role != 4 ? navigation.navigate('ManageOrder', { order: item }) : navigation.navigate('Kitchen', { order: item }) }}
            style={[{ backgroundColor: item.isHollow ? 'rgba(247, 13, 13, 0.8)' : '#8de3ef' }, styles.container]}>
            <Text style={{fontSize:18,fontWeight:'700',textTransform:'capitalize',color:'#f7f7f7e6'}}>{item.name}</Text>
        </TouchableOpacity>

    )
}
const styles = StyleSheet.create({
    container: {
        shadowColor: 'white',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
        elevation: 2,
        height: 100,
        width: '45%',
        margin: 10,
        borderRadius: 5,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: "center",
        alignItems: "center"
    }
})
export default connect(state => {
    return state
})(ItemTable);