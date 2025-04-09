import { View, Text } from 'react-native';

export default function EstadisticasScreen() {
  return (
    <View className="flex-1 items-center justify-center p-6 bg-white">
      <Text className="text-2xl font-bold mb-4">Estadísticas</Text>
      <Text className="text-gray-600 text-center">
        Visualiza las estadísticas y métricas de tu inventario.
      </Text>
    </View>
  );
}