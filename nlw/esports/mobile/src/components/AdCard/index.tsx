import { GameController } from 'phosphor-react-native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { THEME } from '../../theme';
import { AdInfo } from '../AdInfo';

import { styles } from './styles';

export interface Ad {
  id: string
  name: string
  yearsPlaying: number
  weekDays: string[]
  useVoiceChanel: boolean
  hourEnd: string
  hourStart: string
}

interface AdCardProps {
  data: Ad
  onConnect: () => void
}

export function AdCard({ data, onConnect }: AdCardProps) {
  return (
    <View style={styles.container}>
      <AdInfo
        label='Nome'
        value={data.name}
      />
      <AdInfo
        label='Tempo de jogo'
        value={`${data.yearsPlaying} ano(s)`}
      />
      <AdInfo
        label='Disponibilidade'
        value={`${data.weekDays.length} dia(s) \u2022 ${data.hourStart} - ${data.hourEnd}`}
      />
      <AdInfo
        label='Chamada de áudio?'
        value={data.useVoiceChanel ? 'Sim' : 'Não'}
        colorValue={data.useVoiceChanel ? THEME.COLORS.SUCCESS : THEME.COLORS.ALERT}
      />

      <TouchableOpacity style={styles.button} onPress={onConnect}>
        <GameController
          color={THEME.COLORS.TEXT}
          size={20}
        />

        <Text style={styles.buttonTitle}>Conectar</Text>
      </TouchableOpacity>
    </View>
  );
}