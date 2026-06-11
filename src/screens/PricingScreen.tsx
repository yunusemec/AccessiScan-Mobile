import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView,
} from 'react-native';

const plans = [
  {
    name: 'FREE',
    label: 'Ücretsiz',
    price: '₺0',
    period: '',
    color: '#888',
    features: [
      '5 analiz hakkı',
      'HTML erişilebilirlik analizi',
      'CSS erişilebilirlik analizi',
      'Otomatik düzeltme önizleme',
    ],
    cta: 'Mevcut Plan',
    disabled: true,
    popular: false,
  },
  {
    name: 'STARTER',
    label: '₺99/ay',
    price: '₺99',
    period: '/ay',
    color: '#00d4ff',
    features: [
      "Free'deki her şey, artı:",
      '50 analiz hakkı / ay',
      'Analiz geçmişi',
      'Kod indirme',
      'E-posta desteği',
    ],
    cta: 'Starter\'a Geç',
    disabled: false,
    popular: false,
  },
  {
    name: 'PRO',
    label: '₺249/ay',
    price: '₺249',
    period: '/ay',
    color: '#a78bfa',
    features: [
      "Starter'daki her şey, artı:",
      'Sınırsız analiz',
      'PDF raporu indirme',
      'Öncelikli destek',
      'API erişimi (yakında)',
    ],
    cta: 'Pro\'ya Geç',
    disabled: false,
    popular: true,
  },
];

export default function PricingScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.inner}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backText}>← Geri</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Planlar & Fiyatlar</Text>
        </View>

        <Text style={styles.subtitle}>
          İhtiyacınıza uygun planı seçin ve web erişilebilirliğinizi iyileştirin.
        </Text>

        {plans.map((plan) => (
          <View key={plan.name} style={[styles.card, { borderColor: plan.color }]}>
            {plan.popular && (
              <View style={[styles.popularBadge, { backgroundColor: plan.color }]}>
                <Text style={styles.popularText}>En Popüler</Text>
              </View>
            )}

            <View style={styles.planHeader}>
              <Text style={[styles.planName, { color: plan.color }]}>{plan.name}</Text>
              <View style={styles.priceRow}>
                <Text style={[styles.price, { color: plan.color }]}>{plan.price}</Text>
                {plan.period ? <Text style={styles.period}>{plan.period}</Text> : null}
              </View>
            </View>

            <View style={styles.divider} />

            {plan.features.map((f) => (
              <View key={f} style={styles.featureRow}>
                <Text style={[styles.featureCheck, { color: plan.color }]}>✓</Text>
                <Text style={styles.featureText}>{f}</Text>
              </View>
            ))}

            <TouchableOpacity
              style={[
                styles.ctaBtn,
                { backgroundColor: plan.disabled ? '#1a1a2e' : plan.color },
              ]}
              disabled={plan.disabled}
            >
              <Text style={[
                styles.ctaText,
                { color: plan.disabled ? '#555' : '#0a0a0f' },
              ]}>
                {plan.cta}
              </Text>
            </TouchableOpacity>
          </View>
        ))}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Tüm planlar 30 gün iade garantisi içerir. Kredi kartı gerektirmez.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0f' },
  inner: { padding: 20, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 12 },
  backBtn: { padding: 4 },
  backText: { color: '#00d4ff', fontSize: 15, fontWeight: '600' },
  title: { fontSize: 18, fontWeight: '700', color: '#fff' },
  subtitle: { color: '#888', fontSize: 14, lineHeight: 20, marginBottom: 24 },
  card: {
    backgroundColor: '#12121a', borderRadius: 16, padding: 20, marginBottom: 16,
    borderWidth: 1, position: 'relative', overflow: 'hidden',
  },
  popularBadge: {
    position: 'absolute', top: 0, right: 0,
    paddingHorizontal: 12, paddingVertical: 6, borderBottomLeftRadius: 12,
  },
  popularText: { color: '#0a0a0f', fontSize: 11, fontWeight: '700' },
  planHeader: { marginBottom: 16 },
  planName: { fontSize: 20, fontWeight: '800', marginBottom: 4 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
  price: { fontSize: 32, fontWeight: '800' },
  period: { color: '#888', fontSize: 14 },
  divider: { height: 1, backgroundColor: '#1e1e2e', marginBottom: 16 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  featureCheck: { fontSize: 16, fontWeight: '700', width: 20 },
  featureText: { color: '#ccc', fontSize: 14 },
  ctaBtn: { borderRadius: 10, padding: 14, alignItems: 'center', marginTop: 16 },
  ctaText: { fontWeight: '700', fontSize: 15 },
  footer: { alignItems: 'center', marginTop: 8 },
  footerText: { color: '#555', fontSize: 12, textAlign: 'center', lineHeight: 18 },
});
