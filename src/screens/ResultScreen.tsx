import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, SafeAreaView,
  TouchableOpacity,
} from 'react-native';

interface WcagCheck {
  id: string;
  description: string;
  level: string;
  passed: boolean;
  details?: string;
}

interface ScanResult {
  score: number;
  url?: string;
  checks?: WcagCheck[];
  violations?: any[];
  passes?: any[];
  summary?: any;
}

function ScoreRing({ score }: { score: number }) {
  const color = score >= 80 ? '#00d4ff' : score >= 60 ? '#ffd700' : '#ff6b6b';
  return (
    <View style={[styles.scoreRing, { borderColor: color }]}>
      <Text style={[styles.scoreNumber, { color }]}>{score}</Text>
      <Text style={styles.scoreLabel}>/ 100</Text>
    </View>
  );
}

function CheckItem({ check }: { check: any }) {
  const passed = check.passed ?? check.type === 'passes';
  return (
    <View style={[styles.checkItem, { borderLeftColor: passed ? '#00d4ff' : '#ff6b6b' }]}>
      <View style={styles.checkHeader}>
        <Text style={styles.checkIcon}>{passed ? '✅' : '❌'}</Text>
        <View style={styles.checkContent}>
          <Text style={styles.checkId}>{check.id || check.rule}</Text>
          {check.level && <Text style={styles.checkLevel}>WCAG {check.level}</Text>}
        </View>
      </View>
      <Text style={styles.checkDesc}>{check.description || check.message}</Text>
      {check.details && <Text style={styles.checkDetails}>{check.details}</Text>}
    </View>
  );
}

export default function ResultScreen({ route, navigation }: any) {
  const result: ScanResult = route.params?.result || {};
  const score = result.score ?? 0;

  const checks: any[] = result.checks
    || [
        ...(result.violations || []).map((v: any) => ({ ...v, passed: false })),
        ...(result.passes || []).map((p: any) => ({ ...p, passed: true })),
      ];

  const passed = checks.filter((c) => c.passed);
  const failed = checks.filter((c) => !c.passed);

  const scoreColor = score >= 80 ? '#00d4ff' : score >= 60 ? '#ffd700' : '#ff6b6b';
  const scoreLabel = score >= 80 ? 'İyi' : score >= 60 ? 'Orta' : 'Zayıf';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.inner}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backText}>← Geri</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Tarama Sonucu</Text>
        </View>

        {result.url && <Text style={styles.urlText} numberOfLines={1}>{result.url}</Text>}

        {/* Score */}
        <View style={styles.scoreCard}>
          <ScoreRing score={score} />
          <View style={styles.scoreInfo}>
            <Text style={[styles.scoreGrade, { color: scoreColor }]}>{scoreLabel}</Text>
            <Text style={styles.scoreDesc}>Erişilebilirlik Skoru</Text>
            <View style={styles.scoreBadges}>
              <Text style={styles.badge}>✅ {passed.length} geçti</Text>
              <Text style={[styles.badge, styles.badgeFail]}>❌ {failed.length} başarısız</Text>
            </View>
          </View>
        </View>

        {/* Summary stats */}
        {result.summary && (
          <View style={styles.statsRow}>
            {Object.entries(result.summary).map(([k, v]) => (
              <View key={k} style={styles.statCard}>
                <Text style={styles.statValue}>{String(v)}</Text>
                <Text style={styles.statKey}>{k}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Failed */}
        {failed.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>❌ Başarısız Kontroller ({failed.length})</Text>
            {failed.map((c, i) => <CheckItem key={i} check={c} />)}
          </>
        )}

        {/* Passed */}
        {passed.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>✅ Geçen Kontroller ({passed.length})</Text>
            {passed.map((c, i) => <CheckItem key={i} check={c} />)}
          </>
        )}

        {checks.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Detaylı kontrol verisi bulunamadı.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0f' },
  inner: { padding: 20, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 12 },
  backBtn: { padding: 4 },
  backText: { color: '#00d4ff', fontSize: 15, fontWeight: '600' },
  title: { fontSize: 18, fontWeight: '700', color: '#fff' },
  urlText: { color: '#888', fontSize: 12, marginBottom: 16 },
  scoreCard: {
    backgroundColor: '#12121a', borderRadius: 16, padding: 20,
    flexDirection: 'row', alignItems: 'center', gap: 24,
    borderWidth: 1, borderColor: '#1e1e2e', marginBottom: 16,
  },
  scoreRing: {
    width: 90, height: 90, borderRadius: 45, borderWidth: 4,
    justifyContent: 'center', alignItems: 'center',
  },
  scoreNumber: { fontSize: 28, fontWeight: '800' },
  scoreLabel: { color: '#555', fontSize: 12 },
  scoreInfo: { flex: 1 },
  scoreGrade: { fontSize: 22, fontWeight: '800' },
  scoreDesc: { color: '#888', fontSize: 13, marginBottom: 8 },
  scoreBadges: { flexDirection: 'row', gap: 8 },
  badge: {
    backgroundColor: '#00d4ff22', color: '#00d4ff',
    fontSize: 12, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20,
  },
  badgeFail: { backgroundColor: '#ff6b6b22', color: '#ff6b6b' },
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  statCard: {
    backgroundColor: '#12121a', borderRadius: 10, padding: 12,
    alignItems: 'center', minWidth: 80, borderWidth: 1, borderColor: '#1e1e2e',
  },
  statValue: { color: '#00d4ff', fontSize: 18, fontWeight: '700' },
  statKey: { color: '#888', fontSize: 11, marginTop: 2 },
  sectionTitle: { color: '#fff', fontWeight: '700', fontSize: 15, marginTop: 16, marginBottom: 8 },
  checkItem: {
    backgroundColor: '#12121a', borderRadius: 10, padding: 14, marginBottom: 8,
    borderLeftWidth: 3, borderWidth: 1, borderColor: '#1e1e2e',
  },
  checkHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 6 },
  checkIcon: { fontSize: 16 },
  checkContent: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  checkId: { color: '#fff', fontWeight: '600', fontSize: 14, flex: 1 },
  checkLevel: {
    backgroundColor: '#00d4ff22', color: '#00d4ff',
    fontSize: 11, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10,
  },
  checkDesc: { color: '#aaa', fontSize: 13, lineHeight: 18 },
  checkDetails: { color: '#666', fontSize: 12, marginTop: 4 },
  emptyState: { alignItems: 'center', padding: 40 },
  emptyText: { color: '#555', fontSize: 15 },
});
