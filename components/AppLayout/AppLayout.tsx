import React, { useContext, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { Box, Button, Heading, ResponsiveContext } from "grommet"
import { Cafeteria } from "grommet-icons"
import { css, styled } from "goober"
import { slide as Menu } from "react-burger-menu"
import { useAuthState } from "react-firebase-hooks/auth"

import Navbar from "components/Navbar/Navbar"
import { FirebaseContext } from "context/FirebaseContext"

const OuterContainer = styled("div")`
  .bm-menu {
    background: #000;
    width: 300px;
    height: 100%;
    padding: 32px 24px;
    a {
      text-align: center;
      display: block;
      color: #fff;
      margin-bottom: 24px;
    }
  }
`

interface AppLayoutProps {}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { auth } = useContext(FirebaseContext)
  const [user] = useAuthState(auth)
  const size = useContext(ResponsiveContext)
  const router = useRouter()
  const [openMenu, setOpenMenu] = useState<boolean>(false)

  return (
    <OuterContainer id="outer-container">
      <Menu
        pageWrapId={"page-wrap"}
        outerContainerId={"outer-container"}
        isOpen={openMenu}
        onOpen={() => setOpenMenu(true)}
        onClose={() => setOpenMenu(false)}
        onStateChange={(state: any) => state.isOpen}
        burgerButtonClassName={css`
          display: ${openMenu ? "block" : "none"};
        `}
      >
        <Box
          onClick={() => router.push("/")}
          direction="row"
          align="center"
          justify="center"
          style={{ display: "flex", cursor: "pointer", outline: "none" }}
          alignSelf="center"
          margin={{ bottom: "large" }}
        >
          <Cafeteria color="#fff" size={"24px"} />
          <Heading
            size={"24px"}
            color={"#fff"}
            style={{ width: "fit-content" }}
            margin={{ left: "small", vertical: "none" }}
          >
            FridgeCook
          </Heading>
        </Box>
        <Link href="/">Inicio</Link>
        {!user ? (
          <>
            <Button
              primary
              label="Iniciar sesión"
              style={{ color: "#000" }}
              href="/login"
              color="light-1"
            />
            <Button
              label="Registro"
              href="/registro"
              style={{ border: "1px solid #fff" }}
              color="dark-1"
            />
          </>
        ) : (
          <>
            <Link href="/crear-receta">Crear receta</Link>
            <Link href="/mis-recetas">Mis recetas</Link>
            <Link href="/mis-favoritos">Mis favoritos</Link>
          </>
        )}
      </Menu>
      <main id="page-wrap">
        <Box
          width="100%"
          direction="column"
          justify="center"
          align="center"
          pad={{ horizontal: size }}
        >
          <Navbar setOpenMenu={setOpenMenu} />
          {children}
        </Box>
      </main>
    </OuterContainer>
  )
}

export default AppLayout
