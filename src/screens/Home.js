import * as React from 'react';
import { View, Text, ToastAndroid, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { connect } from 'react-redux';
import io from 'socket.io-client';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import moment from 'moment';
import baseURL from '../services/const';
import axios from '../services/axios';
function HomeScreen(props) {
  const navigation = props.navigation
  const accesstoken = props.accesstoken;
  const user = props.user;
  // const role = user.role;
  const [enable, setEnable] = useState(true)
  const [listStatus,setListStatus]= useState(['Đã nhận','Đã hoàn thành', 'Đã hủy'])
  const role = 3
  const listOrder = props.listOrder;
  const sts = 1;
  const dispatch = useDispatch();
  useEffect(() => {
    // getUser()
    (async () => {
      const data = (await axios.get('/api/v1/food/get')).data.data
      dispatch({ type: 'INIT_LIST_FOOD', data: data })
    })().catch(err => {
      console.log(err)
    })
    const socket = io(baseURL)
    socket.on('connect', function () {
      // socket.emit('authenticate', { token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcl9uYW1lIjoibmhhbnZpZW4xIiwicGFzc3dvcmQiOiIkMmIkMTAkWVFGRjRZcnpTc0tHMzVJNnpZb2tST1A3em50akZPUjZwc2Uya2J1T2g5a0luamZDd2FPZFciLCJyb2xlIjozLCJsb2NrIjowLCJpYXQiOjE2ODk4NDYxNzEsImV4cCI6MTY4OTg2NDE3MX0.U42IXmzEeaSarhLzhZU1i0z0sK3sVTVd32KcLKGDBz8' });
      socket.on('err', (err) => {
        ToastAndroid.show('Lỗi')
      })
      socket.on('authenticate', data => {
        console.log(data)
      })
    });
    socket.on('createOrder', data => {
      dispatch({ type: 'ADD_ORDER', data: data.order })
    })
    socket.emit('getListOrder')
    socket.on('getListOrder', data => {
      dispatch({ type: 'INIT_ORDER', data: data })
    })

    return () => {
      socket.disconnect()
    }
  }, [sts])
  return (
    (role == 3 ?
      <View style={{ padding: 10 }}>
        {
          listOrder.length > 0 ? flatListOrder() : <View><Text>Rỗng</Text></View>
        }
        <View style={{ position: 'absolute', right: 10, top: 700 }}>
          <TouchableOpacity style={styles.btnAdd} onPress={() => navigation.navigate('ManageOrder')}>
            <Icon name="plus" size={40} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      : <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Bếp</Text>
      </View>)
  );
  function getUser() {
    (async () => {
      const data = (await axios.get('/api/v1/user/get', {
        headers: {
          Authorization: `Bearer ${accesstoken.token}`,
        },
      })).data.data
      let user = { ...data.staffs[0], role: data.role }
      dispatch({ type: 'ADD_USER', data: user })
    })().catch(err => {
      console.log(err)
      ToastAndroid.show('Có lỗi xảy ra')
    })
  }
  function flatListOrder() {
    return (
      <FlatList
        style={{ height: '100%' }}
        data={listOrder}
        renderItem={({ index, item }) => {
          let total = 0;
          for (let i of item.detail) {
            total += i.price * i.quantity
          }
          
          return (
            <View style={styles.itemOrder}>
              <View style={{ flex: 8 }}>
                <Text style={styles.textItem}>Bàn số: {item.table}</Text>
                <Text style={styles.textItem}>Thời gian: {moment(item.time).format("HH:mm DD/MM/YYYY")}</Text>
                <Text style={styles.textItem}>Trạng thái: {listStatus[item.status-1]}</Text>
                <Text style={styles.textItem}>Thành tiền: {total.toLocaleString('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                })}</Text>
              </View>
              <View>
                <TouchableOpacity style={styles.btnItem}
                  onPress={() => { navigation.navigate('OrderDetail', { order: item }) }}
                >
                  <Text>Tính tiền</Text>
                </TouchableOpacity>
                <TouchableOpacity style={item.status==1 ? styles.btnItem : [styles.btnItem,{backgroundColor:'black'}]}
                  onPress={item.status==1 ? () => { navigation.navigate('ManageOrder', { order: item }) }: null}
                >
                  <Text>Sửa</Text>
                </TouchableOpacity>
              </View>
            </View>
          )
        }
        }
        keyExtractor={(item) => item.id}
      />
    )
  }
}
const styles = StyleSheet.create({
  itemOrder: {
    flexDirection: 'row',
    width: '100%',
    height: 150,
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    // Đảm bảo sử dụng elevation trên Android để có hiệu ứng đổ bóng tương tự.
    elevation: 4,
  },
  btnAdd: {
    flexDirection: 'row',
    backgroundColor: '#0080ff',
    width: 50,
    height: 50,
    alignItems: 'center',
    borderRadius: 30,
    justifyContent: 'center'
  },
  textItem:{
    color:'black',
    fontSize:18,
    marginBottom:5
  },
  btnItem: { flex: 2, backgroundColor: '#00ecff99', width: 80, height: 40, marginBottom: 10, justifyContent: 'center', alignItems: 'center', borderRadius: 10 }
})
export default connect(state => {
  return state
})(HomeScreen);