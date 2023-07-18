import * as React from 'react';
import { View, Text, ToastAndroid } from 'react-native';
import { useState,useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import io from 'socket.io-client';
 function HomeScreen({navigation}) {
   const [socket,setSocket] = useState(io('http://192.168.1.7:8080'))
   useEffect(()=>{
    socket.on('connect', function(){
      socket.emit('authenticate', {token:accesstoken.token});
      socket.on('err',(err)=>{
       ToastAndroid.show('Lỗi')
      })
      socket.on('authenticate',data=>{
        console.log(data)
      })
    });
  
   },[])
  const accesstoken = useSelector((state) => state.accesstoken);
  console.log(accesstoken)
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Home Screen</Text>
      </View>
    );
  }
  export default HomeScreen