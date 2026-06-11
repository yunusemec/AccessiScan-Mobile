import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, Alert, ScrollView, SafeAreaView,
} from 'react-native';
import { scanAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function HomeScreen({ navigation }: any) {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState<'url' | 'html'>('url');
  const [url, setUrl] = useState('');
  const [html, setHtml] = useState('');
  const [loading, setLoading] = useState(false);

  const handleScan = async () => {
    if (tab === 'url' && !url.trim()) {
      Alert.alert('Hata', 'Lütfen bir URL girin.');
      return;
    }
    if (tab === 'html' && !html.trim()) {
      Alert.alert('Hata', 'Lütfen HTML yapıştırın.');
      return;
    }
    setLoading(true);
    try {
      const res = tab === 'url'
        ? await scanAPI.scanUrl(url.trim())
        : await scanAPI.scanHtml(html.trim());
      navigation.navigate('Result', { result: res.data });
    } catch (e: any) {
      Alert.alert('Tarama Başarısız', e?.response?.data?.message || 'Bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.inner}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Merhaba, {user?.name || 'Kullanıcı'} 👋</Text>
            <Text style={styles.subGreeting}>Erişilebilirlik analizi başlat</Text>
          </View>
          <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
            <Text style={styles.logoutText}>Çıkış</Text>
          </TouchableOpacity>
        </View>

        {/* Stat cards */}
        <View style={styles.statsRow}>
          <TouchableOpacity style={styles.statCard} onPress={() => navigation.navigate('History')}>
            <Text style={styles.statIcon}>📊</Text>
            <Text style={styles.statLabel}>Geçmiş</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.statCard} onPress={() => navigation.navigate('Pricing')}>
            <Text style={styles.statIcon}>💎</Text>
            <Text style={styles.statLabel}>Planlar</Text>
          </TouchableOpacity>
        </View>

        {/* Scan card */}
        <View style={styles.scanCard}>
          <Text style={styles.scanTitle}>Yeni Tarama</Text>

          {/* Tabs */}
          <View style={styles.tabs}>
            <TouchableOpacity
              style={[styles.tabBtn, tab === 'url' && styles.tabActive]}
              onPress={() => setTab('url')}
            >
              <Text style={[styles.tabText, tab === 'url' && styles.tabTextActive]}>🔗 URL</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabBtn, tab === 'html' && styles.tabActive]}
              onPress={() => setTab('html')}
            >
              <Text style={[styles.tabText, tab === 'html' && styles.tabTextActive]}>{'</>'} HTML</Text>
            </TouchableOpacity>
          </View>

          {tab === 'url' ? (
            <>
              <Text style={styles.label}>Web sitesi URL</Text>
              <TextInput
                style={styles.input}
                placeholder="https://example.com"
                placeholderTextColor="#555"
                value={url}
                onChangeText={setUrl}
                keyboardType="url"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </>
          ) : (
            <>
              <Text style={styles.label}>HTML Kodu</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="<html>...</html>"
                placeholderTextColor="#555"
                value={html}
                onChangeText={setHtml}
                multiline
                numberOfLines={8}
                textAlignVertical="top"
              />
            </>
          )}

          <TouchableOpacity style={styles.scanBtn} onPress={handleScan} disabled={loading}>
            {loading
              ? <ActivityIndicator color="#0a0a0f" />
              : <Text style={styles.scanBtnText}>🔍 Tara</Text>
            }
          </TouchableOpacity>
        </View>

        {/* Info */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>WCAG 2.1 Uyumluluk</Text>
          <Text style={styles.infoText}>
            Web içeriğini A, AA ve AAA erişilebilirlik standartlarına göre analiz eder.
            Renk kontrastı, alt metin, klavye erişimi ve daha fazlasını kontrol eder.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0f' },
  inner: { padding: 20, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  greeting: { fontSize: 20, fontWeight: '700', color: '#fff' },
  subGreeting: { fontSize: 13, color: '#888', marginTop: 2 },
  logoutBtn: { backgroundColor: '#1a1a2e', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 8 },
  logoutText: { color: '#ff6b6b', fontSize: 13, fontWeight: '600' },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  statCard: {
    flex: 1, backgroundColor: '#12121a', borderRadius: 12, padding: 16,
    alignItems: 'center', borderWidth: 1, borderColor: '#1e1e2e',
  },
  statIcon: { fontSize: 24, marginBottom: 6 },
  statLabel: { color: '#aaa', fontSize: 13, fontWeight: '600' },
  scanCard: {
    backgroundColor: '#12121a', borderRadius: 16, padding: 20,
    borderWidth: 1, borderColor: '#1e1e2e', marginBottom: 16,
  },
  scanTitle: { fontSize: 18, fontWeight: '700', color: '#fff', marginBottom: 16 },
  tabs: { flexDirection: 'row', backgroundColor: '#0a0a0f', borderRadius: 10, padding: 4, marginBottom: 16 },
  tabBtn: { flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  tabActive: { backgroundColor: '#00d4ff' },
  tabText: { color: '#888', fontWeight: '600', fontSize: 14 },
  tabTextActive: { color: '#0a0a0f' },
  label: { fontSize: 13, color: '#aaa', marginBottom: 8 },
  input: {
    backgroundColor: '#1a1a2e', borderRadius: 10, padding: 14,
    color: '#fff', fontSize: 15, borderWidth: 1, borderColor: '#2a2a3e',
  },
  textArea: { height: 140, paddingTop: 14 },
  scanBtn: {
    backgroundColor: '#00d4ff', borderRadius: 10, padding: 16,
    alignItems: 'center', marginTop: 16,
  },
  scanBtnText: { color: '#0a0a0f', fontWeight: '700', fontSize: 16 },
  infoCard: {
    backgroundColor: '#0d1117', borderRadius: 12, padding: 16,
    borderWidth: 1, borderColor: '#00d4ff33',
  },
  infoTitle: { color: '#00d4ff', fontWeight: '700', fontSize: 14, marginBottom: 8 },
  infoText: { color: '#888', fontSize: 13, lineHeight: 20 },
});
