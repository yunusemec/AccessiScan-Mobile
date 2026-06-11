import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme';

const SECTIONS: { title: string; items: string[] }[] = [
  {
    title: 'Topladığımız Veriler',
    items: [
      'Hesap bilgileri: E-posta adresiniz ve şifreniz (şifrelenmiş olarak saklanır).',
      'Analiz verileri: Girdiğiniz URL veya HTML içerikleri, yalnızca analiz süresince işlenir.',
      'Kullanım verileri: Analiz sayısı, plan bilgisi ve oturum kayıtları.',
    ],
  },
  {
    title: 'Verileri Nasıl Kullanıyoruz',
    items: [
      'Erişilebilirlik analizini gerçekleştirmek ve sonuç üretmek.',
      'Hesabınızı yönetmek ve abonelik özelliklerini sunmak.',
      'Hizmet kalitesini iyileştirmek ve güvenliği sağlamak.',
    ],
  },
  {
    title: 'Veri Güvenliği',
    items: [
      'Şifreler bcrypt ile geri döndürülemez biçimde şifrelenir.',
      'Tüm iletişim HTTPS üzerinden şifreli olarak gerçekleşir.',
      'Ödeme bilgileri Stripe tarafından işlenir, tarafımızca saklanmaz.',
    ],
  },
  {
    title: 'Haklarınız (KVKK)',
    items: [
      'Kişisel verilerinize erişme ve düzeltme talep etme.',
      'Verilerinizin silinmesini isteme (hesap kapatma).',
      'İşlemeye itiraz etme ve veri taşınabilirliği talep etme.',
    ],
  },
];

export default function PrivacyScreen({ navigation }: any) {
  return (
    <SafeAreaView style={s.container} edges={['top']}>
      <ScrollView contentContainerStyle={s.scroll}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={s.back}>← Ana Sayfaya Dön</Text></TouchableOpacity>
        <View style={s.titleRow}>
          <Text style={{ fontSize: 24 }}>🔒</Text>
          <Text style={s.title}>Gizlilik Politikası</Text>
        </View>
        <Text style={s.updated}>Son güncelleme: Mayıs 2025</Text>
        <Text style={s.intro}>
          AccessiScan olarak kişisel verilerinizin gizliliğini ciddiye alıyoruz. Bu politika,
          6698 sayılı KVKK kapsamında hangi verileri topladığımızı, nasıl kullandığımızı ve
          haklarınızı açıklamaktadır.
        </Text>

        {SECTIONS.map(sec => (
          <View key={sec.title} style={s.section}>
            <Text style={s.secTitle}>{sec.title}</Text>
            {sec.items.map((it, i) => (
              <View key={i} style={s.li}>
                <Text style={s.bullet}>•</Text>
                <Text style={s.liText}>{it}</Text>
              </View>
            ))}
          </View>
        ))}

        <Text style={s.contact}>Sorular için: privacy@accessiscan.com</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: 20, paddingBottom: 40 },
  back: { color: '#6b7280', fontSize: 13, marginBottom: 20 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 6 },
  title: { fontSize: 24, fontWeight: '800', color: '#fff' },
  updated: { color: '#6b7280', fontSize: 12, marginBottom: 14 },
  intro: { color: '#9ca3af', fontSize: 13, lineHeight: 20, marginBottom: 24 },
  section: { marginBottom: 22 },
  secTitle: { color: '#fff', fontSize: 16, fontWeight: '700', marginBottom: 10, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: colors.border },
  li: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  bullet: { color: colors.cyan, fontSize: 13, marginTop: 1 },
  liText: { color: '#9ca3af', fontSize: 13, lineHeight: 19, flex: 1 },
  contact: { color: '#6b7280', fontSize: 12, marginTop: 8 },
});
