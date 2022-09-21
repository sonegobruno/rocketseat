import { useRef, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  useFonts,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_900Black
} from '@expo-google-fonts/inter'
import { Subscription } from 'expo-modules-core'
import * as Notifications from 'expo-notifications';

import { getPushNotificationToken } from './src/services/getPushNotificationToken'
import { Background } from './src/components/Background';
import { Loading } from './src/components/Loading';
import { Routes } from './src/routes';
import { useKeepAwake } from 'expo-keep-awake';

import './src/services/notificationsConfig'

export default function App() {
  useKeepAwake();

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_900Black
  })

  const getNotificationListener = useRef<Subscription>()
  const responseNotificationListener = useRef<Subscription>()

  useEffect(() => {
    const token = getPushNotificationToken()
  }, [])

  useEffect(() => {
    getNotificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('notification :>> ', notification);
    })

    responseNotificationListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('response :>> ', response);
    })

    return () => {
      if (getNotificationListener.current && responseNotificationListener.current) {
        Notifications.removeNotificationSubscription(getNotificationListener.current)
        Notifications.removeNotificationSubscription(responseNotificationListener.current)
      }
    }
  }, [])

  return (
    <Background>
      <StatusBar
        style='light'
        backgroundColor='transparent'
        translucent
      />

      {fontsLoaded ? <Routes /> : <Loading />}
    </Background>
  );
}

