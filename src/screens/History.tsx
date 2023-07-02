import { useCallback, useState } from "react";
import { Heading, VStack, SectionList, Text, useToast } from "native-base";
import { HistoryCard } from "@components/HistoryCard";
import { ScreenHeader } from "@components/ScreenHeader";
import { api } from "@services/api";
import { HistoryByDayDTO } from "@dtos/HistoryByDayDTO";
import { AppError } from "@utils/App-error";
import { useFocusEffect } from "@react-navigation/native";
import { Loading } from "@components/Loading";

export function History() {

  const toast = useToast()

  const [isLoading, setIsLoading] = useState(true)
  const [exercises, setExercises] = useState<HistoryByDayDTO[]>([])

  async function fetchHistory() {
    try {
      setIsLoading(true)

      const response = await api.get('/history')
      setExercises(response.data)

    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError ? error.message : 'Não foi possível carregar o histórico.'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      })
    } finally {
      setIsLoading(false)
    }
  }

  useFocusEffect(useCallback(() => {
    fetchHistory()
  }, []))

  return (
    <VStack flex={1}>
      <ScreenHeader
        title="Histórico de Exercícios"
      />

      {
        isLoading ? <Loading /> :


          <SectionList
            sections={exercises}
            keyExtractor={item => item.id}
            renderSectionHeader={({ section }) => (
              <Heading color='gray.200' fontSize='md' mt={10} mb={3} fontFamily='heading'>
                {section.title}
              </Heading>
            )}
            renderItem={({ item }) => (
              <HistoryCard exerciseHistory={item} />
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
      }

    </VStack>
  )
}