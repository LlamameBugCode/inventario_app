// src/app/components/BotonSalir.tsx
import { Pressable, Text } from 'react-native';
import { useRouter } from 'expo-router';

export default function BotonSalir() {
  const router = useRouter();

  const handleSalir = () => {
    router.replace('/'); // Reemplaza la ruta actual
  };

  return (
    <Pressable
      className="bg-red-600 p-4 rounded-lg"
      onPress={handleSalir}
    >
      <Text className="text-white text-center font-bold">Salir</Text>
    </Pressable>
  );
}