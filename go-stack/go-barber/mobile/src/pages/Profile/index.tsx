import React, {useRef, useCallback} from 'react';
import Icon from 'react-native-vector-icons/Feather';
import ImagePicker from 'react-native-image-picker';
import * as Yup from 'yup';

import { 
    View, 
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TextInput,
    Alert
} from 'react-native';


import { 
    Container,
    BackButton,
    Title,
    UserAvatarButton,
    UserAvatar,
} from './styles';

import { Form } from '@unform/mobile';
import { FormHandles} from '@unform/core';
import getValidationErrors from '../../utils/getValidationErrors';
import { useNavigation } from '@react-navigation/native';
import Input from '../../components/Input';
import Button from '../../components/Button';

import api from '../../services/api';

import { useAuth } from '../../hooks/Auth';

interface ProfileFormData {
    name: string;
    email: string;
    password: string;
    oldPassword: string;
    password_confirmation: string;
}

const Profile: React.FC = () => {
    const formRef = useRef<FormHandles>(null);
    const emailInputRef = useRef<TextInput>(null);
    const passwordInputRef = useRef<TextInput>(null);
    const oldPasswordInputRef = useRef<TextInput>(null);
    const confirmPasswordInputRef = useRef<TextInput>(null);
    
    const { user, updateUser } = useAuth();

    const navigation = useNavigation();

    const handleSignUp = useCallback(async (data: ProfileFormData) => {
        try {
            formRef.current?.setErrors({});

            const schema = Yup.object().shape({
                name: Yup.string().required('Nome obrigatório'),
                email: Yup.string().required('E-mail obrigatório').email('Digite um E-mail valido'),
                oldPassword: Yup.string(),
                password: Yup.string().when('oldPassword', {
                    is: val => !!val.length,
                    then: Yup.string().required('Campo obrigatorio'),
                    otherwise: Yup.string()
                }),
                password_confirmation: Yup.string()
                    .when('oldPassword', {
                        is: val => !!val.length,
                        then: Yup.string().required('Campo obrigatorio'),
                        otherwise: Yup.string()
                    })
                    .oneOf([Yup.ref('password')], 'Confirmação incorreta')
            });

            await schema.validate(data, {
                abortEarly: false,
            });

            const { name, email, oldPassword, password, password_confirmation } = data;

            const formData = Object.assign({
                name,
                email,
            }, oldPassword ? {
                oldPassword,
                password,
                password_confirmation
            }: {});

            const response = await api.put('/profile', formData);

            updateUser(response.data);

            Alert.alert('Perfil atualizado com sucesso!');

            navigation.goBack();

        } catch (err) {
            if(err instanceof Yup.ValidationError) {
                const errors = getValidationErrors(err);
    
                formRef.current?.setErrors(errors);
                
                return;
            }

            Alert.alert('Erro ao atualizar perfil', 'Ocorreu um erro ao atualizar seu perfil, tente novamente',
            );
        }
    }, [navigation, updateUser]);

    const handleGoBack = useCallback(() => {
        navigation.goBack();
    },[navigation]);

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
                        <BackButton onPress={handleGoBack}>
                            <Icon name="chevron-left" size={24} color="#999591" />
                        </BackButton>

                        <UserAvatarButton onPress={() => {}}>
                            <UserAvatar source={{ uri: user.avatar_url }}/>
                        </UserAvatarButton>
                        <View>
                            <Title>Meu perfil</Title>
                        </View>

                        <Form initialData={ { name: user.name, email: user.email} } onSubmit={handleSignUp} ref={formRef}>
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
                                    oldPasswordInputRef.current?.focus()
                                }
                           />
                            <Input 
                                ref={oldPasswordInputRef}
                                name="oldPassword" 
                                placeholder="Senha atual" 
                                icon="lock" 
                                secureTextEntry
                                textContentType="newPassword"
                                returnKeyType="next"
                                containerStyle={{ marginTop: 16 }}
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
                                returnKeyType="next"
                                onSubmitEditing={() => 
                                    confirmPasswordInputRef.current?.focus()
                                }
                            />

                            <Input 
                                ref={confirmPasswordInputRef}
                                name="password_confirmation" 
                                placeholder="Confirmar Senha" 
                                icon="lock" 
                                secureTextEntry
                                textContentType="newPassword"
                                returnKeyType="send"
                                onSubmitEditing={() => 
                                    formRef.current?.submitForm()
                                }
                            />

                            <Button onPress={() => formRef.current?.submitForm()}>Confirmar mudanças</Button>
                        </Form>
                    </Container>
                </ScrollView>    
            </KeyboardAvoidingView>
        </>    
    );
}

export default Profile;