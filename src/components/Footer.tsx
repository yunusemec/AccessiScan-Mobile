import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../theme';

export default function Footer() {
  const navigation = useNavigation<any>();
  return (
    <View style={styles.footer}>
      <Text style={styles.copy}>© 2025 AccessiScan. Tüm hakları saklıdır.</Text>
      <View style={styles.links}>
        <TouchableOpacity onPress={() => navigation.navigate('Privacy')}>
          <Text style={styles.link}>Gizlilik Politikası</Text>
        </TouchableOpacity>
        <Text style={styles.sep}>|</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Terms')}>
          <Text style={styles.link}>Kullanım Koşulları</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: { borderTopWidth: 1, borderTopColor: colors.border, paddingVertical: 18, paddingHorizontal: 16, alignItems: 'center', gap: 8 },
  copy: { color: '#6b7280', fontSize: 12 },
  links: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  link: { color: '#6b7280', fontSize: 12 },
  sep: { color: '#374151' },
});
