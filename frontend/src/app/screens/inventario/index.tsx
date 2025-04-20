"use client"

import { useState, useEffect } from "react"
import { View, Text, TextInput, Pressable, FlatList, SafeAreaView, Alert } from "react-native"
import { Plus, Search } from "lucide-react-native"
import type { Product } from "@/types"
import CardProductPreview from "./components/CardProductPreview"
import ModalAddProduct from "./components/modals/ModalAddProduct"
import { useStore } from "@/store"
import { useModalManagerStore } from "@/store/slices/modalManagerStore"

export default function InventarioScreen() {
  // Obtenemos los productos y tasas del store
  const products = useStore((state) => state.products)
  const tasas = useStore((state) => state.tasas)

  // Estado para la búsqueda
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products)

  // Estado para controlar la visibilidad del modal
  const [isModalVisible, setIsModalVisible] = useState(false)
  const openModal2 = useModalManagerStore((state)=>state.openModalAddProduct)
  const closeModal2 = useModalManagerStore((state)=>state.closeModalAddProduct)

  // Filtrar productos cuando cambia la búsqueda o los productos
  //Esto es para que funcione la busqueda en tiempo real
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredProducts(products)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = products.filter(
        (product) =>
          product.nombre.toLowerCase().includes(query) ||
          product.codigo.toLowerCase().includes(query) ||
          product.categoria.toLowerCase().includes(query),
      )
      setFilteredProducts(filtered)
    }
  }, [searchQuery, products])

  // Función para abrir el modal
  const openModal = () => setIsModalVisible(true)

  // Función para cerrar el modal
  const closeModal = () => setIsModalVisible(false)

  // Función para manejar la selección de un producto
  const handleProductPress = (product: Product) => {
    // Aquí puedes navegar a la pantalla de detalles del producto
    // o mostrar un modal con más información
    Alert.alert(
      "Detalles del Producto",
      `Nombre: ${product.nombre}\nCódigo: ${product.codigo}\nCantidad: ${product.cantidad}\nPrecio: ${product.precioUnitario} Bs`,
    )
  }

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
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <Pressable className="bg-green-500 px-3 py-2 rounded-md flex-row items-center" onPress={openModal2}>
          <Plus size={20} color="white" />
          <Text className="text-white font-medium ml-1">Añadir Producto</Text>
        </Pressable>
      </View>

      {/* Encabezados de tabla */}
      <View className="flex-row  justify-around items-center  bg-gray-50 py-3 border-b border-gray-200">
        <Text className="ont-bold text-sm text-gray-600 pl-4">Precio</Text>
        <Text className="ont-bold text-sm text-gray-600">Cantidad</Text>

        <Text className=" font-bold text-sm text-gray-600">Ganancias</Text>
      </View>

      {/* Lista de productos */}
      {filteredProducts.length > 0 ? (
        <FlatList
          data={filteredProducts}
          renderItem={({ item }) => <CardProductPreview item={item} onPress={handleProductPress} />}
          keyExtractor={(item) => item.codigo}
          className="bg-white"
        />
      ) : (
        <View className="flex-1 justify-center items-center bg-white">
          <Text className="text-gray-500">No se encontraron productos</Text>
        </View>
      )}

      {/* Modal para añadir productos */}
      <ModalAddProduct  />
    </SafeAreaView>
  )
}
