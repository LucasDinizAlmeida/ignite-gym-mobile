import { VStack, HStack, Heading, Box } from "native-base";



export function NotFound() {



  return (
    <VStack flex={1}>
        <VStack p={8} bg='gray.600' flex={1} alignItems='center' justifyContent='center'>
            <Box rounded='lg' mb={3} overflow='hidden'>
                <HStack>
                <Heading color='green.500'>ERRO 404</Heading>
                </HStack>
            </Box>            
        </VStack>
      
    </VStack>
  )
}