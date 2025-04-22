// src/app/screens/inventario/components/modals/TasasModal.tsx
import { useState, useEffect } from "react"
import { View, Modal, Text, Pressable, TextInput, Alert } from "react-native"
import Icon from "react-native-vector-icons/Ionicons"
import { parseNumber } from "@/utils/auxiliares"
import { useStore } from "@/store"
import { useModalManagerStore } from "@/store/modalManagerStore"


type TasasModalProps = {


}

export default function ModalEditarTasas({



}: TasasModalProps) {

  //Tasas (global)
  const tasas = useStore((state)=>state.tasas)
  const setTasas = useStore((state)=>state.setTasas)
  //Modales
  //Modal de addProduct
  const visibleModalAddProduct = useModalManagerStore((state)=>state.modalsVisible.modalAddProduct)
  //const closeModalAddProduct = useModalManagerStore((state)=>state.closeModalAddProduct)
  //Modal de editarTasas
  const visible = useModalManagerStore((state)=>state.modalsVisible.ModalEditarTasas)
  const close = useModalManagerStore((state)=>state.closeModalEditarTasas)


      //Tasas locales, la de los imputs
  const [tasasLocales, setTasasLocales] = useState({
    tasa1: tasas.tasa1.toString(),
    tasa2: tasas.tasa2.toString(),
    tasa3: tasas.tasa3.toString(),
  })

  const handleTasaLocalChange2 = (tipo: "tasa1" | "tasa2" | "tasa3", valor: string) => {
    setTasasLocales((prev) => ({
      ...prev,
      [tipo]: valor,
    }))
  }

  //
      // Guardar tasas en el store global
      const guardarTasasGlobales2 = () => {
        const nuevasTasas = {
          tasa1: parseNumber(tasasLocales.tasa1),
          tasa2: parseNumber(tasasLocales.tasa2),
          tasa3: parseNumber(tasasLocales.tasa3),
        }

        setTasas(nuevasTasas)
        close()
        Alert.alert("Tasas actualizadas", "Las tasas han sido actualizadas correctamente.")
      }


  // Actualizar tasasLocales cuando cambian las tasas globales o cuando el modal se abre
  useEffect(() => {
    if (visibleModalAddProduct) {
      setTasasLocales({
        tasa1: tasas.tasa1.toString(),
        tasa2: tasas.tasa2.toString(),
        tasa3: tasas.tasa3.toString(),
      })
    }
  }, [visibleModalAddProduct, tasas])

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
              onChangeText={(text) => handleTasaLocalChange2("tasa1", text)}
            />
          </View>
          <View className="mb-3">
            <Text className="text-gray-600 mb-1">Tasa Paralelo (Bs/$):</Text>
            <TextInput
              className="border border-gray-300 rounded-md px-3 py-2"
              keyboardType="numeric"
              value={tasasLocales.tasa2}
              onChangeText={(text) => handleTasaLocalChange2("tasa2", text)}
            />
          </View>
          <View className="mb-4">
            <Text className="text-gray-600 mb-1">Tasa BCV (Bs/$):</Text>
            <TextInput
              className="border border-gray-300 rounded-md px-3 py-2"
              keyboardType="numeric"
              value={tasasLocales.tasa3}
              onChangeText={(text) => handleTasaLocalChange2("tasa3", text)}
            />
          </View>
          <View className="flex-row justify-between">
            <Pressable
              className="bg-gray-400 px-4 py-2 rounded-md flex-1 mr-2"
              onPress={close}
            >
              <Text className="text-white text-center font-medium">Cancelar</Text>
            </Pressable>
            <Pressable className="bg-green-500 px-4 py-2 rounded-md flex-1 ml-2" onPress={guardarTasasGlobales2}>
              <Text className="text-white text-center font-medium">Guardar</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  )
}