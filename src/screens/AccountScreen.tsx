import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform, Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme';

function planLabel(plan: string) {
  if (plan === 'PRO') return { label: '⚜ Pro', color: '#fbbf24' };
  if (plan === 'STARTER') return { label: 'Starter', color: colors.cyan };
  return { label: 'Free', color: '#9ca3af' };
}

function DeleteModal({ visible, loading, error, password, setPassword, onConfirm, onClose }: {
  visible: boolean; loading: boolean; error: string; password: string;
  setPassword: (v: string) => void; onConfirm: () => void; onClose: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={dm.overlay}>
        <View style={dm.box}>
          <View style={dm.icon}><Text style={{ fontSize: 24 }}>⚠️</Text></View>
          <Text style={dm.title}>Hesabı Sil</Text>
          <Text style={dm.desc}>
            Bu işlem <Text style={{ color: colors.redText, fontWeight: '700' }}>geri alınamaz</Text>.
            Hesabınız ve tüm analiz geçmişiniz kalıcı olarak silinecek. Onaylamak için şifrenizi girin.
          </Text>
          <TextInput
            style={dm.input}
            placeholder="Şifreniz"
            placeholderTextColor="#555"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />
          {!!error && <Text style={dm.error}>{error}</Text>}
          <View style={dm.btns}>
            <TouchableOpacity style={dm.cancelBtn} onPress={onClose} disabled={loading}>
              <Text style={dm.cancelText}>Vazgeç</Text>
            </TouchableOpacity>
            <TouchableOpacity style={dm.confirmBtn} onPress={onConfirm} disabled={loading || !password}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={dm.confirmText}>Hesabı Sil</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default function AccountScreen({ navigation }: any) {
  const { user, logout } = useAuth();
  const plan = planLabel(user?.plan ?? 'FREE');

  // Şifre değiştirme
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState('');

  // Hesap silme
  const [showDelete, setShowDelete] = useState(false);
  const [delPassword, setDelPassword] = useState('');
  const [delLoading, setDelLoading] = useState(false);
  const [delError, setDelError] = useState('');

  const handleChangePassword = async () => {
    setPwError(''); setPwSuccess('');
    if (!current || !next) { setPwError('Mevcut ve yeni şifre gerekli.'); return; }
    if (next.length < 6) { setPwError('Yeni şifre en az 6 karakter olmalı.'); return; }
    if (next !== confirm) { setPwError('Yeni şifreler eşleşmiyor.'); return; }
    setPwLoading(true);
    try {
      await authAPI.changePassword(current, next);
      setPwSuccess('Şifreniz başarıyla güncellendi.');
      setCurrent(''); setNext(''); setConfirm('');
    } catch (e: any) {
      setPwError(e?.response?.data?.error ?? 'Şifre değiştirilemedi.');
    } finally {
      setPwLoading(false);
    }
  };

  const handleDelete = async () => {
    setDelError('');
    setDelLoading(true);
    try {
      await authAPI.deleteAccount(delPassword);
      setShowDelete(false);
      await logout(); // AuthStack'e döner
    } catch (e: any) {
      setDelError(e?.response?.data?.error ?? 'Hesap silinemedi.');
    } finally {
      setDelLoading(false);
    }
  };

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })
    : '—';

  return (
    <SafeAreaView style={s.container} edges={['top']}>
      <DeleteModal
        visible={showDelete} loading={delLoading} error={delError}
        password={delPassword} setPassword={setDelPassword}
        onConfirm={handleDelete} onClose={() => { setShowDelete(false); setDelPassword(''); setDelError(''); }}
      />

      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={s.back}>← Geri</Text></TouchableOpacity>
        <Text style={s.headerTitle}>Hesap Ayarları</Text>
        <View style={{ width: 50 }} />
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">

          {/* Hesap bilgileri kartı */}
          <View style={s.card}>
            <Text style={s.cardTitle}>Hesap Bilgileri</Text>
            <View style={s.infoRow}>
              <Text style={s.infoLabel}>E-posta</Text>
              <Text style={s.infoValue} numberOfLines={1}>{user?.email}</Text>
            </View>
            <View style={s.infoRow}>
              <Text style={s.infoLabel}>Plan</Text>
              <View style={[s.planBadge, { borderColor: plan.color + '55', backgroundColor: plan.color + '18' }]}>
                <Text style={[s.planBadgeText, { color: plan.color }]}>{plan.label}</Text>
              </View>
            </View>
            <View style={s.infoRow}>
              <Text style={s.infoLabel}>Kalan analiz</Text>
              <Text style={s.infoValue}>{user?.plan === 'PRO' ? '∞ Sınırsız' : `${user?.tokens ?? 0} token`}</Text>
            </View>
            <View style={[s.infoRow, { borderBottomWidth: 0 }]}>
              <Text style={s.infoLabel}>Üyelik tarihi</Text>
              <Text style={s.infoValue}>{memberSince}</Text>
            </View>
          </View>

          {/* Şifre değiştirme */}
          <View style={s.card}>
            <Text style={s.cardTitle}>Şifre Değiştir</Text>

            {!!pwError && <View style={s.errorBox}><Text style={s.errorText}>{pwError}</Text></View>}
            {!!pwSuccess && <View style={s.successBox}><Text style={s.successText}>{pwSuccess}</Text></View>}

            <Text style={s.label}>Mevcut Şifre</Text>
            <TextInput
              style={s.input}
              placeholder="••••••••"
              placeholderTextColor="#555"
              value={current}
              onChangeText={setCurrent}
              secureTextEntry={!showPw}
              autoCapitalize="none"
            />

            <Text style={s.label}>Yeni Şifre</Text>
            <View style={s.pwRow}>
              <TextInput
                style={[s.input, { flex: 1 }]}
                placeholder="En az 6 karakter"
                placeholderTextColor="#555"
                value={next}
                onChangeText={setNext}
                secureTextEntry={!showPw}
                autoCapitalize="none"
              />
              <TouchableOpacity style={s.eyeBtn} onPress={() => setShowPw(v => !v)}>
                <Text style={s.eyeText}>{showPw ? '🙈' : '👁'}</Text>
              </TouchableOpacity>
            </View>

            <Text style={s.label}>Yeni Şifre (Tekrar)</Text>
            <TextInput
              style={s.input}
              placeholder="••••••••"
              placeholderTextColor="#555"
              value={confirm}
              onChangeText={setConfirm}
              secureTextEntry={!showPw}
              autoCapitalize="none"
            />

            <TouchableOpacity style={s.saveBtn} onPress={handleChangePassword} disabled={pwLoading}>
              {pwLoading ? <ActivityIndicator color="#0a0a0f" /> : <Text style={s.saveBtnText}>Şifreyi Güncelle</Text>}
            </TouchableOpacity>
          </View>

          {/* Tehlikeli bölge */}
          <View style={[s.card, s.dangerCard]}>
            <Text style={s.dangerTitle}>Tehlikeli Bölge</Text>
            <Text style={s.dangerDesc}>Hesabınızı sildiğinizde tüm analiz geçmişiniz kalıcı olarak silinir ve geri alınamaz.</Text>
            <TouchableOpacity style={s.deleteBtn} onPress={() => setShowDelete(true)}>
              <Text style={s.deleteBtnText}>Hesabı Sil</Text>
            </TouchableOpacity>
          </View>

          {/* Çıkış */}
          <TouchableOpacity style={s.logoutBtn} onPress={logout}>
            <Text style={s.logoutText}>⎋  Çıkış Yap</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  back: { color: colors.cyan, fontSize: 14, fontWeight: '600', width: 50 },
  headerTitle: { color: '#fff', fontSize: 16, fontWeight: '700' },
  scroll: { padding: 16, paddingBottom: 40 },
  card: { backgroundColor: colors.card, borderRadius: 16, padding: 18, borderWidth: 1, borderColor: colors.border, marginBottom: 16 },
  cardTitle: { color: '#fff', fontSize: 16, fontWeight: '700', marginBottom: 14 },
  infoRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: colors.border },
  infoLabel: { color: '#9ca3af', fontSize: 13 },
  infoValue: { color: '#fff', fontSize: 13, fontWeight: '500', maxWidth: '60%' },
  planBadge: { borderWidth: 1, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4 },
  planBadgeText: { fontSize: 12, fontWeight: '700' },
  label: { color: '#9ca3af', fontSize: 12, fontWeight: '500', marginBottom: 6, marginTop: 12 },
  input: { backgroundColor: colors.bg, borderRadius: 8, padding: 12, color: '#fff', fontSize: 14, borderWidth: 1, borderColor: colors.border },
  pwRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  eyeBtn: { padding: 12, backgroundColor: colors.bg, borderRadius: 8, borderWidth: 1, borderColor: colors.border },
  eyeText: { fontSize: 16 },
  errorBox: { backgroundColor: 'rgba(239,68,68,0.1)', borderWidth: 1, borderColor: 'rgba(239,68,68,0.2)', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, marginBottom: 8 },
  errorText: { color: colors.redText, fontSize: 13, textAlign: 'center' },
  successBox: { backgroundColor: 'rgba(34,197,94,0.1)', borderWidth: 1, borderColor: 'rgba(34,197,94,0.2)', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, marginBottom: 8 },
  successText: { color: '#4ade80', fontSize: 13, textAlign: 'center' },
  saveBtn: { backgroundColor: colors.cyan, borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginTop: 18 },
  saveBtnText: { color: '#0a0a0f', fontWeight: '700', fontSize: 15 },
  dangerCard: { borderColor: 'rgba(239,68,68,0.3)' },
  dangerTitle: { color: colors.redText, fontSize: 15, fontWeight: '700', marginBottom: 8 },
  dangerDesc: { color: '#9ca3af', fontSize: 13, lineHeight: 19, marginBottom: 14 },
  deleteBtn: { backgroundColor: 'rgba(239,68,68,0.1)', borderWidth: 1, borderColor: 'rgba(239,68,68,0.3)', borderRadius: 10, paddingVertical: 13, alignItems: 'center' },
  deleteBtnText: { color: colors.redText, fontWeight: '700', fontSize: 14 },
  logoutBtn: { paddingVertical: 14, alignItems: 'center' },
  logoutText: { color: '#9ca3af', fontSize: 14, fontWeight: '600' },
});

const dm = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  box: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border2, borderRadius: 16, padding: 24, width: '100%', maxWidth: 380 },
  icon: { width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(239,68,68,0.1)', borderWidth: 1, borderColor: 'rgba(239,68,68,0.2)', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginBottom: 16 },
  title: { color: '#fff', fontSize: 18, fontWeight: '700', textAlign: 'center', marginBottom: 10 },
  desc: { color: '#9ca3af', fontSize: 13, textAlign: 'center', lineHeight: 19, marginBottom: 16 },
  input: { backgroundColor: colors.bg, borderRadius: 8, padding: 12, color: '#fff', fontSize: 14, borderWidth: 1, borderColor: colors.border, marginBottom: 8 },
  error: { color: colors.redText, fontSize: 12, textAlign: 'center', marginBottom: 8 },
  btns: { flexDirection: 'row', gap: 12, marginTop: 6 },
  cancelBtn: { flex: 1, borderWidth: 1, borderColor: colors.border2, borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  cancelText: { color: '#d1d5db', fontWeight: '600', fontSize: 14 },
  confirmBtn: { flex: 1, backgroundColor: colors.red, borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  confirmText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});
