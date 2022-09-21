import React, {useEffect, useState} from 'react';
import { View, TouchableOpacity, Linking, Image, Text, SafeAreaView } from'react-native';

import { useNavigation, useRoute } from '@react-navigation/native';

import { RectButton } from 'react-native-gesture-handler';

import { Feather, FontAwesome } from '@expo/vector-icons';

import styles from './styles';

import api from '../../services/api';

import * as MailComposer from 'expo-mail-composer';

interface Params {
    point_id: number
}

interface Data {
    point: {
        image: string,
        image_url: string,
        name: string,
        email: string,
        whatsapp: string,
        city: string,
        uf: string
    },
    items: {
        title: string,
    }[]
}

const Detail = () => {
    const navigation = useNavigation();
    const routes = useRoute();

    const routeParams = routes.params as Params;
    const [data, setData] = useState<Data>({} as Data);

    function handleNavigatorBack() {
        navigation.goBack();
    }

    function handleWhastApp() {
        Linking.openURL(`whatsapp://send?phone=${data.point.whatsapp}&text=-Tenho interresse sobre coleta de residuos`);
    }

    function handleComposeMail() {
        MailComposer.composeAsync({
            subject: 'Interesse na coleta de residuos',
            recipients: [data.point.email],

        })
    }
    
    useEffect(() => {
        api.get(`points/${routeParams.point_id}`).then(response => {
            console.log(response.data);
            setData(response.data);
        })
    }, [])

    if (!data.point) {
        return null;
    }
    
    return (

        <SafeAreaView style={{flex:1}}>
            <View style={styles.container}>
                <TouchableOpacity onPress={handleNavigatorBack}>
                    <Feather name="arrow-left" size={20} color="#34cb79"/>
                </TouchableOpacity>

                <Image style={styles.pointImage} source={{ uri: data.point.image_url}}/>
                <Text style={styles.pointName}>{data.point.name}</Text>
                <Text style={styles.pointItems}>{data.items.map(item => item.title).join(', ')}</Text>

                <View style={styles.address}>
                    <Text style={styles.addressTitle}>Endereço</Text>
                    <Text style={styles.addressContent}>{data.point.city}, {data.point.uf}</Text>
                </View>
            </View>
            <View style={styles.footer}>
                <RectButton style={styles.button} onPress={handleWhastApp}>
                    <FontAwesome name="whatsapp" size={20} color="#FFF"/>
                    <Text style={styles.buttonText}>WhatsApp</Text>
                </RectButton>

                <RectButton style={styles.button} onPress={handleComposeMail}>
                    <Feather name="mail" size={20} color="#FFF"/>
                    <Text style={styles.buttonText}>E-mail</Text>
                </RectButton>
            </View>
        </SafeAreaView>
    )
}

export default Detail;