import { HistoryDTO } from "@dtos/HistoryDTO";
import { HStack, Heading, Text, VStack } from "native-base";

interface HistoryCardProps {
  exerciseHistory: HistoryDTO
}

export function HistoryCard({ exerciseHistory: { group, hour, name } }: HistoryCardProps) {

  return (
    <HStack bg='gray.600' w='full' px={5} py={4} mb={3} rounded='md' alignItems='center' justifyContent='space-between'>
      <VStack mr={5} flex={1}>
        <Heading color='white' fontSize='md' textTransform='capitalize' numberOfLines={1} fontFamily='heading'>
          {group}
        </Heading>

        <Text color='gray.100' fontSize='lg' numberOfLines={1}>
          {name}
        </Text>
      </VStack>

      <Text color='gray.300' fontSize='md'>
        {hour}
      </Text>
    </HStack>
  )
}