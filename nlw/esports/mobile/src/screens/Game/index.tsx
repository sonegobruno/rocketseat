import { useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity, View, Image, FlatList, Text } from 'react-native'
import { Entypo } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { useEffect, useState } from 'react';

import { styles } from './styles';
import logoImg from '../../assets/logo-nlw-esports.png'

import { GameParams } from '../../@types/navigation';
import { Background } from '../../components/Background';
import { THEME } from '../../theme';
import { Heading } from '../../components/Heading';
import { Ad, AdCard } from '../../components/AdCard';
import { DuoMatch } from '../../components/DuoMatch';

export function Game() {
  const navigation = useNavigation()
  const route = useRoute()
  const game = route.params as GameParams

  const [ads, setAds] = useState<Ad[]>([])
  const [discordDuoSelected, setDiscordDuoSelected] = useState('')

  function handleGoBack() {
    navigation.goBack()
  }

  async function getDiscordUser(adId: string) {
    fetch(`http://192.168.100.17:3333/ads/${adId}/discord`)
      .then(response => response.json())
      .then(data => {
        console.log('data :>> ', data);

        setDiscordDuoSelected(data.discord)
      })
  }

  useEffect(() => {
    fetch(`http://192.168.100.17:3333/games/${game.id}/ads`)
      .then(response => response.json())
      .then(data => {
        setAds(data)
      })
  }, [])


  return (
    <Background>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={handleGoBack}
          >
            <Entypo
              name='chevron-thin-left'
              color={THEME.COLORS.CAPTION_300}
              size={20}
            />
          </TouchableOpacity>

          <Image
            source={logoImg}
            style={styles.logo}
          />

          <View style={styles.right} />
        </View>

        <View style={styles.coverContainer}>
          <Image
            source={{ uri: game.bannerUrl }}
            style={styles.cover}
            resizeMode="cover"
          />
        </View>

        <Heading
          title={game.title}
          subtitle="Conecte-se e comece a jogar!"
        />

        <FlatList
          data={ads}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <AdCard
              data={item}
              onConnect={() => getDiscordUser(item.id)}
            />
          )}
          showsHorizontalScrollIndicator={false}
          horizontal
          style={styles.containerList}
          contentContainerStyle={ads.length === 0 ? styles.emptyListContent : styles.contentList}
          ListEmptyComponent={() => (
            <Text style={styles.emptyListText}>Não há anúncios publicados ainda.</Text>
          )}
        />

        <DuoMatch
          visible={discordDuoSelected.length > 0}
          discord={discordDuoSelected}
          onClose={() => setDiscordDuoSelected('')}
        />
      </SafeAreaView>
    </Background>
  )
}