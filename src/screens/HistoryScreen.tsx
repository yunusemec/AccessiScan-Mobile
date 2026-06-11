import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  ActivityIndicator, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { analyzeAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import ChatWidget from '../components/ChatWidget';
import { colors } from '../theme';

interface AnalysisRow {
  id: string;
  url: string | null;
  htmlSnippet: string | null;
  score: number;
  results: { passed: boolean }[];
  createdAt: string;
}

function ScorePill({ score }: { score: number }) {
  const color = score >= 75 ? '#22c55e' : score >= 50 ? '#f59e0b' : '#ef4444';
  return (
    <View style={[sp.wrap, { backgroundColor: color + '22', borderColor: color }]}>
      <Text style={[sp.text, { color }]}>{score}</Text>
    </View>
  );
}
const sp = StyleSheet.create({
  wrap: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, borderWidth: 1 },
  text: { fontSize: 13, fontWeight: '800' },
});

export default function HistoryScreen({ navigation }: any) {
  const { user } = useAuth();
  const plan = user?.plan ?? 'FREE';

  const [rows, setRows] = useState<AnalysisRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const fetchHistory = useCallback(async () => {
    try {
      const res = await analyzeAPI.history();
      setRows((res.data as AnalysisRow[]).slice(0, 50));
      setError('');
    } catch {
      setError('Geçmiş yüklenemedi.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (plan === 'FREE') { setLoading(false); return; }
    fetchHistory();
  }, [plan, fetchHistory]);

  const onRefresh = () => { setRefreshing(true); fetchHistory(); };

  // FREE plan engel
  if (!loading && plan === 'FREE') {
    return (
      <SafeAreaView style={s.container} edges={[]}>
        <Navbar />
        <View style={s.center}>
          <View style={s.lockIcon}><Text style={{ fontSize: 32 }}>🔒</Text></View>
          <Text style={s.lockTitle}>Bu Özellik Kilitli</Text>
          <Text style={s.lockSub}>Analiz geçmişi Starter ve Pro planlarda mevcuttur. Planınızı yükselterek tüm analizlerinize erişin.</Text>
          <TouchableOpacity style={s.upgradeBtn} onPress={() => navigation.navigate('Pricing')}>
            <Text style={s.upgradeBtnText}>Planları Gör</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const renderItem = ({ item, index }: { item: AnalysisRow; index: number }) => {
    const passed = item.results?.filter(r => r.passed).length ?? 0;
    const total = item.results?.length ?? 0;
    const display = item.url
      ? item.url.replace(/^https?:\/\//, '').slice(0, 55)
      : item.htmlSnippet ? item.htmlSnippet.slice(0, 55).replace(/\s+/g, ' ') + '...' : 'HTML Analizi';
    const typeColor = item.url ? colors.cyan : '#a78bfa';

    return (
      <TouchableOpacity style={s.row} onPress={() => navigation.navigate('Result', { result: item })} activeOpacity={0.7}>
        <Text style={s.rowNum}>{index + 1}</Text>
        <View style={s.rowIcon}><Text>{item.url ? '🌐' : '📄'}</Text></View>
        <View style={s.rowContent}>
          <Text style={s.rowTitle} numberOfLines={1}>{display}</Text>
          <Text style={s.rowMeta}>
            {new Date(item.createdAt).toLocaleDateString('tr-TR', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            {'  ·  '}<Text style={{ color: typeColor }}>{item.url ? 'URL' : 'HTML'}</Text>
          </Text>
        </View>
        {total > 0 && (
          <View style={s.rowChecks}><Text style={s.rowCheckNum}>{passed}/{total}</Text><Text style={s.rowCheckLbl}>kontrol</Text></View>
        )}
        <ScorePill score={item.score} />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={s.container} edges={[]}>
      <Navbar />
      <View style={s.titleBar}>
        <Text style={s.title}>Analiz Geçmişi</Text>
        {!loading && rows.length > 0 && <Text style={s.subtitle}>{rows.length} analiz</Text>}
      </View>

      {loading ? (
        <View style={s.center}><ActivityIndicator size="large" color={colors.cyan} /><Text style={s.loadingText}>Yükleniyor...</Text></View>
      ) : error ? (
        <View style={s.center}>
          <Text style={s.errorText}>{error}</Text>
          <TouchableOpacity style={s.retryBtn} onPress={fetchHistory}><Text style={s.retryText}>Tekrar Dene</Text></TouchableOpacity>
        </View>
      ) : rows.length === 0 ? (
        <View style={s.center}>
          <Text style={{ fontSize: 48, marginBottom: 12 }}>📊</Text>
          <Text style={s.emptyTitle}>Henüz analiz yapmadınız.</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Home')}><Text style={s.emptyLink}>İlk analizinizi yapın →</Text></TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={rows}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={s.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.cyan} />}
        />
      )}

      <ChatWidget />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  titleBar: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 6 },
  title: { fontSize: 20, fontWeight: '800', color: '#fff' },
  subtitle: { color: '#666', fontSize: 12, marginTop: 2 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  loadingText: { color: '#666', marginTop: 10, fontSize: 13 },
  errorText: { color: colors.redText, fontSize: 14, marginBottom: 16 },
  retryBtn: { backgroundColor: colors.cyan, borderRadius: 8, paddingHorizontal: 20, paddingVertical: 10 },
  retryText: { color: '#0a0a0f', fontWeight: '700' },
  emptyTitle: { color: '#9ca3af', fontSize: 15, fontWeight: '500', marginBottom: 10 },
  emptyLink: { color: colors.cyan, fontSize: 13 },
  list: { paddingHorizontal: 12, paddingTop: 8, paddingBottom: 90, gap: 6 },
  row: { backgroundColor: colors.card, borderRadius: 10, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1, borderColor: colors.border },
  rowNum: { color: '#444', fontSize: 11, fontFamily: 'monospace', width: 18, textAlign: 'right' },
  rowIcon: { width: 34, height: 34, borderRadius: 8, backgroundColor: colors.border, justifyContent: 'center', alignItems: 'center' },
  rowContent: { flex: 1, minWidth: 0 },
  rowTitle: { color: '#fff', fontSize: 13, fontWeight: '500' },
  rowMeta: { color: '#555', fontSize: 11, marginTop: 2 },
  rowChecks: { alignItems: 'center' },
  rowCheckNum: { color: '#666', fontSize: 11 },
  rowCheckLbl: { color: '#444', fontSize: 10 },
  lockIcon: { width: 64, height: 64, borderRadius: 14, backgroundColor: colors.border, borderWidth: 1, borderColor: colors.border2, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  lockTitle: { color: '#fff', fontSize: 20, fontWeight: '700', marginBottom: 8 },
  lockSub: { color: '#888', fontSize: 13, textAlign: 'center', marginBottom: 20, lineHeight: 19 },
  upgradeBtn: { backgroundColor: colors.purple, borderRadius: 12, paddingHorizontal: 28, paddingVertical: 12 },
  upgradeBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});
