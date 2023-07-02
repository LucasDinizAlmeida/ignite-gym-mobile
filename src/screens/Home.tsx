import { useCallback, useEffect, useState } from "react";
import { HStack, Text, VStack, FlatList, Heading, useToast } from "native-base";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { ExerciseCard } from "@components/ExerciseCard";
import { Group } from "@components/Group";
import { HomeHeader } from "@components/HomeHeader";
import { AppNavigatorRoutesProps } from "@routes/app.routes";
import { AppError } from "@utils/App-error";
import { api } from "@services/api";
import { ExerciseDTO } from "@dtos/ExerciseDTO";
import { Loading } from "@components/Loading";

export function Home() {

  const toast = useToast()

  const navigation = useNavigation<AppNavigatorRoutesProps>()

  const [isLoading, setIsLoading] = useState(false)
  const [group, setGroup] = useState<string[]>([])
  const [exercises, setExercises] = useState<ExerciseDTO[]>([])
  const [groupSelected, setGroupSelected] = useState('antebraço')

  async function fetchExercisesByGroup() {
    try {
      setIsLoading(true)
      const response = await api.get(`/exercises/bygroup/${groupSelected}`)
      setExercises(response.data)

    } catch (error) {

      const isAppError = error instanceof AppError
      const title = isAppError ? error.message : 'Não foi possível carregar os exercícios por grupo.'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function fetchGroups() {
    try {

      const response = await api.get('/groups')
      setGroup(response.data)

    } catch (error) {

      const isAppError = error instanceof AppError
      const title = isAppError ? error.message : 'Não foi possível carregar os grupos musculares.'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      })
    }
  }

  function handleOpenExerciseDetails(exerciseId: string) {
    navigation.navigate('exercise', { exerciseId })
  }

  useEffect(() => {
    fetchGroups()
  }, [])

  useFocusEffect(useCallback(() => {
    fetchExercisesByGroup()
  }, [groupSelected]))

  return (

    <VStack>
      <HomeHeader />

      <FlatList
        data={group}
        keyExtractor={item => item}
        renderItem={({ item }) => (
          <Group
            name={item}
            isActive={groupSelected.toLocaleUpperCase() === item.toLocaleUpperCase()}
            onPress={() => setGroupSelected(item)}
          />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        _contentContainerStyle={{ px: 8, py: 5 }}
        my={9}
      />

      {
        isLoading ?
          <Loading /> :
          <>
            <VStack px={8}>
              <HStack justifyContent='space-between' mb={5}>
                <Heading color='gray.200' fontSize='md' fontFamily='heading'>
                  Exercícios
                </Heading>

                <Text color='gray.200' fontSize='sm'>
                  {exercises.length}
                </Text>
              </HStack>
            </VStack>

            <FlatList
              data={exercises}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <ExerciseCard
                  onPress={() => handleOpenExerciseDetails(item.id)}
                  data={item}
                />
              )}
              showsVerticalScrollIndicator={false}
              _contentContainerStyle={{ paddingBottom: 20, paddingX: 8 }}
            />
          </>

      }


    </VStack>
  )
}