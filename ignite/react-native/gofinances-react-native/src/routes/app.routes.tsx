import React from 'react'
import { useTheme } from 'styled-components';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const { Navigator, Screen } = createBottomTabNavigator();

import { Dashboard } from '../pages/Dashboard';
import { Register} from '../pages/Register';
import { MaterialIcons } from '@expo/vector-icons'
import { Platform } from 'react-native';
import { Resume } from '../pages/Resume';

export function AppRoutes() {
    const theme = useTheme();

    return (
        <Navigator
            tabBarOptions={{
                activeTintColor: theme.colors.secondary,
                inactiveTintColor: theme.colors.text,
                labelPosition: 'beside-icon',
                style: {
                    paddingVertical: Platform.OS === 'ios' ? 20 : 0,
                    height: 88,
                }
            }}
        >
            <Screen 
                name="Listagem"
                component={Dashboard}
                options={{
                    tabBarIcon:(({size, color}) => (
                        <MaterialIcons 
                            name="format-list-bulleted"
                            size={size}
                            color={color}
                        />
                    ))
                }}
            />

            <Screen 
                name="Cadastrar"
                component={Register}
                options={{
                    tabBarIcon:(({size, color}) => (
                        <MaterialIcons 
                            name="attach-money"
                            size={size}
                            color={color}
                        />
                    ))
                }}
            />

            <Screen 
                name="Resumo"
                component={Resume}
                options={{
                    tabBarIcon:(({size, color}) => (
                        <MaterialIcons 
                            name="pie-chart"
                            size={size}
                            color={color}
                        />
                    ))
                }}
            />
        </Navigator>
    );
}