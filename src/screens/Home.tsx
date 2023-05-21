import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { HStack, Text, VStack, FlatList, Heading } from "native-base";
import { ExerciseCard } from "@components/ExerciseCard";
import { Group } from "@components/Group";
import { HomeHeader } from "@components/HomeHeader";
import { AppNavigatorRoutesProps } from "@routes/app.routes";

export function Home() {

  const navigation = useNavigation<AppNavigatorRoutesProps>()

  const [group, setGroup] = useState(['costas', 'ombro', 'perna', 'biceps', 'triceps'])
  const [exercises, setExercises] = useState(['Puxada articulada', 'Remada unilateral', 'Rosca Scot', 'Rosca direta', 'Puxada frontal'])
  const [groupSelected, setGroupSelected] = useState('costas')

  function handleOpenExerciseDetails() {
    navigation.navigate('exercise')
  }

  return (

    <VStack flex={1}>
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
        keyExtractor={item => item}
        renderItem={({ item }) => (
          <ExerciseCard
            onPress={handleOpenExerciseDetails}
          />
        )}
        showsVerticalScrollIndicator={false}
        _contentContainerStyle={{ paddingBottom: 20, paddingX: 8 }}
      />

    </VStack>
  )
}