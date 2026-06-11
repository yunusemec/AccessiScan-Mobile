import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Modal,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const TERMS_SECTIONS = [
  { title: '1. Hizmet Tanımı', body: 'AccessiScan, web sitelerinin WCAG 2.1 AA standartlarına uygunluğunu analiz eden bir erişilebilirlik test aracıdır. URL veya HTML kodu üzerinden 50 WCAG kriteri ile otomatik analiz, HTML ve CSS tabanlı sorunların tespiti, yapay zeka destekli kod düzeltme önerileri ve detaylı PDF rapor oluşturma hizmeti sunmaktadır.' },
  { title: '2. Hesap Güvenliği', body: 'Platforma erişim için geçerli bir e-posta ile kayıt olmanız gerekir. Şifrenizi üçüncü şahıslarla paylaşmayın. Yetkisiz erişim tespit ederseniz derhal bildirin.' },
  { title: '3. Kullanıcı Yükümlülükleri', body: 'Yalnızca sahibi olduğunuz veya yetkiye sahip olduğunuz URL/HTML içerikleri kullanmalısınız. Platformu spam, otomatik saldırı veya yasadışı amaçlarla kullanamazsınız.' },
  { title: '4. Ödeme Koşulları', body: 'Abonelik planları aylık faturalandırılır. Ödemeler Stripe altyapısıyla güvenle işlenir; kart bilgileriniz tarafımızca saklanmaz.' },
  { title: '5. İptal ve İade', body: 'Aboneliği dilediğiniz zaman iptal edebilirsiniz; iptal mevcut dönem sonunda geçerli olur. Kullanılmamış süreye iade yapılmaz.' },
  { title: '6. Sorumluluk Reddi', body: 'Analiz sonuçları bilgi amaçlıdır ve yasal uyumluluk danışmanlığı niteliği taşımaz. AI tarafından üretilen öneriler üretime uygulanmadan önce insan denetiminden geçirilmelidir.' },
];

function TermsModal({ visible, onAccept, onClose }: { visible: boolean; onAccept: () => void; onClose: () => void }) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={ts.overlay}>
        <View style={ts.sheet}>
          <View style={ts.header}>
            <Text style={ts.headerTitle}>📋 Kullanım Koşulları</Text>
            <TouchableOpacity onPress={onClose}><Text style={ts.close}>✕</Text></TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={ts.body}>
            <Text style={ts.updated}>Son güncelleme: Mayıs 2025</Text>
            <View style={ts.testBox}>
              <Text style={ts.testText}>TEST MODU: Platform test modundadır. Gerçek ödeme alınmaz. Test kartı: 4242 4242 4242 4242</Text>
            </View>
            {TERMS_SECTIONS.map(sec => (
              <View key={sec.title} style={{ marginBottom: 14 }}>
                <Text style={ts.secTitle}>{sec.title}</Text>
                <Text style={ts.secBody}>{sec.body}</Text>
              </View>
            ))}
          </ScrollView>
          <TouchableOpacity style={ts.acceptBtn} onPress={onAccept}>
            <Text style={ts.acceptText}>Okudum ve Kabul Ediyorum</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

export default function RegisterScreen({ navigation }: any) {
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [terms, setTerms] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [emailErr, setEmailErr] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (val: string) => {
    setEmailErr(val && !EMAIL_RE.test(val) ? 'Geçerli bir e-posta adresi giriniz.' : '');
  };

  const handleRegister = async () => {
    setError('');
    if (!EMAIL_RE.test(email)) { setEmailErr('Geçerli bir e-posta adresi giriniz.'); return; }
    if (password.length < 6) { setError('Şifre en az 6 karakter olmalı.'); return; }
    if (!terms) { setError('Kullanım koşullarını kabul etmelisiniz.'); return; }
    setLoading(true);
    try {
      await register(email.trim(), password);
    } catch {
      setError('Kayıt başarısız. Bu e-posta zaten kullanımda olabilir.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={s.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <TermsModal visible={showModal} onAccept={() => { setTerms(true); setShowModal(false); }} onClose={() => setShowModal(false)} />
      <ScrollView contentContainerStyle={s.inner} keyboardShouldPersistTaps="handled">
        <TouchableOpacity style={s.back} onPress={() => navigation.navigate('Landing')}>
          <Text style={s.backText}>‹ Ana Sayfa</Text>
        </TouchableOpacity>

        <View style={s.logoWrap}>
          <Text style={s.logo}>Accessi<Text style={s.logoCyan}>Scan</Text></Text>
          <Text style={s.logoSub}>Ücretsiz hesap oluştur</Text>
        </View>

        <View style={s.card}>
          {!!error && <View style={s.errorBox}><Text style={s.errorText}>{error}</Text></View>}

          <Text style={s.label}>E-posta</Text>
          <TextInput
            style={[s.input, !!emailErr && s.inputErr]}
            placeholder="ornek@email.com"
            placeholderTextColor="#555"
            value={email}
            onChangeText={(v) => { setEmail(v); validateEmail(v); }}
            onBlur={() => validateEmail(email)}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {!!emailErr && <Text style={s.fieldErr}>{emailErr}</Text>}

          <Text style={s.label}>Şifre</Text>
          <View style={s.pwRow}>
            <TextInput
              style={[s.input, { flex: 1 }]}
              placeholder="En az 6 karakter"
              placeholderTextColor="#555"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPw}
            />
            <TouchableOpacity style={s.eyeBtn} onPress={() => setShowPw(v => !v)}>
              <Text style={s.eyeText}>{showPw ? '🙈' : '👁'}</Text>
            </TouchableOpacity>
          </View>

          {/* Terms */}
          <View style={s.termsRow}>
            <TouchableOpacity
              style={[s.checkbox, terms && s.checkboxOn]}
              onPress={() => terms ? setTerms(false) : setShowModal(true)}
            >
              {terms && <Text style={s.checkmark}>✓</Text>}
            </TouchableOpacity>
            <Text style={s.termsText}>
              <Text style={s.termsLink} onPress={() => setShowModal(true)}>Kullanım Koşulları</Text>
              'nı okudum ve kabul ediyorum.
            </Text>
          </View>

          <TouchableOpacity
            style={[s.btn, (loading || !!emailErr) && s.btnDisabled]}
            onPress={handleRegister}
            disabled={loading || !!emailErr}
          >
            {loading ? <ActivityIndicator color="#0a0a0f" /> : <Text style={s.btnText}>Kayıt Ol</Text>}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={s.link}>Zaten hesabın var mı? <Text style={s.linkCyan}>Giriş yap</Text></Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgDeep },
  inner: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  back: { position: 'absolute', top: 40, left: 20 },
  backText: { color: '#6b7280', fontSize: 13 },
  logoWrap: { alignItems: 'center', marginBottom: 28 },
  logo: { fontSize: 26, fontWeight: '800', color: '#fff' },
  logoCyan: { color: colors.cyan },
  logoSub: { color: '#6b7280', fontSize: 13, marginTop: 4 },
  card: { backgroundColor: 'rgba(13,13,26,0.9)', borderRadius: 16, padding: 24, borderWidth: 1, borderColor: colors.border },
  errorBox: { backgroundColor: 'rgba(239,68,68,0.1)', borderWidth: 1, borderColor: 'rgba(239,68,68,0.2)', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, marginBottom: 12 },
  errorText: { color: colors.redText, fontSize: 13, textAlign: 'center' },
  label: { color: '#9ca3af', fontSize: 12, fontWeight: '500', marginBottom: 6, marginTop: 14 },
  input: { backgroundColor: colors.bg, borderRadius: 8, padding: 12, color: '#fff', fontSize: 14, borderWidth: 1, borderColor: colors.border },
  inputErr: { borderColor: 'rgba(239,68,68,0.6)' },
  fieldErr: { color: colors.redText, fontSize: 11, marginTop: 4 },
  pwRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  eyeBtn: { padding: 12, backgroundColor: colors.bg, borderRadius: 8, borderWidth: 1, borderColor: colors.border },
  eyeText: { fontSize: 16 },
  termsRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginTop: 16 },
  checkbox: { width: 18, height: 18, borderRadius: 4, borderWidth: 1, borderColor: colors.border2, backgroundColor: colors.bg, justifyContent: 'center', alignItems: 'center', marginTop: 1 },
  checkboxOn: { backgroundColor: '#10b981', borderColor: '#10b981' },
  checkmark: { color: '#fff', fontSize: 11, fontWeight: '800' },
  termsText: { color: '#6b7280', fontSize: 12, flex: 1, lineHeight: 18 },
  termsLink: { color: colors.cyan },
  btn: { backgroundColor: colors.cyan, borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginTop: 20 },
  btnDisabled: { opacity: 0.5 },
  btnText: { color: '#0a0a0f', fontWeight: '700', fontSize: 15 },
  link: { color: '#6b7280', textAlign: 'center', marginTop: 16, fontSize: 13 },
  linkCyan: { color: colors.cyan },
});

const ts = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: '#0d0d1a', borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '85%', borderWidth: 1, borderColor: colors.border },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.border },
  headerTitle: { color: '#fff', fontWeight: '700', fontSize: 14 },
  close: { color: '#888', fontSize: 16 },
  body: { padding: 18 },
  updated: { color: '#6b7280', fontSize: 11, marginBottom: 12 },
  testBox: { backgroundColor: 'rgba(245,158,11,0.08)', borderWidth: 1, borderColor: 'rgba(245,158,11,0.2)', borderRadius: 8, padding: 10, marginBottom: 16 },
  testText: { color: '#fcd34d', fontSize: 11, lineHeight: 16 },
  secTitle: { color: '#fff', fontWeight: '700', fontSize: 13, marginBottom: 4 },
  secBody: { color: '#9ca3af', fontSize: 12, lineHeight: 18 },
  acceptBtn: { backgroundColor: '#10b981', margin: 16, borderRadius: 10, paddingVertical: 14, alignItems: 'center' },
  acceptText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});
