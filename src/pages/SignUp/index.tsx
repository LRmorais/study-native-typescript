import React, {useRef, useCallback} from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {Form} from '@unform/mobile';
import {FormHandles} from '@unform/core';
import * as Yup from 'yup';
import api from '../../services/api';

import getValidationErrors from '../../utils/getValidationErrors';

import Input from '../../components/Input';
import Button from '../../components/Button';
import logoImg from '../../assets/logo.png';

import {Container, Title, BackToSignIn, BackToSignInText} from './styles';

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
}

const SignUp: React.FC = () => {
  // referencia o click do botão ao onSubmite do form
  const formRef = useRef<FormHandles>(null);
  // hook para navegação entre stacks
  const navigation = useNavigation();

  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);

  const handleSignUp = useCallback(
    async (data: SignUpFormData) => {
      try {
        // zera os erros no final
        formRef.current?.setErrors({});
        //  tipo.obrigatoriedade('mensagem de erro')
        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigátorio'),
          email: Yup.string()
            .required('E-mail obrigátorio')
            .email('Digite um e-mail válido'),
          password: Yup.string()
            .required('Senha obrigátoria')
            .min(6, 'Senha no mínimo 6 digitos'),
        });

        await schema.validate(data, {
          // retorna todos os erros de uma vez só
          abortEarly: false,
        });

        await api.post('/users', data);
        console.log(data);
        Alert.alert(
          'Cadastro realizado com sucesso!',
          'Você já pode fazer login na aplicação.',
        );
        navigation.goBack();
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);
          return;
        }
        Alert.alert(
          'Erro no cadastro',
          'Ocorreu um erro ao fazer cadastro, tente novamente',
        );
      }
    },
    [navigation],
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

            <Title>Crie sua conta</Title>
            <Form onSubmit={handleSignUp} ref={formRef}>
              <Input
                autoCapitalize="words" //caixa alta na primeira letra
                name="name"
                icon="person"
                placeholder="Nome"
                returnKeyType="next"
                onSubmitEditing={() => {
                  emailInputRef.current?.focus();
                }}
              />

              <Input
                ref={emailInputRef}
                keyboardType="email-address"
                autoCorrect={false}
                autoCapitalize="none"
                name="email"
                icon="mail"
                placeholder="E-mail"
                returnKeyType="next"
                onSubmitEditing={() => {
                  passwordInputRef.current?.focus();
                }}
              />

              <Input
                ref={passwordInputRef}
                secureTextEntry
                name="password"
                icon="key"
                placeholder="Senha"
                textContentType="newPassword"
                returnKeyType="send"
                onSubmitEditing={() => {
                  formRef.current?.submitForm();
                }}
              />

              <Button
                onPress={() => {
                  formRef.current?.submitForm();
                }}>
                Cadastrar
              </Button>
            </Form>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>

      <BackToSignIn onPress={() => navigation.navigate('SignIn')}>
        <Icon name="arrow-back" size={20} color="#fff" />
        <BackToSignInText>Voltar para logon</BackToSignInText>
      </BackToSignIn>
    </>
  );
};

export default SignUp;
