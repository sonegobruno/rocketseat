import React, {useState} from 'react';
import { View, Image, Text, ImageBackground, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { RectButton} from 'react-native-gesture-handler';

import {Feather} from '@expo/vector-icons';
import styles from './styles';

import { useNavigation } from '@react-navigation/native'; 

const Home = () => {
    const navigation = useNavigation();

    const [uf, setUf] = useState('');
    const [city, setCity] = useState('');

    function handleNavigationToPoints() {
        navigation.navigate('Points', {
            uf, 
            city,
        });
    }

    return (
        <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ImageBackground 
                source={require('../../assets/home-background.png')} 
                style={styles.container}
                resizeMode="contain"
                imageStyle={{width: 274, height: 368}}
            >
                <View style={styles.main}>
                    <Image source={require('../../assets/logo.png')}/>
                    <View>
                        <Text style={styles.title}>Seu Marketplace para coleta de residuos</Text>
                        <Text style={styles.description}>Ajudamos pessoas a encontrar pontos de coleta de forma eficiente</Text>
                    </View>
                </View>

                <View style={styles.footer}>
                    <TextInput 
                        style={styles.input}
                        placeholder="Digite a UF"
                        value={uf}
                        maxLength={2}
                        autoCorrect={false}
                        autoCapitalize="characters"
                        onChangeText={setUf}
                    >

                    </TextInput>
                    <TextInput
                        style={styles.input}
                        placeholder="Digite a cidade"
                        value={city}
                        autoCorrect={false}
                        onChangeText={setCity}
                    >

                    </TextInput>
                    <RectButton 
                        style={styles.button}
                        onPress={handleNavigationToPoints}
                    >
                        <View style={styles.buttonIcon}>
                            <Feather name="arrow-right" color="#FFF" size={24}/>
                        </View>
                        <Text style={styles.buttonText}>Entrar</Text>
                    </RectButton>
                </View>

            </ImageBackground>
        </KeyboardAvoidingView>
    );
}

export default Home;