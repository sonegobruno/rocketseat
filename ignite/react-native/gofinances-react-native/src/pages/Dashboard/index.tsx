import React, { useCallback,useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useTheme } from '@react-navigation/native';
import { ActivityIndicator } from 'react-native'
import { HighlightCard } from '../../components/HighlightCard';
import { TransactionCard, TransactionCardData } from '../../components/TransactionCard';
import { currencyFormat } from '../../utils/currencyFormat';
import { dateFormat } from '../../utils/dateFormat';

import { 
    Container,
    Header,
    UserWrapper,
    UserInfo,
    Photo,
    User,
    UserGreeting,
    UserName,
    Icon,
    HighlightCards,
    Transactions,
    Title,
    TransactionList,
    LogoutButton,
    LoadContainer
} from './styles';
import { useAuth } from '../../hooks/auth';

export interface DataListProps extends TransactionCardData {
    id: string;
}

interface HighLightProps {
    amount: string;
    lastTransaction: string;
}

interface HighLightData {
    entries: HighLightProps;
    expensive: HighLightProps;
    total: HighLightProps;
}


export function Dashboard() {
    const theme = useTheme();
    const { signOut } = useAuth();
    const { user } = useAuth();
    const dataKey = `@gofinances:transactions_user:${user.id}`;

    const [ transactions, setTransactions ] = useState<DataListProps[]>([]);
    const [ isLoading, setIsLoading ] = useState(true);
    const [ highLightData, setHighLightData ] = useState<HighLightData>({} as HighLightData);

    function getLastTransactionDate(collection: DataListProps[], type: 'positive' | 'negative') {
        const collectionFilttered = collection.filter((item) => item.type === type);

        if(collectionFilttered.length === 0) {
            return 0;
        }

        const lastTransaction = new Date(Math.max.apply(Math, collectionFilttered
            .map((item) => new Date(item.date).getTime())
        ));

        return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString('pt-BR', { month: 'long' })}`;
    }
    
    async function loadData() {
        const response = await AsyncStorage.getItem(dataKey);
        const data = !!response ? JSON.parse(response) : [];

        let entriesTotal = 0;
        let expensiveTotal = 0;
        
        const transactionsFormated: DataListProps[] = data.map((item: DataListProps) => {

            if(item.type === 'positive') {
                entriesTotal += Number(item.amount);
            } else {
                expensiveTotal += Number(item.amount);
            }

            return {
                  ...item,
                amount: currencyFormat(item.amount),
                date: dateFormat(item.date)
                }
            
        });

        
        const total = entriesTotal - expensiveTotal;

        const lastTransactionEntries = getLastTransactionDate(data, 'positive');
        const lastTransactionExpensive = getLastTransactionDate(data, 'negative');
        const totalInterval = lastTransactionExpensive === 0
            ? 'Não há transações'
            : `01 a ${lastTransactionExpensive}`;
        


        setHighLightData({
            entries: {
                amount: currencyFormat(String(entriesTotal)),
                lastTransaction: lastTransactionEntries === 0 
                ? 'Não há transações'
                :`Última entrada dia ${lastTransactionEntries}`
            },
            expensive: {
                amount: currencyFormat(String(expensiveTotal)),
                lastTransaction: lastTransactionEntries === 0
                ? 'Não há transações'
                :`Última saída dia ${lastTransactionExpensive}`
            },
            total: {
                amount: currencyFormat(String(total)),
                lastTransaction: totalInterval
            }
        });

        setTransactions(transactionsFormated);
        setIsLoading(false);
    }

    useEffect(() => {
        loadData();
    },[])

    useFocusEffect(useCallback(() => {
        loadData();
    },[]))

    return (
        <Container>

            { isLoading ? 
                <LoadContainer>
                    <ActivityIndicator color={theme.colors.primary} size="large"/>
                </LoadContainer> :
                <>
                    <Header>
                    <UserWrapper>
                        <UserInfo>
                            <Photo source={{ uri: user.photo}} />
                            <User>
                                <UserGreeting>Olá,</UserGreeting>
                                <UserName>{user.name}</UserName>
                            </User>
                        </UserInfo>

                        <LogoutButton onPress={signOut}>
                            <Icon name="power"/>
                        </LogoutButton>
                    </UserWrapper>
                    </Header>
                    <HighlightCards>
                        <HighlightCard type="up" title="Entradas" amount={highLightData.entries.amount} lastTransaction={highLightData.entries.lastTransaction}/>
                        <HighlightCard type="down" title="Saídas" amount={highLightData.expensive.amount} lastTransaction={highLightData.expensive.lastTransaction}/>
                        <HighlightCard type="total" title="Total" amount={highLightData.total.amount} lastTransaction={highLightData.total.lastTransaction}/>
                    </HighlightCards>
                    
                    <Transactions>
                        <Title>Listagem</Title>

                        <TransactionList 
                            data={transactions}
                            keyExtractor={item => item.id}
                            renderItem={({item}) => <TransactionCard data={item} />}
                        />
                    </Transactions>
                </>
            }
            
        </Container>
    )
}