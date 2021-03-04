import React from 'react';
import {Image, KeyboardAvoidingView, Platform, ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import Input from '../../components/Input';
import Button from '../../components/Button';

import {Container, Title, BackToSignIn, BackToSignInText} from './styles';

import logoImg from '../../assets/logo.png';

const SignUp: React.FC = () => {
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

            <Input name="name" icon="person" placeholder="Nome" />

            <Input name="email" icon="mail" placeholder="E-mail" />

            <Input name="password" icon="key" placeholder="Senha" />

            <Button
              onPress={() => {
                console.log('Tudo ok');
              }}>
              Cadastrar
            </Button>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>

      <BackToSignIn>
        <Icon name="arrow-back" size={20} color="#fff" />
        <BackToSignInText>Voltar para logon</BackToSignInText>
      </BackToSignIn>
    </>
  );
};

export default SignUp;
