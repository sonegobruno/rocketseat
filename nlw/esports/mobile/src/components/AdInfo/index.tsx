import { View, Text, ColorValue } from 'react-native';
import { THEME } from '../../theme';

import { styles } from './styles';

interface AdInfoProps {
  label: string
  value: string
  colorValue?: ColorValue
}

export function AdInfo({
  label,
  value,
  colorValue = THEME.COLORS.TEXT
}: AdInfoProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
      </Text>
      <Text
        style={[styles.value, { color: colorValue }]}
        numberOfLines={1}
      >
        {value}
      </Text>
    </View>
  );
}