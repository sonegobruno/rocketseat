import React, { useCallback, useRef } from 'react';

import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import getValidationErrors from '../../utils/getValidationErrors';
import { Link, useHistory } from 'react-router-dom';
import api from '../../services/api';

import { Container, Content, Background, AnimationContainer } from './styles';
import { FiArrowLeft, FiMail, FiUser, FiLock } from 'react-icons/fi';

import logo from '../../assets/logo.svg';

import { useToast } from '../../hooks/ToastContext';

import Input from '../../components/Input';
import Button from '../../components/Button';

interface SingUpFormData {
    name: string;
    email: string;
    password: string;
}

const SignUp: React.FC = () => {
    const formRef = useRef<FormHandles>(null);
    const { addToast } = useToast();
    const history = useHistory();

    const handleSubmit = useCallback(async (data: SingUpFormData) => {
        try {
            formRef.current?.setErrors({});

            const schema = Yup.object().shape({
                name: Yup.string().required('Nome obrigatório'),
                email: Yup.string().required('E-mail obrigatório').email('Digite um E-mail valido'),
                password: Yup.string().min(6, 'No minimo 6 digitos'),
            });

            await schema.validate(data, {
                abortEarly: false,
            });

            await api.post('/users', data);
        
            history.push('/');

            addToast({
                type: 'success',
                title: 'Cadastro realizado com sucesso',
                description: 'Voce ja pode fazer seu logon no GoBarber'
            })
        } catch (err) {
            if(err instanceof Yup.ValidationError) {
                const errors = getValidationErrors(err);
    
                formRef.current?.setErrors(errors);
                
                return;
            }

            addToast({
                type: 'error',
                title: 'Erro ao fazer cadastro',
                description: 'Ocorreu um erro ao fazer cadastro, tente novamente',
            });
        }
    }, [addToast, history]);
    
    return (
        <Container>
            <Background />
            <Content>
                <AnimationContainer>
                    <img src={logo} alt="GoBarber"/>

                    <Form ref={formRef} onSubmit={handleSubmit}>
                        <h1>Faça seu cadastro</h1>

                        <Input name="name" icon={FiUser} placeholder="Nome" />
                        <Input name="email" icon={FiMail} placeholder="E-mail"/>
                        <Input name="password" icon={FiLock} type="password"placeholder="Senha"/>

                        <Button type="submit">Cadastrar</Button>
                    </Form>

                    <Link to="/">
                        <FiArrowLeft />
                        Voltar para logon
                    </Link>
                </AnimationContainer>
            </Content>
        </Container>
    );
};

export default SignUp;