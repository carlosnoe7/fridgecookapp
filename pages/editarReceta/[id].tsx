
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
import React, { useContext, useEffect,  useState } from "react"

import { useRouter } from "next/router"
import UserAppLayout from "components/UserAppLayout/UserAppLayout"
import { FirebaseContext } from "context/FirebaseContext"

import { genHash } from "utils/genHash"
import SEO from "components/SEO/SEO"

interface EditarRecetaProps {}

const EditarReceta: React.FC<EditarRecetaProps> = () => {
  const {  storage, firestore } = useContext(FirebaseContext)

  const size = useContext(ResponsiveContext)
  
  
  const router = useRouter()
  const [valores,setValores]=useState<any>({})
  const [valoresReceta,setValoresReceta]=useState<any>({})
  const {id}=router.query;
  
  const fetchData = () => {
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
            imageFile:null,
            imageURL:datosreceta.imagen
          })          
          console.log(valores);
          
          setValores({datosreceta})
        } else {
          console.log("No existe")
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }
  useEffect(() => {
    fetchData()
    console.log('Ejecutando...');
    
  }, [id])

  // !Cargar imagen
  const handleImageUpload = ({
    name,
    imageFile,
  }: {
    name: string
    imageFile: any
  }) =>(
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
      }))

      const onChangeValues = (e: any) => {
        setValoresReceta({...valoresReceta,[e.target.name]:e.target.value})
      }
      const onChangePicture=(e:any)=>{

        const imageFile = e.target.files[0]
        setValoresReceta(() => {
          return {
            ...valoresReceta,
            imageFile,
            imageURL: URL.createObjectURL(imageFile),
          }
        })
      }
      const handleSubmit=async(e:any) => {
        e.preventDefault();
        const imageURL = await handleImageUpload({
          name: valoresReceta.nombre,
          imageFile: valoresReceta.imageFile,
        })
        firestore.doc(`recetas/${id}`).get().then(doc=>{
          if (doc.exists) {
            
            doc.ref.update({
              nombre:valoresReceta.nombre,
              ingredientes:valoresReceta.ingredientes,
              preparacion: valoresReceta.preparacion,
              imagen: imageURL,
            })
            router.push('/')
          }

        }).catch(err=>{console.log(err)})
        
      }

      return (
        <UserAppLayout>
          <SEO title="Editar Receta" />
          <Heading alignSelf="start" size={"medium"}>
            Editar Receta
          </Heading>
          <form onSubmit={handleSubmit} >
          <Box
                  direction="column"
                  responsive
                  pad="30px"
                  elevation="large"
                  round="small"
                  animation={{ type: "fadeIn", duration: 4000 }}
                  margin={{ bottom: "medium" }}
                >
                 
                    <Tabs margin={{ bottom: "medium" }}>
                      <Tab title="Descripción">
                        <FormField label="Nombre"  margin="medium">
                          <TextInput
                            size={size}
                            placeholder="Nombre de receta"
                            name="nombre"
                            type="text"
                            value={valoresReceta.nombre}
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
                            src={valoresReceta.imagen}
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
                            value={valoresReceta.preparacion}
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
                            value={valoresReceta.ingredientes}
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
                  
                </Box>

          </form>
              
        </UserAppLayout>
              )
            
          
      

  }


export default EditarReceta
