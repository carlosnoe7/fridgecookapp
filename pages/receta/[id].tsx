import React, { useCallback, useContext, useEffect, useState } from "react"
import { GetServerSidePropsContext } from "next"
import { useRouter } from "next/router"
import Image from "next/image"
import {
  Box,
  Button,
  FormField,
  Grid,
  Heading,
  Markdown,
  Paragraph,
  ResponsiveContext,
  Tab,
  Tabs,
  Text,
  TextArea,
  TextInput,
} from "grommet"
import { Cafeteria, Star, Like, Checkmark } from "grommet-icons"
import { useToasts } from "react-toast-notifications"
import { useAuthState } from "react-firebase-hooks/auth"
import { Form, Formik } from "formik"

import AppLayout from "components/AppLayout/AppLayout"
import SEO from "components/SEO/SEO"
import { firestore } from "pages/_app"
import { Recipe } from "models/Recipe"
import { SSRError } from "models/SSRError"
import NotFound from "components/NotFound/NotFound"
import { FirebaseContext } from "context/FirebaseContext"
import { Opinion } from "models/Opinion"
import useUser from "hooks/useUser"

interface RecipeProps {}

const RecipeID: React.FC<
  RecipeProps & { data: { success?: Recipe; error?: SSRError } }
> = ({ data }) => {
  const size = useContext(ResponsiveContext)
  const router = useRouter()
  const { addToast } = useToasts()
  const { auth, firestore } = useContext(FirebaseContext)
  const [opinions, setOpinions] = useState<Opinion[]>([])
  const [user] = useAuthState(auth)
  const userInfo = useUser(user?.email, firestore)
  const { success, error } = data
  const { id } = router.query
  const fetchOpiniones = useCallback(() => {
    if (!id || error) return
    else
      firestore
        .collection("recetas")
        .doc(id as string)
        .collection("opiniones")
        .onSnapshot((docs) => {
          const tempOpinons: Opinion[] = []
          docs.forEach((doc) => {
            tempOpinons.push({ id: doc.id, ...doc.data() } as Opinion)
          })
          setOpinions(() => tempOpinons)
        })
  }, [id, setOpinions, firestore])

  const likeComment = useCallback(
    async (opinionId: string) => {
      const filteredOpinions = opinions.filter(({ id }) => id === opinionId)
      if (filteredOpinions.length === 0) return
      const opinion = filteredOpinions[0]

      let newLikes: any

      if (userInfo.id in opinion.likes) {
        newLikes = { ...opinion.likes }
        delete newLikes[userInfo.id]
      } else {
        newLikes = { ...opinion.likes, [userInfo.id]: true }
      }

      await firestore
        .collection("recetas")
        .doc(id as string)
        .collection("opiniones")
        .doc(opinionId)
        .set({ likes: newLikes }, { merge: true })
    },
    [opinions, firestore, userInfo]
  )

  useEffect(() => {
    fetchOpiniones()
    return () => {}
  }, [id])

  return (
    <AppLayout>
      {success ? (
        <>
          <SEO title={success.nombre} />

          <Grid
            rows={["xxsmall", "medium"]}
            columns={["medium", "500px"]}
            gap="90px"
            areas={[
              { name: "nav", start: [0, 1], end: [0, 1] },
              { name: "main", start: [1, 1], end: [1, 1] },
            ]}
          >
            <Box
              gridArea="nav"
              margin={{ vertical: "small" }}
              pad="10px"
              round={{ size: "12px" }}
              elevation="large"
              align="center"
              justify="start"
            >
              <Image
                src={success.imagen}
                layout="intrinsic"
                alt="Unsplash"
                priority
                sizes="(max-width:350px) 350px, 500px"
                width={"auto"}
                height={300}
              />
              {/* nombre de la receta */}
              <Heading margin={{ right: "large", vertical: "none" }}>
                {" "}
                {success.nombre}{" "}
              </Heading>
              {/* Fin nombre de la receta */}

              {/*Bonton de agregar favorito*/}
              <Button
                label={
                  userInfo?.favoritos.includes(id as string)
                    ? "En tus favoritos"
                    : "Agregar a favoritos"
                }
                primary
                gap="xxsmall"
                icon={
                  userInfo?.favoritos.includes(id as string) ? (
                    <Checkmark />
                  ) : (
                    <Star />
                  )
                }
                size="medium"
                color="dark-1"
                onClick={() => {
                  if (!user) {
                    router.push("/login")
                  }

                  const inFavoritos = userInfo?.favoritos.includes(id as string)

                  const newFavoritos = inFavoritos
                    ? userInfo?.favoritos?.filter((x) => x !== (id as string))
                    : [...userInfo?.favoritos, id]

                  firestore
                    .collection("users")
                    .doc(userInfo.id)
                    .set({ favoritos: newFavoritos }, { merge: true })
                    .then(() =>
                      userInfo.setUserInfo((x: any) => ({
                        ...x,
                        favoritos: newFavoritos,
                      }))
                    )
                    .then(() =>
                      addToast(
                        `${
                          inFavoritos ? "Eliminado de" : "Agregado a"
                        } favoritos`,
                        {
                          appearance: "success",
                        }
                      )
                    )
                    .catch((err) => {
                      console.log(err)
                      addToast("Erro al agregar a favoritos", {
                        appearance: "warning",
                      })
                    })
                }}
              />

              {/* Fin Bonton de agregar favorito*/}
            </Box>

            {/*Datos de la receta */}
            <Box
              gridArea="main"
              direction="row"
              align="center"
              justify="start"
              margin={{ vertical: "large" }}
              width="100%"
              gap={"medium"}
            >
              <Box
                direction="row"
                margin={{ vertical: "small" }}
                justify="around"
                align="center"
              ></Box>
              <Tabs>
                <Tab title="Ingredientes">
                  <Grid
                    rows={["xxsmall", "xxsmall"]}
                    columns={["xxsmall", "medium"]}
                  >
                    <Box pad="medium" margin={{ vertical: "small" }}>
                      <Cafeteria color="black" size={"24px"} />
                    </Box>
                    <Box pad="medium" margin={{ vertical: "xsmall" }}>
                      {success.ingredientes}
                    </Box>
                  </Grid>
                </Tab>
                <Tab title="Preparación">
                  <Box pad="small" margin={{ vertical: "small" }}>
                    <Markdown>{success.preparacion}</Markdown>
                  </Box>
                </Tab>
                <Tab title="Opiniones">
                  <Heading size="15px"> Comentarios </Heading>

                  <Box pad="small" margin={{ top: "2px" }}>
                    {opinions.map(({ author, message, likes, id }, i) => (
                      <Box
                        margin={{ vertical: "small" }}
                        pad="11px"
                        round={{ size: "12px" }}
                        elevation="large"
                        align="center"
                        key={i}
                      >
                        <Text weight="bold">Autor: {author}</Text>
                        <Paragraph margin={{ top: "2px", bottom: "small" }}>
                          {message}
                        </Paragraph>

                        {/*Me gusta*/}
                        <Text weight="bold">{Object.keys(likes).length}</Text>
                        <Button
                          onClick={() => likeComment(id)}
                          color="dark-1"
                          gap="xxsmall"
                        >
                          <Like color="dark-1" size={"24px"} />
                        </Button>
                      </Box>
                    ))}

                    <Formik
                      initialValues={{ author: "", message: "" }}
                      onSubmit={(
                        { author, message },
                        { setSubmitting, setValues }
                      ) => {
                        if (!author) {
                          return addToast("Agrega un Autor", {
                            appearance: "warning",
                          })
                        }
                        if (!message) {
                          return addToast("Agrega un Comentario", {
                            appearance: "warning",
                          })
                        }
                        setSubmitting(true)
                        firestore
                          .collection("recetas")
                          .doc(id as string)
                          .collection("opiniones")
                          .add({ author, message, likes: {} })
                          .then(() => {
                            addToast("Comentario agregado con éxito", {
                              appearance: "success",
                            })
                            setValues(() => ({ author: "", message: "" }))
                          })
                          .catch(() =>
                            addToast(
                              "Error al subir comentario, intenta más tarde.",
                              { appearance: "error" }
                            )
                          )
                        setSubmitting(false)
                      }}
                    >
                      {({ values, setValues }) => {
                        const onChangeValues = (e: any) => {
                          e.persist()
                          setValues((state) => ({
                            ...state,
                            [e.target.name]: e.target.value,
                          }))
                        }

                        return (
                          <Form>
                            <Text weight="bold">Deja un comentario</Text>

                            <FormField label="Autor" required>
                              <TextInput
                                size={size}
                                placeholder="Ingresa tu Nombre"
                                name="author"
                                value={values.author}
                                onChange={onChangeValues}
                              />
                            </FormField>

                            <FormField label="Comentario" required>
                              <TextArea
                                size={size}
                                name="message"
                                placeholder="Escribe aquí..."
                                value={values.message}
                                onChange={onChangeValues}
                              />
                            </FormField>

                            <Button
                              primary
                              label="Comentar"
                              color={"dark-1"}
                              type="submit"
                              fill={true}
                            />
                          </Form>
                        )
                      }}
                    </Formik>
                  </Box>
                </Tab>
              </Tabs>
            </Box>
          </Grid>
        </>
      ) : error ? (
        <>
          <SEO title={"Receta no encontrada"} />
          <NotFound />
          <Text size={size}>Receta no encontrada</Text>
        </>
      ) : null}
    </AppLayout>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const id = context.params?.id
  if (!id)
    return {
      props: { data: { error: { code: 400, message: "ID Not Found" } } },
    }

  const success = await firestore
    .collection("recetas")
    .doc(id as string)
    .get()
    .then((res) =>
      res.exists
        ? {
            id: res.id,
            ...res.data(),
          }
        : null
    )
    .catch(() => null)

  return !success
    ? {
        props: { data: { error: { code: 404, message: "Recipe Not Found" } } },
      }
    : { props: { data: { success } } }
}

export default RecipeID
