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
  import ModalEditarValoresCalculados from "./ModalEditarValoresCalculados"
  import ModalOptions from "./ModalOptions"
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
    //Variable global


    const editProduct = useStore((state)=>state.editProduct)
    const setEditProduct = useStore((state)=>state.setEditProduct)
    // Obtenemos las tasas y productos del store
    const tasas = useStore((state) => state.tasas)
    //    const setTasas = useStore((state) => state.setTasas)
    const setProduct = useStore((state) => state.setProduct)
    const products = useStore((state)=>state.products )
    const updateProduct = useStore((state)=>state.updateProduct)

    //Para gestionar el modal
    const visibleModalAddProduct = useModalManagerStore((state)=>state.modalsOpen.modalAddProduct)
    const closeModalAddProduct = useModalManagerStore((state)=>state.closeModalAddProduct)
    const openModalEditarTasas = useModalManagerStore((state)=>state.openModalEditarTasas)
    const openModalDetallesValoresCalculados = useModalManagerStore((state)=>state.openModalDetallesValoresCalculados)
    const openModalEditarValoresCalculados= useModalManagerStore((state)=>state.openModalEditarValoresCalculados)
    const closeModalOption= useModalManagerStore((state)=>state.closeOptionsModal)
    //variable global
    const setSelectedProduct = useModalManagerStore((state)=>state.setSelectedProduct)
    const selectedProduct = useModalManagerStore((state)=>state.selectedProduct)



    //Otros estados
    const [tipoValorDetalle,setTipoValorDetalle] = useState<
    "precioUnitario" | "gananciaEsperada" | "gananciaUnitaria"
  >("precioUnitario")





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

     // Cuando editProduct cambia, actualizar el formulario con los datos del producto
  useEffect(() => {
    if (editProduct) {
      setFormData({
        nombre: editProduct.nombre,
        precio: editProduct.precioBulto.toString(),
        cantidad: editProduct.cantidad.toString(),
        porcentajeGanancia: editProduct.porcentajeDeGanancias.toString(),
        precioUnitario: editProduct.precioUnitario.toString(),
        gananciaEsperada: editProduct.gananciasEsperadas.toString(),
        gananciaUnitaria: editProduct.gananciasPorArticulo.toString(),
      })
    } else {
      // Limpiar el formulario si no estamos editando
      setFormData({
        nombre: "",
        precio: "",
        cantidad: "",
        porcentajeGanancia: "",
        precioUnitario: "",
        gananciaEsperada: "",
        gananciaUnitaria: "",
      })
    }
  }, [editProduct])


    // Estado para controlar el modal de edición
/*     const [edicionModalVisible, setEdicionModalVisible] = useState(false) */
    const [campoEditando, setCampoEditando] = useState<"precioUnitario" | "gananciaEsperada" | "gananciaUnitaria" | null>(
      null,
    )
    const [valorEditando, setValorEditando] = useState("")

    // Estado para controlar si se muestra en dólares o bolívares
    const [inputDolares, setInputDolares] = useState<boolean>(true)


    //Es para actualizar lo que se escribe, es como un Onchange para los campos.
    const handleChange = (field: keyof FormFields, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }))
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
        Alert.alert("Error , cebolla es mariko", "Por favor, completa todos los campos requeridos.")
      }
    }



    // Función para mostrar el modal de detalles
    //Esta funcion recibe como parametro "tipo" el cual representa el campo de PU o  O GU
    //Al darle click a alguno de esos elementos se desplegara un modal para ver los detalles
    //Cuyos detalles son su equivalencia de dolares a las tasas
    const mostrarDetalles = (tipo: "precioUnitario" | "gananciaEsperada" | "gananciaUnitaria") => {
      setTipoValorDetalle(tipo)
      openModalDetallesValoresCalculados()
    }

    // Función para iniciar la edición de un valor
    const iniciarEdicion = (tipo: "precioUnitario" | "gananciaEsperada" | "gananciaUnitaria") => {

      //Esto lo que indica es que debemos pasar al modal dos props, tipo y valorEditando
      //Ya que esta funcion establece que campo seesta editando y el valor y guarda esa informacion en estados
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
      openModalEditarValoresCalculados()

    }

    // Función para limpiar el formulario
    const limpiarFormulario = () => {
      setFormData({
        nombre: "",
        precio: "",
        cantidad: "",
        porcentajeGanancia: "",
        precioUnitario: "",
        gananciaEsperada: "",
        gananciaUnitaria: "",
      })
    }

    // Función para guardar el producto en el store
    // Guardar el producto (nuevo o actualizado)
    const guardarProducto = () => {
      // Validar que los campos requeridos estén completos
      const camposIncompletos = CAMPOS_REQUERIDOS.some((field) => formData[field] === "")
      if (camposIncompletos) {
        Alert.alert("Error", "Por favor, completa todos los campos requeridos antes de guardar.")
        return
      }

      // Validar que los valores calculados también estén presentes
      if (
        !formData.precioUnitario ||
        !formData.gananciaEsperada ||
        !formData.gananciaUnitaria
      ) {
        Alert.alert("Error", "Por favor, calcula los valores antes de guardar el producto.")
        return
      }

      try {
        if (editProduct) {
          // Modo edición: Actualizar el producto existente
          const updatedProduct = {
            ...editProduct,
            nombre: formData.nombre,
            precio: parseFloat(formData.precio),
            cantidad: parseInt(formData.cantidad),
            porcentajeGanancia: parseFloat(formData.porcentajeGanancia),
            precioUnitario: parseFloat(formData.precioUnitario),
            gananciaEsperada: parseFloat(formData.gananciaEsperada),
            gananciaUnitaria: parseFloat(formData.gananciaUnitaria),
          }
          updateProduct(updatedProduct)
          Alert.alert("Éxito", "Producto actualizado correctamente")
        } else {
          // Modo creación: Añadir un nuevo producto
          setProduct({
            nombre: formData.nombre,
            precio: parseFloat(formData.precio),
            cantidad: parseInt(formData.cantidad),
            porcentajeGanancia: parseFloat(formData.porcentajeGanancia),
            precioUnitario: parseFloat(formData.precioUnitario),
            gananciaEsperada: parseFloat(formData.gananciaEsperada),
            gananciaUnitaria: parseFloat(formData.gananciaUnitaria),
          })
          Alert.alert("Éxito", "Producto añadido correctamente")
        }
      } catch (error) {
        console.error("Error al guardar el producto:", error)
        Alert.alert("Error", "No se pudo guardar el producto. Por favor, intenta de nuevo.")
      } finally {
        // Estas funciones se ejecutarán siempre, haya o no error
        setEditProduct(null)
        setSelectedProduct(null)
        limpiarFormulario()
        closeModalAddProduct()
        closeModalOption()
      }
    }


    //Para debugear, eliminar luego
    useEffect(() => {
      console.log("Productos:", products);
    }, [products]);

    const onClose = ()=>{
      closeModalAddProduct()
      closeModalOption()
      setEditProduct(null)

    }
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
              <Pressable className="bg-red-500 px-4 py-2 rounded-md" onPress={onClose}>
                <Text className="text-white font-medium">Cancelar</Text>
              </Pressable>
              <Pressable className="bg-green-500 px-4 py-2 rounded-md" onPress={guardarProducto}>
                <Text className="text-white font-medium">Guardar</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/*-------------------------------------------------------------------------------- */}
        {/*-----------------------------------Modales--------------------------------------------- */}
        {/*-------------------------------------------------------------------------------- */}

        {/* Modal para mostrar detalles de valores calculados: PU,GP,GU
        Al darle click a alguno de esos valores podremos ver su equivalencia en bs gracias a este modal*/}
        <ModalDetallesValoresCalculados
            tipo={tipoValorDetalle}
            formData={formData} />
        {/* Modal para editar valores calculados */}
        <ModalEditarValoresCalculados
            campoEditando={campoEditando}
            valorEditando={valorEditando}
            setValorEditando={setValorEditando}
            formData={formData}
            setFormData={setFormData}
          />
         {/* Modal para editar tasas. Estas tasas aparecen en el boton de "tasas" que se encuentra en el modal actual */}
        <ModalEditarTasas  />

        {/* Modal de opciones */}



      </Modal>
    )
  }
