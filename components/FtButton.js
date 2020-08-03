import React from 'react';
import {TouchableHighlight, Text, ActivityIndicator} from 'react-native';

export default function FtButton(props) {
  return (
    <TouchableHighlight
      onPress={props.onPress}
      style={{
        height: 50,
        borderRadius: 6,
        flex: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: props.backgroundColor || '#ED5178',
        ...props.style,
      }}>
      {props.loading ? (
        <ActivityIndicator size="large" color="#ffffff" />
      ) : (
        <Text style={{fontFamily: 'bold', color: '#fff'}}>
          {props.children}
        </Text>
      )}
    </TouchableHighlight>
  );
}
