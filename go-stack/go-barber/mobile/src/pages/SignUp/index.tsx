import React, {useRef, useCallback} from 'react';
import { 
    View, 
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TextInput,
    Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import * as Yup from 'yup';
import { 
    Container,
    Title,
    BackToSignIn,
    BackToSignInText,
} from './styles';
import { Form } from '@unform/mobile';
import { FormHandles} from '@unform/core';
import getValidationErrors from '../../utils/getValidationErrors';
import { useNavigation } from '@react-navigation/native';
import Input from '../../components/Input';
import Button from '../../components/Button';
import api from '../../services/api';
import logo from '../../assets/logo.png';

interface SingUpFormData {
    name: string;
    email: string;
    password: string;
}

const SignUp: React.FC = () => {
    const formRef = useRef<FormHandles>(null);
    const emailInputRef = useRef<TextInput>(null);
    const passwordInputRef = useRef<TextInput>(null);

    const navigation = useNavigation();

    const handleSignUp = useCallback(async (data: SingUpFormData) => {
        try {
            formRef.current?.setErrors({});

            const schema = Yup.object().shape({
                name: Yup.string().required('Nome obrigatório'),
                email: Yup.string().required('E-mail obrigatório').email('Digite um E-mail valido'),
                password: Yup.string().required().min(6, 'No minimo 6 digitos'),
            });

            await schema.validate(data, {
                abortEarly: false,
            });

            await api.post('/users', data);

            Alert.alert('Cadastro realizado com sucesso', 'Voce ja pode realizar login na aplicação!');
            navigation.goBack();

        } catch (err) {
            if(err instanceof Yup.ValidationError) {
                const errors = getValidationErrors(err);
    
                formRef.current?.setErrors(errors);
                
                return;
            }

            Alert.alert('Erro ao cadastrar', 'Ocorreu um erro ao fazer cadastro, tente novamente',
            );
        }
    }, [navigation]);

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
                            <Title>Crie sua conta</Title>
                        </View>

                        <Form onSubmit={handleSignUp} ref={formRef}>
                            <Input 
                                name="name" 
                                placeholder="Nome" 
                                icon="user" 
                                autoCapitalize="words"
                                returnKeyType="next"
                                onSubmitEditing={() => 
                                    emailInputRef.current?.focus()
                                }
                            />
                            <Input 
                                ref={emailInputRef}
                                name="email" 
                                placeholder="E-mail" 
                                icon="mail"
                                keyboardType="email-address"
                                autoCorrect={false}
                                autoCapitalize="none"
                                returnKeyType="next"
                                onSubmitEditing={() => 
                                    passwordInputRef.current?.focus()
                                }
                           />
                            <Input 
                                ref={passwordInputRef}
                                name="password" 
                                placeholder="Senha" 
                                icon="lock" 
                                secureTextEntry
                                textContentType="newPassword"
                                returnKeyType="send"
                                onSubmitEditing={() => 
                                    formRef.current?.submitForm()
                                }
                            />

                            <Button onPress={() => formRef.current?.submitForm()}>Entrar</Button>
                        </Form>
                    </Container>
                </ScrollView>    
            </KeyboardAvoidingView>

            <BackToSignIn onPress={() => navigation.navigate("SignIn")}>
                <Icon  name="arrow-left" size={20} color="#fff"/>
                <BackToSignInText>Voltar para logon</BackToSignInText>
            </BackToSignIn>
        </>    
    );
}

export default SignUp;