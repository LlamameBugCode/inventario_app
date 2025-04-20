// src/app/screens/inventario/components/modals/TasasModal.tsx
import { View, Modal, Text, Pressable, TextInput, Alert } from "react-native"
import Icon from "react-native-vector-icons/Ionicons"
import { parseNumber } from "@/utils/auxiliares"
import { useStore } from "@/store"
import { useModalManagerStore } from "@/store/modalManagerStore"

type TasasModalProps = {

  tasasLocales: {
    tasa1: string
    tasa2: string
    tasa3: string
  }
  handleTasaLocalChange: (tipo: "tasa1" | "tasa2" | "tasa3", valor: string) => void
  guardarTasasGlobales: () => void
}

export default function ModalEditarTasas({

  tasasLocales,
  handleTasaLocalChange,
  guardarTasasGlobales,
}: TasasModalProps) {

  const visible = useModalManagerStore((state)=>state.modalsOpen.ModalEditarTasas)
  const close = useModalManagerStore((state)=>state.closeModalEditarTasas)

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={close}
    >
      <View
        style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.8)" }}
      >
        <View className="bg-white w-[90%] p-5 rounded-lg">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold">Tasas de Cambio</Text>
            <Pressable onPress={close}>
              <Icon name="close-outline" size={24} color="#374151" />
            </Pressable>
          </View>
          <View className="mb-3">
            <Text className="text-gray-600 mb-1">Tasa Promedio (Bs/$):</Text>
            <TextInput
              className="border border-gray-300 rounded-md px-3 py-2"
              keyboardType="numeric"
              value={tasasLocales.tasa1}
              onChangeText={(text) => handleTasaLocalChange("tasa1", text)}
            />
          </View>
          <View className="mb-3">
            <Text className="text-gray-600 mb-1">Tasa Paralelo (Bs/$):</Text>
            <TextInput
              className="border border-gray-300 rounded-md px-3 py-2"
              keyboardType="numeric"
              value={tasasLocales.tasa2}
              onChangeText={(text) => handleTasaLocalChange("tasa2", text)}
            />
          </View>
          <View className="mb-4">
            <Text className="text-gray-600 mb-1">Tasa BCV (Bs/$):</Text>
            <TextInput
              className="border border-gray-300 rounded-md px-3 py-2"
              keyboardType="numeric"
              value={tasasLocales.tasa3}
              onChangeText={(text) => handleTasaLocalChange("tasa3", text)}
            />
          </View>
          <View className="flex-row justify-between">
            <Pressable
              className="bg-gray-400 px-4 py-2 rounded-md flex-1 mr-2"
              onPress={close}
            >
              <Text className="text-white text-center font-medium">Cancelar</Text>
            </Pressable>
            <Pressable className="bg-green-500 px-4 py-2 rounded-md flex-1 ml-2" onPress={guardarTasasGlobales}>
              <Text className="text-white text-center font-medium">Guardar</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  )
}