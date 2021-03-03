/* eslint-disable react-native/no-inline-styles */
import 'react-native-gesture-handler';
import React from 'react';
import {View, Text, StatusBar} from 'react-native';

const App: React.FC = () => {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#312e38" />
      <View style={{flex: 1, backgroundColor: '#312e38'}}>
        <Text>Olá Mundo</Text>
      </View>
    </>
  );
};

export default App;
