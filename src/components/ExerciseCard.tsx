import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import { HStack, Heading, Image, VStack, Text, Icon } from "native-base";
import { Entypo } from '@expo/vector-icons'
import { ExerciseDTO } from "@dtos/ExerciseDTO";
import { api } from "@services/api";


const exerciseImage = 'https://conteudo.imguol.com.br/c/entretenimento/0c/2019/12/03/remada-unilateral-com-halteres-1575402100538_v2_600x600.jpg'

interface Props extends TouchableOpacityProps {
  data: ExerciseDTO
}

export function ExerciseCard({ data: { name, series, repetitions, thumb }, ...rest }: Props) {

  return (
    <TouchableOpacity
      {...rest}
    >
      <HStack bg='gray.500' alignItems='center' p={2} pr={4} rounded='md' mb={3}>
        <Image
          source={{ uri: `${api.defaults.baseURL}/exercise/thumb/${thumb}` }}
          alt="imagem do exercício"
          w={16}
          h={16}
          rounded='md'
          mr={4}
          resizeMode="cover"
        />

        <VStack flex={1}>
          <Heading fontSize='lg' color='white' fontFamily='heading'>
            {name}
          </Heading>

          <Text fontSize='sm' color='gray.200' mt={1} numberOfLines={2}>
            {series} séries x {repetitions} repetições
          </Text>
        </VStack>

        <Entypo name="chevron-thin-right" />

        <Icon
          as={Entypo}
          name="chevron-thin-right"
          color='gray.300'
        />
      </HStack>
    </TouchableOpacity>
  )
}