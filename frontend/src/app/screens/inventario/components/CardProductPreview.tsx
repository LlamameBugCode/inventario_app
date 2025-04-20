// src/components/CardProductPreview.tsx
"use client"

import { View, Text, TouchableOpacity, Alert } from "react-native"
import { Feather } from "@expo/vector-icons"
import type { Product } from "@/types"
import ModalOptions from "./modals/ModalOptions"
import { useStore } from "@/store"
import { useModalManagerStore } from "@/store/modalManagerStore"

type CardProductPreviewProps = {
  item: Product
  onPress?: (product: Product) => void
}

export default function CardProductPreview({ item, onPress }: CardProductPreviewProps) {

  const openOptionsModal = useModalManagerStore((state) => state.openOptionsModal)

  if (!item) {
    return null
  }

  const handleLongPress = () => {
    // Abrir el modal usando el store global
    openOptionsModal(item)
  }


  const handleEdit = () => {
    // Por ahora solo mostramos un mensaje
    Alert.alert("Editar", "La funcionalidad de edición se implementará próximamente")
  }

  return (
    <View>
      {/* Tarjeta del producto */}
      <TouchableOpacity
        className="bg-white rounded-2xl shadow-lg mb-4 overflow-hidden border border-gray-100"
        onPress={() => onPress && onPress(item)}
        onLongPress={handleLongPress}
        activeOpacity={onPress ? 0.7 : 1}
        delayLongPress={500}
      >
        {/* Encabezado con nombre */}
        <View className="p-4 pb-2 border-b border-gray-100">
          <View className="flex-row justify-between items-center">
            <Text className="text-blue-600 font-bold text-lg" numberOfLines={1}>
              {item.nombre}
            </Text>
            <Feather name="edit" size={18} color="#9CA3AF" />
          </View>
        </View>

        {/* Información principal */}
        <View className="p-4 pt-3">
          <View className="flex-row justify-between space-x-2">
            {/* Precio unitario */}
            <View className="flex-1">
              <View className="flex-row items-center mb-1">
                <Feather name="dollar-sign" size={14} color="#6B7280" className="mr-1" />
                <Text className="text-gray-500 text-xs">Precio Unitario</Text>
              </View>
              <Text className="text-green-600 font-semibold text-base">${item.precioUnitario.toFixed(2)}</Text>
              <View className="mt-1">
                <Text className="text-gray-400 text-xs">Equivalentes:</Text>
                <Text className="text-yellow-600 text-xs flex-row items-center">
                  <Feather name="trending-up" size={12} color="#F59E0B" className="mr-1" />
                  {item.precioUnitarioTasa1.toFixed(2)} Bs (T1)
                </Text>
                <Text className="text-blue-600 text-xs flex-row items-center">
                  <Feather name="trending-up" size={12} color="#3B82F6" className="mr-1" />
                  {item.precioUnitarioTasa2.toFixed(2)} Bs (T2)
                </Text>
                <Text className="text-red-600 text-xs flex-row items-center">
                  <Feather name="trending-up" size={12} color="#EF4444" className="mr-1" />
                  {item.precioUnitarioTasa3.toFixed(2)} Bs (T3)
                </Text>
              </View>
            </View>

            {/* Cantidad */}
            <View className="flex-1 items-center">
              <View className="flex-row items-center mb-1">
                <Feather name="box" size={14} color="#6B7280" className="mr-1" />
                <Text className="text-gray-500 text-xs">Cantidad</Text>
              </View>
              <Text className="text-gray-700 font-medium text-sm">
                {item.cantidad - item.articulosVendidos}/{item.cantidad}
              </Text>
            </View>

            {/* Ganancia esperada */}
            <View className="flex-1 items-end">
              <View className="flex-row items-center mb-1">
                <Feather name="bar-chart-2" size={14} color="#6B7280" className="mr-1" />
                <Text className="text-gray-500 text-xs">Ganancia Esperada</Text>
              </View>
              <Text className="text-green-600 font-semibold text-base">${item.gananciasEsperadas.toFixed(2)}</Text>
              <Text className="text-gray-500 text-xs mt-1">Ganancia actual</Text>
              <Text className="text-blue-600 font-medium text-sm">
                ${(item.gananciasPorArticulo * item.articulosVendidos).toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        {/* Barra de progreso para ventas */}
        {item.articulosVendidos > 0 && (
          <View className="p-4 pt-2 bg-gray-50 border-t border-gray-100">
            <View className="flex-row justify-between items-center mb-1">
              <Text className="text-xs text-gray-500">
                Vendidos: {item.articulosVendidos}/{item.cantidad}
              </Text>
              <Text className="text-xs text-gray-500">
                {Math.round((item.articulosVendidos / item.cantidad) * 100)}%
              </Text>
            </View>
            <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <View
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${(item.articulosVendidos / item.cantidad) * 100}%` }}
              />
            </View>
          </View>
        )}
      </TouchableOpacity>

      {/* Modal de opciones */}
      <ModalOptions

         // Leer la visibilidad del modal desde el store
         // Usar la función del store para cerrar el modal


        product={item} // Leer el producto seleccionado desde el store
      />
    </View>
  )
}