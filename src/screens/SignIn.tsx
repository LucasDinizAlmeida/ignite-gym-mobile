import { Image, VStack, Text, Center, Heading, ScrollView, useToast } from "native-base";

import { useNavigation } from "@react-navigation/native";
import BackgroundImage from '@assets/background.png'
import LogoSvg from '@assets/logo.svg'
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { AuthNavigatorRoutesProps } from '@routes/auth.routes'
import { useForm, Controller } from "react-hook-form";
import { useAuth } from "@contexts/AuthContext";
import { useState } from "react";
import { AppError } from "@utils/App-error";

interface FormData {
  email: string
  password: string
}

export function SignIn() {

  const { signIn } = useAuth()
  const toast = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>()

  const navigation = useNavigation<AuthNavigatorRoutesProps>()

  function handleNewAccount() {
    navigation.navigate('signUp')
  }

  async function handleSignIn({ email, password }: FormData) {
    try {
      setIsLoading(true)
      await signIn(email, password)
    } catch (error) {

      const isAppError = error instanceof AppError
      const title = isAppError ? error.message : 'Não foi possível entrar. Tente novamente mais tarde.'
      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      })
      setIsLoading(false)
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
            Acesse sua conta
          </Heading>

          <Controller
            control={control}
            name="email"
            rules={{
              required: 'E-mail obrigatório!'
            }}
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
            rules={{
              required: 'Senha obrigatória!'
            }}
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



          <Button
            title="Acessar"
            onPress={handleSubmit(handleSignIn)}
            isLoading={isLoading}
          />
        </Center>

        <Center mt={24}>
          <Text color='gray.100' fontSize='sm' fontFamily='body' mb={3}>
            Ainda não tem acesso?
          </Text>
          <Button
            title="Criar conta"
            variant='outline'
            onPress={handleNewAccount}
          />
        </Center>

      </VStack>
    </ScrollView>
  )
}