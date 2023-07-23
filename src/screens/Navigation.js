
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from './Login';
import HomeScreen from './Home';
import ManageOrder from './ManageOrder';
import OrderDetail from './OrderDetail';
const Stack = createNativeStackNavigator();

function Navigaion() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name='ManageOrder' component={ManageOrder}/>
        <Stack.Screen name='Login' component={LoginScreen}/>
        <Stack.Screen name= 'OrderDetail' component={OrderDetail}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Navigaion;