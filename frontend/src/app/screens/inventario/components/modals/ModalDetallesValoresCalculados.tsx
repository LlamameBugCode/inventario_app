// src/app/screens/inventario/components/modals/ModalDetallesValoresCalculados.tsx
import { View, Modal, Text, Pressable } from "react-native"
import Icon from "react-native-vector-icons/Ionicons"
import { useStore } from "@/store"
import { useModalManagerStore } from "@/store/modalManagerStore"
import { convertirValor } from "@/utils/calculos"

type ModalDetallesValoresCalculadosProps = {
  tipo: "precioUnitario" | "gananciaEsperada" | "gananciaUnitaria"
  formData: {
    precioUnitario: string
    gananciaEsperada: string
    gananciaUnitaria: string
  }
}

export default function ModalDetallesValoresCalculados({ tipo, formData }: ModalDetallesValoresCalculadosProps) {
  // Acceder al estado global para controlar la visibilidad del modal
  const visible = useModalManagerStore((state) => state.modalsVisible.ModalDetallesValoresCalculados)
  const closeModal = useModalManagerStore((state) => state.closeModalDetallesValoresCalculados)
  const tasas = useStore((state) => state.tasas)

  // Obtener el valor en dólares según el tipo
  const valorDolar = formData[tipo]

  // Calcular los valores equivalentes en bolívares
  const valoresBs = [
    {
      tasa: tasas.tasa1,
      valor: convertirValor(valorDolar, tasas.tasa1, true),
      etiqueta: "Promedio",
      color: "#F59E0B",
    },
    {
      tasa: tasas.tasa2,
      valor: convertirValor(valorDolar, tasas.tasa2, true),
      etiqueta: "Paralelo",
      color: "#3B82F6",
    },
    {
      tasa: tasas.tasa3,
      valor: convertirValor(valorDolar, tasas.tasa3, true),
      etiqueta: "BCV",
      color: "#EF4444",
    },
  ]

  if (!valorDolar) return null

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={closeModal}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.8)",
        }}
      >
        <View className="bg-white w-[90%] p-5 rounded-lg">
          {/* Encabezado */}
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold">{getTitulo(tipo)}</Text>
            <Pressable onPress={closeModal}>
              <Icon name="close-outline" size={24} color="#374151" />
            </Pressable>
          </View>

          {/* Valor en dólares */}
          <View className="bg-green-50 p-3 rounded-lg mb-4">
            <Text className="text-gray-600 mb-1">Valor en dólares:</Text>
            <Text className="text-green-600 text-xl font-bold">${valorDolar}</Text>
          </View>

          {/* Equivalentes en bolívares */}
          <Text className="text-gray-600 mb-2 font-medium">Equivalentes en bolívares:</Text>
          {valoresBs.map((item, index) => (
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
          <Pressable className="bg-blue-500 py-2 rounded-lg mt-3" onPress={closeModal}>
            <Text className="text-white text-center font-medium">Cerrar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  )
}

// Función auxiliar para obtener el título según el tipo
const getTitulo = (tipo: "precioUnitario" | "gananciaEsperada" | "gananciaUnitaria") => {
  switch (tipo) {
    case "precioUnitario":
      return "Precio Unitario"
    case "gananciaEsperada":
      return "Ganancia Producto"
    case "gananciaUnitaria":
      return "Ganancia por Artículo"
  }
}