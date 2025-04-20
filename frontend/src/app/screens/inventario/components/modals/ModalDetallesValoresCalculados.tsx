// src/app/screens/inventario/components/modals/DetallesModal.tsx
import { View, Modal, Text, Pressable } from "react-native"
import Icon from "react-native-vector-icons/Ionicons"
import { useModalManagerStore } from "@/store/modalManagerStore"

type DetallesModalProps = {

  detalleSeleccionado: {
    titulo: string
    valorDolar: string
    valoresBs: {
      tasa: number
      valor: string
      etiqueta: string
      color: string
    }[]
  } | null
}

export default function ModalDetallesValoresCalculados({  detalleSeleccionado }: DetallesModalProps) {

  const ModalDetallesValoresCalculados = useModalManagerStore((state)=>state.modalsOpen.ModalDetallesValoresCalculados)
  const closeModalDetallesValoresCalculados = useModalManagerStore((state)=>state.closeModalDetallesValoresCalculados)

  if (!detalleSeleccionado) return null

  return (
    <Modal
      visible={ModalDetallesValoresCalculados}
      onRequestClose={closeModalDetallesValoresCalculados}
      transparent={true}
      animationType="fade"
    >
      <View
        style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.8)" }}
      >
        <View className="bg-white w-[90%] p-5 rounded-lg">
          {/* Encabezado */}
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold">{detalleSeleccionado.titulo}</Text>
            <Pressable onPress={closeModalDetallesValoresCalculados}>
              <Icon name="close-outline" size={24} color="#374151" />
            </Pressable>
          </View>

          {/* Valor en dólares */}
          <View className="bg-green-50 p-3 rounded-lg mb-4">
            <Text className="text-gray-600 mb-1">Valor en dólares:</Text>
            <Text className="text-green-600 text-xl font-bold">${detalleSeleccionado.valorDolar}</Text>
          </View>

          {/* Equivalentes en bolívares */}
          <Text className="text-gray-600 mb-2 font-medium">Equivalentes en bolívares:</Text>
          {detalleSeleccionado.valoresBs.map((item, index) => (
            <View key={index} className="bg-gray-50 p-3 rounded-lg mb-2 flex-row justify-between items-center">
              <View>
                <Text className="text-gray-500">
                  {item.etiqueta} (Bs/${item.tasa}):
                </Text>
                <Text className={`text-lg font-semibold ${item.color}`}>{item.valor} Bs</Text>
              </View>
            </View>
          ))}

          {/* Botón de cierre */}
          <Pressable className="bg-blue-500 py-2 rounded-lg mt-3" onPress={closeModalDetallesValoresCalculados}>
            <Text className="text-white text-center font-medium">Cerrar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  )
}