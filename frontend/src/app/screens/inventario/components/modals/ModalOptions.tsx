import { View, Text, Modal, TouchableOpacity, StyleSheet,Alert } from "react-native"
import { Feather } from "@expo/vector-icons"
import type { Product } from "@/types"
import { useStore } from "@/store"
import { useModalManagerStore } from "@/store/modalManagerStore"

export default function ModalOptions() {
  //Modales
  const visible = useModalManagerStore((state)=>state.modalsOpen.optionsModal)
  const close = useModalManagerStore((state)=>state.closeOptionsModal)
  const closeOptionsModal = useModalManagerStore((state)=>state.closeOptionsModal)
  const openModalAddProduct = useModalManagerStore((state)=>state.openModalAddProduct)
  //Gestion Productos
  const deleteProduct = useStore((state)=>state.deleteProduct)
  //Activar modo edicion
  const editProduct = useStore((state)=>state.editProduct)
  const setEditProduct = useStore((state)=>state.setEditProduct)

  const product = editProduct


  //Siempre validando antes de usar el objeto
  if (!product) return null

  const onClose = ()=>{
    setEditProduct(null)
    close()
  }

  const onDelete = () => {
    Alert.alert(
      "Eliminar producto",
      `¿Estás seguro de que deseas eliminar "${product.nombre}"?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => {
            deleteProduct(product.codigo)
            closeOptionsModal()

          },
        },
      ],
      { cancelable: true },
    )
    setEditProduct(null)

  }

  const onEdit = ()=>{
    setEditProduct(product)
    openModalAddProduct()
    closeOptionsModal()



  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Encabezado del modal */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Opciones del producto</Text>
            <Text style={styles.productName} numberOfLines={1}>
              {"el nombre es: "+product.nombre}
            </Text>
          </View>

          {/* Opciones */}
          <View style={styles.optionsContainer}>
            <TouchableOpacity style={styles.optionButton} onPress={onEdit}>
              <View style={[styles.iconContainer, { backgroundColor: "#3b82f6" }]}>
                <Feather name="edit-2" size={20} color="white" />
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionTitle}>Editar</Text>
                <Text style={styles.optionDescription}>Modificar información del producto</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionButton} onPress={onDelete}>
              <View style={[styles.iconContainer, { backgroundColor: "#ef4444" }]}>
                <Feather name="trash-2" size={20} color="white" />
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionTitle}>Eliminar</Text>
                <Text style={styles.optionDescription}>Quitar producto del inventario</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Botón de cancelar */}
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 30,
  },
  modalHeader: {
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#374151",
  },
  productName: {
    fontSize: 16,
    color: "#6b7280",
    marginTop: 4,
  },
  optionsContainer: {
    marginBottom: 20,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  optionDescription: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 2,
  },
  cancelButton: {
    backgroundColor: "#f3f4f6",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4b5563",
  },
})
