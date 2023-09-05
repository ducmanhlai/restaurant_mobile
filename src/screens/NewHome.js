import * as React from 'react';
import { View, Text, ToastAndroid, StyleSheet, FlatList, TouchableOpacity, Alert, StatusBar, Image } from 'react-native';
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
import ItemTable from './custom/ItemTable';

function NewHomeScreen(props) {
  const navigation = props.navigation
  const accesstoken = props.accesstoken;
  const user = props.user;
  const role = 3
  const listOrder = props.listOrder|| [];
  const [listTable, setListTable] = useState([]);
  const [tableTmp, setTableTmp] = useState([])
  var sts = 1;
  const dispatch = useDispatch();
  useEffect(() => {
    // getUser()
    (async () => {
      const data = (await axios.get('/api/v1/food/get')).data.data
      dispatch({ type: 'INIT_LIST_FOOD', data: data })
      const list= (await axios.get('/api/v1/table/get')).data.data
      setTableTmp([...list])
    })().catch(err => {
      console.log(err)
    })
    const socket = io(baseURL)
    socket.on('connect', function () {
      // socket.emit('authenticate', { token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcl9uYW1lIjoibmhhbnZpZW4xIiwicGFzc3dvcmQiOiIkMmIkMTAkWVFGRjRZcnpTc0tHMzVJNnpZb2tST1A3em50akZPUjZwc2Uya2J1T2g5a0luamZDd2FPZFciLCJyb2xlIjozLCJsb2NrIjowLCJpYXQiOjE2ODk4NDYxNzEsImV4cCI6MTY4OTg2NDE3MX0.U42IXmzEeaSarhLzhZU1i0z0sK3sVTVd32KcLKGDBz8' });
      socket.on('err', (err) => {
        ToastAndroid.show('Lỗi')
      })
      //   socket.on('authenticate', data => {
      //     console.log(data)
      //   })
    });
    socket.on('createOrder', data => {
      socket.emit('getListOrder');
      dispatch({ type: 'ADD_ORDER', data: data.order })
    })
    socket.emit('getListOrder')
    socket.on('getListOrder', data => {
      const list = []
      tableTmp?.forEach(element => {
        let [isHollow,idOrder,detail] =CheckInOrder(element.id,data)
        list.push({
          id: element.id,
          name: element.name,
          isHollow: isHollow,
          idOrder: idOrder,
          detail:detail
        })
      });
      setListTable([...list])
      dispatch({ type: 'INIT_ORDER', data: data })
    })
    return () => {
      socket.disconnect()
    }
  }, [tableTmp.length])
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
        >Danh sách đơn</Animatable.Text>
      </View>
      {
        flatListOrder() 
      }
      <StatusBar
        animated={true}
        backgroundColor="#0693e3"
        barStyle={'default'}
        hidden={false}
      />
    </LinearGradient>
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
        style={{ height: '100%'}}
        contentContainerStyle={{ paddingBottom: 80,justifyContent:'center',alignItems:'center',width:'100%' }}
        data={listTable}
        numColumns={2}
        renderItem={({ index, item }) => <ItemTable item={item} navigation={navigation}/>
        }
        keyExtractor={({ item, index }) => uuidv4()}
      />
    )
  }
}
function CheckInOrder(id,listOrder) {
  for (let i of listOrder) {
    if (i.table == id && i.status < 3)
      return [true,i.id,i.detail]
  }
  return [false,0,[]]
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
  textItem: {
    color: 'black',
    fontSize: 18,
    marginBottom: 5
  },
  btnItem: { flex: 2, backgroundColor: '#00ecff99', width: 80, height: 40, marginBottom: 10, justifyContent: 'center', alignItems: 'center', borderRadius: 10 }
})
export default connect(state => {
  return state
})(NewHomeScreen);