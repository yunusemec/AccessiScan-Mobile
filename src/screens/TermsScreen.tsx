import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme';

const SECTIONS = [
  { title: '1. Hizmet Tanımı', body: 'AccessiScan, web sitelerinin WCAG 2.1 AA standartlarına uygunluğunu analiz eden bir erişilebilirlik test aracıdır. URL veya HTML kodu üzerinden 50 WCAG kriteri ile otomatik analiz, HTML ve CSS tabanlı sorunların tespiti, yapay zeka destekli kod düzeltme önerileri ve detaylı PDF rapor oluşturma hizmeti sunmaktadır. Hizmet Ücretsiz, Başlangıç ve Profesyonel planlarda sunulmaktadır.' },
  { title: '2. Hesap Güvenliği', body: 'Platforma erişim için geçerli bir e-posta ile kayıt olmanız gerekir. Şifrenizi üçüncü şahıslarla paylaşmayın. Yetkisiz erişim tespit ederseniz derhal bildirin. Her kullanıcı yalnızca bir hesap açabilir.' },
  { title: '3. Kullanıcı Yükümlülükleri', body: 'Yalnızca sahibi olduğunuz veya yetkiye sahip olduğunuz URL/HTML içerikleri kullanmalısınız. Platformu spam, otomatik saldırı, kötü amaçlı yazılım veya yasadışı amaçlarla kullanamazsınız. Türk Hukuku ve uluslararası mevzuata uygun hareket etmelisiniz.' },
  { title: '4. Ödeme Koşulları', body: 'Abonelik planları aylık faturalandırılır. Ödemeler Stripe altyapısıyla güvenle işlenir; kart bilgileriniz tarafımızca saklanmaz. Fiyatlar KDV hariçtir. Plan yükseltmeleri anında geçerli olur.' },
  { title: '5. İptal ve İade', body: 'Aboneliği dilediğiniz zaman iptal edebilirsiniz; iptal mevcut dönem sonunda geçerli olur. İptal sonrası hesap Ücretsiz plana düşürülür ve geçmiş veriler 30 gün saklanır. Kullanılmamış süreye iade yapılmaz.' },
  { title: '6. Sorumluluk Reddi', body: 'Analiz sonuçları bilgi amaçlıdır ve yasal uyumluluk danışmanlığı niteliği taşımaz. Bir sitenin WCAG uyumlu çıkması yasal erişilebilirlik yükümlülüklerini garanti etmez. Yapay zeka tarafından üretilen öneriler üretim ortamına uygulanmadan önce insan denetiminden geçirilmelidir.' },
  { title: '7. Fikri Mülkiyet', body: 'Platformun tasarımı, kodu ve içeriği AccessiScan\'e aittir. Kullanıcılar girdi olarak sağladıkları içeriklerin haklarını saklı tutar.' },
  { title: '8. Uygulanacak Hukuk', body: 'Bu koşullar Türk Hukuku\'na tabidir. Uyuşmazlıklarda Türkiye mahkemeleri yetkilidir. Sorular için: privacy@accessiscan.com' },
];

export default function TermsScreen({ navigation }: any) {
  return (
    <SafeAreaView style={s.container} edges={['top']}>
      <ScrollView contentContainerStyle={s.scroll}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={s.back}>← Ana Sayfaya Dön</Text></TouchableOpacity>
        <View style={s.titleRow}>
          <Text style={{ fontSize: 24 }}>📋</Text>
          <Text style={s.title}>Kullanım Koşulları</Text>
        </View>
        <Text style={s.updated}>Son güncelleme: Mayıs 2025</Text>

        <View style={s.testBox}>
          <Text style={s.testText}>TEST MODU: Platform test modundadır. Gerçek ödeme alınmaz. Test kartı: 4242 4242 4242 4242</Text>
        </View>

        {SECTIONS.map(sec => (
          <View key={sec.title} style={s.section}>
            <Text style={s.secTitle}>{sec.title}</Text>
            <Text style={s.secBody}>{sec.body}</Text>
          </View>
        ))}
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
  testBox: { backgroundColor: 'rgba(245,158,11,0.08)', borderWidth: 1, borderColor: 'rgba(245,158,11,0.2)', borderRadius: 10, padding: 12, marginBottom: 20 },
  testText: { color: '#fcd34d', fontSize: 12, lineHeight: 17 },
  section: { marginBottom: 18 },
  secTitle: { color: '#fff', fontSize: 15, fontWeight: '700', marginBottom: 6, paddingBottom: 6, borderBottomWidth: 1, borderBottomColor: colors.border },
  secBody: { color: '#9ca3af', fontSize: 13, lineHeight: 20 },
});
