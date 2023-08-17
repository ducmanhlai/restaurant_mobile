import React, { useState, } from "react";
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
function ItemOrder(props) {
    const listFood = props.listFood
    const socket = io(baseURL)
    const item = props.item;
    const user = props.user;
    const food = getDetailFood(item.id_dish)
    const [isCancel, setIsCancel] = useState(item.status == 1)
    return (
        <View style={{ height: 100, width: '100%', backgroundColor: '#bbffec57', margin: 10, borderRadius: 20, alignItems: 'center', flexDirection: 'row' }}>
            <Image source={{
                uri: food?.avatar,
            }}
                style={{ height: 80, flex: 2, margin: 10, borderRadius: 20 }}
            ></Image>
            <View style={{ flex: 3 }}>
                <Text>{food.name}</Text>
                <Text>{formatCurrency(item.price)}</Text>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ paddingTop: 1, }}>Số lượng: </Text>
                    <Text style={{ marginLeft: 3, paddingTop: 1, }}>{item.quantity}</Text>
                </View>
            </View>
            {
                user.role == 4 ?
                    <TouchableOpacity
                        disabled={!isCancel}
                        onPress={() => {
                            socket.emit('updateStatusDetail', {
                                "id": item.id,
                                "status": 2
                            })
                            Alert.alert('Thông báo', 'Đã hoàn thành')
                            setIsCancel(false)
                        }}
                        style={{ height: '50%', backgroundColor: '#0693e3', flex: 1, alignItems: 'center', justifyContent: "center", marginRight: 15, borderRadius: 10, opacity: isCancel ? 1 : 0.5 }}>
                        <Icon name='check' size={18} color={'white'}></Icon>
                    </TouchableOpacity>
                    : null
            }

            <TouchableOpacity
                disabled={!isCancel}
                onPress={() => {
                    socket.emit('updateStatusDetail', {
                        "id": item.id,
                        "status": 3
                    })
                    Alert.alert('Thông báo', 'Đã hủy')
                    setIsCancel(false)
                }}
                style={{ height: '50%', backgroundColor: '#ed2222', flex: 1, alignItems: 'center', justifyContent: "center", marginRight: 15, borderRadius: 10, opacity: isCancel ? 1 : 0.5 }}>
                <Icon name='remove' size={18} color={'white'}></Icon>
            </TouchableOpacity>
        </View>
    )
    function getDetailFood(id) {
        for (let i of listFood) {
            if (i.id == id) {
                return i
            }
        }
    }
}
export default connect(state => {
    return state
})(ItemOrder);