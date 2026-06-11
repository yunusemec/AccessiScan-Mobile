import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme';

type Status = 'waiting' | 'updated' | 'pending';

export default function PaymentSuccessScreen({ navigation }: any) {
  const { user, refreshUser } = useAuth();
  const [status, setStatus] = useState<Status>('waiting');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let tries = 0;
    const poll = async () => {
      while (!cancelled && tries < 3) {
        await new Promise(r => setTimeout(r, tries === 0 ? 2000 : 3000));
        if (cancelled) return;
        try { await refreshUser(); } catch { /* ignore */ }
        tries++;
        setAttempt(tries);
      }
    };
    poll();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (attempt === 0) return;
    if (user && user.plan !== 'FREE') setStatus('updated');
    else if (attempt >= 3) setStatus('pending');
  }, [attempt, user?.plan]);

  return (
    <SafeAreaView style={s.container}>
      <View style={s.center}>
        {status === 'waiting' ? (
          <View style={[s.icon, { backgroundColor: 'rgba(0,212,255,0.1)', borderColor: 'rgba(0,212,255,0.2)' }]}>
            <ActivityIndicator size="large" color={colors.cyan} />
          </View>
        ) : status === 'updated' ? (
          <View style={[s.icon, { backgroundColor: 'rgba(57,255,20,0.1)', borderColor: 'rgba(57,255,20,0.3)' }]}>
            <Text style={{ fontSize: 36 }}>✅</Text>
          </View>
        ) : (
          <View style={[s.icon, { backgroundColor: 'rgba(245,158,11,0.1)', borderColor: 'rgba(245,158,11,0.3)' }]}>
            <Text style={{ fontSize: 36 }}>⚠️</Text>
          </View>
        )}

        <Text style={s.title}>
          {status === 'waiting' && 'Ödeme Doğrulanıyor...'}
          {status === 'updated' && 'Planınız Güncellendi! 🎉'}
          {status === 'pending' && 'Ödeme Alındı'}
        </Text>

        {status === 'waiting' && <Text style={s.desc}>Plan bilgileriniz güncelleniyor, lütfen bekleyin.</Text>}
        {status === 'updated' && (
          <Text style={s.desc}>
            <Text style={{ color: colors.cyan, fontWeight: '700' }}>{user?.plan}</Text> planına geçiş yapıldı.{'\n'}
            {user?.tokens === 999999 ? 'Sınırsız analiz hakkınız aktif.' : `${user?.tokens} analiz hakkınız tanımlandı.`}
          </Text>
        )}
        {status === 'pending' && <Text style={s.desc}>Ödemeniz başarıyla alındı. Planınız birkaç dakika içinde güncellenecek.</Text>}

        {status !== 'waiting' && (
          <View style={s.btns}>
            <TouchableOpacity style={s.primaryBtn} onPress={() => navigation.navigate('Home')}>
              <Text style={s.primaryText}>Ana Sayfaya Git</Text>
            </TouchableOpacity>
            {status === 'pending' && (
              <TouchableOpacity style={s.secondaryBtn} onPress={() => { refreshUser().catch(() => {}); setAttempt(1); setStatus('waiting'); }}>
                <Text style={s.secondaryText}>Yenile</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        {status === 'waiting' && attempt > 0 && <Text style={s.counter}>Deneme {attempt}/3</Text>}
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  icon: { width: 80, height: 80, borderRadius: 40, borderWidth: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 24, fontWeight: '800', color: '#fff', textAlign: 'center', marginBottom: 12 },
  desc: { color: '#9ca3af', fontSize: 14, textAlign: 'center', lineHeight: 21, marginBottom: 28 },
  btns: { flexDirection: 'row', gap: 12 },
  primaryBtn: { backgroundColor: colors.cyan, borderRadius: 12, paddingHorizontal: 28, paddingVertical: 13 },
  primaryText: { color: '#0a0a0f', fontWeight: '700', fontSize: 14 },
  secondaryBtn: { backgroundColor: colors.border, borderRadius: 12, paddingHorizontal: 28, paddingVertical: 13 },
  secondaryText: { color: '#d1d5db', fontWeight: '700', fontSize: 14 },
  counter: { color: '#6b7280', fontSize: 12, marginTop: 14 },
});
