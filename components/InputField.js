import 'react-native-gesture-handler';
import React from 'react';
import {TextInput, Text, View} from 'react-native';

const InputField: () => React$Node = (props, ...rest) => {
  return (
    <View style={{flex: 0, backgroundColor: 'white', ...props.style}}>
      <Text
        style={{
          fontFamily: 'bold',
          fontSize: 11,
          textTransform: 'uppercase',
          opacity: 0.2,
          marginBottom: -5,
          color: '#000',
        }}>
        {props.label}
      </Text>
      <TextInput
        onChangeText={props.onChange}
        spellCheck={false}
        value={props.value}
        autoCapitalize="none"
        secureTextEntry={props.type === 'password'}
        autoCompleteType={props.type}
        style={{
          borderBottomColor: '#f4f5f9',
          borderBottomWidth: 2,
          paddingStart: 0,
          fontSize: 16,
          fontFamily: 'regular',
        }}
        placeholder={props.placeholder}
      />
    </View>
  );
};

export default InputField;
