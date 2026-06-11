import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, Alert, KeyboardAvoidingView, Platform,
  ScrollView,
} from 'react-native';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen({ navigation }: any) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    if (!email || !password) { setError('E-posta ve şifre gerekli.'); return; }
    setLoading(true);
    try {
      const res = await authAPI.login(email.trim(), password);
      await login(res.data.token, res.data.user);
    } catch {
      setError('Geçersiz e-posta veya şifre.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={s.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={s.inner} keyboardShouldPersistTaps="handled">

        <View style={s.logoWrap}>
          <Text style={s.logo}>Accessi<Text style={s.logoCyan}>Scan</Text></Text>
          <Text style={s.logoSub}>Hesabına giriş yap</Text>
        </View>

        <View style={s.card}>
          {!!error && <View style={s.errorBox}><Text style={s.errorText}>{error}</Text></View>}

          <Text style={s.label}>E-posta</Text>
          <TextInput
            style={s.input}
            placeholder="ornek@email.com"
            placeholderTextColor="#555"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={s.label}>Şifre</Text>
          <View style={s.pwRow}>
            <TextInput
              style={[s.input, { flex: 1 }]}
              placeholder="••••••••"
              placeholderTextColor="#555"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPw}
            />
            <TouchableOpacity style={s.eyeBtn} onPress={() => setShowPw(v => !v)}>
              <Text style={s.eyeText}>{showPw ? '🙈' : '👁'}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={s.btn} onPress={handleLogin} disabled={loading}>
            {loading
              ? <ActivityIndicator color="#0a0a0f" />
              : <Text style={s.btnText}>Giriş Yap</Text>}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={s.link}>Hesabın yok mu? <Text style={s.linkCyan}>Kayıt ol</Text></Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0f' },
  inner: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  logoWrap: { alignItems: 'center', marginBottom: 32 },
  logo: { fontSize: 28, fontWeight: '800', color: '#fff', letterSpacing: 0.5 },
  logoCyan: { color: '#00d4ff' },
  logoSub: { color: '#666', fontSize: 13, marginTop: 4 },
  card: {
    backgroundColor: '#12121a', borderRadius: 16, padding: 24,
    borderWidth: 1, borderColor: '#1e1e2e',
  },
  errorBox: {
    backgroundColor: 'rgba(239,68,68,0.1)', borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.2)', borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 8, marginBottom: 12,
  },
  errorText: { color: '#f87171', fontSize: 13, textAlign: 'center' },
  label: { color: '#aaa', fontSize: 12, fontWeight: '500', marginBottom: 6, marginTop: 14 },
  input: {
    backgroundColor: '#0a0a0f', borderRadius: 8, padding: 12,
    color: '#fff', fontSize: 14, borderWidth: 1, borderColor: '#1e1e2e',
  },
  pwRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  eyeBtn: { padding: 12, backgroundColor: '#0a0a0f', borderRadius: 8, borderWidth: 1, borderColor: '#1e1e2e' },
  eyeText: { fontSize: 16 },
  btn: {
    backgroundColor: '#00d4ff', borderRadius: 10, paddingVertical: 14,
    alignItems: 'center', marginTop: 20,
  },
  btnText: { color: '#0a0a0f', fontWeight: '700', fontSize: 15 },
  link: { color: '#666', textAlign: 'center', marginTop: 16, fontSize: 13 },
  linkCyan: { color: '#00d4ff' },
});
