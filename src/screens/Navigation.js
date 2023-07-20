
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from './Login';
import HomeScreen from './Home';
import ManageOrder from './ManageOrder';
const Stack = createNativeStackNavigator();

function Navigaion() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name='Login' component={LoginScreen}/>
        <Stack.Screen name= 'ManageOrder' component={ManageOrder}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Navigaion;