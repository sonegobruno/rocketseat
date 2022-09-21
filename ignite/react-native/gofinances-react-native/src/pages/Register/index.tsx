import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import uuid from 'react-native-uuid';
import { useNavigation } from '@react-navigation/native';

import { 
    Keyboard, 
    Modal, 
    TouchableWithoutFeedback,
    Alert
 } from 'react-native';

import { 
    Container,
    Header,
    Title,
    Form,
    Fields,
    TransactionsTypes
} from './styles';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { InputForm } from '../../components/Form/InputForm';
import { Button } from '../../components/Form/Button';
import { TransactionTypeButton } from '../../components/Form/TransactionTypeButton';
import { CategorySelectButton } from '../../components/Form/CategorySelectButton';
import { CategorySelect } from '../CategorySelect';
import { useAuth } from '../../hooks/auth';

interface FormData {
    name: string;
    amount: string;
}

const schema = Yup.object().shape({
    name: Yup.string().required('Nome é obrigatório'),
    amount:  Yup.number()
                .typeError('Informe um valor numérico')
                .positive('O valor não pode ser negativo')
                .required('O valor é obrigatório')
});


export function Register() {
    const { user } = useAuth();
    const dataKey = `@gofinances:transactions_user:${user.id}`;
    const navigation = useNavigation();
    const { 
        control, 
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        resolver: yupResolver(schema)
    });

    const [ transactionType, setTransactionType ] = useState('');
    const [ category, setCategory ] = useState({
        key: 'category',
        name: 'Categoria',
    });
    const [ categoryModalOpen, setCategoryModalOpen ] = useState(false);

    function handleTransactionTypeSelect(type: 'positive' | 'negative') {
        setTransactionType(type);
    }

    function handleCloseSelectCategory() {
        setCategoryModalOpen(false);
    }

    function handleOpenSelectCategory() {
        setCategoryModalOpen(true);
    }

    async function handleRegister(form: FormData) {
        if(!transactionType) {
            return Alert.alert('Selecione o tipo da transação')
        }

        if(category.key === 'category') {
            return Alert.alert('Selecione a categoria')
        }

        const newTransaction = {
            id: String(uuid.v4()),
            name: form.name,
            amount: form.amount,
            type: transactionType,
            category: category.key,
            date: new Date()
        }

        try {
            const data = await AsyncStorage.getItem(dataKey);
            const currentData = data ? JSON.parse(data) : [];

            const dataFormatted = [
                ...currentData,
                newTransaction
            ]
            await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormatted));

            setTransactionType('');
            setCategory({
                key: 'category',
                name: 'Categoria',
            });

            reset();

            navigation.navigate('Listagem');
        } catch(err) {
            console.log(err)
            Alert.alert('Não foi possível salvar')
        }

    }

    return(
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <Container>
                <Header>
                    <Title>Cadastro</Title>
                </Header>
                <Form>
                    <Fields>
                        <InputForm 
                            placeholder="Nome" 
                            name="name" 
                            control={control} 
                            autoCapitalize="sentences"
                            autoCorrect={false}
                            error={errors.name?.message}
                        />
                        <InputForm 
                            placeholder="Preço" 
                            name="amount" 
                            control={control}
                            keyboardType="numeric"
                            error={errors.amount?.message}
                        />

                        <TransactionsTypes>
                            <TransactionTypeButton 
                                type="up" 
                                onPress={() => {handleTransactionTypeSelect('positive')}}
                                isActive={transactionType === 'positive'}
                            >Income</TransactionTypeButton>
                                
                            <TransactionTypeButton 
                                type="down" 
                                onPress={() => {handleTransactionTypeSelect('negative')}}
                                isActive={transactionType === 'negative'}
                            >Outcome</TransactionTypeButton>
                        </TransactionsTypes>

                        <CategorySelectButton onPress={handleOpenSelectCategory}>{category.name}</CategorySelectButton>
                    </Fields>

                    <Button onPress={handleSubmit(handleRegister)}>Enviar</Button>
                </Form>

                <Modal visible={categoryModalOpen}>
                    <CategorySelect 
                        category={category}
                        setCategory={setCategory}
                        closeSelectCategory={handleCloseSelectCategory}
                    />
                </Modal>
            </Container>
        </TouchableWithoutFeedback>
    )
}