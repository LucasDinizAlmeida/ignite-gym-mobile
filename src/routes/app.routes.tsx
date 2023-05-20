import { createBottomTabNavigator, BottomTabNavigationProp } from "@react-navigation/bottom-tabs"
import { Exercise } from "@screens/Exercise"
import { History } from "@screens/History"
import { Home } from "@screens/Home"
import { Profile } from "@screens/Profile"
import { MaterialIcons } from '@expo/vector-icons'

// import HomeSvg from '@assets/home.svg'
// import HistorySvg from '@assets/history.svg'
// import ProfileSvg from '@assets/profile.svg'
import { Icon, useTheme } from "native-base"
import { Platform } from "react-native"

type AppRoutes = {
  home: undefined
  exercise: undefined
  profile: undefined
  history: undefined
}

export type AppNavigatorRoutesProps = BottomTabNavigationProp<AppRoutes>

const { Navigator, Screen } = createBottomTabNavigator<AppRoutes>()

export function AppRoutes() {
  const { sizes, colors } = useTheme()

  return (
    <Navigator screenOptions={{
      headerShown: false,
      tabBarShowLabel: false,
      tabBarActiveTintColor: colors.green[500],
      tabBarInactiveTintColor: colors.gray[200],
      tabBarStyle: {
        backgroundColor: colors.gray[600],
        borderTopWidth: 0,
        height: Platform.OS === 'android' ? 'auto' : 96,
        paddingBottom: sizes[10],
        paddingTop: sizes[6]
      }
    }}>
      <Screen
        name="home"
        component={Home}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon
              as={MaterialIcons}
              name="home"
              color={color}
              size={30}
            />
          )
        }}
      />
      <Screen
        name="history"
        component={History}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon
              as={MaterialIcons}
              name="history"
              color={color}
              size={30}
            />
          )
        }}
      />
      <Screen
        name="profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon
              as={MaterialIcons}
              name="model-training"
              color={color}
              size={30}
            />
          )
        }}
      />
      <Screen
        name="exercise"
        component={Exercise}
        options={{
          tabBarButton: () => null
        }}
      />
    </Navigator>
  )
}