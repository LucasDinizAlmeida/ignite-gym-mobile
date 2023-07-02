import { UserDTO } from "@dtos/userDTO";
import { api } from "@services/api";
import { storageAuthTokenGet, storageAuthTokenRemove, storageAuthTokenSave } from "@storage/storageAuthToken";
import { storageUserGet, storageUserRemove, storageUserSave } from "@storage/storageUser";
import { ReactNode, createContext, useContext, useEffect, useState } from "react";

export interface AuthContextProvider {
  user: UserDTO
  signIn: (email: string, password: string) => Promise<void>
  updateUserProfile: (userUpdated: UserDTO) => Promise<void>
  signOut: () => Promise<void>
  isLoadingUserStorageData: boolean
}

interface AuthContextProviderProps {
  children: ReactNode
}

interface StorageUserAndTokenProps {
  userData: UserDTO
  token: string
  refresh_token: string
}

interface UserAndTokenUpdate {
  token: string
  userData: UserDTO
}

const AuthContext = createContext<AuthContextProvider>({} as AuthContextProvider)

export function AuthContextProvider({ children }: AuthContextProviderProps) {

  const [user, setUser] = useState<UserDTO>({} as UserDTO)
  const [isLoadingUserStorageData, setIsLoadingUserStorageData] = useState(true)

  async function storageUserAndTokenSave({ token, userData, refresh_token }: StorageUserAndTokenProps) {
    try {
      setIsLoadingUserStorageData(true)

      await storageUserSave(userData)
      await storageAuthTokenSave({ refresh_token, token })
    } catch (error) {
      throw error
    } finally {
      setIsLoadingUserStorageData(false)
    }
  }

  async function userAndTokenUpdate({ token, userData }: UserAndTokenUpdate) {

    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    setUser(userData)

  }

  async function signIn(email: string, password: string) {
    try {

      const { data } = await api.post('/sessions', { email, password })

      if (data.user && data.token && data.refresh_token) {
        await storageUserAndTokenSave({
          refresh_token: data.refresh_token,
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

  async function updateUserProfile(userUpdated: UserDTO) {
    try {
      setUser(userUpdated)
      await storageUserSave(userUpdated)
    } catch (error) {
      throw error
    }
  }

  async function loadUserData() {

    try {
      const userLogged = await storageUserGet()
      const { token } = await storageAuthTokenGet()

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

  useEffect(() => {
    const subscribe = api.registerIntercaptTokenManager(signOut)

    return () => {
      subscribe()
    }
  }, [signOut])

  return (
    <AuthContext.Provider value={{
      user,
      signIn,
      updateUserProfile,
      signOut,
      isLoadingUserStorageData
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)