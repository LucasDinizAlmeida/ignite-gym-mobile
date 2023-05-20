import { HStack, VStack, Text, Heading, Icon } from "native-base";
import { UserPhoto } from "./UserPhoto";
import { MaterialIcons } from '@expo/vector-icons'
import { TouchableOpacity } from "react-native";

export function HomeHeader() {
  return (
    <HStack bg='gray.600' pt={16} pb={5} px={8} alignItems='center'>
      <UserPhoto
        source={{ uri: 'https://github.com/LucasDinizAlmeida.png' }}
        size={16}
        alt="foto de perfil"
      />
      <VStack flex={1} ml={3}>
        <Text color='gray.100' fontSize='md'>
          Olá,
        </Text>

        <Heading color='gray.100' fontSize='md' fontFamily='heading'>
          Lucas
        </Heading>
      </VStack>

      <TouchableOpacity>
        <Icon
          as={MaterialIcons}
          name="logout"
          color='gray.200'
          size={7}
        />
      </TouchableOpacity>
    </HStack>
  )
}