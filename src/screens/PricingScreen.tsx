import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  ActivityIndicator, Linking, Modal, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { paymentAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme';

type PlanKey = 'FREE' | 'STARTER' | 'PRO';

interface PlanInfo {
  key: PlanKey;
  name: string;
  price: string;
  tokens: string;
  color: string;
  features: string[];
  isPro?: boolean;
}

const PLANS: PlanInfo[] = [
  { key: 'FREE', name: 'Free', price: 'Ücretsiz', tokens: '5 analiz hakkı', color: '#9ca3af', features: ['5 analiz hakkı', 'HTML erişilebilirlik analizi', 'CSS erişilebilirlik analizi', 'Otomatik düzeltme önizleme'] },
  { key: 'STARTER', name: 'Starter', price: '₺99', tokens: '50 analiz hakkı', color: colors.cyan, features: ["Free'deki her şey, artı:", '50 analiz hakkı / ay', 'URL ve HTML analizi', 'Analiz geçmişi', 'E-posta desteği'] },
  { key: 'PRO', name: 'Pro', price: '₺249', tokens: '∞ Sınırsız analiz', color: '#f59e0b', isPro: true, features: ["Starter'daki her şey, artı:", 'Sınırsız analiz', 'PDF rapor indirme', 'Öncelikli destek', 'API erişimi (yakında)'] },
];

function CancelModal({ visible, loading, onConfirm, onClose }: { visible: boolean; loading: boolean; onConfirm: () => void; onClose: () => void }) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={cm.overlay}>
        <View style={cm.box}>
          <View style={cm.icon}><Text style={{ fontSize: 24 }}>⚠️</Text></View>
          <Text style={cm.title}>Aboneliği İptal Et</Text>
          <Text style={cm.desc}>
            Aboneliğinizi iptal etmek istediğinize emin misiniz?{' '}
            <Text style={{ color: colors.redText }}>Tüm premium özellikler kaldırılacak</Text> ve hesabınız Free plana geçecek.
          </Text>
          <View style={cm.btns}>
            <TouchableOpacity style={cm.cancelBtn} onPress={onClose} disabled={loading}>
              <Text style={cm.cancelText}>Vazgeç</Text>
            </TouchableOpacity>
            <TouchableOpacity style={cm.confirmBtn} onPress={onConfirm} disabled={loading}>
              {loading ? <ActivityIndicator color={colors.redText} /> : <Text style={cm.confirmText}>Evet, İptal Et</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default function PricingScreen({ navigation }: any) {
  const { user, refreshUser } = useAuth();
  const currentPlan = user?.plan ?? 'FREE';
  const subStatus = user?.subscriptionStatus ?? null;
  const isCancelling = subStatus === 'cancelling';

  const [loading, setLoading] = useState<PlanKey | null>(null);
  const [error, setError] = useState('');
  const [infoMsg, setInfoMsg] = useState('');
  const [showCancel, setShowCancel] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [reactLoading, setReactLoading] = useState(false);

  const handleCheckout = async (plan: 'STARTER' | 'PRO') => {
    if (!user) { navigation.navigate('Login'); return; }
    setLoading(plan); setError('');
    try {
      const res = await paymentAPI.createCheckout(plan);
      if (res.data.url) {
        await Linking.openURL(res.data.url);
        setInfoMsg('Ödeme sayfası tarayıcıda açıldı. Ödeme sonrası "Yenile" ile planınızı güncelleyin.');
      }
    } catch (e: any) {
      setError(e?.response?.data?.error ?? 'Ödeme başlatılamadı.');
    } finally {
      setLoading(null);
    }
  };

  const handleCancel = async () => {
    setCancelLoading(true);
    try {
      const res = await paymentAPI.cancelSubscription();
      await refreshUser();
      setShowCancel(false);
      const cancelAt = res.data?.cancelAt
        ? new Date(res.data.cancelAt).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })
        : '';
      setInfoMsg(`Aboneliğiniz iptal edildi. ${cancelAt} tarihine kadar özellikleri kullanmaya devam edebilirsiniz.`);
    } catch (e: any) {
      setError(e?.response?.data?.error ?? 'İptal işlemi başarısız.');
      setShowCancel(false);
    } finally {
      setCancelLoading(false);
    }
  };

  const handleReactivate = async () => {
    setReactLoading(true); setError('');
    try {
      await paymentAPI.reactivate();
      await refreshUser();
      setInfoMsg('Aboneliğiniz yeniden aktifleştirildi!');
    } catch (e: any) {
      setError(e?.response?.data?.error ?? 'Yeniden aktivasyon başarısız.');
    } finally {
      setReactLoading(false);
    }
  };

  const renderPlan = (plan: PlanInfo) => {
    const isCurrent = currentPlan === plan.key;
    const isFree = plan.key === 'FREE';
    const isCancellingThis = isCurrent && isCancelling;
    const isDowngrade = currentPlan === 'PRO' && plan.key === 'STARTER';
    const isLoading = loading === plan.key;

    let btnLabel = user ? 'Satın Al' : 'Giriş Yap ve Satın Al';
    if (currentPlan === 'STARTER' && plan.key === 'PRO') btnLabel = "⬆ Pro'ya Yükselt";
    else if (isDowngrade) btnLabel = 'Mevcut Plan Daha İyi';

    return (
      <View key={plan.key} style={[s.card, plan.isPro && s.cardPro, { borderColor: plan.isPro ? colors.cyan : colors.border }]}>
        {/* Badge */}
        {isCurrent && !isCancellingThis && (
          <View style={[s.topBadge, { backgroundColor: plan.isPro ? colors.amber : isFree ? 'rgba(255,255,255,0.2)' : '#22c55e' }]}>
            <Text style={s.topBadgeText}>✓ Mevcut Planınız</Text>
          </View>
        )}
        {isCancellingThis && (
          <View style={[s.topBadge, { backgroundColor: colors.amber }]}>
            <Text style={s.topBadgeText}>⏳ İptal Sürecinde</Text>
          </View>
        )}
        {!isCurrent && plan.isPro && !isCancelling && (
          <View style={[s.topBadge, { backgroundColor: colors.cyan }]}>
            <Text style={s.topBadgeText}>✦ Popüler</Text>
          </View>
        )}

        <Text style={[s.planName, { color: plan.isPro ? colors.cyan : isCurrent ? '#22c55e' : '#9ca3af' }]}>{plan.name}</Text>
        <View style={s.priceRow}>
          <Text style={s.price}>{plan.price}</Text>
          {!isFree && <Text style={s.priceUnit}> / ay</Text>}
        </View>
        <Text style={[s.tokens, { color: plan.isPro ? colors.cyan : isCurrent ? '#22c55e' : '#d1d5db' }]}>{plan.tokens}</Text>

        <View style={s.divider} />

        {plan.features.map((f, i) => (
          <View key={i} style={s.featRow}>
            <Text style={[s.featCheck, { color: plan.isPro ? colors.cyan : '#22c55e' }]}>✓</Text>
            <Text style={s.featText}>{f}</Text>
          </View>
        ))}

        {/* Buton */}
        <View style={{ marginTop: 16 }}>
          {isCurrent && !isCancellingThis ? (
            <View style={[s.btn, s.btnCurrent]}><Text style={s.btnCurrentText}>✓ Mevcut Planınız</Text></View>
          ) : isCancellingThis ? (
            <View style={[s.btn, s.btnCancelling]}><Text style={s.btnCancellingText}>⏳ İptal Sürecinde</Text></View>
          ) : isDowngrade ? (
            <View style={[s.btn, s.btnDisabled]}><Text style={s.btnDisabledText}>{btnLabel}</Text></View>
          ) : isFree ? (
            <View style={[s.btn, s.btnDisabled]}><Text style={s.btnDisabledText}>Ücretsiz</Text></View>
          ) : (
            <TouchableOpacity
              style={[s.btn, { backgroundColor: plan.isPro ? colors.cyan : colors.purple }]}
              onPress={() => handleCheckout(plan.key as 'STARTER' | 'PRO')}
              disabled={!!loading}
            >
              {isLoading ? <ActivityIndicator color={plan.isPro ? '#0a0a0f' : '#fff'} />
                : <Text style={[s.btnText, { color: plan.isPro ? '#0a0a0f' : '#fff' }]}>{btnLabel}</Text>}
            </TouchableOpacity>
          )}

          {/* İptal / Geri al */}
          {isCurrent && !isFree && (
            <View style={{ alignItems: 'center', marginTop: 10 }}>
              {isCancellingThis ? (
                <TouchableOpacity onPress={handleReactivate} disabled={reactLoading}>
                  <Text style={s.reactivate}>{reactLoading ? 'İşleniyor...' : '↻ İptali Geri Al'}</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => setShowCancel(true)}>
                  <Text style={s.cancelLink}>✕ Aboneliği İptal Et</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={s.container} edges={['top']}>
      <CancelModal visible={showCancel} loading={cancelLoading} onConfirm={handleCancel} onClose={() => setShowCancel(false)} />

      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={s.back}>← Geri</Text></TouchableOpacity>
        {user && (
          <TouchableOpacity onPress={() => { refreshUser().catch(() => {}); setInfoMsg('Plan bilgisi yenilendi.'); }}>
            <Text style={s.refresh}>↻ Yenile</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView contentContainerStyle={s.scroll}>
        <View style={s.titleWrap}>
          <View style={s.pricingBadge}><Text style={s.pricingBadgeText}>Fiyatlandırma</Text></View>
          <Text style={s.title}>İhtiyacınıza Uygun Planı Seçin</Text>
          <Text style={s.subtitle}>Erişilebilir bir web, <Text style={{ color: colors.cyan }}>herkes için daha iyi</Text> bir web demektir.</Text>
        </View>

        {!!error && <View style={s.errorBox}><Text style={s.errorText}>{error}</Text></View>}
        {!!infoMsg && <View style={s.infoBox}><Text style={s.infoText}>{infoMsg}</Text></View>}

        {PLANS.map(renderPlan)}

        <Text style={s.footNote}>Tüm planlar aylık faturalandırılır. İstediğiniz zaman iptal edebilirsiniz.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  back: { color: colors.cyan, fontSize: 14, fontWeight: '600' },
  refresh: { color: '#9ca3af', fontSize: 13 },
  scroll: { paddingHorizontal: 16, paddingBottom: 40 },
  titleWrap: { alignItems: 'center', marginBottom: 20 },
  pricingBadge: { backgroundColor: 'rgba(0,212,255,0.1)', borderWidth: 1, borderColor: 'rgba(0,212,255,0.2)', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 5, marginBottom: 12 },
  pricingBadgeText: { color: colors.cyan, fontSize: 11, fontWeight: '700' },
  title: { fontSize: 24, fontWeight: '800', color: '#fff', textAlign: 'center', marginBottom: 8 },
  subtitle: { color: '#9ca3af', fontSize: 14, textAlign: 'center', lineHeight: 20 },
  errorBox: { backgroundColor: 'rgba(239,68,68,0.1)', borderWidth: 1, borderColor: 'rgba(239,68,68,0.2)', borderRadius: 10, padding: 12, marginBottom: 12 },
  errorText: { color: colors.redText, fontSize: 13, textAlign: 'center' },
  infoBox: { backgroundColor: 'rgba(245,158,11,0.1)', borderWidth: 1, borderColor: 'rgba(245,158,11,0.2)', borderRadius: 10, padding: 12, marginBottom: 12 },
  infoText: { color: '#fcd34d', fontSize: 13, textAlign: 'center', lineHeight: 18 },
  card: { backgroundColor: '#0d0d18', borderWidth: 1, borderRadius: 16, padding: 20, marginBottom: 16 },
  cardPro: { backgroundColor: '#0d1117', borderWidth: 2 },
  topBadge: { alignSelf: 'center', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 4, marginBottom: 10, marginTop: -2 },
  topBadgeText: { color: '#0a0a0f', fontSize: 11, fontWeight: '700' },
  planName: { fontSize: 14, fontWeight: '700', marginBottom: 6 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline' },
  price: { color: '#fff', fontSize: 32, fontWeight: '800' },
  priceUnit: { color: '#6b7280', fontSize: 14 },
  tokens: { fontSize: 13, fontWeight: '600', marginTop: 6 },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 14 },
  featRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 10 },
  featCheck: { fontSize: 14, fontWeight: '700', marginTop: 1 },
  featText: { color: '#d1d5db', fontSize: 13, flex: 1, lineHeight: 18 },
  btn: { borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  btnText: { fontWeight: '700', fontSize: 14 },
  btnCurrent: { backgroundColor: 'rgba(34,197,94,0.1)', borderWidth: 1, borderColor: 'rgba(34,197,94,0.3)' },
  btnCurrentText: { color: '#22c55e', fontWeight: '700', fontSize: 14 },
  btnCancelling: { backgroundColor: 'rgba(245,158,11,0.1)', borderWidth: 1, borderColor: 'rgba(245,158,11,0.3)' },
  btnCancellingText: { color: '#fbbf24', fontWeight: '700', fontSize: 14 },
  btnDisabled: { backgroundColor: colors.border },
  btnDisabledText: { color: '#6b7280', fontWeight: '700', fontSize: 14 },
  reactivate: { color: '#34d399', fontSize: 12 },
  cancelLink: { color: 'rgba(239,68,68,0.7)', fontSize: 12 },
  footNote: { color: '#6b7280', fontSize: 12, textAlign: 'center', marginTop: 8 },
});

const cm = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  box: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border2, borderRadius: 16, padding: 24, width: '100%', maxWidth: 380 },
  icon: { width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(239,68,68,0.1)', borderWidth: 1, borderColor: 'rgba(239,68,68,0.2)', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginBottom: 16 },
  title: { color: '#fff', fontSize: 18, fontWeight: '700', textAlign: 'center', marginBottom: 10 },
  desc: { color: '#9ca3af', fontSize: 13, textAlign: 'center', lineHeight: 19, marginBottom: 20 },
  btns: { flexDirection: 'row', gap: 12 },
  cancelBtn: { flex: 1, borderWidth: 1, borderColor: colors.border2, borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  cancelText: { color: '#d1d5db', fontWeight: '600', fontSize: 14 },
  confirmBtn: { flex: 1, backgroundColor: 'rgba(239,68,68,0.1)', borderWidth: 1, borderColor: 'rgba(239,68,68,0.3)', borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  confirmText: { color: colors.redText, fontWeight: '600', fontSize: 14 },
});
