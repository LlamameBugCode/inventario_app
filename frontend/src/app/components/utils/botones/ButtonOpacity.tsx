import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

const ButtonOpacity = () => {
  return (
    <Pressable
      className="bg-green-500 px-5 ml-5 py-2 rounded-md flex-row items-center"
      style={({ pressed }) => [
        { opacity: pressed ? 0.7 : 1 }, // Efecto de opacidad al presionar
      ]}
    >
      {({ pressed }) => (
        <Text className="text-white font-bold p-1">
          {pressed ? 'Boton' : 'Botón'}
        </Text>
      )}
    </Pressable>
  );
};

export default ButtonOpacity;