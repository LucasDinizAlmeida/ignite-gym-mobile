import { Image, VStack, Text, Center, Heading, ScrollView, useToast } from "native-base";

import BackgroundImage from '@assets/background.png'
import LogoSvg from '@assets/logo.svg'
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { useNavigation } from "@react-navigation/native";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { api } from "@services/api";
import axios from 'axios'
import { Alert } from "react-native";
import { AppError } from "@utils/App-error";
import { useState } from "react";
import { useAuth } from "@contexts/AuthContext";

interface FormDataProps {
  name: string
  email: string
  password: string
  password_confirm: string

}

const schema = yup.object({
  name: yup.string().required('Nome obrigatório.'),
  email: yup.string().required('E-mail obrigatório.').email('Email inválido.'),
  password: yup.string().required('Senha obrigatória.').min(6, 'A senha deve ter no mínimo 6 dígitos.'),
  password_confirm: yup.string().required('Confirme a senha.').oneOf([yup.ref('password')], 'A senha de confirmação não confere.')
})

export function SignUp() {

  const toast = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const { signIn } = useAuth()

  const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
    resolver: yupResolver(schema)
  })
  const navigation = useNavigation()

  function handleGoBack() {
    navigation.goBack()
  }

  async function handleSignUp({ email, name, password, password_confirm }: FormDataProps) {
    try {
      setIsLoading(true)

      await api.post('/users', { email, name, password })
      await signIn(email, password)

    } catch (error) {

      setIsLoading(false)

      const isAppError = error instanceof AppError
      const title = isAppError ? error.message : 'Não foi possível criar a conta. Tente novamente mais tarde.'
      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      })

    }
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
      <VStack flex={1} px={10} pb={16}>
        <Image
          source={BackgroundImage}
          alt="people training"
          resizeMode="contain"
          position="absolute"
        />

        <Center my={24}>
          <LogoSvg />

          <Text color='gray.100' fontSize='sm'>
            Treine sua mente e o seu corpo
          </Text>
        </Center>

        <Center>
          <Heading color='gray.100' fontSize='xl' fontFamily='heading' my={8}>
            Crie sua conta
          </Heading>

          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Nome"
                value={value}
                onChangeText={onChange}
                errorMessage={errors.name?.message}
              />
            )}
          />



          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="E-mail"
                keyboardType="email-address"
                autoCapitalize="none"
                value={value}
                onChangeText={onChange}
                errorMessage={errors.email?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Senha"
                secureTextEntry
                value={value}
                onChangeText={onChange}
                errorMessage={errors.password?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password_confirm"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Confirme a senha"
                secureTextEntry
                value={value}
                onChangeText={onChange}
                onSubmitEditing={handleSubmit(handleSignUp)}
                returnKeyType="send"
                errorMessage={errors.password_confirm?.message}
              />
            )}
          />


          <Button
            title="Criar e acessar"
            onPress={handleSubmit(handleSignUp)}
            isLoading={isLoading}
          />
        </Center>

        <Center mt={12}>
          <Button
            title="Voltar para o login"
            variant='outline'
            onPress={handleGoBack}
          />
        </Center>

      </VStack>
    </ScrollView>
  )
}