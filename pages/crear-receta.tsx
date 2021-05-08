import { Form, Formik } from "formik"
import {
  Box,
  Button,
  FormField,
  Heading,
  ResponsiveContext,
  Tab,
  Tabs,
  TextArea,
  TextInput,
} from "grommet"
import React, { useContext } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { useToasts } from "react-toast-notifications"
import { useRouter } from "next/router"
import UserAppLayout from "components/UserAppLayout/UserAppLayout"
import { FirebaseContext } from "context/FirebaseContext"
import useUser from "hooks/useUser"
import { genHash } from "utils/genHash"
import SEO from "components/SEO/SEO"

interface CrearRecetaProps {}

const CrearReceta: React.FC<CrearRecetaProps> = ({}) => {
  const { auth, storage, firestore } = useContext(FirebaseContext)
  const [user] = useAuthState(auth)
  const size = useContext(ResponsiveContext)
  const { addToast } = useToasts()
  const userInfo = useUser(user?.email, firestore)
  const router = useRouter()
  
  // !Cargar imagen
  const handleImageUpload = ({
    name,
    imageFile,
  }: {
    name: string
    imageFile: any
  }) =>
    storage
      .ref(
        `/recetas/${name}/${genHash(imageFile.name)}.${
          imageFile.type === "image/png" ? "png" : "jpg"
        }`
      )
      .put(imageFile)
      .then(
        (img) =>
          "https://firebasestorage.googleapis.com/v0/b/" +
          img.metadata.bucket +
          "/o/" +
          img.metadata.fullPath.replace(/\//g, "%2F") +
          "?alt=media"
      )
      .catch((e) => {
        console.log(e)
        return null
      })

  return (
    <UserAppLayout>
      <SEO title="Crear receta" />
      <Heading alignSelf="start" size={"medium"}>
        Crear receta.
      </Heading>
      <Formik
        initialValues={{
          nombre: "",
          imagen: "",
          preparacion: "",
          ingredientes: "",
          imageFile: null,
          imageURL: "",
        }}
        onSubmit={async (
          { nombre, preparacion, ingredientes, imageFile },
          { setSubmitting }
        ) => {
          // ! Verificando informacion de la receta
          if (!nombre) {
            return addToast("Nombre Obligatorio.", {
              appearance: "warning",
            })
          }

          if (!preparacion) {
            return addToast("La Preparación es necesaria.", {
              appearance: "warning",
            })
          }
          if (!ingredientes) {
            return addToast("Coloca Algunos Ingredientes", {
              appearance: "warning",
            })
          }

          setSubmitting(true)
          const imageURL = await handleImageUpload({
            name: nombre,
            imageFile: imageFile,
          })

          if (!imageURL)
            return addToast("Error al subir receta, intente mas tarde.", {
              appearance: "error",
            })

          await firestore
            .collection("recetas")
            .add({
              nombre,
              preparacion,
              ingredientes,
              imagen: imageURL,
              author: userInfo.id,
            })
            .then(() => {
              router.push("/")
            })
            .catch((err) => {
              console.log(err)
              addToast("Error al subir receta, intente mas tarde.")
            })
          setSubmitting(false)
        }}
      >
        {({ values, setValues, touched, setTouched }) => {
          //! Capturar los datos que se solicitan el la receta

          

          const onChangeValues = (e: any) => {
            e.persist()
            const value = e.target.value
            setTouched({ ...touched, [e.target.name]: value.length > 0 })
            setValues((state) => ({
              ...state,
              [e.target.name]: e.target.value,
            }))
          }

          const onChangePicture = (e: any) => {
            setValues((state) => {
              const imageFile = e.target.files[0]
              return {
                ...state,
                imageFile,
                imageURL: URL.createObjectURL(imageFile),
              }
            })
          }

          return (
            <Box
              direction="column"
              responsive
              pad="30px"
              elevation="large"
              round="small"
              animation={{ type: "fadeIn", duration: 4000 }}
              margin={{ bottom: "medium" }}
            >
              <Form
                style={{
                  width: "100%",
                  minHeight: 400,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Tabs margin={{ bottom: "medium" }}>
                  <Tab title="Descripción">
                    <FormField label="Nombre" required margin="medium">
                      <TextInput
                        size={size}
                        placeholder="Nombre de receta"
                        name="nombre"
                        type="text"
                        value={values.nombre}
                        onChange={onChangeValues}
                      />
                    </FormField>
                    <Box
                      direction="row"
                      align="center"
                      style={{ flexWrap: "wrap" }}
                    >
                      <FormField margin="medium" label="Imagen" required>
                        <input
                          type="file"
                          accept="image/x-png,image/jpeg"
                          onChange={onChangePicture}
                        />
                      </FormField>
                      <img
                        src={values.imageURL}
                        alt="Aquí va tu imágen"
                        style={{ width: 50 }}
                      />
                    </Box>
                  </Tab>
                  <Tab title="Preparación">
                    <FormField
                      label="Describe aquí tu preparación"
                      required
                      margin="medium"
                    >
                      <TextArea
                        name="preparacion"
                        placeholder="Escribe aquí..."
                        value={values.preparacion}
                        onChange={onChangeValues}
                      />
                    </FormField>
                  </Tab>
                  <Tab title="Ingredientes">
                    <FormField
                      label="Enlista aquí tus ingredientes"
                      required
                      margin="medium"
                    >
                      <TextArea
                        name="ingredientes"
                        placeholder="Escribe aquí..."
                        value={values.ingredientes}
                        onChange={onChangeValues}
                      />
                    </FormField>
                  </Tab>
                </Tabs>
                <Button
                  primary
                  type="submit"
                  label="Guardar"
                  alignSelf="center"
                  margin={{ top: "medium" }}
                />
              </Form>
            </Box>
          )
        }}
      </Formik>
    </UserAppLayout>
  )
}

export default CrearReceta
/*

  const fetchData = useCallback(() => {
    firestore
      .collection("recetas")
      .doc(`${id}`)
      .get()
      .then((doc) => {
        if (doc.exists) {
          console.log(doc.data())
          const datosreceta: any = doc.data()
          setValoresReceta({
            nombre: datosreceta.nombre,
            preparacion: datosreceta.preparacion,
            ingredientes: datosreceta.ingredientes,
            imagen: datosreceta.imagen,
          })
        } else {
          console.log("No existe")
        }
        setValues(doc.data())
      })
      .catch((err) => {
        console.log(err)
      })
  }, [id, firestore])

*/