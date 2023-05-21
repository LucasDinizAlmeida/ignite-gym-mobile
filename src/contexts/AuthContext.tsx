import { UserDTO } from "@dtos/userDTO";
import { api } from "@services/api";
import { storageAuthTokenGet, storageAuthTokenRemove, storageAuthTokenSave } from "@storage/storageAuthToken";
import { storageUserGet, storageUserRemove, storageUserSave } from "@storage/storageUser";
import { ReactNode, createContext, useContext, useEffect, useState } from "react";

export interface AuthContextProvider {
  user: UserDTO
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  isLoadingUserStorageData: boolean
}

interface AuthContextProviderProps {
  children: ReactNode
}

interface StorageUserAndTokenProps {
  userData: UserDTO
  token: string
}

const AuthContext = createContext<AuthContextProvider>({} as AuthContextProvider)

export function AuthContextProvider({ children }: AuthContextProviderProps) {

  const [user, setUser] = useState<UserDTO>({} as UserDTO)
  const [isLoadingUserStorageData, setIsLoadingUserStorageData] = useState(true)

  async function storageUserAndTokenSave({ token, userData }: StorageUserAndTokenProps) {
    try {
      setIsLoadingUserStorageData(true)

      await storageUserSave(userData)
      await storageAuthTokenSave(token)
    } catch (error) {
      throw error
    } finally {
      setIsLoadingUserStorageData(false)
    }
  }

  async function userAndTokenUpdate({ token, userData }: StorageUserAndTokenProps) {

    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    setUser(userData)

  }

  async function signIn(email: string, password: string) {
    try {

      const { data } = await api.post('/sessions', { email, password })

      if (data.user && data.token) {
        await storageUserAndTokenSave({
          token: data.token,
          userData: data.user
        })
        userAndTokenUpdate({
          token: data.token,
          userData: data.user
        })
      }
    } catch (error) {

      throw error
    }
  }

  async function signOut() {
    try {
      setIsLoadingUserStorageData(true)

      setUser({} as UserDTO)
      await storageUserRemove()
      await storageAuthTokenRemove()

    } catch (error) {
      throw error

    } finally {
      setIsLoadingUserStorageData(false)
    }
  }

  async function loadUserData() {

    try {
      const userLogged = await storageUserGet()
      const token = await storageAuthTokenGet()

      if (userLogged && token) {
        userAndTokenUpdate({
          token,
          userData: userLogged
        })
      }

    } catch (error) {
      throw error
    } finally {
      setIsLoadingUserStorageData(false)
    }
  }

  useEffect(() => {
    loadUserData()
  }, [])

  return (
    <AuthContext.Provider value={{
      user,
      signIn,
      signOut,
      isLoadingUserStorageData
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)