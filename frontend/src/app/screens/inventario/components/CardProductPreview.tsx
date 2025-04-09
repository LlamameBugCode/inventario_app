import { View, Text, TextInput, Pressable, SafeAreaView, Alert, StatusBar, KeyboardAvoidingView, Platform, TouchableOpacity, ScrollView } from 'react-native';
import { Product } from '@/types';

//ESta funcion es usada por un flatList por lo tanto
//Su parametro debe ser un objeto item, igual le agregamos el tipo de datos
//Estamos solo cumpliendo la firma del flatList

export type CardProductPreviewProps ={
  product:Product
}

export default function CardProductPreview({ item }: { item: Product }) {
  return (
    <View className="flex-row items-center border-b border-gray-200 py-3">
      <Text className="flex-[3] text-blue-600 font-medium pl-4">eje{item.nombre}</Text>
      <Text className="flex-[1] text-green-600">${item.precioUnitario.toFixed(1)}</Text>
      <Text className="flex-[1] text-center">{item.cantidad}</Text>
      <Text className="flex-[1] text-green-600">${item.gananciasEsperadas.toFixed(2)}</Text>


    </View>
  )
}
