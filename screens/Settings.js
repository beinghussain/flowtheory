import 'react-native-gesture-handler';
import auth from '@react-native-firebase/auth';
import React from 'react';
import RNFS from 'react-native-fs';
import storage from '@react-native-firebase/storage';
import AsyncStorage from '@react-native-community/async-storage';
import Snackbar from 'react-native-snackbar';

import {
  SafeAreaView,
  Text,
  StatusBar,
  TouchableOpacity,
  View,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import {getPosts} from '../utils';

const Settings: () => React$Node = ({navigation, user}) => {
  const backup = () => {
    const backupFile = `${RNFS.TemporaryDirectoryPath}/file.txt`;
    const reference = storage().ref(
      `data_backup/${user.uid}/latest_backup.txt`,
    );

    getPosts().then(data => {
      if (data.length) {
        RNFS.writeFile(backupFile, JSON.stringify(data), 'utf8')
          .then(async success => {
            await reference.delete();
            await reference.putFile(backupFile);

            Snackbar.show({
              fontFamily: 'regular',
              text: 'Backup completed!',
              duration: Snackbar.LENGTH_LONG,
            });

            await Promise.all(
              data.map(async d => {
                const refFile = storage().ref(
                  `data_backup/${user.uid}/medias/${d.media}`,
                );
                const dir = RNFS.ExternalCachesDirectoryPath;
                const file = `${dir}/medias/${d.media}`;
                RNFS.exists(file).then(async exists => {
                  if (exists) {
                    await refFile.putFile(file);
                  }
                });
              }),
            );

            Snackbar.show({
              fontFamily: 'regular',
              text: 'Backup completed!',
              duration: Snackbar.LENGTH_LONG,
            });
          })
          .catch(err => {
            console.log(err);
          });
      }
    });
  };

  const restore = async () => {
    try {
      const reference = storage().ref(
        `data_backup/${user.uid}/latest_backup.txt`,
      );
      const file = `${RNFS.TemporaryDirectoryPath}/file.txt`;
      const url = await reference.getDownloadURL();
      RNFS.downloadFile({
        fromUrl: url,
        toFile: file,
      }).promise.then(r => {
        RNFS.readFile(file, 'utf8').then(async data => {
          await AsyncStorage.setItem('posts', data);
          const posts = JSON.parse(data);

          await Promise.all(
            posts.map(async d => {
              try {
                const refFile = storage().ref(
                  `data_backup/${user.uid}/medias/${d.media}`,
                );
                const downloadUrl = await refFile.getDownloadURL();
                const dir = `${RNFS.ExternalCachesDirectoryPath}/medias`;

                await RNFS.exists(dir).then(async exists => {
                  if (!exists) {
                    await RNFS.mkdir(dir);
                  }
                });

                const file = `${dir}/${d.media}`;

                RNFS.exists(file).then(async exists => {
                  if (!exists) {
                    RNFS.downloadFile({
                      fromUrl: downloadUrl,
                      toFile: file,
                    }).promise.then(r => {});
                  }
                });
              } catch (err) {
                if (err.code === 'storage/object-not-found') {
                  console.log('Some images not found');
                }
              }
            }),
          );
          Snackbar.show({
            fontFamily: 'regular',
            text: 'Restore complete!',
            duration: Snackbar.LENGTH_LONG,
          });
        });
      });
    } catch (err) {
      if (err.code === 'storage/object-not-found') {
        Snackbar.show({
          fontFamily: 'regular',
          text: 'No Backup found',
          duration: Snackbar.LENGTH_LONG,
        });
      }
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#ffffff'}}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <View
        style={{
          backgroundColor: 'white',
          borderBottomColor: '#f4f5f9',
          borderBottomWidth: 1,
          justifyContent: 'center',
          flexDirection: 'row',
          paddingStart: 24,
          paddingEnd: 24,
          paddingTop: 15,
          flex: 0,
          paddingBottom: 15,
        }}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Home')}
          style={{position: 'absolute', left: 0, padding: 15}}>
          <Icon name="arrow-back-outline" color="#000" size={24} />
        </TouchableOpacity>
        <Text style={{fontFamily: 'medium', color: '#000', fontSize: 16}}>
          Settings
        </Text>
      </View>

      <View style={{flex: 1}}>
        <TouchableOpacity onPress={backup}>
          <View
            style={{
              flex: 0,
              alignItems: 'center',
              flexDirection: 'row',
              borderBottomColor: '#f4f5f9',
              borderBottomWidth: 1,
              padding: 18,
            }}>
            <Icon size={22} name="cloud-upload" color="#B0BAC5" />
            <Text
              style={{fontSize: 16, marginStart: 12, fontFamily: 'regular'}}>
              Back up Now
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={restore}>
          <View
            style={{
              flex: 0,
              alignItems: 'center',
              flexDirection: 'row',
              borderBottomColor: '#f4f5f9',
              borderBottomWidth: 1,
              padding: 18,
            }}>
            <Icon size={22} name="cloud-download" color="#B0BAC5" />
            <Text
              style={{fontSize: 16, marginStart: 12, fontFamily: 'regular'}}>
              Restore Data
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={async () => {
            await AsyncStorage.setItem('posts', '[]');
            auth().signOut();
          }}>
          <View
            style={{
              flex: 0,
              alignItems: 'center',
              flexDirection: 'row',
              borderBottomColor: '#f4f5f9',
              borderBottomWidth: 1,
              padding: 18,
            }}>
            <Icon size={24} name="log-out" color="#B0BAC5" />
            <Text
              style={{fontSize: 16, marginStart: 12, fontFamily: 'regular'}}>
              Logout
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      <View
        style={{
          flex: 0,
          width: '100%',
          position: 'absolute',
          bottom: 0,
          marginTop: 15,
          padding: 15,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text style={{fontSize: 12, opacity: 0.3, fontFamily: 'regular'}}>
          Demo App v1.0 By Hussain Dehgamwala for Flow Theory
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default Settings;
