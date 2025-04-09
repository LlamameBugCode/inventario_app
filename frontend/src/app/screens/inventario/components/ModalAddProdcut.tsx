"use client"

import { useState, useEffect } from "react"
import { View, Modal, Text, Pressable, TextInput, Alert, TouchableOpacity } from "react-native"
import Icon from "react-native-vector-icons/Ionicons"
import { useStore } from "@/store"
import { parseNumber } from "@/utils/auxiliares"

type ModalAddProductProps = {
  visible: boolean
  onClose: () => void
}

type FormFields = {
  nombre: string
  precio: string
  cantidad: string
  porcentajeGanancia: string
  precioUnitario: string
  gananciaEsperada: string
  gananciaUnitaria: string
}

const CAMPOS_REQUERIDOS: (keyof FormFields)[] = ["precio", "cantidad", "porcentajeGanancia"]

export default function ModalAddProduct({ visible, onClose }: ModalAddProductProps) {
  // Obtenemos las tasas del store
  const tasas = useStore((state) => state.tasas)
  const setTasas = useStore((state) => state.setTasas)

  // Estado para el formulario
  const [formData, setFormData] = useState<FormFields>({
    nombre: "",
    precio: "",
    cantidad: "",
    porcentajeGanancia: "",
    precioUnitario: "",
    gananciaEsperada: "",
    gananciaUnitaria: "",
  })

  // Estado para las tasas locales
  const [tasasLocales, setTasasLocales] = useState({
    tasa1: tasas.tasa1.toString(),
    tasa2: tasas.tasa2.toString(),
    tasa3: tasas.tasa3.toString(),
  })

  // Estado para controlar el modal de detalles
  const [detallesModalVisible, setDetallesModalVisible] = useState(false)
  const [detalleSeleccionado, setDetalleSeleccionado] = useState<{
    titulo: string
    valorDolar: string
    valoresBs: { tasa: number; valor: string; etiqueta: string; color: string }[]
  } | null>(null)

  // Estado para controlar el modal de tasas
  const [tasasModalVisible, setTasasModalVisible] = useState(false)

  // Estado para controlar el modal de edición
  const [edicionModalVisible, setEdicionModalVisible] = useState(false)
  const [campoEditando, setCampoEditando] = useState<"precioUnitario" | "gananciaEsperada" | "gananciaUnitaria" | null>(
    null,
  )
  const [valorEditando, setValorEditando] = useState("")

  // Estado para controlar si se muestra en dólares o bolívares
  const [inputDolares, setInputDolares] = useState<boolean>(true)

  // Actualizar tasasLocales cuando cambian las tasas globales o cuando el modal se abre
  useEffect(() => {
    if (visible) {
      setTasasLocales({
        tasa1: tasas.tasa1.toString(),
        tasa2: tasas.tasa2.toString(),
        tasa3: tasas.tasa3.toString(),
      })
    }
  }, [visible, tasas])

  const handleChange = (field: keyof FormFields, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Manejar cambios en las tasas locales
  const handleTasaLocalChange = (tipo: "tasa1" | "tasa2" | "tasa3", valor: string) => {
    setTasasLocales((prev) => ({
      ...prev,
      [tipo]: valor,
    }))
  }

  // Guardar tasas en el store global
  const guardarTasasGlobales = () => {
    const nuevasTasas = {
      tasa1: parseNumber(tasasLocales.tasa1),
      tasa2: parseNumber(tasasLocales.tasa2),
      tasa3: parseNumber(tasasLocales.tasa3),
    }

    setTasas(nuevasTasas)
    setTasasModalVisible(false)
    Alert.alert("Tasas actualizadas", "Las tasas han sido actualizadas correctamente.")
  }

  const handleCalcular = () => {
    if (CAMPOS_REQUERIDOS.every((f) => formData[f] !== "")) {
      const precioProducto = parseNumber(formData.precio)
      const cantidadArticulos = parseNumber(formData.cantidad)
      const porcentajeGanancia = parseNumber(formData.porcentajeGanancia)

      // Calcular el costo unitario
      const costoUnitario = precioProducto / cantidadArticulos

      // Calcular el precio unitario con ganancia
      const precioUnitario = costoUnitario * (1 + porcentajeGanancia / 100)

      // Calcular la ganancia esperada total
      const gananciaEsperada = (precioProducto * porcentajeGanancia) / 100

      // Calcular la ganancia por artículo
      const gananciaUnitaria = gananciaEsperada / cantidadArticulos

      setFormData((prev) => ({
        ...prev,
        precioUnitario: precioUnitario.toFixed(2),
        gananciaEsperada: gananciaEsperada.toFixed(2),
        gananciaUnitaria: gananciaUnitaria.toFixed(2),
      }))
    } else {
      Alert.alert("Error", "Por favor, completa todos los campos requeridos.")
    }
  }

  // Función para convertir valores entre bolívares y dólares
  const convertirValor = (valor: string, tasa: number, aBs = false) => {
    if (!valor) return ""
    const numero = parseNumber(valor)
    return aBs ? (numero * tasa).toFixed(2) : (numero / tasa).toFixed(2)
  }

  // Función para mostrar el modal de detalles
  const mostrarDetalles = (tipo: "precioUnitario" | "gananciaEsperada" | "gananciaUnitaria") => {
    let titulo = ""
    let valorDolar = ""

    switch (tipo) {
      case "precioUnitario":
        titulo = "Precio Unitario"
        valorDolar = formData.precioUnitario
        break
      case "gananciaEsperada":
        titulo = "Ganancia Producto"
        valorDolar = formData.gananciaEsperada
        break
      case "gananciaUnitaria":
        titulo = "Ganancia por Artículo"
        valorDolar = formData.gananciaUnitaria
        break
    }

    setDetalleSeleccionado({
      titulo,
      valorDolar,
      valoresBs: [
        {
          tasa: tasas.tasa1,
          valor: convertirValor(valorDolar, tasas.tasa1, true),
          etiqueta: "Promedio",
          color: "text-yellow-500",
        },
        {
          tasa: tasas.tasa2,
          valor: convertirValor(valorDolar, tasas.tasa2, true),
          etiqueta: "Paralelo",
          color: "text-blue-600",
        },
        {
          tasa: tasas.tasa3,
          valor: convertirValor(valorDolar, tasas.tasa3, true),
          etiqueta: "BCV",
          color: "text-red-500",
        },
      ],
    })

    setDetallesModalVisible(true)
  }

  // Función para iniciar la edición de un valor
  const iniciarEdicion = (tipo: "precioUnitario" | "gananciaEsperada" | "gananciaUnitaria") => {
    setCampoEditando(tipo)
    switch (tipo) {
      case "precioUnitario":
        setValorEditando(formData.precioUnitario)
        break
      case "gananciaEsperada":
        setValorEditando(formData.gananciaEsperada)
        break
      case "gananciaUnitaria":
        setValorEditando(formData.gananciaUnitaria)
        break
    }
    setEdicionModalVisible(true)
  }

  // Función para guardar el valor editado y recalcular los demás valores
  const guardarValorEditado = () => {
    if (!campoEditando || !valorEditando) {
      setEdicionModalVisible(false)
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

    setEdicionModalVisible(false)
  }

  return (
    <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.8)" }}>
        <View className="bg-white w-[95%] p-6 rounded-lg">
          <Text className="text-xl font-bold mb-4">Añadir Producto</Text>

          {/* Botones superiores */}
          <View className="flex-row justify-between mb-4">
            {/* Botón "bs/dolares" con ícono de calculadora */}
            <Pressable
              className={`${inputDolares ? "bg-green-400" : "bg-red-600"} px-4 py-2 rounded-md flex-row items-center`}
              onPress={() => setInputDolares(!inputDolares)}
            >
              <Icon name="calculator-outline" size={18} color="#333" className="mr-2" />
              <Text className="text-gray-800 font-medium">{inputDolares ? "Dolares" : "Bolivares"}</Text>
            </Pressable>

            {/* Botón para mostrar tasas */}
            <Pressable
              className="bg-gray-200 px-4 py-2 rounded-md flex-row items-center"
              onPress={() => setTasasModalVisible(true)}
            >
              <Icon name="logo-usd" size={18} color="#333" className="mr-2" />
              <Text className="text-gray-800 font-medium">Ver Tasas</Text>
            </Pressable>
          </View>

          {/* Campos del formulario */}
          <View className="mb-4 flex-row justify-between">
            <View className="flex-1 mr-2">
              <Text className="text-gray-600 mb-1">Nombre del producto</Text>
              <TextInput
                className="border border-gray-300 rounded-md px-3 py-1.5"
                placeholder="Ej. HARINA PAN"
                value={formData.nombre}
                onChangeText={(text) => handleChange("nombre", text)}
              />
            </View>
            <View className="flex-1 ml-2">
              <Text className="text-gray-600 mb-1">Cantidad de artículos</Text>
              <TextInput
                className="border border-gray-300 rounded-md px-3 py-1.5"
                keyboardType="numeric"
                placeholder="Ej. 20"
                value={formData.cantidad}
                onChangeText={(text) => handleChange("cantidad", text)}
              />
            </View>
          </View>
          <View className="mb-4 flex-row justify-between">
            <View className="flex-1 mr-2">
              <Text className="text-gray-600 mb-1">Precio del producto {inputDolares ? "($)" : "(Bs)"}</Text>
              <TextInput
                className="border border-gray-300 rounded-md px-3 py-1.5"
                keyboardType="numeric"
                placeholder={inputDolares ? "Ej. 10.50" : "Ej. 350.00"}
                value={formData.precio}
                onChangeText={(text) => handleChange("precio", text)}
              />
            </View>
            <View className="flex-1 ml-2">
              <Text className="text-gray-600 mb-1">Porcentaje ganancias</Text>
              <TextInput
                className="border border-gray-300 rounded-md px-3 py-1.5"
                keyboardType="numeric"
                placeholder="Ej. 30%"
                value={formData.porcentajeGanancia}
                onChangeText={(text) => handleChange("porcentajeGanancia", text)}
              />
            </View>
          </View>

          <View className="mb-4">
            <Pressable className="bg-blue-500 px-6 py-2 rounded-md items-center" onPress={handleCalcular}>
              <Text className="text-white font-medium">Calcular</Text>
            </Pressable>
          </View>

          {/* Resultados de cálculos - Versión compacta con soporte para pulsación larga */}
          <View className="mb-6">
            {/* Precio unitario */}
            <TouchableOpacity
              className="mb-3 bg-gray-50 p-2 rounded-lg border border-gray-200"
              onPress={() => formData.precioUnitario && mostrarDetalles("precioUnitario")}
              onLongPress={() => formData.precioUnitario && iniciarEdicion("precioUnitario")}
              delayLongPress={500}
              disabled={!formData.precioUnitario}
            >
              <View className="flex-row justify-between items-center">
                <Text className="text-gray-600 font-medium">Precio unitario:</Text>
                <View className="flex-row items-center">
                  <Text className="text-green-500 font-bold mr-2">
                    ${formData.precioUnitario ? formData.precioUnitario : "-"}
                  </Text>
                  {formData.precioUnitario && (
                    <View className="flex-row">
                      <Icon name="create-outline" size={16} color="#9CA3AF" className="mr-1" />
                      <Icon name="chevron-forward-outline" size={16} color="#9CA3AF" />
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>

            {/* Ganancia Producto */}
            <TouchableOpacity
              className="mb-3 bg-gray-50 p-2 rounded-lg border border-gray-200"
              onPress={() => formData.gananciaEsperada && mostrarDetalles("gananciaEsperada")}
              onLongPress={() => formData.gananciaEsperada && iniciarEdicion("gananciaEsperada")}
              delayLongPress={500}
              disabled={!formData.gananciaEsperada}
            >
              <View className="flex-row justify-between items-center">
                <Text className="text-gray-600 font-medium">Ganancia Producto:</Text>
                <View className="flex-row items-center">
                  <Text className="text-green-500 font-bold mr-2">
                    ${formData.gananciaEsperada ? formData.gananciaEsperada : "-"}
                  </Text>
                  {formData.gananciaEsperada && (
                    <View className="flex-row">
                      <Icon name="create-outline" size={16} color="#9CA3AF" className="mr-1" />
                      <Icon name="chevron-forward-outline" size={16} color="#9CA3AF" />
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>

            {/* Ganancia por artículo */}
            <TouchableOpacity
              className="mb-3 bg-gray-50 p-2 rounded-lg border border-gray-200"
              onPress={() => formData.gananciaUnitaria && mostrarDetalles("gananciaUnitaria")}
              onLongPress={() => formData.gananciaUnitaria && iniciarEdicion("gananciaUnitaria")}
              delayLongPress={500}
              disabled={!formData.gananciaUnitaria}
            >
              <View className="flex-row justify-between items-center">
                <Text className="text-gray-600 font-medium">Ganancia por artículo:</Text>
                <View className="flex-row items-center">
                  <Text className="text-green-500 font-bold mr-2">
                    ${formData.gananciaUnitaria ? formData.gananciaUnitaria : "-"}
                  </Text>
                  {formData.gananciaUnitaria && (
                    <View className="flex-row">
                      <Icon name="create-outline" size={16} color="#9CA3AF" className="mr-1" />
                      <Icon name="chevron-forward-outline" size={16} color="#9CA3AF" />
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          </View>

          {/* Botones de acción */}
          <View className="flex-row justify-between">
            <Pressable className="bg-red-500 px-4 py-2 rounded-md" onPress={onClose}>
              <Text className="text-white font-medium">Cancelar</Text>
            </Pressable>
            <Pressable
              className="bg-green-500 px-4 py-2 rounded-md"
              onPress={() => {
                // Lógica para guardar el producto
                onClose()
              }}
            >
              <Text className="text-white font-medium">Guardar</Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* Modal para mostrar detalles de valores */}
      <Modal
        visible={detallesModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setDetallesModalVisible(false)}
      >
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.8)" }}
        >
          <View className="bg-white w-[90%] p-5 rounded-lg">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold">{detalleSeleccionado?.titulo}</Text>
              <Pressable onPress={() => setDetallesModalVisible(false)}>
                <Icon name="close-outline" size={24} color="#374151" />
              </Pressable>
            </View>

            <View className="bg-green-50 p-3 rounded-lg mb-4">
              <Text className="text-gray-600 mb-1">Valor en dólares:</Text>
              <Text className="text-green-600 text-xl font-bold">${detalleSeleccionado?.valorDolar}</Text>
            </View>

            <Text className="text-gray-600 mb-2 font-medium">Equivalentes en bolívares:</Text>
            {detalleSeleccionado?.valoresBs.map((item, index) => (
              <View key={index} className="bg-gray-50 p-3 rounded-lg mb-2 flex-row justify-between items-center">
                <View>
                  <Text className="text-gray-500">
                    {item.etiqueta} (Bs/${item.tasa}):
                  </Text>
                  <Text className={`text-lg font-semibold ${item.color}`}>{item.valor} Bs</Text>
                </View>
              </View>
            ))}

            <Pressable className="bg-blue-500 py-2 rounded-lg mt-3" onPress={() => setDetallesModalVisible(false)}>
              <Text className="text-white text-center font-medium">Cerrar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Modal para editar tasas */}
      <Modal
        visible={tasasModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setTasasModalVisible(false)}
      >
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.8)" }}
        >
          <View className="bg-white w-[90%] p-5 rounded-lg">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold">Tasas de Cambio</Text>
              <Pressable onPress={() => setTasasModalVisible(false)}>
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
                onPress={() => setTasasModalVisible(false)}
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

      {/* Modal para editar valores calculados */}
      <Modal
        visible={edicionModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setEdicionModalVisible(false)}
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
              <Pressable onPress={() => setEdicionModalVisible(false)}>
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
                onPress={() => setEdicionModalVisible(false)}
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
    </Modal>
  )
}
