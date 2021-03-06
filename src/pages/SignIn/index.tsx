import React, {useCallback, useRef} from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import * as Yup from 'yup';

import {Form} from '@unform/mobile';
import {FormHandles} from '@unform/core';

import {useAuth} from '../../hooks/auth';

import getValidationErrors from '../../utils/getValidationErrors';

import Input from '../../components/Input';
import Button from '../../components/Button';

import logoImg from '../../assets/logo.png';
import {
  Container,
  Title,
  ForgotPassword,
  ForgotPasswordText,
  CreateAccountButton,
  CreateAccountButtonText,
} from './styles';

interface SignInFormData {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  // referencia o click do botão ao onSubmite do form
  const formRef = useRef<FormHandles>(null);
  const passwordInputRef = useRef<TextInput>(null);
  // hook para navegação entre stacks
  const navigation = useNavigation();

  const {signIn} = useAuth();

  const handleSignIn = useCallback(
    async (data: SignInFormData) => {
      try {
        // zera os erros no final
        formRef.current?.setErrors({});
        //  tipo.obrigatoriedade('mensagem de erro')
        const schema = Yup.object().shape({
          email: Yup.string()
            .required('E-mail obrigátorio')
            .email('Digite um e-mail válido'),
          password: Yup.string().required('Senha obrigátoria'),
        });

        await schema.validate(data, {
          // retorna todos os erros de uma vez só
          abortEarly: false,
        });

        await signIn({...data});
        // navigation.navigate('Dashboard');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          console.log(errors);
          formRef.current?.setErrors(errors);
          return;
        }

        Alert.alert(
          'Erro na autenticação',
          'Ocorreu um erro ao fazer login, cheque as credenciais',
        );
      }
    },
    [signIn],
  );

  return (
    <>
      {/* evitar que o teclado no ios, cubra os campos */}
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled>
        <ScrollView
          contentContainerStyle={{flex: 1}}
          keyboardShouldPersistTaps="handled">
          <Container>
            <Image source={logoImg} />

            <Title>Faça seu logon</Title>

            <Form ref={formRef} onSubmit={handleSignIn}>
              <Input
                autoCorrect={false}
                autoCapitalize="none"
                keyboardType="email-address"
                name="email"
                icon="mail"
                placeholder="E-mail"
                returnKeyType="next"
                onSubmitEditing={() => {
                  passwordInputRef.current?.focus();
                }} // disparar um foco
              />
              <Input
                ref={passwordInputRef}
                name="password"
                icon="key"
                placeholder="Senha"
                secureTextEntry
                returnKeyType="send"
              />

              <Button
                onPress={() => {
                  formRef.current?.submitForm();
                }}>
                Entrar
              </Button>
            </Form>
            <ForgotPassword onPress={() => {}}>
              <ForgotPasswordText>Esqueci minha senha</ForgotPasswordText>
            </ForgotPassword>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>

      <CreateAccountButton onPress={() => navigation.navigate('SignUp')}>
        <Icon name="enter-outline" size={20} color="#ff9000" />
        <CreateAccountButtonText>Criar uma conta</CreateAccountButtonText>
      </CreateAccountButton>
    </>
  );
};

export default SignIn;
