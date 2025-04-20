"use client"

import { useState, useEffect } from "react"
import { View, Modal, Text, Pressable, TextInput, Alert, TouchableOpacity } from "react-native"
import Icon from "react-native-vector-icons/Ionicons"
import { useStore } from "@/store"
import { parseNumber } from "@/utils/auxiliares"
import { convertirValor, calcularPrecioUnitario, calcularGananciaEsperada, calcularGananciaUnitaria } from "@/utils/calculos";
import { useModalManagerStore } from "@/store/modalManagerStore"
import ModalEditarTasas from "./ModalEditarTasas"
import ModalDetallesValoresCalculados from "./ModalDetallesValoresCalculados"


type FormFields = {
  nombre: string
  precio: string
  cantidad: string
  porcentajeGanancia: string
  precioUnitario: string
  gananciaEsperada: string
  gananciaUnitaria: string
}

const CAMPOS_REQUERIDOS: (keyof FormFields)[] = ["precio", "cantidad", "porcentajeGanancia", "nombre"]

export default function ModalAddProduct() {
  // Obtenemos las tasas y productos del store
  const tasas = useStore((state) => state.tasas)
  const setTasas = useStore((state) => state.setTasas)
  const setProduct = useStore((state) => state.setProduct)
  const products = useStore((state)=>state.products )

  //Para gestionar el modal
  const visibleModalAddProduct = useModalManagerStore((state)=>state.modalsOpen.modalAddProduct)
  const closeModalAddProduct = useModalManagerStore((state)=>state.closeModalAddProduct)
  const openModalEditarTasas = useModalManagerStore((state)=>state.openModalEditarTasas)
  const openModalDetallesValoresCalculados = useModalManagerStore((state)=>state.openModalDetallesValoresCalculados)



/*   const onClose2 = ()=> {
    closeModalAddProduct()
    console.log("cerrando")
  }
 */

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
    if (visibleModalAddProduct) {
      setTasasLocales({
        tasa1: tasas.tasa1.toString(),
        tasa2: tasas.tasa2.toString(),
        tasa3: tasas.tasa3.toString(),
      })
    }
  }, [visibleModalAddProduct, tasas])

  //Es para actualizar lo que se escribe, es como un Onchange para los campos.
  const handleChange = (field: keyof FormFields, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Manejar cambios en las tasas locales
  //Este pertenece a la opcion para cambiar las tasas desde el modal
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

  //El boton de caluclar hace este calculo para los campos de : PU,GP,GPA
  const handleCalcular = () => {
    if (CAMPOS_REQUERIDOS.every((f) => formData[f] !== "")) {
      //Casteamos a entero
      const precioProducto = parseNumber(formData.precio)
      const cantidadArticulos = parseNumber(formData.cantidad)
      const porcentajeGanancia = parseNumber(formData.porcentajeGanancia)

      //Calcular
      //Se hacen los calculos
      const costoUnitario = calcularPrecioUnitario(precioProducto, cantidadArticulos);
      const precioUnitario = costoUnitario * (1 + porcentajeGanancia / 100);
      const gananciaEsperada = calcularGananciaEsperada(precioProducto, porcentajeGanancia);
      const gananciaUnitaria = calcularGananciaUnitaria(gananciaEsperada, cantidadArticulos);

      //El resultado de los calculos se coloca en los campos PU,GE,GU
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



  // Función para mostrar el modal de detalles
  //Esta funcion recibe como parametro "tipo" el cual representa el campo
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

    //Intercambio aqui
    openModalDetallesValoresCalculados()
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
  //Recordar que hay campos que estan relcaionados con otros
  //Si se actualizara uno entonces habra que actualizar los que estan relacionados
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

  // Función para guardar el producto en el store
  const guardarProducto = () => {
    // Verificar que los campos requeridos estén completos
    if (CAMPOS_REQUERIDOS.some((field) => formData[field] === "" )) {
      Alert.alert("Error", "Por favor, completa todos los campos requeridos y calcula los valores antes de guardar.")
      return
    }

    if (!formData.precioUnitario || !formData.gananciaEsperada || !formData.gananciaUnitaria) {
      Alert.alert("Error", "Por favor, calcula los valores antes de guardar el producto.")
      return
    }

    // Crear el objeto de datos del formulario para el store
    const productData = {
      nombre: formData.nombre,
      precio: parseNumber(formData.precio),
      cantidad: parseNumber(formData.cantidad),
      porcentajeGanancia: parseNumber(formData.porcentajeGanancia),
      precioUnitario: parseNumber(formData.precioUnitario),
      gananciaEsperada: parseNumber(formData.gananciaEsperada),
      gananciaUnitaria: parseNumber(formData.gananciaUnitaria),
    }

    try {
      // Guardar el producto en el store
      setProduct(productData)

      // Mostrar mensaje de éxito
      Alert.alert("Éxito", "Producto guardado correctamente", [{ text: "OK", onPress: closeModalAddProduct }])

      // Limpiar el formulario
      setFormData({
        nombre: "",
        precio: "",
        cantidad: "",
        porcentajeGanancia: "",
        precioUnitario: "",
        gananciaEsperada: "",
        gananciaUnitaria: "",
      })
    } catch (error) {
      // Mostrar mensaje de error
      Alert.alert("Error", "No se pudo guardar el producto. Por favor, intenta de nuevo.")
      console.error("Error al guardar el producto:", error)
    }
  }


  //Para debugear, eliminar luego
  useEffect(() => {
    console.log("Productos:", products);
  }, [products]);


  return (
    <Modal visible={visibleModalAddProduct} transparent={true} animationType="fade" onRequestClose={closeModalAddProduct}>
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
              onPress={() => openModalEditarTasas()}
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
              <Text className="text-gray-600 mb-1">Precio del producto {inputDolares ? "$" : "Bs"}</Text>
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
            <Pressable className="bg-red-500 px-4 py-2 rounded-md" onPress={closeModalAddProduct}>
              <Text className="text-white font-medium">Cancelar</Text>
            </Pressable>
            <Pressable className="bg-green-500 px-4 py-2 rounded-md" onPress={guardarProducto}>
              <Text className="text-white font-medium">Guardar</Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* Modal para mostrar detalles de valores , es cuando presionas en el addProduct
      los campos de Precio Unitario,Ganancias producto y Ganancias Por Articulo*/}
      <ModalDetallesValoresCalculados
        detalleSeleccionado={detalleSeleccionado}
      />

      {/* Modal para editar tasas */}
      <ModalEditarTasas
        tasasLocales={tasasLocales}
        handleTasaLocalChange={handleTasaLocalChange}
        guardarTasasGlobales={guardarTasasGlobales}
      />
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
                onPress={()=>setEdicionModalVisible(false)}
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
