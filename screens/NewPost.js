import 'react-native-gesture-handler';
import React, {useState} from 'react';
import ImagePicker from 'react-native-image-picker';
import RNFS from 'react-native-fs';

import {checkMultiple, request, PERMISSIONS} from 'react-native-permissions';
import {
  SafeAreaView,
  Text,
  StatusBar,
  TouchableOpacity,
  View,
  Dimensions,
  Image,
  TextInput,
} from 'react-native';

import {addPost} from '../utils';

const options = {
  title: 'Select Image',
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

const NewPost: () => React$Node = ({navigation}) => {
  const [media, setMedia] = useState();
  const [image, setImage] = useState();
  const [text, setText] = useState('');

  const selectImages = () => {
    ImagePicker.launchImageLibrary(options, async response => {
      const dest = `${RNFS.ExternalCachesDirectoryPath}/medias/${response.fileName}`;

      RNFS.exists(`${RNFS.ExternalCachesDirectoryPath}/medias`).then(exists => {
        if (!exists) {
          RNFS.mkdir(`${RNFS.ExternalCachesDirectoryPath}/medias/`).then(() => {
            RNFS.copyFile(`file://${response.path}`, dest).then(results => {
              setImage(response.path);
              setMedia(response.fileName);
            });
          });
        } else {
          RNFS.copyFile(`file://${response.path}`, dest).then(results => {
            setImage(response.path);
            setMedia(response.fileName);
          });
        }
      });
    });
  };

  const selectMedia = type => {
    checkMultiple([
      PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
    ])
      .then(statuses => {
        const perm2 = statuses['android.permission.WRITE_EXTERNAL_STORAGE'];

        if (perm2 === 'denied') {
          request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE).then(response => {
            if (response === 'granted') {
              selectImages();
            }
          });
        }
        if (perm2 === 'granted') {
          selectImages();
        }
      })
      .catch(error => {
        // …
      });
  };

  const publish = async () => {
    const post = {
      text,
      media,
    };

    const response = await addPost(post);
    if (response === 'success') {
      navigation.navigate('Home');
    }
  };

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
          flex: 0,
          paddingBottom: 15,
        }}>
        <Text style={{fontFamily: 'medium', fontSize: 16}}>Add New Post</Text>
        <TouchableOpacity onPress={publish}>
          <Text style={{color: '#ED5178', fontFamily: 'bold'}}>PUBLISH</Text>
        </TouchableOpacity>
      </View>
      <SafeAreaView style={{flex: 1}}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            paddingStart: 24,
            paddingEnd: 24,
          }}>
          <TextInput
            scrollEnabled={false}
            value={text}
            onChangeText={text => setText(text)}
            multiline
            style={{
              marginBottom: 30,
              fontSize: 16,
              fontFamily: 'regular',
              paddingStart: 0,
            }}
            placeholder="What's on your mind?"
          />
          {image && (
            <Image
              style={{
                width: '100%',
                height: Dimensions.get('screen').width - 48,
              }}
              source={{
                uri: `file://${image}`,
              }}
            />
          )}
        </View>
        <View
          style={{
            backgroundColor: 'white',
            flex: 0,
            zIndex: 99,
            width: '100%',
            flexDirection: 'row',
            position: 'absolute',
            bottom: 0,
          }}>
          <View
            style={{
              borderTopWidth: 1,
              borderTopColor: '#f4f5f9',
              backgroundColor: 'white',
              flex: 1,
              zIndex: 99,
            }}>
            <TouchableOpacity
              onPress={selectMedia}
              style={{marginStart: 15, marginEnd: 15, padding: 15}}>
              <Text
                style={{
                  width: '100%',
                  textAlign: 'center',
                  fontFamily: 'bold',
                }}>
                Select Image
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};
export default NewPost;
