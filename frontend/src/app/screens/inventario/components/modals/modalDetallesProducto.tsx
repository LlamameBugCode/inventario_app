// src/app/screens/inventario/components/modals/ModalDetallesProducto.tsx
import { View, Modal, Text, Pressable, ScrollView } from "react-native"
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons"
import { useModalManagerStore } from "@/store/modalManagerStore"
import { Product } from "@/types"

type ModalDetallesProductoProps = {
  product: Product | null
}

export default function ModalDetallesProducto({ product }: ModalDetallesProductoProps) {
  if (!product) return null

  const visible = useModalManagerStore((state) => state.modalsOpen.modalDetallesProducto)
  const close = useModalManagerStore((state) => state.closeModalDetallesProducto)

  // Función para renderizar una pequeña gráfica de barras
  const renderBarChart = () => {
    const totalGanancias = product.gananciasEsperadas
    const gananciasActuales = product.gananciasActuales
    const porcentajeActual = (gananciasActuales / totalGanancias) * 100

    return (
      <View className="flex-row items-center justify-center mt-4">
        <View className="w-[80%] h-6 bg-gray-200 rounded-full overflow-hidden shadow-sm">
          <View
            className="h-full bg-green-500 rounded-full"
            style={{ width: `${porcentajeActual}%` }}
          />
        </View>
        <Text className="ml-2 text-gray-700 font-medium">{porcentajeActual.toFixed(0)}%</Text>
      </View>
    )
  }

  return (
    <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={close}>
      <View className="flex-1 justify-center items-center bg-black/80">
        <ScrollView className="w-full max-h-[90%]">
          <View className="bg-white w-[95%] p-6 rounded-2xl shadow-lg">
            {/* Encabezado */}
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-3xl font-bold text-blue-600">{product.nombre}</Text>
              <Pressable onPress={close}>
                <Feather name="x" size={32} color="#6B7280" />
              </Pressable>
            </View>

            {/* Sección 1: Información General */}
            <View className="mb-8">
              <Text className="text-xl font-semibold text-gray-800 mb-4">Información General</Text>
              <View className="space-y-3">
                {/* Código */}
                <View className="flex-row items-center bg-gray-50 p-4 rounded-xl shadow-sm">
                  <MaterialCommunityIcons name="barcode-scan" size={28} color="#4F46E5" className="mr-3" />
                  <Text className="text-gray-700 flex-1">Código:</Text>
                  <Text className="text-gray-900 font-bold text-lg">{product.codigo}</Text>
                </View>
                {/* Categoría */}
                <View className="flex-row items-center bg-gray-50 p-4 rounded-xl shadow-sm">
                  <MaterialCommunityIcons name="tag-outline" size={28} color="#10B981" className="mr-3" />
                  <Text className="text-gray-700 flex-1">Categoría:</Text>
                  <Text className="text-gray-900 font-bold text-lg">{product.categoria}</Text>
                </View>
                {/* Cantidad */}
                <View className="flex-row items-center bg-gray-50 p-4 rounded-xl shadow-sm">
                  <MaterialCommunityIcons name="package-variant-closed" size={28} color="#F59E0B" className="mr-3" />
                  <Text className="text-gray-700 flex-1">Cantidad:</Text>
                  <Text className="text-gray-900 font-bold text-lg">
                    {product.cantidad - product.articulosVendidos}/{product.cantidad}
                  </Text>
                </View>
              </View>
            </View>

            {/* Sección 2: Precios */}
            <View className="mb-8">
              <Text className="text-xl font-semibold text-gray-800 mb-4">Precios</Text>
              <View className="space-y-3">
                {/* Precio por Bulto */}
                <View className="flex-row items-center bg-gray-50 p-4 rounded-xl shadow-sm">
                  <MaterialCommunityIcons name="cash-multiple" size={28} color="#10B981" className="mr-3" />
                  <Text className="text-gray-700 flex-1">Precio por Bulto:</Text>
                  <Text className="text-green-600 font-bold text-lg">${product.precioBulto.toFixed(2)}</Text>
                </View>
                {/* Precio Unitario */}
                <View className="flex-row items-center bg-gray-50 p-4 rounded-xl shadow-sm">
                  <MaterialCommunityIcons name="currency-usd" size={28} color="#10B981" className="mr-3" />
                  <Text className="text-gray-700 flex-1">Precio Unitario:</Text>
                  <Text className="text-green-600 font-bold text-lg">${product.precioUnitario.toFixed(2)}</Text>
                </View>
                {/* Tasas */}
                <View className="space-y-2">
                  <Text className="text-gray-700 ml-1">Tasas:</Text>
                  <View className="flex-row items-center bg-gray-50 p-4 rounded-xl shadow-sm">
                    <MaterialCommunityIcons name="trending-up" size={28} color="#F59E0B" className="mr-3" />
                    <Text className="text-gray-700 flex-1">Tasa 1:</Text>
                    <Text className="text-yellow-600 font-bold text-lg">${product.precioUnitarioTasa1.toFixed(2)}</Text>
                  </View>
                  <View className="flex-row items-center bg-gray-50 p-4 rounded-xl shadow-sm">
                    <MaterialCommunityIcons name="trending-up" size={28} color="#3B82F6" className="mr-3" />
                    <Text className="text-gray-700 flex-1">Tasa 2:</Text>
                    <Text className="text-blue-600 font-bold text-lg">${product.precioUnitarioTasa2.toFixed(2)}</Text>
                  </View>
                  <View className="flex-row items-center bg-gray-50 p-4 rounded-xl shadow-sm">
                    <MaterialCommunityIcons name="trending-up" size={28} color="#EF4444" className="mr-3" />
                    <Text className="text-gray-700 flex-1">Tasa 3:</Text>
                    <Text className="text-red-600 font-bold text-lg">${product.precioUnitarioTasa3.toFixed(2)}</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Sección 3: Ganancias */}
            <View className="mb-8">
              <Text className="text-xl font-semibold text-gray-800 mb-4">Ganancias</Text>
              <View className="space-y-3">
                {/* % Ganancia */}
                <View className="flex-row items-center bg-gray-50 p-4 rounded-xl shadow-sm">
                  <MaterialCommunityIcons name="percent-outline" size={28} color="#10B981" className="mr-3" />
                  <Text className="text-gray-700 flex-1">% Ganancia:</Text>
                  <Text className="text-green-600 font-bold text-lg">{product.porcentajeDeGanancias.toFixed(2)}%</Text>
                </View>
                {/* Ganancias Esperadas */}
                <View className="flex-row items-center bg-gray-50 p-4 rounded-xl shadow-sm">
                  <MaterialCommunityIcons name="chart-line" size={28} color="#10B981" className="mr-3" />
                  <Text className="text-gray-700 flex-1">Ganancias Esperadas:</Text>
                  <Text className="text-green-600 font-bold text-lg">${product.gananciasEsperadas.toFixed(2)}</Text>
                </View>
                {/* Ganancias Actuales */}
                <View className="flex-row items-center bg-gray-50 p-4 rounded-xl shadow-sm">
                  <MaterialCommunityIcons name="cash-check" size={28} color="#10B981" className="mr-3" />
                  <Text className="text-gray-700 flex-1">Ganancias Actuales:</Text>
                  <Text className="text-green-600 font-bold text-lg">${product.gananciasActuales.toFixed(2)}</Text>
                </View>
                {/* Gráfica de Progreso */}
                <View className="mt-2">
                  <Text className="text-gray-700 ml-1 mb-2">Progreso de Ganancias:</Text>
                  {renderBarChart()}
                </View>
              </View>
            </View>

            {/* Botón de Cierre */}
            <Pressable
              className="bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-4 rounded-xl mt-6 shadow-md"
              onPress={close}
            >
              <Text className="text-white text-lg font-bold text-center">Cerrar</Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </Modal>
  )
}