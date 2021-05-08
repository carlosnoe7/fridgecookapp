import React, { useContext } from "react"
import { useRouter } from "next/router"
import * as yup from "yup"
import { Form, Formik } from "formik"
import { MailOption, Lock } from "grommet-icons"
import {
  Box,
  FormField,
  TextInput,
  Text,
  Button,
  ResponsiveContext,
} from "grommet"

import { FirebaseContext } from "../context/FirebaseContext"
import AuthLayout from "components/AuthLayout/AuthLayout"
import SEO from "components/SEO/SEO"

interface RegistroProps {}

const validationSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().min(8).required(),
  confirmPassword: yup.string().min(8).required(),
})

const Registro: React.FC<RegistroProps> = () => {
  const { firestore, auth } = useContext(FirebaseContext)
  const router = useRouter()
  const size = useContext(ResponsiveContext)
  const registerUser = (email: string, password: string) =>
    auth.createUserWithEmailAndPassword(email, password)

  return (
    <AuthLayout>
      <SEO title="Registro" />
      <Box
        direction="column"
        responsive
        pad="30px"
        elevation="large"
        round="small"
        animation={{ type: 'fadeIn', duration: 4000 }}
      >

      
      <Box align="center" justify="center" width="350px">
        <Formik
          initialValues={{ email: "", password: "", confirmPassword: "" }}
          onSubmit={({ email, password }) => {
            registerUser(email, password)
              .then(() =>
                firestore.collection("users").add({ email, favoritos: [] })
              )
              .then(() => router.push("/"))
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
              <Form style={{ width: "100%" }}>
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
                <FormField
                  error={
                    errors.password && touched.password ? (
                      <Text size="small" color="status-error">
                        La contraseña debe tener 8 o más caracteres.
                      </Text>
                    ) : null
                  }
                  label="Contraseña"
                  required
                >
                  <TextInput
                    placeholder="Ingresa contraseña"
                    name="password"
                    size={size}
                    type="password"
                    value={values.password}
                    onChange={onChangeValues}
                    icon={<Lock color="dark-1" />}
                  />
                </FormField>
                <FormField
                  error={
                    values.password !== values.confirmPassword &&
                    touched.confirmPassword ? (
                      <Text size="small" color="status-error">
                        Las contraseñas no coinciden
                      </Text>
                    ) : null
                  }
                  label="Confirmar contraseña"
                  required
                >
                  <TextInput
                    type="password"
                    placeholder="Ingresa contraseña"
                    name="confirmPassword"
                    size={size}
                    value={values.confirmPassword}
                    onChange={onChangeValues}
                    icon={<Lock color="dark-1" />}
                  />
                </FormField>
                <Button
                  margin={{ top: "large" }}
                  style={{ display: "block", width: "100%" }}
                  type="submit"
                  disabled={
                    values.email.length === 0 ||
                    values.password.length === 0 ||
                    values.confirmPassword.length === 0 ||
                    typeof errors.email !== "undefined" ||
                    typeof errors.password !== "undefined" ||
                    typeof errors.confirmPassword !== "undefined" ||
                    values.confirmPassword !== values.password ||
                    isSubmitting
                  }
                  label="Registrar"
                  primary
                  color="dark-1"
                />
              </Form>
            )
          }}
        </Formik>
      </Box>
      </Box>
    </AuthLayout>
  )
}

export default Registro
