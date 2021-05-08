import React from "react"
import Image from "next/image"
import { useRouter } from "next/router"
import { Box, Button, Text } from "grommet"
import { Close,Edit } from "grommet-icons"
import { firestore } from "pages/_app"
import { useToasts } from "react-toast-notifications"

interface RecipePreviewProps {
  imagen: string
  id: string
  nombre: string
  deleteBtn?: any
  editBtn?:any
}

const RecipePreview: React.FC<RecipePreviewProps> = ({
  id,
  imagen,
  nombre,
  deleteBtn,
  editBtn
}) => {
  const router = useRouter()
  const { addToast } = useToasts()

  const deleteRecipe = () => {
    firestore
      .collection("recetas")
      .doc(id)
      .delete()
      .then(() => deleteBtn())
      .then(() => addToast("Eliminado con exito", { appearance: "success" }))
      .catch(() => {
        return addToast("Error al eliminar", { appearance: "error" })
      })
  }

  const editRecipe=()=>{
    
    router.push(`/editarReceta/${id}`)
  }
  {
    /*Funcion que llama el archivo [id]*/
  }
  return (
    <Box
      style={{ cursor: "pointer" }}
      pad={{ horizontal: "medium", top: "medium", bottom: "small" }}
      height="fit-content"
      border={{ style: "groove" }}
      round={{ size: "12px" }}
      hoverIndicator={"neutral-2"}
      elevation="large"
      onClick={() => router.push(`/receta/${id}`)}
    >
      <Image
        src={imagen}
        layout="responsive"
        alt="Unsplash"
        width="300px"
        height="200px"
        loading={"eager"}
      />
      <Text margin={{ top: "small" }}>{nombre}</Text>
      {deleteBtn && (
        <Button
          onClick={(e) => {
            e.stopPropagation()
            e.persist()

            deleteRecipe()
          }}
          margin={{ top: "small" }}
          hoverIndicator={{ color: "#fff" }}
          label="Eliminar"
          icon={<Close />}
        />
      )}
      {
        editBtn && (
          <Button
          onClick={(e) => {
            e.stopPropagation()
            e.persist()

            editRecipe()
          }}
          margin={{ top: "small" }}
          hoverIndicator={{ color: "#fff" }}
          label="Editar"
          icon={<Edit />}
        />
        )
      }
    </Box>
  )
}

export default RecipePreview
