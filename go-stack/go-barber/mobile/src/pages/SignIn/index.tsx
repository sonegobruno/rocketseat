import React, {useCallback, useRef} from 'react';
import { 
    View, 
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TextInput,
    Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { FormHandles} from '@unform/core';
import { 
    Container,
    Title,
    ForgotPassword,
    ForgotPasswordText,
    CreateAccountButton,
    CreateAccountButtonText,
} from './styles';
import * as Yup from 'yup';

import getValidationErrors from '../../utils/getValidationErrors';

import Input from '../../components/Input';
import Button from '../../components/Button';
import { useAuth } from '../../hooks/Auth';
import logo from '../../assets/logo.png';

interface SignInFormData {
    email: string;
    password: string;
}

const SignIn: React.FC = () => {
    const navigation = useNavigation();
    const passwordInputRef = useRef<TextInput>(null);
    const formRef = useRef<FormHandles>(null);
    const { signIn, user } = useAuth();

    const handleSubmit = useCallback(async (data: SignInFormData) => {
        try {
            formRef.current?.setErrors({});

            const schema = Yup.object().shape({
                email: Yup.string().required('E-mail obrigatório').email('Digite um E-mail valido'),
                password: Yup.string().required('Digite uma senha valida'),
            });

            await schema.validate(data, {
                abortEarly: false,
            });

            await signIn({
                email: data.email,
                password: data.password
            });
        } catch (err) {
            if(err instanceof Yup.ValidationError) {
                const errors = getValidationErrors(err);
    
                formRef.current?.setErrors(errors);
                
                return;
            }

            Alert.alert('Erro na autenticação', 'Ocorreu um erro ao fazer login, cheque as credenciais',
            );
        }
    }, [signIn]); 

    return(
        <>
            <KeyboardAvoidingView 
                style={{flex: 1}}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                enabled
            > 
                <ScrollView
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{flex: 1}}
                >
                    <Container>
                        <Image source={logo}/>

                        <View>
                            <Title>Faça seu logon</Title>
                        </View>

                        <Form onSubmit={handleSubmit} ref={formRef}>
                            <Input 
                                name="email" 
                                placeholder="E-mail" 
                                icon="mail"
                                autoCorrect={false}
                                autoCapitalize="none"
                                keyboardType="email-address"
                                returnKeyType="next"
                                onSubmitEditing={() => {
                                    passwordInputRef.current?.focus();
                                }}
                            />
                            <Input 
                                name="password" 
                                placeholder="Senha" 
                                icon="lock" 
                                secureTextEntry
                                returnKeyType="send"
                                onSubmitEditing={() => formRef.current?.submitForm()}
                                ref={passwordInputRef}
                            />

                            <Button onPress={() =>{formRef.current?.submitForm()}}>Entrar</Button>
                        </Form>
                        <ForgotPassword onPress={() => {}}>
                            <ForgotPasswordText>Esqueci minha senha</ForgotPasswordText>
                        </ForgotPassword>
                    </Container>
                </ScrollView>    
            </KeyboardAvoidingView>

            <CreateAccountButton onPress={() => navigation.navigate('SignUp')}>
                <Icon  name="log-in" size={20} color="#ff9000"/>
                <CreateAccountButtonText>Crie uma conta</CreateAccountButtonText>
            </CreateAccountButton>
        </>    
    );
}

export default SignIn;