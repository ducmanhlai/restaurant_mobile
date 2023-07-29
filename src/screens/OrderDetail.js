import React, { useEffect, useState } from "react";
import {
    FlatList,
    Image,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { useSelector, useDispatch } from 'react-redux';
import { connect } from "react-redux";
import io from 'socket.io-client';
import baseURL from "../services/const";
import moment from "moment/moment";
function OrderDetail(props) {
    const navigation = props.navigation;
    const listOrder = props.listOrder;
    const listFood = props.listFood;
    const [modalVisible, setModalVisible] = useState(false);
    const [order, setOrder] = useState(props.route.params.order)
    const orderDetail = order.detail.filter(item=>{
        return item.status!=3
    })
    const socket = io(baseURL)
    const sts = 1;
    const dispatch = useDispatch();
    let VietNamDong = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });
    useEffect(() => {

    }, [])
    useEffect(() => {
        socket.on('connect', function () {
            // socket.emit('authenticate', { token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcl9uYW1lIjoibmhhbnZpZW4xIiwicGFzc3dvcmQiOiIkMmIkMTAkWVFGRjRZcnpTc0tHMzVJNnpZb2tST1A3em50akZPUjZwc2Uya2J1T2g5a0luamZDd2FPZFciLCJyb2xlIjozLCJsb2NrIjowLCJpYXQiOjE2ODk4NDYxNzEsImV4cCI6MTY4OTg2NDE3MX0.U42IXmzEeaSarhLzhZU1i0z0sK3sVTVd32KcLKGDBz8' });
            socket.on('err', (err) => {
                ToastAndroid.show('Lỗi')
            })
            socket.on('authenticate', data => {
                console.log(data)
            })
        });
        return () => {
            socket.disconnect()
        }
    }, [sts])
    return (
        <View style={{ height: '100%', width: '100%', }}>
            <Modal animationType="slide" visible={modalVisible}></Modal>
            <View style={{ backgroundColor: 'white', zIndex: 1, minHeight: '10%', justifyContent: 'space-evenly' }}>
                <Text style={{ color: 'black' }}>Bàn số: {order.table}</Text>
                <Text style={{ color: 'black' }}>Giờ tạo: {moment(order.time).format("HH:mm DD/MM/YYYY")}</Text>
                <Text style={{ color: 'black' }}>Tổng tiền: {50000}</Text>
            </View>
            <FlatList
                style={{ maxHeight: '80%', backgroundColor: 'white', paddingRight: 10, position: 'relative', zIndex: 1 }}
                data={orderDetail}
                renderItem={itemFood}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{
                    flexGrow: 1,
                }}
            />
            <View style={{ backgroundColor: 'white', minHeight: '15%', width: '100%', alignItems: 'center', flexDirection: 'row', marginHorizontal: 10, position: 'relative', zIndex: 2 }}>
                <TouchableOpacity style={{ height: '30%', backgroundColor: '#ed2222', flex: 1, alignItems: 'center', justifyContent: "center", marginRight: 15, borderRadius: 10 }}><Text style={{ fontSize: 18, color: 'white', fontWeight: '700' }}>Quay lại</Text></TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        socket.emit('payOrder',order)
                    }}
                    style={{ height: '30%', backgroundColor: '#00ecff99', flex: 1, alignItems: 'center', justifyContent: "center", marginRight: 15, borderRadius: 10 }}>
                    <Text style={{ fontSize: 18, color: 'white', fontWeight: '700' }}>Xác nhận</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    function itemFood({ index, item }) {
        let food = getDetailFood(item.id_dish)
        return (
            <View style={{ height: 100, width: '100%', backgroundColor: '#bbffec57', margin: 10, borderRadius: 20, alignItems: 'center', flexDirection: 'row' }}>
                <Image source={{
                    uri: food?.avatar,
                }}
                    style={{ height: 80, flex: 2, margin: 10, borderRadius: 20 }}
                ></Image>
                <View style={{ flex: 3 }}>
                    <Text>{food.name}</Text>
                    <Text>{VietNamDong.format(item.price)}</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ paddingTop: 1, }}>Số lượng: </Text>
                        <Text style={{ marginLeft: 3, paddingTop: 1, }}>{item.quantity}</Text>
                    </View>
                </View>
                {/* <TouchableOpacity style={{ height: '50%', backgroundColor: '#ed2222', flex: 1, alignItems: 'center', justifyContent: "center", marginRight: 15, borderRadius: 10 }}><Text style={{ fontSize: 18, color: 'white' }}>Hủy</Text></TouchableOpacity> */}
            </View>
        )
    }
    function getDetailFood(id) {
        for (let i of listFood) {
            if (i.id == id) {
                return i
            }
        }
    }
}


const styles = StyleSheet.create({
    row: {
        flex: 1,
        justifyContent: "space-around"
    },
    textInputNote: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 20,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4, // For Android shadow
    },
});

export default connect(state => {
    return state
})(OrderDetail);