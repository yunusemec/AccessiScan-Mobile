import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, ScrollView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { analyzeAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { colors } from '../theme';

type Tab = 'url' | 'html';

export default function HomeScreen({ navigation }: any) {
  const { user, refreshUser } = useAuth();
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
    if (tokens === 0) { setError("Analiz hakkınız bitti — Premium'a geçin."); return; }

    setLoading(true);
    try {
      const content = tab === 'url' ? urlInput.trim() : htmlInput.trim();
      const res = await analyzeAPI.analyze(tab, content);
      await refreshUser();
      navigation.navigate('Result', { result: res.data });
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Analiz sırasında bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={s.container} edges={[]}>
      <Navbar />
      <ScrollView contentContainerStyle={s.inner}>
        {/* Hero */}
        <View style={s.hero}>
          <View style={s.wcagBadge}>
            <View style={s.dot} />
            <Text style={s.wcagText}>WCAG 2.1 AA Uyumlu Analiz</Text>
          </View>
          <Text style={s.heroTitle}>Web Sitenizi{'\n'}<Text style={s.heroCyan}>Analiz Edin</Text></Text>
          <Text style={s.heroSub}>
            50 WCAG 2.1 kriteri ile sitenizi tarayın, sorunları tespit edin ve çözüm önerileri alın.
          </Text>
          {user?.plan === 'PRO' && (
            <View style={s.proBadge}><Text style={s.proText}>⚜ Pro Plan — Sınırsız Analiz</Text></View>
          )}
        </View>

        {/* Form card */}
        <View style={s.card}>
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

          {!!error && <View style={s.errorBox}><Text style={s.errorText}>{error}</Text></View>}

          {tokens === 0 && (
            <View style={s.tokenBox}>
              <Text style={s.tokenText}>Token yok — Premium'a geçerek devam edebilirsiniz.</Text>
            </View>
          )}

          <TouchableOpacity
            style={[s.analyzeBtn, (loading || tokens === 0) && s.analyzeBtnDisabled]}
            onPress={tokens === 0 ? () => navigation.navigate('Pricing') : handleAnalyze}
            disabled={loading}
          >
            {loading
              ? <><ActivityIndicator color="#0a0a0f" /><Text style={s.analyzeBtnText}>  Analiz ediliyor...</Text></>
              : <Text style={s.analyzeBtnText}>{tokens === 0 ? "Token yok, Premium'a geç" : 'Analiz Et'}</Text>}
          </TouchableOpacity>
        </View>

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
  container: { flex: 1, backgroundColor: colors.bg },
  inner: { padding: 16, paddingBottom: 40 },
  hero: { marginBottom: 20, marginTop: 8 },
  wcagBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', backgroundColor: 'rgba(0,212,255,0.1)', borderWidth: 1, borderColor: 'rgba(0,212,255,0.2)', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, marginBottom: 12 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.cyan },
  wcagText: { color: colors.cyan, fontSize: 11, fontWeight: '600' },
  heroTitle: { fontSize: 28, fontWeight: '800', color: '#fff', lineHeight: 36, marginBottom: 10 },
  heroCyan: { color: colors.cyan },
  heroSub: { color: '#888', fontSize: 13, lineHeight: 20 },
  proBadge: { marginTop: 10, alignSelf: 'flex-start', backgroundColor: 'rgba(245,158,11,0.1)', borderWidth: 1, borderColor: 'rgba(245,158,11,0.3)', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 },
  proText: { color: '#fbbf24', fontSize: 12, fontWeight: '600' },
  card: { backgroundColor: colors.card, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.border },
  tabs: { flexDirection: 'row', backgroundColor: colors.bg, borderRadius: 10, padding: 4, marginBottom: 14 },
  tabBtn: { flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  tabActive: { backgroundColor: colors.border, borderBottomWidth: 2, borderBottomColor: colors.cyan },
  tabText: { color: '#666', fontWeight: '600', fontSize: 13 },
  tabTextActive: { color: '#fff' },
  input: { backgroundColor: colors.bg, borderRadius: 10, padding: 12, color: '#fff', fontSize: 14, borderWidth: 1, borderColor: colors.border, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },
  textarea: { height: 160, paddingTop: 12 },
  errorBox: { marginTop: 10, backgroundColor: 'rgba(239,68,68,0.1)', borderWidth: 1, borderColor: 'rgba(239,68,68,0.2)', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8 },
  errorText: { color: colors.redText, fontSize: 13 },
  tokenBox: { marginTop: 10, backgroundColor: 'rgba(139,92,246,0.1)', borderWidth: 1, borderColor: 'rgba(139,92,246,0.2)', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8 },
  tokenText: { color: '#a78bfa', fontSize: 13, textAlign: 'center' },
  analyzeBtn: { backgroundColor: colors.cyan, borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginTop: 14, flexDirection: 'row', justifyContent: 'center' },
  analyzeBtnDisabled: { opacity: 0.5 },
  analyzeBtnText: { color: '#0a0a0f', fontWeight: '700', fontSize: 15 },
  tokenInfo: { alignItems: 'center', marginTop: 12 },
  tokenInfoText: { color: '#555', fontSize: 12 },
  tokenInfoNum: { color: colors.cyan, fontWeight: '600' },
});
