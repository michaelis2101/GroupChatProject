import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {StatusBar, Platform} from 'react-native';
import { AuthProvider } from './screen/authcontext';



import ChatScreen from './screen/chatscreen';
import HomeScreen from './screen/home';
import ConList from './screen/contactlist';
import GroupChatScreen from './screen/groupchat';
import SelectMember from './screen/selectmember';
import CreateGroup from './screen/creategroup';
import SignIn from './screen/signin';
import SignUp from './screen/signup';



const Stack = createNativeStackNavigator();


const App = () => {

  return (
    <AuthProvider>
      <NavigationContainer> 
        <Stack.Navigator
          initialRouteName='LoginScreen'
          screenOptions={{headerShown:false}}
        >
          <Stack.Screen name='HomeScreen' component={HomeScreen}/>
          <Stack.Screen name='LoginScreen' component={SignIn}/>
          <Stack.Screen name='RegisterScreen' component={SignUp}/>
          <Stack.Screen name='ChatScreen' component={ChatScreen}/>
          <Stack.Screen name='ContactList' component={ConList}/>
          <Stack.Screen name='GroupChatScreen' component={GroupChatScreen}/>
          <Stack.Screen name='SelectMember' component={SelectMember}/>
          <Stack.Screen name='CreateGroup' component={CreateGroup}/> 
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
    
  )

}

export default App