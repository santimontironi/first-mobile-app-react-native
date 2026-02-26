import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import RegisterScreen from '../screens/RegisterScreen';
import LoginScreen from '../screens/LoginScreen';
import ConfirmUser from '../screens/ConfirmUser';

const Stack = createNativeStackNavigator();

const AppNavigation = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false, statusBarStyle: 'light-content' }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false, statusBarStyle: 'light-content' }} />
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false, statusBarStyle: 'light-content' }} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigation;
