import 'react-native-gesture-handler';
import {useState} from 'react';
import auth from '@react-native-firebase/auth';
import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Text,
  StatusBar,
  View,
  Dimensions,
  Image,
} from 'react-native';
import Snackbar from 'react-native-snackbar';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import InputField from '../components/InputField';
import FtButton from '../components/FtButton';
import {validateEmail} from '../utils';

const ScreenHeight = Dimensions.get('window').height;

const Login: () => React$Node = ({navigation}) => {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const login = () => {
    if (validateEmail(email)) {
      setLoading(true);
      auth()
        .signInWithEmailAndPassword(email, password)
        .then(() => {
          console.log('User account created & signed in!');
        })
        .catch(error => {
          setLoading(false);
          if (error.code === 'auth/invalid-email') {
            Snackbar.show({
              fontFamily: 'regular',
              text: 'That email address is invalid!',
              duration: Snackbar.LENGTH_LONG,
            });
          }
          if (error.code === 'auth/user-not-found') {
            Snackbar.show({
              fontFamily: 'regular',
              text: 'User not found. Please create an account',
              duration: Snackbar.LENGTH_LONG,
            });
          }
        });
    } else {
      Snackbar.show({
        fontFamily: 'regular',
        text: 'That email address is invalid!',
        duration: Snackbar.LENGTH_LONG,
      });
    }
  };

  return (
    <ScrollView>
      <SafeAreaView>
        <StatusBar backgroundColor="#ED5178" barStyle="light-content" />
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <View style={styles.body}>
            <Image
              resizeMode="cover"
              style={styles.headerImage}
              source={require('../assets/signup.png')}
            />
            <View style={{flex: 1, marginTop: 100}}>
              <Image
                style={{height: 200, width: '100%'}}
                resizeMode="contain"
                source={require('../assets/icon.png')}
              />
              <Text
                style={{
                  fontSize: 24,
                  width: '100%',
                  textAlign: 'center',
                  fontFamily: 'bold',
                }}>
                Login
              </Text>
              <Text
                style={{
                  opacity: 0.7,
                  fontSize: 14,
                  width: '100%',
                  marginTop: 12,
                  textAlign: 'center',
                  fontFamily: 'regular',
                }}>
                Welcome back, Login to access your account
              </Text>
              <View style={{marginStart: 24, marginEnd: 24, marginTop: 50}}>
                <InputField
                  onChange={email => setEmail(email)}
                  value={email}
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
                  style={{}}
                />
                <InputField
                  onChange={password => setPassword(password)}
                  value={password}
                  label="PASSWORD"
                  type="password"
                  placeholder="Enter your password"
                  style={{marginTop: 20}}
                />
                <FtButton
                  loading={loading}
                  style={{marginTop: 30}}
                  onPress={login}>
                  Login
                </FtButton>
                <View
                  style={{
                    flex: 0,
                    marginTop: 50,
                    justifyContent: 'center',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      color: '#000',
                      opacity: 0.5,
                      marginEnd: 4,
                      fontFamily: 'medium',
                    }}>
                    New to FlowTheory?
                  </Text>
                  <Text
                    onPress={() => navigation.navigate('Signup')}
                    style={{color: '#ED5178', fontFamily: 'medium'}}>
                    Create an account
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  headerImage: {
    width: '100%',
    height: 300,
    position: 'absolute',
    top: 0,
    right: 0,
  },
  body: {
    height: ScreenHeight,
    backgroundColor: 'white',
  },
});

export default Login;
