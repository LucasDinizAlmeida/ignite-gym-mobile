import { api } from "@services/api";
import { ReactNode, createContext, useContext, useState } from "react";

export interface AuthContextProvider {
  user: UserDTO
  signIn: (email: string, password: string) => Promise<void>
}

interface AuthContextProviderProps {
  children: ReactNode
}

const AuthContext = createContext<AuthContextProvider>({} as AuthContextProvider)

export function AuthContextProvider({ children }: AuthContextProviderProps) {

  const [user, setUser] = useState<UserDTO>({} as UserDTO)

  async function signIn(email: string, password: string) {
    try {
      const { data } = await api.post('/sessions', { email, password })

      if (data.user) {
        console.log(data.user)
        setUser(user)
      }
    } catch (error) {
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      signIn
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)