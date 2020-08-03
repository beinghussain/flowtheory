import 'react-native-gesture-handler';
import {useState} from 'react';
import auth from '@react-native-firebase/auth';
import React from 'react';
import Snackbar from 'react-native-snackbar';
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
import {Colors} from 'react-native/Libraries/NewAppScreen';
import InputField from '../components/InputField';
import FtButton from '../components/FtButton';
import {validateEmail} from '../utils';
const ScreenHeight = Dimensions.get('window').height;

const Signup: () => React$Node = ({navigation}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [loading, setLoading] = useState(false);

  const signup = () => {
    if (
      password === password2 &&
      password !== '' &&
      name !== '' &&
      validateEmail(email)
    ) {
      setLoading(true);
      auth()
        .createUserWithEmailAndPassword(email, password)
        .then(() => {
          var user = auth().currentUser;
          user
            .updateProfile({
              displayName: name,
            })
            .then(function() {
              Snackbar.show({
                fontFamily: 'regular',
                text: 'Account created successfully!',
                duration: Snackbar.LENGTH_LONG,
              });
            })
            .catch(function(error) {
              // An error happened.
            });
        })
        .catch(error => {
          setLoading(false);
          if (error.code === 'auth/email-already-in-use') {
            Snackbar.show({
              fontFamily: 'regular',
              text: 'This email address is already in use!',
              duration: Snackbar.LENGTH_LONG,
            });
          }
        });
    } else {
      if (password !== password2) {
        Snackbar.show({
          fontFamily: 'regular',
          text: "Passwords doesn't match",
          duration: Snackbar.LENGTH_LONG,
        });
      }
      if (!validateEmail(email)) {
        Snackbar.show({
          fontFamily: 'regular',
          text: 'Invalid Email',
          duration: Snackbar.LENGTH_LONG,
        });
      }
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
                Signup
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
                Hey there, Quickly create an account and access features
              </Text>
              <View style={{marginStart: 24, marginEnd: 24, marginTop: 50}}>
                <InputField
                  onChange={name => setName(name)}
                  value={name}
                  label="Name"
                  type="name"
                  placeholder="Enter your Name"
                  style={{}}
                />
                <InputField
                  onChange={email => setEmail(email)}
                  value={email}
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
                  style={{marginTop: 20}}
                />
                <InputField
                  onChange={password => setPassword(password)}
                  value={password}
                  label="PASSWORD"
                  type="password"
                  placeholder="Enter your password"
                  style={{marginTop: 20}}
                />
                <InputField
                  onChange={password2 => setPassword2(password2)}
                  value={password2}
                  label="REPEAT PASSWORD"
                  type="password"
                  placeholder="Pleas confirm your password"
                  style={{marginTop: 20}}
                />
                <FtButton
                  loading={loading}
                  style={{marginTop: 30}}
                  onPress={signup}>
                  SIGNUP
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
                    Already have an account?
                  </Text>
                  <Text
                    onPress={() => navigation.navigate('Login')}
                    style={{color: '#ED5178', fontFamily: 'medium'}}>
                    Login
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

export default Signup;
