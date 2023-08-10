import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from './Login';
import HomeScreen from './Home';
import ManageOrder from './ManageOrder';
import OrderDetail from './OrderDetail';
import KitchenScreen from './Kitchen';
import Header from './custom/Header';
const Stack = createNativeStackNavigator();
function Navigaion() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Home" component={HomeScreen}
         options={{
          headerShown:false,
          // header: ({ scene }) => {
          //   return <Header title={'Đăng nhập'} />;
          // },
          headerTitle:'Đăng nhập'
        }} />
        <Stack.Screen name='ManageOrder' title={'Thêm order'} component={ManageOrder}
         options={{
          headerShown:false,
          // header: ({ scene }) => {
          //   return <Header title={'Đăng nhập'} />;
          // },
          headerTitle:'Đăng nhập'
        }} 
        />
        <Stack.Screen name='Login' component={LoginScreen}
          options={{
            headerShown:false,
            // header: ({ scene }) => {
            //   return <Header title={'Đăng nhập'} />;
            // },
            headerTitle:'Đăng nhập'
          }} />
        <Stack.Screen name='OrderDetail' component={OrderDetail}
          options={{
            // header: ({ scene }) => {
            //   return <Header title={'Tính tiền'} />;
            // },
            headerTitle:'Tính tiền'
          }} />
           <Stack.Screen name='Kitchen' component={KitchenScreen}
          options={{
            // header: ({ scene }) => {
            //   return <Header title={'Tính tiền'} />;
            // },
            headerTitle:'Xem chi tiết'
          }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Navigaion;