import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    StatusBar
} from "react-native";
import axios from '../services/axios';
import { useSelector, useDispatch } from 'react-redux'
export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const accesstoken = useSelector((state) => state.accesstoken);
    if(accesstoken.token.length>0 )navigation.navigate('Home')
    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <View style={styles.inputView}>
                <TextInput
                    style={styles.TextInput}
                    placeholder="Tên đăng nhập"
                    placeholderTextColor="#00000047"
                    onChangeText={(email) => setEmail(email)}
                />
            </View>
            <View style={styles.inputView}>
                <TextInput
                    style={styles.TextInput}
                    placeholder="Mật khẩu"
                    placeholderTextColor="#00000047"
                    onChangeText={(password) => setPassword(password)}
                />
            </View>
            <TouchableOpacity>
            </TouchableOpacity>
            <TouchableOpacity style={styles.loginBtn} onPress= {handleLogin}>
                <Text style={styles.loginText}>Đăng nhập</Text>
            </TouchableOpacity>
        </View>
    );
    function handleLogin(){
        (async ()=>{
              const data= (await axios.post('/api/v1/auth/login',{
                username:email,
                password
            })).data
           
          if(data?.errCode ==0){
              dispatch({type:'ADD',data:data.accessToken});
              navigation.navigate('Home')
          
          }
        })().catch(err=>{
            console.log(err)
        })
    }
}
const styles = StyleSheet.create({
    container: {
        height: '100%',
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    image: {
        marginBottom: 40,
    },
    inputView: {
        backgroundColor: "#8acce1",
        borderRadius: 30,
        width: "70%",
        height: 45,
        marginBottom: 20,
        alignItems: "center",
    },
    TextInput: {
        height: 50,
        flex: 1,
        padding: 10,
        marginLeft: 20,
    },
    loginText: {
        fontWeight: '800',
        fontSize: 18,
    },
    forgot_button: {
        height: 30,
        marginBottom: 30,
    },
    loginBtn: {
        width: "80%",
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 40,
        backgroundColor: "#8acce1",
    },
});