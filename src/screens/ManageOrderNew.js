import React, { useEffect, useState, useRef } from "react";
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    DrawerLayoutAndroid,
    ToastAndroid,
    Alert,
    SafeAreaView,
} from "react-native";
import { useDispatch } from 'react-redux';
import { connect } from "react-redux";
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import AnimatedLoader from 'react-native-animated-loader';
import { BlurView } from '@react-native-community/blur';
import LinearGradient from "react-native-linear-gradient";
import * as Animatable from 'react-native-animatable';
import { formatCurrency } from "../common";
import io from 'socket.io-client';
import axios from '../services/axios';
import baseURL from "../services/const";
import ItemOrder from "./custom/ItemOrder";
function ManageOrder(props) {
    const user = props.user;
    const navigation = props.navigation;
    const order = props.route.params?.order || null;
    const [id_staff, setId_staff] = useState(1);
    const [listFood, setListFood] = useState([])
    const [table, setTable] = useState(order?.id || 0);
    const [typeFood, setTypeFood] = useState(0);
    const [note, setNote] = useState('');
    const [listDetail, setListDetail] = useState();
    const [openTable, setOpenTable] = useState(false);
    const [openTypeFood, setOpenTypeFood] = useState(false);
    const [noteVisible, setNoteVisible] = useState(true);
    const [loading, setLoading] = useState(true)
    const drawer = useRef(null);
    const socket = io(baseURL)
    const sts = 1;
    const dispatch = useDispatch();
    let VietNamDong = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });
    useEffect(() => {

        (async () => {
            getListFood();
          
        })().finally(() => {
            setLoading(!loading)
        })
    }, [])
    useEffect(() => {
        // getUser()
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
        <DrawerLayoutAndroid
            ref={drawer}
            drawerWidth={300}
            drawerPosition={'right'}
            renderNavigationView={navigationView}
            >
            <SafeAreaView style={{ height: '100%' }}>
                <LinearGradient colors={['#0693e3', '#fff']} style={styles.linearGradient}
                    start={{ x: 0.0, y: 0 }} end={{ x: 1, y: 0.75 }}>
                    <AnimatedLoader
                        source={require("../animation/animation_ll2in0tu.json")}
                        visible={loading}
                        overlayColor="rgba(255,255,255,0.75)"
                        animationStyle={styles.lottie}
                        speed={1}>
                        <Text>Đang tải...</Text>
                    </AnimatedLoader>
                    <View style={{
                        flexDirection: 'row',
                        borderBottomColor: '#ccc',
                        borderBottomWidth: 0.5,
                        marginBottom: 5,

                    }}>
                        <Animatable.Image source={{
                            uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSw_DHz4baaRqCuAK145KvHH_xfHXUfDwxzsA&usqp=CAU'
                        }} animation={'slideInDown'}
                            duration={500}
                            style={[{ height: 30, width: 30, borderRadius: 80, marginBottom: 'auto', marginTop: 'auto', marginRight: 8 }]}
                        ></Animatable.Image>
                        <Animatable.Text
                            animation={'fadeIn'}
                            duration={2000}
                            style={{
                                fontSize: 22,
                                color: '#fff',
                                fontWeight: '500', textTransform: 'uppercase', textAlign: 'center', marginTop: 20,
                                marginBottom: 16,
                            }}
                        >Tạo đơn</Animatable.Text>
                        <TouchableOpacity style={{ marginLeft: 'auto', marginTop: 'auto', marginBottom: 'auto' }} onPress={() => drawer.current.openDrawer()}><Icon name="list-ul" size={20} color='black'></Icon></TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: 'row', width: '30%', marginTop: 10, marginLeft: 'auto', marginRight: 'auto' }}>
                       <Text>Bàn số {table}</Text>
                    </View>
                    <View>
                        {/* {noteVisible && (
                            <BlurView
                                style={{ flex: 1, position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}
                                blurType="dark" // Loại hiệu ứng blur (light, dark, extra light)
                            />
                        )} */}
                        {listFood.length > 0 ? renderListFood() : <View><Text>Đang tải</Text></View>}
                    </View>

                    <View style={{ flexDirection: 'column', alignItems: 'center', flex: 1, width: '100%' }}>
                        <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}>
                            <TextInput
                                placeholder="Ghi chú..."
                                value={note}
                                onChangeText={(text) => setNote(text)}
                                style={[{ height: 90, width: '90%', marginVertical: 10 }, styles.textInputNote]}
                            />
                        </View>
                        <TouchableOpacity
                            onPress={() => {
                                handleOrder();
                            }}
                            style={[styles.btnAdd, { backgroundColor: '#00ecff99' }]}
                        >
                            <Text style={{ fontWeight: '600', color: '#555' }}>
                                {order != null ? 'Chỉnh sửa' : 'Tạo order'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </LinearGradient>
            </SafeAreaView>
        </DrawerLayoutAndroid>
    );
    function getListFood() {
        (async () => {
            let data = (await axios.get('/api/v1/food/get')).data.data;
            data = [...data.map(item => {
                return { ...item, quantity: 0 }
            })]
            setListFood([...data])
            setListDetail(props.route.params?.order.detail || [])
        })().catch(err => {
            console.log(err)
        })
    }
    function renderListFood() {
        return (
            <FlatList
                style={{
                    height: '60%', backgroundColor: 'transparent', marginTop: 10, borderBottomColor: '#ccc',
                    borderBottomWidth: 1,
                }}
                data={listFood}
                renderItem={itemFood}
                keyExtractor={(item) => item.id}
            />
        )
    }
    function itemFood({ index, item }) {
        return (
            <View style={{ height: 110, width: '95%', backgroundColor: '#bbffec57', marginLeft: 'auto', marginRight: 'auto', borderRadius: 10, alignItems: 'center', flexDirection: 'row', marginBottom: 8 }}>
                <Image source={{
                    uri: item.avatar,
                }}
                    style={{ height: '65%', width: '22%', margin: 10, borderRadius: 8 }}
                ></Image>
                <View style={{ marginLeft: 10 }}>
                    <Text style={[styles.textItem, { fontSize: 20 }]} numberOfLines={2}>{item.name}</Text>
                    <Text style={styles.textItem}>{formatCurrency(item.price)}</Text>
                </View>
                <View style={{ flexDirection: 'row', marginTop: 'auto', marginBottom: 15, maxWidth: '50%', marginRight: 20, marginLeft: 'auto' }}>
                    <TouchableOpacity onPress={() => handleMinus(item.id)}>
                        <Icon name='minus-circle' size={24} style={{ marginLeft: 10 }} color={'#e91323c9'} />
                    </TouchableOpacity>
                    <Text style={{ marginLeft: 10, paddingTop: 1, fontSize: 17 }}>{item.quantity}</Text>
                    <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => handlePlus(item.id)}>
                        <Icon name='plus-circle' size={24} color={'#1ee913c9'} />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
    function navigationView() {
        return (
            <View >
                <FlatList
                    data={listDetail}
                    renderItem={({ item }) => { return <ItemOrder item={item} /> }}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{
                    }}
                />
            </View>
        )
    }
    function handleMinus(id) {
        setListFood(listFood.map(item => {
            return item.id == id ? { ...item, quantity: item.quantity == 0 ? 0 : item.quantity - 1 } : { ...item }
        }))
    }
    function handlePlus(id) {
        setListFood(listFood.map(item => {
            return item.id == id ? { ...item, quantity: item.quantity > 100 ? 100 : item.quantity + 1 } : { ...item }
        }))
    }
    function handleOrder() {
        let data = {
            id: order.idOrder!=0 ? order.idOrder : null,
            table: table,
            id_staff: user.id,
            note: note,
            detail: [...listFood.filter(item => {
                return item.quantity > 0
            }).map(item => {
                return {
                    ...item,
                    id_food: item.id
                }
            })]
        }
        if (order.idOrder!=0) {
            socket.emit('updateOrderDetail', data)
            navigation.navigate('Home')
        }
        else {
            socket.emit('createOrder', data)
            navigation.navigate('Home')
        }

    }
}

const styles = StyleSheet.create({
    row: {
        flex: 1,
        justifyContent: "space-around"
    },
    textItem: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12
    },
    btnAdd: {
        padding: 12,
        borderRadius: 10
    },
    textInputNote: {
        padding: 10,
        borderWidth: 0.5,
        borderColor: '#ccc',
        borderRadius: 10,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    lottie: {
        width: 100,
        height: 100,
    },
    linearGradient: {
        paddingTop: 10,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 6,
        flex: 1
    },
});

export default connect(state => {
    return state
})(ManageOrder);