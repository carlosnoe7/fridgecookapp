import React, { Dispatch, SetStateAction, useContext } from "react"
import { useRouter } from "next/router"
import { Box, Button, Header, Heading, ResponsiveContext } from "grommet"
import { Cafeteria, Menu } from "grommet-icons"
import { useAuthState } from "react-firebase-hooks/auth"
import { FirebaseContext } from "context/FirebaseContext"

interface NavbarProps {
  setOpenMenu: Dispatch<SetStateAction<boolean>>
}

const Navbar: React.FC<NavbarProps> = ({ setOpenMenu }) => {
  const { auth } = useContext(FirebaseContext)
  const [user] = useAuthState(auth)
  const size = useContext(ResponsiveContext)
  const router = useRouter()

  return (
    <Header
      margin={{ top: "small" }}
      justify="between"
      align="center"
      width="100%"
    >
      {/*Menu vertical*/}
      <Menu
        fill="dark-1"
        color="dark-1"
        size={"medium"}
        style={{ cursor: "pointer" }}
        onClick={() => setOpenMenu((x) => !x)}
      />
      <Box direction="row" align="center" onClick={() => router.push("/")}>
        {/*Icono*/}
        <Cafeteria color="dark-1" size={size} />
        <Heading size={size} margin={{ left: "small", vertical: "none" }}>
          FridgeCook
        </Heading>
      </Box>
       {/*! Verifacamos si el usuario esta logiado o no*/}
      {!user ? (
          // ? Regresamos el boton de iniciar sesion
        <Box direction="row">
          <Button
            primary
            color="dark-1"
            label="Iniciar Sesión"
            margin={{ right: "small" }}
            href="/login"
          />
          <Button href="/registro" color="dark-1" label="Registro" />
        </Box>
      ) : (
          // ? Regresamos el boton de cerrar sesion
        <Button
          primary
          color="dark-1"
          label="Cerrar Sesión"
          margin={{ right: "small" }}
          onClick={() => {
            auth.signOut().then(() => {})
          }}
        />
      )}
    </Header>
  )
}

export default Navbar
