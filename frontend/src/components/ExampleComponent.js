import React from 'react';
import { View, Text } from 'react-native';

const ExampleComponent = ({ children }) => (
  <View>
    <Text>Componente de ejemplo</Text>
    {children}
  </View>
);

export default ExampleComponent;
