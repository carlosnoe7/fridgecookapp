import { useRouter } from "next/router"
import React, { useContext, useEffect } from "react"
import { useAuthState } from "react-firebase-hooks/auth"

import AppLayout from "components/AppLayout/AppLayout"
import { FirebaseContext } from "context/FirebaseContext"

interface UserAppLayoutProps {}

const UserAppLayout: React.FC<UserAppLayoutProps> = ({ children }) => {
  const { auth } = useContext(FirebaseContext)
  const [user, loading, error] = useAuthState(auth)
  const router = useRouter()

  useEffect(() => {
    if ((!user && !loading) || error) router.push("/login")
    return () => {}
  }, [user, loading, error, router])

  return <AppLayout>{children}</AppLayout>
}

export default UserAppLayout
