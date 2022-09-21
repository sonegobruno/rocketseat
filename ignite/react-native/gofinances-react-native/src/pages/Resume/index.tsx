import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useCallback, useEffect, useState } from 'react';
import { HistoryCard } from '../../components/HistoryCard';
import { categories } from '../../utils/categories';
import { currencyFormat } from '../../utils/currencyFormat';
import { DataListProps } from '../Dashboard';
import { VictoryPie } from 'victory-native';
import { useTheme } from 'styled-components';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { addMonths, subMonths, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { 
    Container,
    Header,
    Title,
    Content,
    ChartContainer,
    MonthSelect,
    MonthSelectButton,
    MonthSelectIcon,
    Month,
    LoadContainer
} from './styles';
import { RFValue } from 'react-native-responsive-fontsize';
import { ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../hooks/auth';

interface CategoryData {
    key: string;
    name: string;
    total: number;
    totalFormatted: string;
    color: string;
    percent: number;
    percentFormatted: string;
}

export function Resume() {
    const theme = useTheme();
    const { user } = useAuth();
    const dataKey = `@gofinances:transactions_user:${user.id}`;
    const [ isLoading, setisLoading ] = useState(false);
    const [ totalByCategories, setTotalByCategories ] = useState<CategoryData[]>([])
    const [ selectedDate, setSelectedData ] = useState(new Date());

    function handleDateChange(action: 'next' | 'prev') {
        if(action === 'next') {
            const newDate = addMonths(selectedDate, 1);
            setSelectedData(newDate);
        } else {
            const newDate = subMonths(selectedDate, 1);
            setSelectedData(newDate);
        }
    }

    async function loadData() {
        setisLoading(true);

        const response = await AsyncStorage.getItem(dataKey);
        const responseFormatted = !!response ? JSON.parse(response) : [];

        const expensives = responseFormatted.filter((item: DataListProps) => 
            item.type === 'negative' &&
            new Date(item.date).getMonth() === selectedDate.getMonth() && 
            new Date(item.date).getFullYear() === selectedDate.getFullYear()
        );

        const expensivesTotal = expensives.reduce((acc: number, item: DataListProps) => {
            return acc + Number(item.amount);
        }, 0);

        const totalByCategory: CategoryData[] = [];

        categories.forEach((category) => {
            let categorySum = 0;

            expensives.forEach((expensive: DataListProps) => {
                if(expensive.category === category.key) {
                    categorySum += Number(expensive.amount);
                }
            });

            if(categorySum > 0) {
                totalByCategory.push({
                    ...category,
                    name: category.name,
                    total: categorySum,
                    totalFormatted: currencyFormat(String(categorySum)),
                    percent: (categorySum / expensivesTotal * 100),
                    percentFormatted: (categorySum / expensivesTotal * 100).toFixed(0) + '%',
                })
            }
        });
        setTotalByCategories(totalByCategory);
        setisLoading(false);
    }

    useFocusEffect(useCallback(() => {
        loadData();
    },[selectedDate]))

    return (
        <Container>
            
                <Header>
                    <Title>Resumo</Title>
                </Header>
            {isLoading ? 
                <LoadContainer>
                    <ActivityIndicator color={theme.colors.primary} size="large"/>
                </LoadContainer> :
                <Content
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ 
                        paddingHorizontal: 24,
                        paddingBottom: useBottomTabBarHeight() 
                    }}
                >
                    <MonthSelect>
                        <MonthSelectButton onPress={() => {handleDateChange('prev')}}>
                            <MonthSelectIcon name="chevron-left"/>
                        </MonthSelectButton>

                        <Month>{format(selectedDate, 'MMMM, yyyy', { locale: ptBR })}</Month>

                        <MonthSelectButton onPress={() => {handleDateChange('next')}}>
                            <MonthSelectIcon name="chevron-right"/>
                        </MonthSelectButton>
                    </MonthSelect>
                    <ChartContainer>
                        <VictoryPie 
                            data={totalByCategories}
                            colorScale={totalByCategories.map(category => category.color)}
                            style={{
                                labels: { 
                                    fontSize: RFValue(18),
                                    fontWeight: 'bold',
                                    fill: theme.colors.shape
                                }
                            }}
                            labelRadius={50}
                            x="percentFormatted"
                            y="total"
                        />
                    </ChartContainer>
                    {totalByCategories.map(item => (
                        <HistoryCard key={item.key} title={item.name} amount={item.totalFormatted} color={item.color}/>
                    ))}
                </Content>
            }
        </Container>
    )
}