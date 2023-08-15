import * as React from 'react';
import { View, Text, ToastAndroid, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { connect } from 'react-redux';
import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid';
import io from 'socket.io-client';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import AnimatedLoader from 'react-native-animated-loader';
import baseURL from '../services/const';
import ItemOrder from './custom/ItemOrder';
import { compareByStatus } from '../common';
import ItemHome from './custom/ItemHome';
function KitChenScreen(props) {
  const navigation = props.navigation
  const user = props.user;
  const role = user.role;
  const [listStatus, setListStatus] = useState(['Đã nhận', 'Đang làm', 'Đã hủy', 'Đã hoàn thành']);
  const [loading, setLoading] = useState(false)
  const listOrder = props.listOrder;
  const order = props.route.params.order
  const sts = 1;
  const dispatch = useDispatch();

  useEffect(() => {
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

    <View style={{ padding: 10 }}>
      {/* <AnimatedLoader
          source={require("../animation/animation_ll2in0tu.json")}
          visible={loading}
          overlayColor="rgba(255,255,255,0.75)"
          animationStyle={styles.lottie}
          speed={1}>
          <Text>Đang tải...</Text>
        </AnimatedLoader> */}
        <FlatList
          data={order.detail}
          renderItem={({ item }) => { return <ItemOrder item={item} /> }}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
          }}
       />
    </View>

  );

  function flatListOrder() {
    return (
      <FlatList
        style={{ height: '100%' }}
        data={listOrder.filter(item => {
          return item.status != 4
        }).sort(compareByStatus)}
        renderItem={({ index, item }) => <ItemHome item={item} navigation={navigation} />
        }
        keyExtractor={({ item, index }) => uuidv4()}
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
  lottie: {
    width: 100,
    height: 100,
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
  textItem: {
    color: 'black',
    fontSize: 18,
    marginBottom: 5
  },
  btnItem: { flex: 2, backgroundColor: '#00ecff99', width: 80, height: 40, marginBottom: 10, justifyContent: 'center', alignItems: 'center', borderRadius: 10 }
})
export default connect(state => {
  return state
})(KitChenScreen);