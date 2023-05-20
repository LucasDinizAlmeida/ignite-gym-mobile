import { Heading, VStack, SectionList, Text } from "native-base";
import { HistoryCard } from "@components/HistoryCard";
import { ScreenHeader } from "@components/ScreenHeader";
import { useState } from "react";


export function History() {

  const [exercises, setExercises] = useState([
    {
      title: '26.03.23',
      data: ['Remada alta', 'Puxada Unilateral']
    },
    {
      title: '27.03.23',
      data: ['Remada alta']
    },
  ])

  return (
    <VStack flex={1}>
      <ScreenHeader
        title="Histórico de Exercícios"
      />

      <SectionList
        sections={exercises}
        keyExtractor={item => item}
        renderItem={({ item }) => (
          <HistoryCard />
        )}

        renderSectionHeader={({ section }) => (
          <Heading color='gray.200' fontSize='md' mt={10} mb={3} fontFamily='heading'>
            {section.title}
          </Heading>
        )}
        px={8}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={exercises.length === 0 && { flex: 1, justifyContent: 'center' }}
        ListEmptyComponent={() => (
          <Text color='gray.100' textAlign='center'>
            Não há exercícios registrados ainda.{'\n'}
            Vamos treinar hoje?
          </Text>
        )}
      />


    </VStack>
  )
}