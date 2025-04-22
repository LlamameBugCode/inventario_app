// src/app/screens/inventario/components/modals/ModalDetallesProducto.tsx
import { View, Modal, Text, Pressable } from "react-native"
import { Feather } from "@expo/vector-icons"
import {Product} from "@/types/index"
import { useModalManagerStore } from "@/store/modalManagerStore"

type ModalDetallesProductoProps = {

  product: Product | null
}

export default function ModalDetallesProducto({  product }: ModalDetallesProductoProps) {
  if (!product) return null

  const visible = useModalManagerStore((state)=>state.modalsOpen.modalDetallesProducto)
  const close = useModalManagerStore((state)=>state.closeModalDetallesProducto)


  return (
    <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={close}>
      <View className="flex-1 justify-center items-center bg-black/80">
        <View className="bg-white w-[95%] p-6 rounded-lg">
          {/* Encabezado */}
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-blue-600">{product.nombre}</Text>
            <Pressable onPress={close}>
              <Feather name="x" size={24} color="#6B7280" />
            </Pressable>
          </View>

          {/* Sección 1: Información General */}
          <View className="mb-4">
            <Text className="text-gray-500 text-sm">Código: {product.codigo}</Text>
            <Text className="text-gray-500 text-sm">Categoría: {product.categoria}</Text>
            <Text className="text-gray-700 font-medium mt-2">
              Cantidad: {product.cantidad - product.articulosVendidos}/{product.cantidad}
            </Text>
          </View>

          {/* Sección 2: Precios */}
          <View className="mb-4">
            <Text className="text-lg font-semibold text-gray-800 mb-2">Precios</Text>
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">Precio por Bulto:</Text>
              <Text className="text-green-600 font-medium">${product.precioBulto.toFixed(2)}</Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">Precio Unitario:</Text>
              <Text className="text-green-600 font-medium">${product.precioUnitario.toFixed(2)}</Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">Tasa 1:</Text>
              <Text className="text-yellow-600 font-medium">${product.precioUnitarioTasa1.toFixed(2)}</Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">Tasa 2:</Text>
              <Text className="text-blue-600 font-medium">${product.precioUnitarioTasa2.toFixed(2)}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Tasa 3:</Text>
              <Text className="text-red-600 font-medium">${product.precioUnitarioTasa3.toFixed(2)}</Text>
            </View>
          </View>

          {/* Sección 3: Ganancias */}
          <View className="mb-4">
            <Text className="text-lg font-semibold text-gray-800 mb-2">Ganancias</Text>
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">% Ganancia:</Text>
              <Text className="text-green-600 font-medium">{product.porcentajeDeGanancias.toFixed(2)}%</Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">Ganancias Esperadas:</Text>
              <Text className="text-green-600 font-medium">${product.gananciasEsperadas.toFixed(2)}</Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">Ganancias Actuales:</Text>
              <Text className="text-green-600 font-medium">${product.gananciasActuales.toFixed(2)}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Ganancias por Artículo:</Text>
              <Text className="text-green-600 font-medium">${product.gananciasPorArticulo.toFixed(2)}</Text>
            </View>
          </View>

          {/* Botón de Cierre */}
          <Pressable
            className="bg-blue-600 px-4 py-3 rounded-md mt-4"
            onPress={close}
          >
            <Text className="text-white text-center font-medium">Cerrar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  )
}