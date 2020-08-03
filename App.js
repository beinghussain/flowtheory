import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {View} from 'react-native';
import Login from './screens/Login';
import Signup from './screens/Signup';
import Home from './screens/Home';
import Settings from './screens/Settings';
import NewPost from './screens/NewPost';
import {createStackNavigator} from '@react-navigation/stack';
import auth from '@react-native-firebase/auth';
import {useState, useEffect} from 'react';
import {navigationRef} from './components/RootNavigation';

const Stack = createStackNavigator();

const App: () => React$Node = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  });

  if (initializing) return null;

  return (
    <NavigationContainer ref={navigationRef}>
      {!user && (
        <View style={{flex: 1}}>
          <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{
              headerShown: false,
            }}>
            <Stack.Screen
              name="Login"
              component={Login}
              options={{headerMode: 'none'}}
            />
            <Stack.Screen name="Signup" component={Signup} />
          </Stack.Navigator>
        </View>
      )}
      {user && (
        <View style={{flex: 1}}>
          <View style={{flex: 1}}>
            <Stack.Navigator
              initialRouteName="Home"
              screenOptions={{
                headerShown: false,
              }}>
              <Stack.Screen name="Home">
                {props => <Home {...props} user={user} />}
              </Stack.Screen>
              <Stack.Screen name="Settings">
                {props => <Settings {...props} user={user} />}
              </Stack.Screen>
              <Stack.Screen name="NewPost" component={NewPost} />
            </Stack.Navigator>
          </View>
        </View>
      )}
    </NavigationContainer>
  );
};

export default App;
