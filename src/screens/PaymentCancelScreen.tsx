import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme';

export default function PaymentCancelScreen({ navigation }: any) {
  return (
    <SafeAreaView style={s.container}>
      <View style={s.center}>
        <View style={s.icon}><Text style={{ fontSize: 36 }}>✕</Text></View>
        <Text style={s.title}>Ödeme İptal Edildi</Text>
        <Text style={s.desc}>Herhangi bir ücret alınmadı. İstediğiniz zaman tekrar deneyebilirsiniz.</Text>
        <View style={s.btns}>
          <TouchableOpacity style={s.primaryBtn} onPress={() => navigation.navigate('Pricing')}>
            <Text style={s.primaryText}>Planlara Dön</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.secondaryBtn} onPress={() => navigation.navigate('Home')}>
            <Text style={s.secondaryText}>Ana Sayfa</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  icon: { width: 80, height: 80, borderRadius: 40, borderWidth: 1, borderColor: 'rgba(239,68,68,0.2)', backgroundColor: 'rgba(239,68,68,0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 24, fontWeight: '800', color: '#fff', textAlign: 'center', marginBottom: 12 },
  desc: { color: '#9ca3af', fontSize: 14, textAlign: 'center', lineHeight: 21, marginBottom: 28 },
  btns: { flexDirection: 'row', gap: 12 },
  primaryBtn: { backgroundColor: colors.purple, borderRadius: 12, paddingHorizontal: 24, paddingVertical: 13 },
  primaryText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  secondaryBtn: { backgroundColor: colors.border, borderRadius: 12, paddingHorizontal: 24, paddingVertical: 13 },
  secondaryText: { color: '#d1d5db', fontWeight: '700', fontSize: 14 },
});
