import React, { useState,useEffect } from 'react';
import { initDatabase, initializeDatabase } from '@/services/database/database';
import { initializeStoreFromDB } from '@/store/slices/inventarioSlice';
import { View, Text, TextInput, Pressable, SafeAreaView, Alert, StatusBar, KeyboardAvoidingView, Platform, TouchableOpacity, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, MaterialIcons, FontAwesome5 } from '@expo/vector-icons'; // Asegúrate de tener esta dependencia
import { useStore } from '../../src/store';
import BotonSalir from './components/utils/botones/BotonSalir';


export default function HomeScreen() {

  useEffect(() => {
    const setupDatabase = async () => {
      try {
        // Inicializa la conexión a la base de datos
        await initializeDatabase();

        // Inicializa las tablas de la base de datos
        await initDatabase();
        initializeStoreFromDB(useStore);
        console.log("Base de datos lista para usarse");
      } catch (error) {
        console.error("Error al configurar la base de datos:", error);
      }
    };

    setupDatabase();
  }, []);



  // Estado local para capturar las tasas ingresadas
  const [tasasInput, setTasasInput] = useState({
    tasa1: '',
    tasa2: '',
    tasa3: '',
  });

  // Acceso al estado global y acciones
  const tasasGlobales = useStore((state) => state.tasas);
  const setTasas = useStore((state) => state.setTasas);

  // Función para guardar las tasas
  const handleSaveTasas = () => {
    const { tasa1, tasa2, tasa3 } = tasasInput;

    // Validar que todos los campos estén completos
    if (tasa1.trim() === '' || tasa2.trim() === '' || tasa3.trim() === '') {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
      return;
    }

    // Convertir los valores a números
    const numericTasa1 = parseFloat(tasa1);
    const numericTasa2 = parseFloat(tasa2);
    const numericTasa3 = parseFloat(tasa3);

    // Validar que los valores sean números válidos
    if (isNaN(numericTasa1) || isNaN(numericTasa2) || isNaN(numericTasa3)) {
      Alert.alert('Error', 'Todos los valores deben ser números válidos.');
      return;
    }

    // Actualizar el estado global con las nuevas tasas
    setTasas({
      tasa1: numericTasa1,
      tasa2: numericTasa2,
      tasa3: numericTasa3,
    });

    // Notificar éxito al usuario
    Alert.alert(
      'Éxito',
      `Las tasas han sido guardadas:\nTasa 1: ${numericTasa1}\nTasa 2: ${numericTasa2}\nTasa 3: ${numericTasa3}`
    );

    // Limpiar los campos de entrada
    setTasasInput({
      tasa1: '',
      tasa2: '',
      tasa3: '',
    });
  };


  return (
    <SafeAreaView className="flex-1">
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#1e3c72', '#2a5298']} // Colores modernos
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="flex-1"
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            className="px-6"
            showsVerticalScrollIndicator={false}
          >
            {/* Encabezado */}
            <View className="pt-12 pb-8 items-center">
              <View className="w-20 h-20 bg-white/20 rounded-full items-center justify-center mb-4">
                <FontAwesome5 name="boxes" size={36} color="white" />
              </View>
              <Text className="text-3xl font-bold text-white tracking-wider">INVENTARIO</Text>
              <Text className="text-white/70 text-base mt-2">Sistema de gestión de productos</Text>
            </View>

            {/* Sección de tasas */}
            <View className="bg-white/10 rounded-xl p-5 mb-8">
              <View className="flex-row items-center mb-3">
                <MaterialIcons name="attach-money" size={24} color="#a3e635" />
                <Text className="text-lg font-semibold text-white ml-2">Configuración de tasas</Text>
              </View>

              {/* Input para tasa1 */}
              <View className="bg-white/5 rounded-lg p-1 flex-row items-center mb-2">
                <TextInput
                  className="flex-1 h-12 px-4 bg-white rounded-lg text-base text-gray-800"
                  keyboardType="numeric"
                  placeholder="Tasa 1"
                  placeholderTextColor="#9ca3af"
                  value={tasasInput.tasa1}
                  onChangeText={(text) =>
                    setTasasInput((prev) => ({ ...prev, tasa1: text }))
                  }
                />
              </View>

              {/* Input para tasa2 */}
              <View className="bg-white/5 rounded-lg p-1 flex-row items-center mb-2">
                <TextInput
                  className="flex-1 h-12 px-4 bg-white rounded-lg text-base text-gray-800"
                  keyboardType="numeric"
                  placeholder="Tasa 2"
                  placeholderTextColor="#9ca3af"
                  value={tasasInput.tasa2}
                  onChangeText={(text) =>
                    setTasasInput((prev) => ({ ...prev, tasa2: text }))
                  }
                />
              </View>

              {/* Input para tasa3 */}
              <View className="bg-white/5 rounded-lg p-1 flex-row items-center mb-4">
                <TextInput
                  className="flex-1 h-12 px-4 bg-white rounded-lg text-base text-gray-800"
                  keyboardType="numeric"
                  placeholder="Tasa 3"
                  placeholderTextColor="#9ca3af"
                  value={tasasInput.tasa3}
                  onChangeText={(text) =>
                    setTasasInput((prev) => ({ ...prev, tasa3: text }))
                  }
                />
              </View>

              {/* Botón para guardar las tasas */}
              <TouchableOpacity
                className="bg-green-500 h-12 px-4 rounded-lg items-center justify-center"
                onPress={handleSaveTasas}
              >
                <Text className="text-white font-bold text-lg">Guardar Tasas</Text>
              </TouchableOpacity>

              {/* Mostrar las tasas actuales */}
              {(tasasGlobales.tasa1 > 0 || tasasGlobales.tasa2 > 0 || tasasGlobales.tasa3 > 0) && (
                <View className="mt-4 bg-white/5 rounded-lg p-3">
                  <Text className="text-white font-bold mb-2">Tasas Actuales:</Text>
                  <Text className="text-white">Tasa 1: ${tasasGlobales.tasa1.toFixed(2)}</Text>
                  <Text className="text-white">Tasa 2: ${tasasGlobales.tasa2.toFixed(2)}</Text>
                  <Text className="text-white">Tasa 3: ${tasasGlobales.tasa3.toFixed(2)}</Text>
                </View>
              )}
            </View>

            {/* Menú principal */}
            <Text className="text-white text-lg font-semibold mb-4">Menú Principal</Text>

            <View className="space-y-4 mb-8">
              <Link href="/screens/inventario" asChild>
                <TouchableOpacity className="bg-white/10 rounded-xl overflow-hidden">
                  <LinearGradient
                    colors={['#3b82f6', '#2563eb']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    className="p-4 flex-row items-center"
                  >
                    <View className="bg-white/20 w-12 h-12 rounded-full items-center justify-center mr-4">
                      <Feather name="package" size={24} color="white" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-white text-lg font-bold">Inventario</Text>
                      <Text className="text-white/70">Gestiona tus productos</Text>
                    </View>
                    <Feather name="chevron-right" size={24} color="white" />
                  </LinearGradient>
                </TouchableOpacity>
              </Link>

              <Link href="/screens/herramientas" asChild>
                <TouchableOpacity className="bg-white/10 rounded-xl overflow-hidden">
                  <LinearGradient
                    colors={['#10b981', '#059669']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    className="p-4 flex-row items-center"
                  >
                    <View className="bg-white/20 w-12 h-12 rounded-full items-center justify-center mr-4">
                      <Feather name="tool" size={24} color="white" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-white text-lg font-bold">Herramientas</Text>
                      <Text className="text-white/70">Utilidades y configuración</Text>
                    </View>
                    <Feather name="chevron-right" size={24} color="white" />
                  </LinearGradient>
                </TouchableOpacity>
              </Link>
            </View>

            {/* Botón de salir personalizado */}
            <View className="mb-8">
              <BotonSalir />
            </View>

            {/* Pie de página */}
            <View className="items-center mb-6">
              <Text className="text-white/50 text-sm">v1.0.0 • Sistema de Inventario</Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}