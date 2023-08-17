import * as React from 'react';
import { View, Text, ToastAndroid, StyleSheet, FlatList, TouchableOpacity, Alert, StatusBar,Image } from 'react-native';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { connect } from 'react-redux';
import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid';
import io from 'socket.io-client';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';
import baseURL from '../services/const';
import axios from '../services/axios';
import { compareByStatus } from '../common';
import ItemHome from './custom/ItemHome';
function HomeScreen(props) {
  const navigation = props.navigation
  const accesstoken = props.accesstoken;
  const user = props.user;
  const listOrder = props.listOrder;
  const sts = 1;
  const dispatch = useDispatch();
  useEffect(() => {
    (async () => {
      const data = (await axios.get('/api/v1/food/get')).data.data
      dispatch({ type: 'INIT_LIST_FOOD', data: data })
    })().catch(err => {
      ToastAndroid.show('Lỗi', 1000)
      console.log(err)
    })
    const socket = io(baseURL)
    socket.on('connect', function () {
      // socket.emit('authenticate', { token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcl9uYW1lIjoibmhhbnZpZW4xIiwicGFzc3dvcmQiOiIkMmIkMTAkWVFGRjRZcnpTc0tHMzVJNnpZb2tST1A3em50akZPUjZwc2Uya2J1T2g5a0luamZDd2FPZFciLCJyb2xlIjozLCJsb2NrIjowLCJpYXQiOjE2ODk4NDYxNzEsImV4cCI6MTY4OTg2NDE3MX0.U42IXmzEeaSarhLzhZU1i0z0sK3sVTVd32KcLKGDBz8' });
      socket.on('err', (err) => {
        ToastAndroid.show('Lỗi', 1000)
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
    <LinearGradient colors={['#0693e3', '#fff']} style={styles.linearGradient}
      start={{ x: 0.0, y: 0 }} end={{ x: 1, y: 0.75 }}
    >
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
                style={[{ height: 30, width: 30, borderRadius: 80, marginBottom: 'auto',marginTop:'auto',marginRight:8}]}
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
        >Danh sách đơn</Animatable.Text>
        {
          user.role!=4 ?  <TouchableOpacity style={styles.btnAdd} onPress={() => navigation.navigate('ManageOrder')}>
          <Icon name="plus" style={{ fontWeight: '400', fontSize: 24 }} color="white" />
        </TouchableOpacity>:null
        }
      </View>
      {
        listOrder.length > 0 ? flatListOrder() : <View style={{ height: '100%', alignItems: 'center', justifyContent: 'center' }}><Text>Chưa có gì</Text></View>
      }
      <StatusBar
        animated={true}
        backgroundColor="#0693e3"
        barStyle={'default'}
        hidden={false}
      />
    </LinearGradient>
  );
  function flatListOrder() {
    return (
      <FlatList
        style={{
          height: '100%',
          borderBottomColor: '#ccc',
          borderBottomWidth: 1,
        }}
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
    backgroundColor: '#0080ff',
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 60,
    marginTop:10,
    marginLeft: 'auto',
    marginStart: 'auto',
    
  },
  linearGradient: {
    paddingTop: 10,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 6,
    flex:1
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
})(HomeScreen);