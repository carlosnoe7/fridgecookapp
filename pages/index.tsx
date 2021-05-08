import React, { useContext, useState } from "react"
import { Box, Grid, ResponsiveContext, TextInput } from "grommet"
import { Search } from "grommet-icons"

import AppLayout from "components/AppLayout/AppLayout"
import SEO from "components/SEO/SEO"
import { firestore } from "./_app"
import { Recipe } from "models/Recipe"
import { SSRError } from "models/SSRError"
import RecipePreview from "components/RecipePreview/RecipePreview"

interface indexProps {}

const index: React.FC<
  indexProps & { data: { success?: Recipe[]; error?: SSRError } }
> = ({ data }) => {
  const [searchText, setSearchText] = useState("")
  const size = useContext(ResponsiveContext)

  return (
    <AppLayout>
      <SEO title="Inicio" />
      <Box
        width="100%"
        margin={{ vertical: "large" }}
        direction="row"
        align="center"
        justify="between"
      >
        <TextInput
          value={
              searchText
          }
          onChange={(e) => setSearchText(() => e.target.value)}
          placeholder="Buscar receta..."
          size={size}
          width="100%"
          icon={<Search color="dark-1" />}
        />
      </Box>
      <Box width="100%">
        <Grid columns={"26%"} responsive gap="medium">
          {data.success
            ?.filter(({ nombre }) =>
              searchText.length === 0 ? true : nombre.toUpperCase().includes(searchText.toUpperCase())
            )
            .map(({ id, imagen, nombre }, i) => (
              <RecipePreview id={id} imagen={imagen} nombre={nombre} key={i} />
            ))
          }
        </Grid>
      </Box>
    </AppLayout>
  )
}

export async function getServerSideProps() {
  const success = await firestore
    .collection("recetas")
    .get()
    .then((docs) => {
      const recipes: Recipe[] = []
      docs.forEach((doc) => {
        recipes.push({ ...doc.data(), id: doc.id } as Recipe)
      })
      return recipes
    })
    .catch(() => null)

  return !success
    ? {
        props: { data: { error: { code: 404, message: "Recipe Not Found" } } },
      }
    : { props: { data: { success } } }
}

export default index
