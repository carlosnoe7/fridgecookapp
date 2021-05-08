import { Box, Heading, ResponsiveContext } from "grommet"
import { Cafeteria } from "grommet-icons"
import { Text } from "grommet"
import React, { useContext } from "react"
import { useRouter } from "next/router"

interface AuthComponentProps {}

const AuthComponent: React.FC<AuthComponentProps> = ({ children }) => {
  const router = useRouter()
  const size = useContext(ResponsiveContext)

  return (
    <Box justify="center" align="center" height="100vh" direction="column">
      <Box
          animation={{ type: 'jiggle', duration: 5000 }}
        onClick={() => router.push("/")}
        style={{ cursor: "pointer" }}
        direction="row"
        align="center"
        margin={{ bottom: "large" }}
      >
        <Cafeteria color="#000" size={size} />
        <Heading size={size} margin={{ left: "small", vertical: "none" }}>
          FridgeCook
        </Heading>
      </Box>
      <Text
        textAlign="center"
        margin={{ bottom: "medium" }}
        size={size}
        weight="bold"
      >
        {router.pathname === "/login" ? "Iniciar Sesión" : "Registrarse"}
      </Text>
      {children}
    </Box>
  )
}

export default AuthComponent
