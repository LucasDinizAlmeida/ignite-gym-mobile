import { useEffect, useState } from "react";
import OneSignal, { NotificationReceivedEvent, OSNotification } from "react-native-onesignal";
import { useTheme, Box } from "native-base";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { AuthRoutes } from "./auth.routes";
import { AppRoutes } from "./app.routes";
import { useAuth } from "@contexts/AuthContext";
import { Loading } from "@components/Loading";
import { Notification } from "@components/notification";

const linking = {
  prefixes: ['ignite-gym://', 'com.lucasdev.ignitegym://', 'exp+ignite-gym://'],
  config: {
    screens: {
      signIn: {
        path: 'signIn'
      },
      exercise: {
        path: 'exercise/:exerciseId',
        parse: {
          exerciseId: (exerciseId: string) => exerciseId
        }
      },
      notFound: '*',
    }
  }
}



export function Routes() {

  const { colors } = useTheme()
  const { user, isLoadingUserStorageData } = useAuth()
  const [notification, setNotification] = useState<OSNotification | null>(null)


  const theme = DefaultTheme
  theme.colors.background = colors.gray[700]

  if (isLoadingUserStorageData) {
    return <Loading />
  }

  useEffect(() => {
    const onSubscribe = OneSignal
      .setNotificationWillShowInForegroundHandler((notificationReceivedEvent: NotificationReceivedEvent) => {
        const response = notificationReceivedEvent.getNotification()
        setNotification(response)
      })
  
      return () => onSubscribe
  }, [])


  return (
    <Box flex={1} bg='gray.700'>
      <NavigationContainer theme={theme} linking={linking}>
        {user.id ? <AppRoutes /> : <AuthRoutes />}   
        {
          notification &&
          <Notification 
            data={notification}
            onClose={() => setNotification(null)}
          />
        }
      </NavigationContainer>
    </Box>
  )
}