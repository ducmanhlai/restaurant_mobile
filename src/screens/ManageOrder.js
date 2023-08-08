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
} from "react-native";
import { useDispatch } from 'react-redux';
import { connect } from "react-redux";
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import AnimatedLoader from 'react-native-animated-loader';
import { formatCurrency } from "../common";
import io from 'socket.io-client';
import axios from '../services/axios';
import baseURL from "../services/const";
import ItemOrder from "./custom/ItemOrder";
function ManageOrder(props) {
    const navigation = props.navigation;
    const order = props.route.params?.order || null;
    const [listTable, setListTable] = useState([])
    const [listTypeFood, setListTypeFood] = useState([])
    const [id_staff, setId_staff] = useState(1);
    const [listFood, setListFood] = useState([])
    const [table, setTable] = useState(1);
    const [typeFood, setTypeFood] = useState(0);
    const [note, setNote] = useState('');
    const [listDetail, setListDetail] = useState();
    const [openTable, setOpenTable] = useState(false);
    const [openTypeFood, setOpenTypeFood] = useState(false);
    const [loading,setLoading] = useState(true)
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
            const data = (await axios.get('/api/v1/table/get')).data.data;
            let maxId = data[0].id;
            data.forEach(element => {
                if (element.id > maxId)
                    maxId = element.id
            });
            let listTmp = []
            for (let i = 1; i <= maxId; i++) {
                listTmp = [{ label: `Bàn số ${i}`, value: i }, ...listTmp]
            }
            setListTable([...listTmp])
        })().finally(()=>{
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
            renderNavigationView={navigationView}>
            <View style={{ backgroundColor: '#f7f7f773', flex: 1, }}>
            <AnimatedLoader
                    source={require("../animation/animation_ll2in0tu.json")}
                    visible={loading}
                    overlayColor="rgba(255,255,255,0.75)"
                    animationStyle={styles.lottie}
                    speed={1}>
                    <Text>Đang tải...</Text>
                </AnimatedLoader>
                <View style={{ flexDirection: 'row', width: '100%', marginTop: 10 }}>
                    <DropDownPicker
                        placeholder={table == 0 ? 'Chọn bàn' : `Bàn số ${table}`}
                        setOpen={() => { setOpenTable(!openTable) }}
                        multiple={false}
                        items={listTable}
                        open={openTable}
                        setValue={setTable}
                        style={{ width: '40%', left: 10 }}
                    />
                    <DropDownPicker
                        style={{ width: '40%', right: 200 }}
                        placeholder={'Chọn loại'}
                        setOpen={() => { setOpenTypeFood(!openTypeFood) }}
                        multiple={false}
                        items={listTypeFood}
                        open={openTypeFood}
                        setValue={setTypeFood}
                    ></DropDownPicker>
                </View>
                <View>
                    {listFood.length > 0 ? renderListFood() : <View><Text>Đang tải</Text></View>}
                </View>
                <View style={{ flexDirection: 'column', alignItems: 'center', flex: 1, }}
                >
                    <TextInput
                        placeholder="Ghi chú..."
                        value={note}
                        onChangeText={(text) => setNote(text)}
                        style={[{ height: 90, width: '90%', marginVertical: 10 }, styles.textInputNote]}
                    ></TextInput>
                    <TouchableOpacity
                        onPress={() => {
                            handleOrder();
                        }}
                        style={[styles.textInputNote, { backgroundColor: '#00ecff99' }]}
                    >
                        <Text>{order != null ? 'Chỉnh sửa' : 'Tạo order'}</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <TouchableOpacity style={{ position: 'absolute', right: 10, top: 25 }} onPress={() => drawer.current.openDrawer()}><Icon name="list-ul" size={20} color='black'></Icon></TouchableOpacity>
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
                style={{ height: '70%', backgroundColor: 'white', marginTop: 10 }}
                data={listFood}
                renderItem={itemFood}
                keyExtractor={(item) => item.id}
            />
        )
    }
    function itemFood({ index, item }) {
        return (
            <View style={{ height: 120, width: '100%', backgroundColor: '#bbffec57', margin: 10, borderRadius: 20, alignItems: 'center', flexDirection: 'row' }}>
                <Image source={{
                    uri: item.avatar,
                }}
                    style={{ height: 100, width: 150, margin: 10, borderRadius: 20 }}
                ></Image>
                <View>
                    <Text>{item.name}</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity onPress={() => handleMinus(item.id)}>
                            <Icon name='minus-circle' size={30} style={{ marginLeft: 10 }} color={'#e91323c9'} />
                        </TouchableOpacity>
                        <Text style={{ marginLeft: 10, paddingTop: 1, fontSize: 20 }}>{item.quantity}</Text>
                        <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => handlePlus(item.id)}>
                            <Icon name='plus-circle' size={30} color={'#1ee913c9'} />
                        </TouchableOpacity>
                    </View>
                    <Text>{formatCurrency(item.price)}</Text>
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
            id: order != null ? order.id : null,
            table: table,
            detail: [...listFood.filter(item => {
                return item.quantity > 0
            }).map(item => {
                return {
                    ...item,
                    id_food: item.id
                }
            })]
        }
        if (order != null) {
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
        elevation: 4,
    },
    lottie: {
        width: 100,
        height: 100,
      },
});

export default connect(state => {
    return state
})(ManageOrder);