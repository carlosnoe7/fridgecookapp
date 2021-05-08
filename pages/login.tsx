import React, { useContext } from "react"
import * as yup from "yup"
import { Form, Formik } from "formik"
import { Lock, MailOption } from "grommet-icons"
import { useRouter } from "next/router"
import {
  Box,
  Button,
  FormField,
  ResponsiveContext,
  Text,
  TextInput,
} from "grommet"

import AuthLayout from "components/AuthLayout/AuthLayout"
import SEO from "components/SEO/SEO"
import { FirebaseContext } from "context/FirebaseContext"
import { useToasts } from "react-toast-notifications"

interface LoginProps {}

const validationSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().min(8).required(),
})

const Login: React.FC<LoginProps> = ({}) => {
  const { auth } = useContext(FirebaseContext)
  const router = useRouter()
  const size = useContext(ResponsiveContext)
  const { addToast } = useToasts()

  return (
    <AuthLayout>
      <SEO title="Entrar" />
      <Box
        direction="column"
        responsive
        pad="30px"
        elevation="large"
        round="small"
        animation={{ type: 'fadeIn', duration: 4000 }}
      >
        <Box direction="row" align="center" margin={{ bottom: "medium" }}>
          <Text size={size} margin={{ right: "small" }}>
            ¿Nuevo en FridgeCook?
          </Text>
          <Button
              primary
              color="dark-1"
              label="Registrate aquí"

              onClick={(e) => {
                e.persist()
                router.push("/registro")
              }}
          />
        </Box>
        <Formik
          initialValues={{ email: "", password: "" }}
          onSubmit={async (values, { setSubmitting }) => {
            setSubmitting(true)
            await auth
              .signInWithEmailAndPassword(values.email, values.password)
              .then(() => {router.push("/"); console.log('Simon');})
              .catch((err) => {
                console.log(err)
                const errorMessage =
                  err.code === "auth/user-not-found"
                    ? "Cuenta no existe"
                    : "auth/wrong-password"
                    ? "Contraseña o correo incorrectos"
                    : ""
                addToast(errorMessage, { appearance: "warning" })
              })
            setSubmitting(false)
          }}
          validationSchema={validationSchema}
        >
          {({
            values,
            setValues,
            errors,
            touched,
            setTouched,
            isSubmitting,
          }) => {
            const onChangeValues = (e: any) => {
              e.persist()
              const value = e.target.value
              setTouched({ ...touched, [e.target.name]: value.length > 0 })
              setValues((state) => ({
                ...state,
                [e.target.name]: e.target.value,
              }))
            }

            return (
              <Form>
                <FormField
                  required
                  label="Correo"
                  error={
                    errors.email && touched.email ? (
                      <Text size="small" color="status-error">
                        Por favor, ingresa un email válido.
                      </Text>
                    ) : null
                  }
                >
                  <TextInput
                    placeholder="Ingresa correo"
                    size={size}
                    name="email"
                    value={values.email}
                    onChange={onChangeValues}
                    icon={<MailOption color="dark-1" />}
                  />
                </FormField>
                <FormField label="Contraseña" required>
                  <TextInput
                    size={size}
                    placeholder="Ingresa contraseña"
                    name="password"
                    type="password"
                    value={values.password}
                    onChange={onChangeValues}
                    icon={<Lock color="dark-1" />}
                  />
                </FormField>
                <Button
                  margin={{ top: "large" }}
                  style={{ display: "block", width: "100%" }}
                  type="submit"
                  label="Iniciar sesión"
                  disabled={
                    values.email.length === 0 ||
                    values.password.length === 0 ||
                    typeof errors.email !== "undefined" ||
                    typeof errors.password !== "undefined" ||
                    isSubmitting
                  }
                  primary
                  color="dark-1"
                />
              </Form>
            )
          }}
        </Formik>
      </Box>
    </AuthLayout>
  )
}

export default Login
