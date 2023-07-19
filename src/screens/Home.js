import * as React from 'react';
import { View, Text, ToastAndroid, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import baseURL from '../services/const';
import axios from '../services/axios';
import { connect } from 'react-redux';
import io from 'socket.io-client';
function HomeScreen(props) {
  const [socket, setSocket] = useState(io(baseURL));
  const accesstoken = props.accesstoken;
  const user = props.user;
  const role = user.role;
  const listOrder = props.listOrder;
  const sts = 1;
  const dispatch = useDispatch();
  useEffect(() => {
    getUser()
    socket.on('connect', function () {
      console.log('call')
      socket.emit('authenticate', { token: accesstoken.token });
      socket.on('err', (err) => {
        ToastAndroid.show('Lỗi')
      })
      socket.on('authenticate', data => {
        console.log(data)
      })
      socket.emit('getListOrder')
      socket.on('getListOrder', data => {
        dispatch({ type: 'INIT_ORDER', data: data })
      })
      socket.on('createOrder', data => {
        dispatch({ type: 'ADD_ORDER', data: data.order })
      })
    });
  }, [sts])
  return (
    (role == 3 ?
      <View style={{ padding: 10 }}>
        {
          listOrder.length > 0 ? flatListOrder() : <View><Text>Rỗng</Text></View>
        }
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
  function getFood() {
  }
  function flatListOrder() {
    return (
      <FlatList
        style={{ height: '100%' }}
        data={listOrder}
        renderItem={({ index, item }) => {
          return (<TouchableOpacity style={styles.itemOrder}
            onPress={() => {console.log(item.id)}}
          >
            <Text>Bàn số: {item.table}</Text>
            <Text></Text>
          </TouchableOpacity>)
        }
        }
        keyExtractor={(item) => item.id}
      />
    )
  }
}
const styles = StyleSheet.create({
  itemOrder: {
    width: '100%',
    height: 100,
    backgroundColor: '#bbffec57',
    borderRadius: 15,
    padding: 10,

  }
})
export default connect(state => {
  return state
})(HomeScreen);