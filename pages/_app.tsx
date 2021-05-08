import "firebase/firestore"
import "firebase/storage"
import "firebase/auth"
import React from "react"
import firebase from "firebase/app"
import { AppProps } from "next/app"
import { Grommet } from "grommet"
import { setup } from "goober"
import { prefix } from "goober-autoprefixer"
import { ToastProvider } from "react-toast-notifications"

import { FirebaseContext } from "../context/FirebaseContext"

import "../styles/globals.css"

setup(React.createElement, prefix)

const firebaseConfig = {
  apiKey: "AIzaSyBhkU1Ewwow_Jp12Y08OVKphv2tEAUQiLs",
  authDomain: "recipe-app-91f88.firebaseapp.com",
  databaseURL: "https://recipe-app-91f88.firebaseio.com",
  projectId: "recipe-app-91f88",
  storageBucket: "recipe-app-91f88.appspot.com",
  messagingSenderId: "146967844225",
  appId: "1:146967844225:web:17120b5662d89de45c8480",
}

if (!firebase.apps.length) firebase.initializeApp(firebaseConfig)

export const firestore = firebase.firestore()
export const auth = firebase.auth()
export const storage = firebase.storage()

const theme = {
  global: {
    font: {
      family: "Poppins",
      size: "18px",
      height: "20px",
    },
  },
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <FirebaseContext.Provider value={{ firestore, auth, storage }}>
      <Grommet theme={theme}>
        <ToastProvider placement="bottom-center" autoDismiss={5000}>
          <Component {...pageProps} />
        </ToastProvider>
      </Grommet>
    </FirebaseContext.Provider>
  )
}

export default MyApp
