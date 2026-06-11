import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme';

const STEPS = [
  { num: 1, icon: '🌐', title: 'URL gir veya HTML yapıştır', desc: 'Web sitenizin adresini yazın ya da HTML kodunuzu doğrudan yapıştırın.' },
  { num: 2, icon: '🔍', title: 'Otomatik WCAG analizi', desc: '50+ WCAG 2.1 AA kontrolü saniyeler içinde tamamlanır. HTML ve CSS hataları tespit edilir.' },
  { num: 3, icon: '🤖', title: 'AI destekli öneriler al', desc: 'Yapay zeka en kritik sorunları özetler, pratik çözümler önerir ve HTML\'i otomatik düzeltir.' },
];

const FEATURES = [
  { icon: '🔍', title: '50+ WCAG Kontrolü', desc: 'WCAG 2.1 AA standardına göre kapsamlı HTML ve CSS erişilebilirlik denetimi.' },
  { icon: '🤖', title: 'AI Destekli Analiz', desc: 'Yapay zeka kritik sorunları özetler ve otomatik HTML düzeltmeleri üretir.' },
  { icon: '📊', title: 'Detaylı Raporlama', desc: 'POUR kategorilerine göre ayrıştırılmış raporlar ve PDF indirme desteği.' },
  { icon: '📱', title: 'URL & HTML Desteği', desc: 'Canlı URL analizi veya HTML kodu yapıştırarak anında sonuç alın.' },
  { icon: '⚡', title: 'Hızlı Analiz', desc: 'Saniyeler içinde tamamlanan analiz, anlık sonuçlar ve öneriler.' },
  { icon: '🔒', title: 'Güvenli & Özel', desc: 'Verileriniz sadece analiz süresince işlenir, saklanmaz veya paylaşılmaz.' },
];

const PLANS = [
  { name: 'Free', price: '₺0/ay', color: '#6b7280', highlight: false, features: ['5 analiz hakkı', 'HTML erişilebilirlik analizi', 'CSS erişilebilirlik analizi', 'Otomatik düzeltme önizleme'] },
  { name: 'Starter', price: '₺99/ay', color: colors.cyan, highlight: false, features: ["Free'deki her şey +", '50 analiz hakkı / ay', 'Analiz geçmişi', 'Kod indirme', 'E-posta desteği'] },
  { name: 'Pro', price: '₺249/ay', color: '#f59e0b', highlight: true, features: ["Starter'daki her şey +", 'Sınırsız analiz', 'PDF raporu indirme', 'Öncelikli destek', 'API erişimi (yakında)'] },
];

export default function LandingScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Nav */}
      <View style={styles.nav}>
        <Text style={styles.brand}>Accessi<Text style={styles.cyan}>Scan</Text></Text>
        <TouchableOpacity style={styles.navLogin} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.navLoginText}>Giriş Yap</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.badge}>
            <View style={styles.dot} />
            <Text style={styles.badgeText}>50+ WCAG 2.1 AA Kontrolü</Text>
          </View>
          <Text style={styles.heroTitle}>Web erişilebilirliğini</Text>
          <Text style={styles.heroTitleAccent}>analiz et.</Text>
          <Text style={styles.heroDesc}>
            50+ WCAG 2.1 AA kontrolü ile web sitenizin erişilebilirliğini analiz edin,
            AI destekli önerilerle anında iyileştirin.
          </Text>
          <TouchableOpacity style={styles.ctaPrimary} onPress={() => navigation.navigate('Register')}>
            <Text style={styles.ctaPrimaryText}>Ücretsiz Başla →</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.ctaSecondary} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.ctaSecondaryText}>Giriş Yap</Text>
          </TouchableOpacity>
          <Text style={styles.heroNote}>Kredi kartı gerekmez · Ücretsiz plan sonsuzdur</Text>
        </View>

        {/* Nasıl Çalışır */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nasıl Çalışır?</Text>
          <Text style={styles.sectionSub}>3 adımda erişilebilirlik analizi</Text>
          {STEPS.map(s => (
            <View key={s.num} style={styles.stepCard}>
              <View style={styles.stepNum}><Text style={styles.stepNumText}>{s.num}</Text></View>
              <Text style={styles.stepIcon}>{s.icon}</Text>
              <Text style={styles.stepTitle}>{s.title}</Text>
              <Text style={styles.stepDesc}>{s.desc}</Text>
            </View>
          ))}
        </View>

        {/* Özellikler */}
        <View style={[styles.section, styles.sectionAlt]}>
          <Text style={styles.sectionTitle}>Özellikler</Text>
          <Text style={styles.sectionSub}>Profesyonel erişilebilirlik araçları</Text>
          <View style={styles.featGrid}>
            {FEATURES.map(f => (
              <View key={f.title} style={styles.featCard}>
                <Text style={styles.featIcon}>{f.icon}</Text>
                <Text style={styles.featTitle}>{f.title}</Text>
                <Text style={styles.featDesc}>{f.desc}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Planlar */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fiyatlandırma</Text>
          <Text style={styles.sectionSub}>İhtiyacınıza göre plan seçin</Text>
          {PLANS.map(p => (
            <View key={p.name} style={[styles.planCard, { borderColor: p.highlight ? p.color : colors.border }]}>
              {p.highlight && (
                <View style={[styles.popular, { backgroundColor: p.color + '22', borderColor: p.color + '55' }]}>
                  <Text style={[styles.popularText, { color: p.color }]}>🔥 En Popüler</Text>
                </View>
              )}
              <Text style={styles.planName}>{p.name}</Text>
              <Text style={[styles.planPrice, { color: p.color }]}>{p.price}</Text>
              {p.features.map(f => (
                <View key={f} style={styles.planFeat}>
                  <Text style={[styles.planCheck, { color: p.color }]}>✓</Text>
                  <Text style={styles.planFeatText}>{f}</Text>
                </View>
              ))}
            </View>
          ))}
          <TouchableOpacity style={styles.allPlans} onPress={() => navigation.navigate('Pricing')}>
            <Text style={styles.allPlansText}>Tüm Planları Gör →</Text>
          </TouchableOpacity>
        </View>

        {/* CTA */}
        <View style={styles.ctaSection}>
          <Text style={styles.ctaTitle}>Hemen <Text style={styles.cyan}>ücretsiz</Text> başlayın</Text>
          <Text style={styles.ctaDesc}>Kredi kartı gerektirmez. Dakikalar içinde kurulum. İlk analizinizi hemen yapın.</Text>
          <TouchableOpacity style={styles.ctaPrimary} onPress={() => navigation.navigate('Register')}>
            <Text style={styles.ctaPrimaryText}>Ücretsiz Hesap Oluştur →</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.ctaLoginLink}>Zaten hesabınız var mı? <Text style={styles.cyan}>Giriş yapın</Text></Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 AccessiScan</Text>
          <View style={styles.footerLinks}>
            <TouchableOpacity onPress={() => navigation.navigate('Privacy')}><Text style={styles.footerLink}>Gizlilik</Text></TouchableOpacity>
            <Text style={styles.footerSep}>·</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Terms')}><Text style={styles.footerLink}>Kullanım Koşulları</Text></TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  nav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.04)' },
  brand: { fontSize: 18, fontWeight: '800', color: '#fff' },
  cyan: { color: colors.cyan },
  navLogin: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 8, borderWidth: 1, borderColor: colors.border2 },
  navLoginText: { color: '#d1d5db', fontSize: 13, fontWeight: '600' },
  scroll: { paddingBottom: 30 },

  hero: { alignItems: 'center', paddingHorizontal: 24, paddingTop: 40, paddingBottom: 50 },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderColor: 'rgba(0,212,255,0.2)', backgroundColor: 'rgba(0,212,255,0.05)', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6, marginBottom: 24 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.cyan },
  badgeText: { color: colors.cyan, fontSize: 11, fontWeight: '600' },
  heroTitle: { fontSize: 36, fontWeight: '900', color: '#fff', textAlign: 'center', letterSpacing: -1 },
  heroTitleAccent: { fontSize: 40, fontWeight: '900', color: colors.cyan, textAlign: 'center', letterSpacing: -1, marginBottom: 16 },
  heroDesc: { color: '#9ca3af', fontSize: 14, lineHeight: 21, textAlign: 'center', marginBottom: 28 },
  ctaPrimary: { backgroundColor: colors.cyan, borderRadius: 12, paddingVertical: 14, paddingHorizontal: 32, alignItems: 'center', width: '100%', marginBottom: 12 },
  ctaPrimaryText: { color: '#020c10', fontWeight: '800', fontSize: 15 },
  ctaSecondary: { borderWidth: 1, borderColor: colors.border2, borderRadius: 12, paddingVertical: 14, paddingHorizontal: 32, alignItems: 'center', width: '100%' },
  ctaSecondaryText: { color: '#d1d5db', fontWeight: '600', fontSize: 14 },
  heroNote: { color: '#6b7280', fontSize: 11, marginTop: 18 },

  section: { paddingHorizontal: 18, paddingVertical: 36 },
  sectionAlt: { backgroundColor: 'rgba(0,212,255,0.02)' },
  sectionTitle: { fontSize: 22, fontWeight: '800', color: '#fff', textAlign: 'center', marginBottom: 6 },
  sectionSub: { color: '#6b7280', fontSize: 13, textAlign: 'center', marginBottom: 24 },

  stepCard: { borderWidth: 1, borderColor: 'rgba(0,212,255,0.15)', backgroundColor: 'rgba(14,14,26,0.8)', borderRadius: 16, padding: 20, marginBottom: 14 },
  stepNum: { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(0,212,255,0.1)', borderWidth: 1.5, borderColor: 'rgba(0,212,255,0.25)', justifyContent: 'center', alignItems: 'center', marginBottom: 14 },
  stepNumText: { color: colors.cyan, fontWeight: '800', fontSize: 14 },
  stepIcon: { fontSize: 24, marginBottom: 10 },
  stepTitle: { color: '#fff', fontWeight: '700', fontSize: 15, marginBottom: 6 },
  stepDesc: { color: '#6b7280', fontSize: 13, lineHeight: 19 },

  featGrid: { gap: 12 },
  featCard: { borderWidth: 1, borderColor: colors.border, backgroundColor: 'rgba(14,14,26,0.6)', borderRadius: 16, padding: 16 },
  featIcon: { fontSize: 28, marginBottom: 10 },
  featTitle: { color: '#fff', fontWeight: '700', fontSize: 14, marginBottom: 6 },
  featDesc: { color: '#6b7280', fontSize: 12, lineHeight: 18 },

  planCard: { borderWidth: 1, borderRadius: 16, backgroundColor: 'rgba(14,14,26,0.5)', padding: 20, marginBottom: 14 },
  popular: { alignSelf: 'flex-start', borderWidth: 1, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4, marginBottom: 10 },
  popularText: { fontSize: 11, fontWeight: '700' },
  planName: { color: '#fff', fontWeight: '800', fontSize: 18, marginBottom: 4 },
  planPrice: { fontWeight: '800', fontSize: 26, marginBottom: 14 },
  planFeat: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  planCheck: { fontSize: 14, fontWeight: '700' },
  planFeatText: { color: '#9ca3af', fontSize: 13 },
  allPlans: { borderWidth: 1, borderColor: colors.border2, borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 6 },
  allPlansText: { color: '#d1d5db', fontWeight: '600', fontSize: 14 },

  ctaSection: { paddingHorizontal: 24, paddingVertical: 40, alignItems: 'center' },
  ctaTitle: { fontSize: 26, fontWeight: '900', color: '#fff', textAlign: 'center', marginBottom: 12 },
  ctaDesc: { color: '#9ca3af', fontSize: 13, lineHeight: 20, textAlign: 'center', marginBottom: 24 },
  ctaLoginLink: { color: '#6b7280', fontSize: 12, marginTop: 16 },

  footer: { borderTopWidth: 1, borderTopColor: colors.border, paddingVertical: 24, alignItems: 'center', gap: 8 },
  footerText: { color: '#6b7280', fontSize: 12 },
  footerLinks: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  footerLink: { color: '#6b7280', fontSize: 12 },
  footerSep: { color: '#374151' },
});
