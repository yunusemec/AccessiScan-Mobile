import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  SafeAreaView, ActivityIndicator, RefreshControl,
} from 'react-native';
import { scanAPI } from '../services/api';

interface ScanItem {
  _id: string;
  url?: string;
  score: number;
  createdAt: string;
}

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 80 ? '#00d4ff' : score >= 60 ? '#ffd700' : '#ff6b6b';
  return (
    <View style={[styles.scoreBadge, { backgroundColor: color + '22', borderColor: color }]}>
      <Text style={[styles.scoreText, { color }]}>{score}</Text>
    </View>
  );
}

export default function HistoryScreen({ navigation }: any) {
  const [history, setHistory] = useState<ScanItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const fetchHistory = useCallback(async () => {
    try {
      const res = await scanAPI.getHistory();
      setHistory(res.data?.scans || res.data || []);
      setError('');
    } catch {
      setError('Geçmiş yüklenemedi.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  const onRefresh = () => { setRefreshing(true); fetchHistory(); };

  const renderItem = ({ item }: { item: ScanItem }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('Result', { result: item })}
    >
      <View style={styles.cardLeft}>
        <Text style={styles.cardUrl} numberOfLines={1}>{item.url || 'HTML Taraması'}</Text>
        <Text style={styles.cardDate}>{new Date(item.createdAt).toLocaleDateString('tr-TR', {
          day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
        })}</Text>
      </View>
      <ScoreBadge score={item.score} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Geri</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Tarama Geçmişi</Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#00d4ff" />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={fetchHistory}>
            <Text style={styles.retryText}>Tekrar Dene</Text>
          </TouchableOpacity>
        </View>
      ) : history.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyIcon}>📂</Text>
          <Text style={styles.emptyTitle}>Henüz tarama yok</Text>
          <Text style={styles.emptyText}>İlk taramanı yapmak için Ana Sayfa'ya git.</Text>
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00d4ff" />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0f' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, gap: 12 },
  backBtn: { padding: 4 },
  backText: { color: '#00d4ff', fontSize: 15, fontWeight: '600' },
  title: { fontSize: 18, fontWeight: '700', color: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  list: { padding: 16, gap: 10 },
  card: {
    backgroundColor: '#12121a', borderRadius: 12, padding: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderWidth: 1, borderColor: '#1e1e2e',
  },
  cardLeft: { flex: 1, marginRight: 12 },
  cardUrl: { color: '#fff', fontSize: 14, fontWeight: '600' },
  cardDate: { color: '#666', fontSize: 12, marginTop: 4 },
  scoreBadge: {
    width: 52, height: 52, borderRadius: 26, borderWidth: 2,
    justifyContent: 'center', alignItems: 'center',
  },
  scoreText: { fontSize: 16, fontWeight: '800' },
  errorText: { color: '#ff6b6b', fontSize: 15, marginBottom: 16 },
  retryBtn: { backgroundColor: '#00d4ff', borderRadius: 8, paddingHorizontal: 20, paddingVertical: 10 },
  retryText: { color: '#0a0a0f', fontWeight: '700' },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 8 },
  emptyText: { color: '#888', fontSize: 14, textAlign: 'center' },
});
