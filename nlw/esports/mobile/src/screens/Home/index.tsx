import { useEffect, useState } from 'react';
import { FlatList, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native'

import logoImg from '../../assets/logo-nlw-esports.png'
import { Background } from '../../components/Background';
import { Game, GameCard } from '../../components/GameCard';
import { Heading } from '../../components/Heading';

import { styles } from './styles';

export function Home() {
  const navigation = useNavigation()
  const [games, setGames] = useState<Game[]>([])

  useEffect(() => {
    fetch('http://192.168.100.17:3333/games')
      .then(response => response.json())
      .then(data => {
        setGames(data)
      })
  }, [])

  function handleOpenGame(game: Game) {
    const { id, title, bannerUrl } = game

    navigation.navigate('game', {
      id,
      title,
      bannerUrl,
    })
  }

  return (
    <Background>
      <SafeAreaView style={styles.container}>
        <Image
          source={logoImg}
          style={styles.logo}
        />

        <Heading
          title="Encontre seu duo!"
          subtitle="Selecione o game que deseja jogar..."
        />


        <FlatList
          contentContainerStyle={styles.contentList}
          data={games}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <GameCard
              data={item}
              onPress={() => handleOpenGame(item)}
            />
          )}
          showsHorizontalScrollIndicator={false}
          horizontal
        />
      </SafeAreaView>
    </Background>
  )
}