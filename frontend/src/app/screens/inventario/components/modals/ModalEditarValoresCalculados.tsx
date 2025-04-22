  "use client"
import React from 'react'
import Icon from 'react-native-vector-icons/Ionicons' // Se agregó la importación de Icon
import { parseNumber } from '@/utils/auxiliares'
import { Modal,TextInput,View,Text,Pressable } from 'react-native'
import { useModalManagerStore } from '@/store/modalManagerStore'


type FormFields = {
  nombre: string
  precio: string
  cantidad: string
  porcentajeGanancia: string
  precioUnitario: string
  gananciaEsperada: string
  gananciaUnitaria: string
}

type ModalEditarValoresCalculadosProp = {
   campoEditando: "precioUnitario" | "gananciaEsperada" | "gananciaUnitaria" | null,
  valorEditando:string,
  setValorEditando: React.Dispatch<React.SetStateAction<string>>

  formData: FormFields
  setFormData: React.Dispatch<React.SetStateAction<FormFields>>

}

export default function ModalEditarValoresCalculados({ campoEditando,valorEditando,setValorEditando,formData,setFormData }:ModalEditarValoresCalculadosProp) {



  const visible = useModalManagerStore((state)=>state.modalsVisible.modalEditarValoresCalculados)
  const close = useModalManagerStore((state)=>state.closeModalEditarValoresCalculados)


  const guardarValorEditado = () => {
    //Esto lo que indica es quie el modal debe recibir como prop el formData y setFormData y pasarle esta funcion
    if (!campoEditando || !valorEditando) {
      //setEdicionModalVisible(false)
      close()
      return
    }

    const precioProducto = parseNumber(formData.precio)
    const cantidadArticulos = parseNumber(formData.cantidad)
    const nuevoValor = parseNumber(valorEditando)

    let nuevoPrecioUnitario = parseNumber(formData.precioUnitario)
    let nuevaGananciaEsperada = parseNumber(formData.gananciaEsperada)
    let nuevaGananciaUnitaria = parseNumber(formData.gananciaUnitaria)
    let nuevoPorcentajeGanancia = parseNumber(formData.porcentajeGanancia)

    // Recalcular valores según el campo que se está editando
    switch (campoEditando) {
      case "precioUnitario":
        nuevoPrecioUnitario = nuevoValor
        // Costo unitario sin ganancia
        const costoUnitario = precioProducto / cantidadArticulos
        // Ganancia por artículo = precio unitario - costo unitario
        nuevaGananciaUnitaria = nuevoPrecioUnitario - costoUnitario
        // Ganancia total = ganancia por artículo * cantidad
        nuevaGananciaEsperada = nuevaGananciaUnitaria * cantidadArticulos
        // Porcentaje de ganancia = (ganancia total / precio producto) * 100
        nuevoPorcentajeGanancia = (nuevaGananciaEsperada / precioProducto) * 100
        break

      case "gananciaEsperada":
        nuevaGananciaEsperada = nuevoValor
        // Porcentaje de ganancia = (ganancia total / precio producto) * 100
        nuevoPorcentajeGanancia = (nuevaGananciaEsperada / precioProducto) * 100
        // Ganancia por artículo = ganancia total / cantidad
        nuevaGananciaUnitaria = nuevaGananciaEsperada / cantidadArticulos
        // Costo unitario sin ganancia
        const costoUnitarioGE = precioProducto / cantidadArticulos
        // Precio unitario = costo unitario + ganancia por artículo
        nuevoPrecioUnitario = costoUnitarioGE + nuevaGananciaUnitaria
        break

      case "gananciaUnitaria":
        nuevaGananciaUnitaria = nuevoValor
        // Ganancia total = ganancia por artículo * cantidad
        nuevaGananciaEsperada = nuevaGananciaUnitaria * cantidadArticulos
        // Porcentaje de ganancia = (ganancia total / precio producto) * 100
        nuevoPorcentajeGanancia = (nuevaGananciaEsperada / precioProducto) * 100
        // Costo unitario sin ganancia
        const costoUnitarioGU = precioProducto / cantidadArticulos
        // Precio unitario = costo unitario + ganancia por artículo
        nuevoPrecioUnitario = costoUnitarioGU + nuevaGananciaUnitaria
        break
    }

    // Actualizar todos los valores
    setFormData((prev) => ({
      ...prev,
      precioUnitario: nuevoPrecioUnitario.toFixed(2),
      gananciaEsperada: nuevaGananciaEsperada.toFixed(2),
      gananciaUnitaria: nuevaGananciaUnitaria.toFixed(2),
      porcentajeGanancia: nuevoPorcentajeGanancia.toFixed(2),
    }))

    //setEdicionModalVisible(false)
    close()
  }


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
          <Text className="text-xl font-bold">
            {campoEditando === "precioUnitario"
              ? "Editar Precio Unitario"
              : campoEditando === "gananciaEsperada"
                ? "Editar Ganancia Producto"
                : "Editar Ganancia por Artículo"}
          </Text>
          <Pressable onPress={close}>
            <Icon name="close-outline" size={24} color="#374151" />
          </Pressable>
        </View>

        <View className="mb-4">
          <Text className="text-gray-600 mb-2">
            Al editar este valor, se recalcularán automáticamente los demás valores relacionados.
          </Text>
          <TextInput
            className="border border-gray-300 rounded-md px-3 py-3 text-lg"
            keyboardType="numeric"
            value={valorEditando}
            onChangeText={setValorEditando}
            autoFocus
          />
        </View>

        <View className="flex-row justify-between">
          <Pressable
            className="bg-gray-400 px-4 py-2 rounded-md flex-1 mr-2"
            onPress={close}
          >
            <Text className="text-white text-center font-medium">Cancelar</Text>
          </Pressable>
          <Pressable className="bg-green-500 px-4 py-2 rounded-md flex-1 ml-2" onPress={guardarValorEditado}>
            <Text className="text-white text-center font-medium">Guardar</Text>
          </Pressable>
        </View>
      </View>
    </View>
  </Modal>

  )
}
