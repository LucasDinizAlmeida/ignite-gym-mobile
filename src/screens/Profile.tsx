import { useState } from "react";
import { TouchableOpacity } from "react-native";

import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system';

import { Center, ScrollView, VStack, Skeleton, Text, Heading, useToast } from "native-base";
import { ScreenHeader } from "@components/ScreenHeader";
import { UserPhoto } from "@components/UserPhoto";
import { Input } from "@components/Input";
import { Button } from "@components/Button";

const PHOTO_SIZE = 33

export function Profile() {

  const toast = useToast()

  const [photoIsLoading, setPhotoIsLoading] = useState(false)
  const [userPhoto, setUserPhoto] = useState('https://github.com/LucasDinizAlmeida.png')

  async function handleUserPhotoSelect() {
    setPhotoIsLoading(true)

    try {
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true
      }) as ImagePicker.ImagePickerResult



      if (photoSelected.canceled) {
        return
      }
      if (photoSelected.assets[0].uri) {
        const photoInfo = await FileSystem.getInfoAsync(photoSelected.assets[0].uri)


        if (photoInfo.exists && (photoInfo.size / 1024 / 1024 > 5)) {
          return toast.show({
            title: 'Essa image é muito grande escolha uma de até 5MB.',
            placement: 'top',
            bgColor: 'red.500'
          })
        }

        setUserPhoto(photoSelected.assets[0].uri)
      }

    } catch (error) {
      console.log(error)
    } finally {
      setPhotoIsLoading(false)
    }
  }

  return (
    <VStack flex={1}>
      <ScreenHeader title="Perfil" />
      <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
        <Center mt={6} px={10}>
          {
            photoIsLoading ?
              <Skeleton
                w={PHOTO_SIZE}
                h={PHOTO_SIZE}
                rounded='full'
                startColor='gray.400'
                endColor='gray.500'
              />
              :
              <UserPhoto
                source={{ uri: userPhoto }}
                alt="Foto de perfil"
                size={33}
              />
          }

          <TouchableOpacity onPress={handleUserPhotoSelect}>
            <Text color='green.500' fontWeight='bold' fontSize='md' mt={2} mb={8}>
              Alterar foto
            </Text>
          </TouchableOpacity>

          <Input
            bg='gray.600'
            value="Lucas Diniz Almeida"
          />
          <Input
            bg='gray.600'
            value="lucas@example.com"
            isDisabled
          />



          <Heading color='gray.200' fontSize='md' mb={2} mt={12} alignSelf='flex-start' fontFamily='heading'>
            Alterar senha
          </Heading>
          <Input
            bg='gray.600'
            placeholder="Senha atual"
            secureTextEntry
          />
          <Input
            bg='gray.600'
            placeholder="Nova senha"
            secureTextEntry
          />
          <Input
            bg='gray.600'
            placeholder="Confirmar nova senha"
            secureTextEntry
          />

          <Button
            title="Atualizar"
            mt={4}
          />
        </Center>
      </ScrollView>
    </VStack>
  )
}