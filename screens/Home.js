import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Text,
  StatusBar,
  View,
  Dimensions,
  Image,
} from 'react-native';
import TimeAgo from 'react-native-timeago';

import {getPosts} from '../utils';
import RNFS from 'react-native-fs';

const ScreenHeight = Dimensions.get('window').height;

const Home: () => React$Node = ({navigation, user}) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Update the document title using the browser API
    getPosts().then(data => {
      setPosts(data);
    });
  });

  const goTo = screenName => {
    navigation.navigate(screenName);
  };

  const dir = RNFS.ExternalCachesDirectoryPath;

  return (
    <View style={{flex: 1}}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <View
        style={{
          backgroundColor: 'white',
          borderBottomColor: '#f4f5f9',
          borderBottomWidth: 1,
          justifyContent: 'space-between',
          flexDirection: 'row',
          paddingStart: 24,
          paddingEnd: 24,
          paddingTop: 15,
          paddingBottom: 15,
        }}>
        <Text style={{fontFamily: 'medium', fontSize: 18}}>Explore</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Icon size={22} name="settings-sharp" />
        </TouchableOpacity>
      </View>
      <SafeAreaView style={{flex: 1}}>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={[
            styles.scrollView,
            {backgroundColor: posts.length > 0 ? '#f4f5f9' : '#ffffff'},
          ]}>
          {posts.length > 0 ? (
            posts.reverse().map((d, index) => {
              return (
                <View
                  style={{
                    marginBottom: 15,
                    elevation: 0.5,
                  }}
                  key={index}>
                  <View
                    style={{
                      backgroundColor: '#fff',
                      flex: 1,
                      padding: 10,
                      alignItems: 'center',
                      flexDirection: 'row',
                    }}>
                    <View
                      style={{
                        marginEnd: 15,
                        height: 40,
                        width: 40,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#34495e',
                        borderRadius: 100,
                      }}>
                      <Text
                        style={{
                          fontFamily: 'medium',
                          color: '#fff',
                          fontSize: 25,
                        }}>
                        {user.displayName.charAt(0)}
                      </Text>
                    </View>
                    <View>
                      <Text style={{fontFamily: 'medium', fontSize: 16}}>
                        {user.displayName}
                      </Text>
                      <Text
                        style={{
                          fontFamily: 'regular',
                          opacity: 0.3,
                          fontSize: 13,
                        }}>
                        Posted {<TimeAgo time={user.date} />}
                      </Text>
                    </View>
                  </View>
                  <Image
                    style={{
                      width: '100%',
                      height: Dimensions.get('screen').width,
                    }}
                    source={{uri: `file://${dir}/medias/${d.media}`}}
                  />
                  <Text
                    style={{
                      padding: 15,
                      fontSize: 14,
                      fontFamily: 'regular',
                      backgroundColor: '#fff',
                    }}>
                    {d.text &&
                      `${d.text.slice(0, 100)}${
                        d.text.length > 100 ? '...' : ''
                      }`}
                  </Text>
                </View>
              );
            })
          ) : (
            <View
              style={{
                margin: -15,
                flex: 1,
                backgroundColor: 'white',
                height: 500,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                style={{width: 300, height: 300}}
                resizeMode="contain"
                source={{
                  uri:
                    'https://cdn.dribbble.com/users/357797/screenshots/3998541/empty_box.jpg',
                }}
              />
              <Text style={{fontFamily: 'medium'}}>No Items</Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
      <View
        style={{
          borderTopWidth: 1,
          borderTopColor: '#f4f5f9',
          backgroundColor: 'white',
          flex: 0,
          zIndex: 99,
          position: 'absolute',
          bottom: 0,
          width: '100%',
          justifyContent: 'space-around',
          flexDirection: 'row',
        }}>
        <TouchableOpacity style={{padding: 15}}>
          <Icon color="#ED5178" size={24} name="home-sharp" />
        </TouchableOpacity>
        <TouchableOpacity style={{padding: 15}}>
          <Icon color="#B0BAC5" size={24} name="planet-sharp" />
        </TouchableOpacity>
        <TouchableOpacity style={{padding: 15}} onPress={() => goTo('NewPost')}>
          <Icon color="#B0BAC5" size={24} name="add-circle-sharp" />
        </TouchableOpacity>
        <TouchableOpacity style={{padding: 15}}>
          <Icon color="#B0BAC5" size={24} name="notifications-sharp" />
        </TouchableOpacity>
        <TouchableOpacity style={{padding: 15}}>
          <Icon color="#B0BAC5" size={24} name="person-sharp" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    paddingStart: 15,
    paddingEnd: 15,
    paddingTop: 15,
    paddingBottom: 100,
    marginBottom: 55,
    backgroundColor: '#f4f5f9',
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

export default Home;
