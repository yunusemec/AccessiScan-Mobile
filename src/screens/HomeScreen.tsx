import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, ScrollView, SafeAreaView, Platform,
} from 'react-native';
import { analyzeAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

type Tab = 'url' | 'html';

export default function HomeScreen({ navigation }: any) {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState<Tab>('url');
  const [urlInput, setUrlInput] = useState('');
  const [htmlInput, setHtmlInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const tokens = user?.tokens ?? 0;

  const handleAnalyze = async () => {
    setError('');
    if (tab === 'url' && !urlInput.trim()) { setError('Lütfen bir URL girin.'); return; }
    if (tab === 'html' && !htmlInput.trim()) { setError('Lütfen HTML kod yapıştırın.'); return; }
    if (tokens === 0) { setError("Analiz hakkınız kalmadı. Planınızı yükseltin."); return; }

    setLoading(true);
    try {
      const content = tab === 'url' ? urlInput.trim() : htmlInput.trim();
      const res = await analyzeAPI.analyze(tab, content);
      navigation.navigate('Result', { result: res.data });
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Analiz sırasında bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={s.container}>
      <ScrollView contentContainerStyle={s.inner}>

        {/* Navbar */}
        <View style={s.navbar}>
          <Text style={s.brand}>Accessi<Text style={s.brandCyan}>Scan</Text></Text>
          <View style={s.navRight}>
            <TouchableOpacity style={s.navBtn} onPress={() => navigation.navigate('History')}>
              <Text style={s.navBtnText}>Geçmiş</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.navBtn} onPress={() => navigation.navigate('Pricing')}>
              <Text style={s.navBtnText}>Planlar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.logoutBtn} onPress={logout}>
              <Text style={s.logoutText}>Çıkış</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Hero */}
        <View style={s.hero}>
          <View style={s.wcagBadge}>
            <View style={s.dot} />
            <Text style={s.wcagText}>WCAG 2.1 AA Uyumlu Analiz</Text>
          </View>
          <Text style={s.heroTitle}>
            Web Sitenizi{'\n'}<Text style={s.heroCyan}>Analiz Edin</Text>
          </Text>
          <Text style={s.heroSub}>
            50 WCAG 2.1 kriteri ile sitenizi tarayın, sorunları tespit edin ve çözüm önerileri alın.
          </Text>
          {user?.plan === 'PRO' && (
            <View style={s.proBadge}>
              <Text style={s.proText}>⚜ Pro Plan — Sınırsız Analiz</Text>
            </View>
          )}
        </View>

        {/* Form card */}
        <View style={s.card}>
          {/* Tabs */}
          <View style={s.tabs}>
            {(['url', 'html'] as Tab[]).map((t) => (
              <TouchableOpacity
                key={t}
                style={[s.tabBtn, tab === t && s.tabActive]}
                onPress={() => { setTab(t); setError(''); }}
              >
                <Text style={[s.tabText, tab === t && s.tabTextActive]}>
                  {t === 'url' ? 'URL Gir' : 'HTML Yapıştır'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {tab === 'url' ? (
            <TextInput
              style={s.input}
              placeholder="https://example.com"
              placeholderTextColor="#555"
              value={urlInput}
              onChangeText={setUrlInput}
              keyboardType="url"
              autoCapitalize="none"
              autoCorrect={false}
              onSubmitEditing={handleAnalyze}
            />
          ) : (
            <TextInput
              style={[s.input, s.textarea]}
              placeholder={'<html>\n  <body>\n    <!-- HTML kodunuzu buraya yapıştırın -->\n  </body>\n</html>'}
              placeholderTextColor="#555"
              value={htmlInput}
              onChangeText={setHtmlInput}
              multiline
              numberOfLines={10}
              textAlignVertical="top"
            />
          )}

          {!!error && (
            <View style={s.errorBox}><Text style={s.errorText}>{error}</Text></View>
          )}

          {tokens === 0 && (
            <View style={s.tokenBox}>
              <Text style={s.tokenText}>Analiz hakkınız bitti — planınızı yükseltebilirsiniz.</Text>
            </View>
          )}

          <TouchableOpacity
            style={[s.analyzeBtn, (loading || tokens === 0) && s.analyzeBtnDisabled]}
            onPress={handleAnalyze}
            disabled={loading || tokens === 0}
          >
            {loading
              ? <><ActivityIndicator color="#0a0a0f" /><Text style={s.analyzeBtnText}> Analiz ediliyor...</Text></>
              : <Text style={s.analyzeBtnText}>Analiz Et</Text>}
          </TouchableOpacity>
        </View>

        {/* Token info */}
        {tokens > 0 && (
          <View style={s.tokenInfo}>
            <Text style={s.tokenInfoText}>Kalan analiz hakkı: <Text style={s.tokenInfoNum}>{tokens}</Text></Text>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0f' },
  inner: { padding: 16, paddingBottom: 40 },

  navbar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, paddingTop: 4 },
  brand: { fontSize: 20, fontWeight: '800', color: '#fff' },
  brandCyan: { color: '#00d4ff' },
  navRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  navBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: '#1e1e2e' },
  navBtnText: { color: '#aaa', fontSize: 12 },
  logoutBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, backgroundColor: '#1a1a2e' },
  logoutText: { color: '#f87171', fontSize: 12, fontWeight: '600' },

  hero: { marginBottom: 20 },
  wcagBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0,212,255,0.1)', borderWidth: 1,
    borderColor: 'rgba(0,212,255,0.2)', borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 4, marginBottom: 12,
  },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#00d4ff' },
  wcagText: { color: '#00d4ff', fontSize: 11, fontWeight: '600' },
  heroTitle: { fontSize: 28, fontWeight: '800', color: '#fff', lineHeight: 36, marginBottom: 10 },
  heroCyan: { color: '#00d4ff' },
  heroSub: { color: '#888', fontSize: 13, lineHeight: 20 },
  proBadge: {
    marginTop: 10, alignSelf: 'flex-start',
    backgroundColor: 'rgba(245,158,11,0.1)', borderWidth: 1,
    borderColor: 'rgba(245,158,11,0.3)', borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 5,
  },
  proText: { color: '#fbbf24', fontSize: 12, fontWeight: '600' },

  card: {
    backgroundColor: '#12121a', borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: '#1e1e2e',
  },
  tabs: { flexDirection: 'row', backgroundColor: '#0a0a0f', borderRadius: 10, padding: 4, marginBottom: 14 },
  tabBtn: { flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  tabActive: { backgroundColor: '#1e1e2e', borderBottomWidth: 2, borderBottomColor: '#00d4ff' },
  tabText: { color: '#666', fontWeight: '600', fontSize: 13 },
  tabTextActive: { color: '#fff' },
  input: {
    backgroundColor: '#0a0a0f', borderRadius: 10, padding: 12,
    color: '#fff', fontSize: 14, borderWidth: 1, borderColor: '#1e1e2e',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  textarea: { height: 160, paddingTop: 12 },
  errorBox: {
    marginTop: 10, backgroundColor: 'rgba(239,68,68,0.1)', borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.2)', borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 8,
  },
  errorText: { color: '#f87171', fontSize: 13 },
  tokenBox: {
    marginTop: 10, backgroundColor: 'rgba(139,92,246,0.1)', borderWidth: 1,
    borderColor: 'rgba(139,92,246,0.2)', borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 8,
  },
  tokenText: { color: '#a78bfa', fontSize: 13, textAlign: 'center' },
  analyzeBtn: {
    backgroundColor: '#00d4ff', borderRadius: 10, paddingVertical: 14,
    alignItems: 'center', marginTop: 14, flexDirection: 'row', justifyContent: 'center', gap: 6,
  },
  analyzeBtnDisabled: { opacity: 0.4 },
  analyzeBtnText: { color: '#0a0a0f', fontWeight: '700', fontSize: 15 },
  tokenInfo: { alignItems: 'center', marginTop: 12 },
  tokenInfoText: { color: '#555', fontSize: 12 },
  tokenInfoNum: { color: '#00d4ff', fontWeight: '600' },
});
