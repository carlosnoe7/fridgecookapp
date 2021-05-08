import { useCallback, useEffect, useMemo, useState } from "react"
import firebase from "firebase/app"

interface ResponseUser {
  id: string
  favoritos: string[]
  email: string
  setUserInfo: any
}

const useUser: (
  user: string | undefined,
  firestore: firebase.firestore.Firestore
) => ResponseUser = (user, firestore) => {
  const [userInfo, setUserInfo] = useState<{
    id: string
    favoritos: string[]
    email: string
  }>({
    id: "",
    favoritos: [],
    email: "",
  })
  const fetchUserData = useCallback(async () => {
    if (!user) return

    const response: ResponseUser | null = await firestore
      .collection("users")
      .where("email", "==", user)
      .get()
      .then((docs) => {
        let docId = {} as ResponseUser
        docs.forEach((doc) => {
          docId = { ...doc.data(), id: doc.id } as ResponseUser
        })
        return docId
      })
      .catch(() => null)

    if (!response) return

    setUserInfo(
      () =>
        response || {
          id: "",
          favoritos: [],
          email: "",
        }
    )
  }, [setUserInfo, user])

  useEffect(() => {
    fetchUserData()
    return () => {}
  }, [user])

  return useMemo(() => ({ ...userInfo, setUserInfo }), [userInfo, setUserInfo])
}

export default useUser
