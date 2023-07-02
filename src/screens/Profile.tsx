import { useState } from "react";
import { TouchableOpacity } from "react-native";
import { Center, ScrollView, VStack, Skeleton, Text, Heading, useToast } from "native-base";

import { useAuth } from "@contexts/AuthContext";
import { useForm, Controller } from "react-hook-form";
import * as yup from 'yup'
import { yupResolver } from "@hookform/resolvers/yup";

import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system';

import defaultUserPhotoImg from '@assets/userPhotoDefault.png'

import { ScreenHeader } from "@components/ScreenHeader";
import { UserPhoto } from "@components/UserPhoto";
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { AppError } from "@utils/App-error";
import { api } from "@services/api";

const PHOTO_SIZE = 33

interface FormDataProps {
  name: string
  email: string
  old_password: string
  password: string
  password_confirm: string
}

const schema = yup.object({
  name: yup.string().required('Nome obrigatório'),
  old_password: yup.string().min(6, 'Mínimo 6 digitos.').nullable().transform((value) => !!value ? value : null),
  password: yup
    .string()
    .min(6, 'Mínimo 6 digitos.')
    .nullable()
    .transform((value) => !!value ? value : null)
    .when('old_password', {
      is: (field: any) => field,
      then: (schema) =>
        schema
          .nullable()
          .required('Informe a confirmação da senha.')
          .transform((value) => !!value ? value : null),
    }),
  password_confirm: yup
    .string()
    .nullable()
    .transform((value) => !!value ? value : null)
    .oneOf([yup.ref('password')], 'A confirmação de senha não confere.')
    .when('password', {
      is: (nova_senha: any) => nova_senha,
      then: (schema) =>
        schema
          .nullable()
          .transform((value) => !!value ? value : null)
          .required('Informe a confirmação da senha.')
    })
})

export function Profile() {

  const toast = useToast()
  const { user, updateUserProfile } = useAuth()
  const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
    defaultValues: {
      name: user.name,
      email: user.email
    },
    resolver: yupResolver(schema)
  })

  const [photoIsLoading, setPhotoIsLoading] = useState(false)
  const [updating, setUpdating] = useState(false)
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

        const fileExtension = photoSelected.assets[0].uri.split('.').pop()
        const fileName = user.name.replace(/\s/g, "")

        const photoFile = {
          name: `${fileName}.${fileExtension}`.toLocaleLowerCase(),
          uri: photoSelected.assets[0].uri,
          type: `${photoSelected.assets[0].type}/${fileExtension}`
        } as any

        const userPhotoUploadForm = new FormData()
        userPhotoUploadForm.append('avatar', photoFile)

        const avatarUpdatedResponse = await api.patch('/users/avatar', userPhotoUploadForm, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })

        const userUpdated = user
        userUpdated.avatar = avatarUpdatedResponse.data.avatar

        updateUserProfile(userUpdated)


        toast.show({
          title: 'Foto atualizada com sucesso.',
          placement: 'top',
          bgColor: 'green.700'
        })
        // setUserPhoto(photoSelected.assets[0].uri)
      }

    } catch (error) {
      console.log(error)
    } finally {
      setPhotoIsLoading(false)
    }
  }



  async function handleProfileUpdate(data: FormDataProps) {
    try {
      setUpdating(true)
      const userUpdated = user
      userUpdated.name = data.name

      await api.put('/users', data)
      await updateUserProfile(userUpdated)


      toast.show({
        title: 'Perfil atualizado com sucesso.',
        placement: 'top',
        bgColor: 'green.700'
      })


    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError ? error.message : 'Não foi possível atualizar o perfil. Tente de novo mais tarde.'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      })
    } finally {
      setUpdating(false)
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
                source={
                  user.avatar ?
                    { uri: `${api.defaults.baseURL}/avatar/${user.avatar}` } :
                    defaultUserPhotoImg
                }
                alt="Foto de perfil"
                size={33}
              />
          }

          <TouchableOpacity onPress={handleUserPhotoSelect}>
            <Text color='green.500' fontWeight='bold' fontSize='md' mt={2} mb={8}>
              Alterar foto
            </Text>
          </TouchableOpacity>

          <Controller
            name="name"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Input
                bg='gray.600'
                value={value}
                onChangeText={onChange}
                errorMessage={errors.name?.message}
              />
            )}
          />

          <Controller
            name="email"
            control={control}
            render={({ field: { value } }) => (
              <Input
                bg='gray.600'
                value={value}
                isDisabled
              />
            )}
          />



          <Heading color='gray.200' fontSize='md' mb={2} mt={12} alignSelf='flex-start' fontFamily='heading'>
            Alterar senha
          </Heading>
          <Controller
            name="old_password"
            control={control}
            render={({ field: { onChange } }) => (
              <Input
                bg='gray.600'
                placeholder="Senha atual"
                onChangeText={onChange}
                secureTextEntry
                errorMessage={errors.old_password?.message}
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            render={({ field: { onChange } }) => (
              <Input
                bg='gray.600'
                placeholder="Nova senha"
                onChangeText={onChange}
                secureTextEntry
                errorMessage={errors.password?.message}
              />
            )}
          />
          <Controller
            name="password_confirm"
            control={control}
            render={({ field: { onChange } }) => (
              <Input
                bg='gray.600'
                placeholder="Confirmar nova senha"
                onChangeText={onChange}
                secureTextEntry
                errorMessage={errors.password_confirm?.message}
              />
            )}
          />

          <Button
            title="Atualizar"
            mt={4}
            onPress={handleSubmit(handleProfileUpdate)}
            isLoading={updating}
          />
        </Center>
      </ScrollView>
    </VStack>
  )
}