import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, FlatList, SafeAreaView, Modal } from 'react-native';
import { ChevronDown, Plus, Search } from 'lucide-react-native';
import { Product } from '@/types';
import CardProductPreview from '@/app/screens/inventario/components/CardProductPreview';
import ModalAddProduct from '@/app/screens/inventario/components/ModalAddProdcut'
import { useStore } from '@/store';

export default function InventarioScreen() {
  // Obtenemos las tasas del store
  const tasas = useStore(state => state.tasas);

  // Datos de ejemplo
  const [productosTemporal, setProductosTemporal] = useState<Product[]>([
    {
      nombre: 'HARINA PAN',
      codigo: '1234',
      categoria: 'Alimentos',
      cantidad: 12,
      precioBulto: 1.4,
      precioUnitario: 1.0,

      porcentajeDeGanancias: 10,
      gananciasPorArticulo: 0.12,
      gananciasEsperadas: 85.05,
      gananciasActuales: 0,

      articulosVendidos: 0,
    },
    {
      nombre: 'ARROZ MARY',
      codigo: '1234',
      categoria: 'Alimentos',
      cantidad: 8,
      precioBulto: 2.2,
      precioUnitario: 1.8,
      porcentajeDeGanancias: 15,
      gananciasPorArticulo: 0.28,
      gananciasEsperadas: 52.8,
      gananciasActuales: 0,
      articulosVendidos: 0,
    },
    {
      nombre: 'PASTA PRIMOR',
      codigo: '1234',
      categoria: 'Alimentos',
      cantidad: 15,
      precioBulto: 1.1,
      precioUnitario: 0.9,
      porcentajeDeGanancias: 20,
      gananciasPorArticulo: 0.15,
      gananciasEsperadas: 49.5,
      gananciasActuales: 0,
      articulosVendidos: 0,
    },
  ]);

  // Estado para controlar la visibilidad del modal
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Función para abrir el modal
  const openModal = () => setIsModalVisible(true);

  // Función para cerrar el modal
  const closeModal = () => setIsModalVisible(false);

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {/* Barra de navegación */}
      <View className="bg-blue-600 py-4 px-4">
        <Text className="text-white text-xl font-bold">Sistema de Inventario</Text>
      </View>

      {/* Barra de búsqueda y botón de añadir */}
      <View className="flex-row items-center p-4 bg-white border-b border-gray-200">
        <View className="flex-1 flex-row items-center bg-gray-100 rounded-md px-3 py-2 mr-2">
          <Search size={20} color="#9CA3AF" />
          <TextInput
            className="flex-1 ml-2 text-gray-800"
            placeholder="Buscar producto..."
            placeholderTextColor="#9CA3AF"
          />
        </View>
        <Pressable className="bg-green-500 px-3 py-2 rounded-md flex-row items-center" onPress={openModal}>
          <Plus size={20} color="white" />
          <Text className="text-white font-medium ml-1">Añadir Producto</Text>
        </Pressable>
      </View>

      {/* Encabezados de tabla */}
      <View className="flex-row items-center bg-gray-50 py-3 border-b border-gray-200">
        <Text className="flex-[3] font-bold text-sm text-gray-600 pl-4">Productos</Text>
        <Text className="flex-[1] font-bold text-sm text-gray-600">Precio</Text>
        <Text className="flex-[1] font-bold text-sm text-gray-600 text-center">Cantidad</Text>
        <Text className="flex-[1.2] font-bold text-sm text-gray-600">Ganancias</Text>
      </View>

      {/* Lista de productos */}
      <FlatList
        data={productosTemporal}
        renderItem={({ item }) => <CardProductPreview item={item} tasas={tasas} />}
        keyExtractor={(item) => item.codigo}
        className="bg-white"
      />

      {/* Modal */}
      <ModalAddProduct
        visible={isModalVisible}
        onClose={closeModal}
      />

    </SafeAreaView>
  );
}