import React, { useCallback, useRef, ChangeEvent } from 'react';

import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import getValidationErrors from '../../utils/getValidationErrors';
import { useHistory, Link } from 'react-router-dom';
import api from '../../services/api';

import { Container, Content, AvatarInput } from './styles';
import { FiMail, FiUser, FiLock, FiCamera, FiArrowLeft } from 'react-icons/fi';

import { useToast } from '../../hooks/ToastContext';

import Input from '../../components/Input';
import Button from '../../components/Button';
import { useAuth } from '../../hooks/AuthContext';

interface IProfileFormData {
    name: string;
    email: string;
    password: string;
    oldPassword: string;
    password_confirmation: string;
}

const Profile: React.FC = () => {
    const formRef = useRef<FormHandles>(null);
    const { addToast } = useToast();
    const history = useHistory();
    const { user, updateUser } = useAuth();

    const handleSubmit = useCallback(async (data: IProfileFormData) => {
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
        
            history.push('/dashboard');

            addToast({
                type: 'success',
                title: 'Perfil atualizado!',
                description: 'Suas informações do perfil foram atualizadas com sucesso!'
            })
        } catch (err) {
            if(err instanceof Yup.ValidationError) {
                const errors = getValidationErrors(err);
    
                formRef.current?.setErrors(errors);
                
                return;
            }

            addToast({
                type: 'error',
                title: 'Erro ao atualizar',
                description: 'Ocorreu um erro ao atualizar o perfil, tente novamente',
            });
        }
    }, [addToast, history, updateUser]);
    
    const handleAvatarChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const data = new FormData();

            data.append('avatar', event.target.files[0]);

            api.patch('users/avatar', data).then((response) => {
                updateUser(response.data);

                addToast({
                    type: 'success',
                    title: 'Avatar atualizado!'
                })
            });
        }
    },[addToast, updateUser]);

    return (
        <Container>
            <header>
                <div>
                    <Link to="/dashboard">
                        <FiArrowLeft />
                    </Link>
                </div>
            </header>
            <Content>
                    <Form 
                        ref={formRef} 
                        onSubmit={handleSubmit}
                        initialData={{
                            name: user.name,
                            email: user.email,
                        }}
                    >
                        <AvatarInput>
                            <img src={user.avatar_url} alt={user.name}/>
                            <label htmlFor="avatar">
                                <FiCamera />
                                <input type="file" id="avatar" onChange={handleAvatarChange}/>
                            </label>
                        </AvatarInput>

                        <h1>Meu perfil</h1>

                        <Input name="name" icon={FiUser} placeholder="Nome" />
                        <Input name="email" icon={FiMail} placeholder="E-mail"/>
                        <Input 
                            containerStyle={{ marginTop: 24 }}
                            name="oldPassword" 
                            icon={FiLock} 
                            type="password" 
                            placeholder="Senha atual"
                        />
                        <Input name="password" icon={FiLock} type="password" placeholder="Nova senha"/>
                        <Input name="password_confirmation" icon={FiLock} type="password" placeholder="Confirmar senha"/>

                        <Button type="submit">Confirmar mudança</Button>
                    </Form>

            </Content>
        </Container>
    );
};

export default Profile;