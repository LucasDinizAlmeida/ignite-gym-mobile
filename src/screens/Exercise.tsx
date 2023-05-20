import { TouchableOpacity } from "react-native";
import { VStack, Text, Icon, HStack, Heading, Image, Box, ScrollView } from "native-base";
import { Feather } from '@expo/vector-icons'
import { useNavigation } from "@react-navigation/native";
import { AppNavigatorRoutesProps } from "@routes/app.routes";

import BodySvg from '@assets/body.svg'
import SeriesSvg from '@assets/series.svg'
import RepetitionsSvg from '@assets/repetitions.svg'
import { Button } from "@components/Button";

const exerciseImage = 'https://conteudo.imguol.com.br/c/entretenimento/0c/2019/12/03/remada-unilateral-com-halteres-1575402100538_v2_600x600.jpg'

export function Exercise() {

  const navigation = useNavigation<AppNavigatorRoutesProps>()

  function handleGoBack() {
    navigation.goBack()
  }

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
            Puxada frontal
          </Heading>

          <HStack>
            <BodySvg />
            <Text color='gray.200' ml={1} textTransform='capitalize'>
              Costas
            </Text>
          </HStack>
        </HStack>
      </VStack>

      <ScrollView
        showsVerticalScrollIndicator={false}
      >
        <VStack p={8}>
          <Image
            source={{ uri: exerciseImage }}
            alt="Nome do exercício"
            w='full'
            h={80}
            mb={3}
            rounded='lg'
            resizeMode="cover"
          />

          <Box bg='gray.600' pb={4} px={4} rounded='lg'>
            <HStack alignItems='center' justifyContent='space-around' mt={5} mb={6}>
              <HStack>
                <SeriesSvg />
                <Text color='gray.200' ml={1}>
                  3 Séries
                </Text>
              </HStack>

              <HStack>
                <RepetitionsSvg />
                <Text color='gray.200' ml={1}>
                  12 Repetições
                </Text>
              </HStack>
            </HStack>

            <Button
              title="Marcar como realizado"
            />
          </Box>
        </VStack>
      </ScrollView>
    </VStack>
  )
}