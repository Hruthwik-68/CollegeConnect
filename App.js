import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/home';
import SignUpScreen from './screens/signup';
import LoginScreen from './screens/login';
import Oops from './screens/oops'
import Admin from './screens/admin';
import Event from './screens/event';
import Achievement from './screens/achievement';
import Profile from './screens/profile';
import Doubt from './screens/doubt';
import Community from './screens/community';
import Solve from './screens/solve';
import Solution from './screens/solution';
import CreateCommunity from './screens/CreateCommunity';
import JoinCommunity from './screens/JoinCommunity';
import MyCommunity from './screens/MyCommunity';
import CommunityUse from './screens/CommunityUse';
import UploadProgress from './screens/UploadProgress';
import JoinedCommunity from './screens/JoinedCommunity';
import Map from './screens/Map';
import { StatusBar } from 'react-native';

const Stack = createStackNavigator();

// Define the stack navigator for the main screens
function MainStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // Hide the header for all routes by default
      }}
      initialRouteName="Home" // Set the initial route
    >
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Oops" component={Oops} />
      <Stack.Screen name="Admin" component={Admin} />
        <Stack.Screen name="Event" component={Event} />
        <Stack.Screen name="Achievement" component={Achievement} />
        <Stack.Screen name="Profile" component={Profile}/>
        <Stack.Screen name="Doubt" component={Doubt} />
        <Stack.Screen name="Community" component={Community}/>
        <Stack.Screen name="Solve" component={Solve}/>
        <Stack.Screen name="Solution" component={Solution}/>
        <Stack.Screen name="CreateCommunity" component={CreateCommunity}/>
        <Stack.Screen name="JoinedCommunity" component={JoinedCommunity}/>

        <Stack.Screen name="Map" component={Map}/>

        <Stack.Screen name="MyCommunity" component={MyCommunity}/>
        <Stack.Screen name="UploadProgress" component={UploadProgress}/>

        <Stack.Screen name="JoinCommunity" component={JoinCommunity}/>
        <Stack.Screen name="CommunityUse" component={CommunityUse}/>

    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <>
    <StatusBar backgroundColor="#0A3866" /> 
    <NavigationContainer>
      <MainStack />
    </NavigationContainer>
    </>
  );
}
