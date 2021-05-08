import React, { useCallback, useContext, useEffect, useState } from "react"
import { Box, Grid, Heading } from "grommet"
import { useAuthState } from "react-firebase-hooks/auth"

import RecipePreview from "components/RecipePreview/RecipePreview"
import SEO from "components/SEO/SEO"
import UserAppLayout from "components/UserAppLayout/UserAppLayout"
import { FirebaseContext } from "context/FirebaseContext"
import useUser from "hooks/useUser"
import { Recipe } from "models/Recipe"

interface MisFavoritosProps {}

const MisFavoritos: React.FC<MisFavoritosProps> = ({}) => {
  const { auth, firestore } = useContext(FirebaseContext)
  const [user] = useAuthState(auth)
  const userInfo = useUser(user?.email, firestore)
  const [myFavorites, setMyFavorites] = useState<Recipe[]>([])
  //! Funcion que recupera mis recetas favoritas
  const fetchFavorites = useCallback(() => {
    if (userInfo.favoritos.length === 0) return

    const promises: Promise<Recipe | null>[] = userInfo.favoritos.map(
      (recipeID) =>
        firestore
          .collection("recetas")
          .doc(recipeID)
          .get()
          .then((doc) =>
            !doc.exists ? null : ({ id: doc.id, ...doc.data() } as Recipe)
          )
    )

    Promise.all(promises)
      .then((recipes) =>
        setMyFavorites(() => recipes.filter((x) => x) as Recipe[])
      )
      .catch(() => null)
  }, [userInfo.favoritos, firestore, setMyFavorites])

  useEffect(() => {
    fetchFavorites()
    return () => {}
  }, [userInfo.favoritos])

  return (
    <UserAppLayout>
      <SEO title="Mis favoritas" />
      <Heading alignSelf="start" size="medium">
        Mis recetas favoritas
      </Heading>
      <Box width="100%">
        <Grid columns={"26%"} responsive gap="medium">
          {myFavorites.map(({ id, imagen, nombre }, i) => (
            <RecipePreview id={id} imagen={imagen} nombre={nombre} key={i} />
          ))}
        </Grid>
      </Box>
    </UserAppLayout>
  )
}

export default MisFavoritos
