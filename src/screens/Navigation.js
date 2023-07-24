
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from './Login';
import HomeScreen from './Home';
import ManageOrder from './ManageOrder';
import OrderDetail from './OrderDetail';
import Header from './custom/Header';
const Stack = createNativeStackNavigator();
function Navigaion() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen}
          options={{
            header: ({ scene }) => {
              return <Header title={'Trang chủ'} />;
            },
          }} />
        <Stack.Screen name='ManageOrder' component={ManageOrder}
          options={{
            header: ({ scene }) => {
              return <Header title={'Thêm order'} />;
            },
          }}
        />
        <Stack.Screen name='Login' component={LoginScreen}
          options={{
            header: ({ scene }) => {
              return <Header title={'Đăng nhập'} />;
            },
          }} />
        <Stack.Screen name='OrderDetail' component={OrderDetail}
          options={{
            header: ({ scene }) => {
              return <Header title={'Tính tiền'} />;
            },
          }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Navigaion;