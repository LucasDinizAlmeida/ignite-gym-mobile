import { TouchableOpacity } from "react-native";
import { VStack, Text, Icon, HStack, Heading, Image, Box, ScrollView, useToast } from "native-base";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AppNavigatorRoutesProps } from "@routes/app.routes";

import { Feather } from '@expo/vector-icons'

import BodySvg from '@assets/body.svg'
import SeriesSvg from '@assets/series.svg'
import RepetitionsSvg from '@assets/repetitions.svg'
import { Button } from "@components/Button";
import { ExerciseDTO } from "@dtos/ExerciseDTO";
import { api } from "@services/api";
import { useEffect, useState } from "react";
import { AppError } from "@utils/App-error";
import { Loading } from "@components/Loading";

const exerciseImage = 'https://conteudo.imguol.com.br/c/entretenimento/0c/2019/12/03/remada-unilateral-com-halteres-1575402100538_v2_600x600.jpg'

interface RouteParamsProps {
  exerciseId: string
}

export function Exercise() {

  const [exercise, setExercise] = useState<ExerciseDTO>({} as ExerciseDTO)
  const [isLoading, setIsLoading] = useState(true)
  const [sendingRegister, setSendingRegister] = useState(false)
  const toast = useToast()

  const navigation = useNavigation<AppNavigatorRoutesProps>()
  const route = useRoute()
  const { exerciseId } = route.params as RouteParamsProps

  async function fetchExerciseDetails() {
    try {
      setIsLoading(true)

      const response = await api.get(`/exercises/${exerciseId}`)
      setExercise(response.data)

    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError ? error.message : 'Não foi possível carregar os detalhes do exercício.'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      })
    } finally {
      setIsLoading(false)
    }

  }

  async function handleExerciseHistoryRegister() {
    try {
      setSendingRegister(true)

      await api.post('/history', { exercise_id: exerciseId })

      toast.show({
        title: 'Parabéns! Exercício registrado nos eu histórico.',
        placement: 'top',
        bgColor: 'green.700'
      })

      navigation.navigate('history')

    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError ? error.message : 'Não foi possível carregar os detalhes do exercício.'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      })
    } finally {
      setSendingRegister(false)
    }
  }


  function handleGoBack() {
    navigation.goBack()
  }

  useEffect(() => {
    fetchExerciseDetails()
  }, [exerciseId])

  return (
    <VStack flex={1}>
      <VStack bg='gray.600' px={8} pt={12}>
        <TouchableOpacity
          onPress={handleGoBack}
        >
          <Icon
            as={Feather}
            name='arrow-left'
            color='green.500'
            size={6}
          />
        </TouchableOpacity>

        <HStack alignItems='center' justifyContent='space-between' mt={4} mb={8}>
          <Heading color='gray.100' fontSize='lg' flexShrink={1} fontFamily='heading'>
            {exercise.name}
          </Heading>

          <HStack>
            <BodySvg />
            <Text color='gray.200' ml={1} textTransform='capitalize'>
              {exercise.group}
            </Text>
          </HStack>
        </HStack>
      </VStack>



      {
        isLoading ? <Loading /> :
          <VStack p={8}>
            <Box rounded='lg' mb={3} overflow='hidden'>
              <Image
                source={{ uri: `${api.defaults.baseURL}/exercise/demo/${exercise.demo}` }}
                alt="Nome do exercício"
                w='full'
                h={80}
                rounded='lg'
                resizeMode="cover"
              />
            </Box>

            <Box bg='gray.600' pb={4} px={4} rounded='lg'>
              <HStack alignItems='center' justifyContent='space-around' mt={5} mb={6}>
                <HStack>
                  <SeriesSvg />
                  <Text color='gray.200' ml={1}>
                    {exercise.series} Séries
                  </Text>
                </HStack>

                <HStack>
                  <RepetitionsSvg />
                  <Text color='gray.200' ml={1}>
                    {exercise.repetitions} Repetições
                  </Text>
                </HStack>
              </HStack>

              <Button
                title="Marcar como realizado"
                onPress={handleExerciseHistoryRegister}
                isLoading={sendingRegister}
              />
            </Box>
          </VStack>
      }
    </VStack>
  )
}