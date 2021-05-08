import React, { useCallback, useContext, useEffect, useState } from "react"
import { Box, Grid, Heading } from "grommet"
import { useAuthState } from "react-firebase-hooks/auth"

import RecipePreview from "components/RecipePreview/RecipePreview"
import SEO from "components/SEO/SEO"
import UserAppLayout from "components/UserAppLayout/UserAppLayout"
import { FirebaseContext } from "context/FirebaseContext"
import useUser from "hooks/useUser"
import { Recipe } from "models/Recipe"

interface MisRecetasProps {}

const MisRecetas: React.FC<MisRecetasProps> = ({}) => {
  const { firestore, auth } = useContext(FirebaseContext)
  const [user] = useAuthState(auth)
  const userInfo = useUser(user?.email, firestore)
  const [myRecipes, setMyRecipes] = useState<Recipe[]>([])
  const fetchRecipes = useCallback(async () => {
    if (userInfo.id === "") return

    //! Buscar recetas que coincidan con el id del usuario
    const recipesDB = await firestore
      .collection("recetas")
      .where("author", "==", userInfo.id)
      .get()
      .then((docs) => {
        const recipes = [] as Recipe[]
        docs.forEach((doc) =>
          recipes.push({ id: doc.id, ...doc.data() } as Recipe)
        )
        return recipes
      })
      .catch(() => null)

    if (!recipesDB) return
    setMyRecipes(() => recipesDB)
  }, [userInfo.id, setMyRecipes, firestore])

  useEffect(() => {
    fetchRecipes()
    return () => {}
  }, [userInfo.id])

  return (
    <UserAppLayout>
      <SEO title="Mis recetas" />
      <Heading alignSelf="start" size="medium">
        Mis recetas
      </Heading>
      <Box width="100%">
        <Grid columns={"26%"} responsive gap="medium">
          {myRecipes.map(({ id, imagen, nombre }, i) => (
            <RecipePreview
              deleteBtn={() =>
                setMyRecipes((x) => x.filter((x) => x.id !== id))
              }
              editBtn={()=>console.log('Hola')}
              id={id}
              imagen={imagen}
              nombre={nombre}
              key={i}
            />
          ))}
        </Grid>
      </Box>
    </UserAppLayout>
  )
}

export default MisRecetas
