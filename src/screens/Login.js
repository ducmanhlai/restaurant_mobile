import React, { useState,useEffect,useRef} from "react";
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    StatusBar,
    ToastAndroid,
    SafeAreaView,
    
} from "react-native";
import AnimatedLoader from 'react-native-animated-loader';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import axios from '../services/axios';
import { useSelector, useDispatch } from 'react-redux'
export default function LoginScreen({ navigation }) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false)
    const [accesstoken, setAccessToken] = useState(useSelector((state) => state.accesstoken));
   
  
    if (accesstoken.token.length > 0) navigation.navigate('Home')
    return (
        <SafeAreaView style={styles.container}>
            <AnimatedLoader
                source={require("../animation/animation_ll2in0tu.json")}
                visible={loading}
                overlayColor="rgba(255,255,255,0.75)"
                animationStyle={styles.lottie}
                speed={1}>
                <Text>Đang xử lý...</Text>
            </AnimatedLoader>
            <Animatable.Image source={{
                uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSw_DHz4baaRqCuAK145KvHH_xfHXUfDwxzsA&usqp=CAU'
            }} animation={'slideInDown'}
            duration={1700}
                style={[{ height: 200, width: 200, borderRadius: 80, marginBottom: 10, marginTop: -36 }]}
            ></Animatable.Image>
            <Animatable.Text style={{ fontSize: 32, marginBottom: 50, color: '#000', fontWeight: '600' }}
             animation={'slideInDown'}
             duration={1000}
            >Đăng nhập</Animatable.Text>
            <StatusBar style="auto" />
            <Animatable.View style={styles.inputView}
            animation={'slideInLeft'}
            duration={1000}
            >
                <Icon name='smile-o' size={24} style={{ marginLeft: 16 }} color='#0693e3'></Icon>
                <TextInput
                    style={styles.TextInput}
                    placeholder="Tên đăng nhập"
                    placeholderTextColor="#00000047"
                    onChangeText={(email) => setEmail(email)}
                />
            </Animatable.View>
            <Animatable.View style={styles.inputView}
               animation={'slideInLeft'}
               duration={1000}
            >
                <Icon name='lock' size={29} style={{ marginLeft: 16, marginRight: 4 }} color='#0693e3'></Icon>
                <TextInput
                    secureTextEntry={true}
                    style={styles.TextInput}
                    placeholder="Mật khẩu"
                    placeholderTextColor="#00000047"
                    onChangeText={(password) => setPassword(password)}
                />
            </Animatable.View>
            <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}
            >
                <LinearGradient colors={['#8ed1fc', '#0693e3']} style={styles.linearGradient}
                    start={{ x: 0.0, y: 0.25 }} end={{ x: 0.75, y: 1.0 }}
                >
                    <Text style={styles.loginText}>Đăng nhập</Text>
                </LinearGradient>
            </TouchableOpacity>
        </SafeAreaView>


    );
    async function getUser(token) {
        const data = (await axios.get('/api/v1/user/get', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })).data.data
        let user = { ...data.staffs[0], role: data.role }
        console.log(user)
        dispatch({ type: 'ADD_USER', data: user })
    }
    function handleLogin() {
        (async () => {
            setLoading(true)
            const data = (await axios.post('/api/v1/auth/login', {
                username: email,
                password
            })).data
            if (data?.errCode == 0) {
                dispatch({ type: 'ADD_TOKEN', data: data.accessToken });
                await getUser(data.accessToken)
                navigation.navigate('Home')
            }
            else {
                setLoading(false)
                ToastAndroid.showWithGravity('Sai tên đăng nhập hoặc mật khẩu', 1500, ToastAndroid.BOTTOM);
            }
        })().catch(err => {
            setLoading(false)
            console.log(err)
            ToastAndroid.showWithGravity('Có lỗi!!!!!', 1500, ToastAndroid.BOTTOM);
        })
    }
}
const styles = StyleSheet.create({
    container: {
        height: '100%',
        width: '100%',
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 8,
        shadowColor: 'red',
        shadowOffset: { width: 200, height: 100 },
        shadowOpacity: 0.7,
        shadowRadius: 100,
        elevation: 9,
    },
    image: {
        marginBottom: 40,
    },
    inputView: {
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        borderRadius: 30,
        width: "80%",
        height: 45,
        marginBottom: 20,
        alignItems: "center",
        flexDirection: 'row'
    },
    linearGradient: {
        height: '100%',
        width: '100%',
        paddingLeft: 15,
        paddingRight: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 6
    },
    buttonText: {
        fontSize: 18,
        fontFamily: 'Gill Sans',
        textAlign: 'center',
        margin: 10,
        color: '#ffffff',
        backgroundColor: 'transparent',
    },
    lottie: {
        width: 100,
        height: 100,
    },
    TextInput: {
        height: 50,
        padding: 10,
        marginLeft: 0,
        width: '95%'
    },
    loginText: {
        fontWeight: '800',
        fontSize: 18,
        color: '#eee'
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
        marginTop: 20,
        backgroundColor: "#8acce1",
        borderRadius: 8
    },
});