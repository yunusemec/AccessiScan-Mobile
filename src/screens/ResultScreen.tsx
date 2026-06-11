import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, SafeAreaView,
  TouchableOpacity,
} from 'react-native';

interface CheckResult {
  id: string;
  title: string;
  passed: boolean;
  score: number;
  maxScore: number;
  issues: string[];
  suggestions: string[];
  wcag?: string;
  level?: string;
}

interface AnalysisResult {
  htmlScore: number;
  cssScore: number;
  totalScore: number;
  htmlResults: CheckResult[];
  cssResults: CheckResult[];
  tokensLeft?: number;
  aiInsights?: {
    criticalIssues: { issue: string; solution: string }[];
    scoreComment: string;
    generalAdvice: string;
  } | null;
}

function scoreColor(score: number) {
  if (score >= 75) return '#39ff14';
  if (score >= 50) return '#fbbf24';
  return '#f87171';
}

function ScoreRing({ score, size = 80 }: { score: number; size?: number }) {
  const color = scoreColor(score);
  return (
    <View style={[s.ring, { width: size, height: size, borderRadius: size / 2, borderColor: color }]}>
      <Text style={[s.ringNum, { color, fontSize: size * 0.32 }]}>{score}</Text>
    </View>
  );
}

function CheckItem({ check, expanded, onToggle }: { check: CheckResult; expanded: boolean; onToggle: () => void }) {
  return (
    <TouchableOpacity style={[s.checkCard, { borderLeftColor: check.passed ? '#39ff14' : '#f87171' }]} onPress={onToggle} activeOpacity={0.7}>
      <View style={s.checkHeader}>
        <Text style={s.checkIcon}>{check.passed ? '✅' : '❌'}</Text>
        <View style={s.checkMeta}>
          <Text style={s.checkTitle} numberOfLines={expanded ? undefined : 1}>{check.title}</Text>
          <View style={s.checkBadges}>
            {check.wcag && <Text style={s.wcagBadge}>WCAG {check.wcag}</Text>}
            {check.level && <Text style={s.levelBadge}>{check.level}</Text>}
          </View>
        </View>
        <Text style={s.chevron}>{expanded ? '▲' : '▼'}</Text>
      </View>

      {expanded && (
        <View style={s.checkBody}>
          {check.issues.length > 0 && (
            <>
              <Text style={s.bodyLabel}>Sorunlar</Text>
              {check.issues.map((iss, i) => (
                <Text key={i} style={s.bodyItem}>• {iss}</Text>
              ))}
            </>
          )}
          {check.suggestions.length > 0 && (
            <>
              <Text style={[s.bodyLabel, { color: '#00d4ff', marginTop: 8 }]}>Öneriler</Text>
              {check.suggestions.map((sug, i) => (
                <Text key={i} style={[s.bodyItem, { color: '#6ee7f7' }]}>→ {sug}</Text>
              ))}
            </>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

type Section = 'html' | 'css';

export default function ResultScreen({ route, navigation }: any) {
  const result: AnalysisResult = route.params?.result;
  const [section, setSection] = useState<Section>('html');
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  if (!result) {
    return (
      <SafeAreaView style={s.container}>
        <View style={s.center}>
          <Text style={s.errorText}>Sonuç bulunamadı.</Text>
          <TouchableOpacity style={s.backBtnFull} onPress={() => navigation.goBack()}>
            <Text style={s.backBtnText}>← Geri Dön</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const toggle = (id: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const checks = section === 'html' ? result.htmlResults : result.cssResults;
  const failed = checks.filter(c => !c.passed);
  const passed = checks.filter(c => c.passed);

  const totalPassed = [...result.htmlResults, ...result.cssResults].filter(c => c.passed).length;
  const totalFailed = [...result.htmlResults, ...result.cssResults].filter(c => !c.passed).length;

  return (
    <SafeAreaView style={s.container}>
      <ScrollView contentContainerStyle={s.inner}>

        {/* Back */}
        <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
          <Text style={s.backText}>← Geçmişe / Ana Sayfa</Text>
        </TouchableOpacity>

        {/* Score cards */}
        <View style={s.scoreRow}>
          <View style={s.scoreCard}>
            <ScoreRing score={result.totalScore} size={72} />
            <Text style={s.scoreLabel}>Toplam</Text>
          </View>
          <View style={s.scoreCard}>
            <ScoreRing score={result.htmlScore} size={56} />
            <Text style={s.scoreLabel}>HTML</Text>
          </View>
          <View style={s.scoreCard}>
            <ScoreRing score={result.cssScore} size={56} />
            <Text style={s.scoreLabel}>CSS</Text>
          </View>
        </View>

        {/* Summary badges */}
        <View style={s.summaryRow}>
          <View style={s.summaryBadge}>
            <Text style={s.summaryNum}>{totalPassed}</Text>
            <Text style={s.summaryLbl}>geçti</Text>
          </View>
          <View style={[s.summaryBadge, s.summaryBadgeFail]}>
            <Text style={[s.summaryNum, { color: '#f87171' }]}>{totalFailed}</Text>
            <Text style={s.summaryLbl}>başarısız</Text>
          </View>
        </View>

        {/* AI Insights */}
        {result.aiInsights && (
          <View style={s.aiCard}>
            <Text style={s.aiTitle}>🤖 AI Yorumu</Text>
            <Text style={s.aiComment}>{result.aiInsights.scoreComment}</Text>
            {result.aiInsights.criticalIssues.slice(0, 2).map((ci, i) => (
              <View key={i} style={s.aiIssue}>
                <Text style={s.aiIssueProblem}>⚠ {ci.issue}</Text>
                <Text style={s.aiIssueSolution}>→ {ci.solution}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Section tabs */}
        <View style={s.sectionTabs}>
          {(['html', 'css'] as Section[]).map(sec => (
            <TouchableOpacity
              key={sec}
              style={[s.sectionTab, section === sec && s.sectionTabActive]}
              onPress={() => setSection(sec)}
            >
              <Text style={[s.sectionTabText, section === sec && s.sectionTabTextActive]}>
                {sec === 'html' ? 'HTML Kontrolleri' : 'CSS Kontrolleri'}
                {' '}({sec === 'html' ? result.htmlResults.length : result.cssResults.length})
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Failed */}
        {failed.length > 0 && (
          <>
            <Text style={s.sectionTitle}>❌ Başarısız ({failed.length})</Text>
            {failed.map(c => (
              <CheckItem
                key={c.id}
                check={c}
                expanded={expanded.has(c.id)}
                onToggle={() => toggle(c.id)}
              />
            ))}
          </>
        )}

        {/* Passed */}
        {passed.length > 0 && (
          <>
            <Text style={[s.sectionTitle, { color: '#6ee7f7' }]}>✅ Geçti ({passed.length})</Text>
            {passed.map(c => (
              <CheckItem
                key={c.id}
                check={c}
                expanded={expanded.has(c.id)}
                onToggle={() => toggle(c.id)}
              />
            ))}
          </>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0f' },
  inner: { padding: 16, paddingBottom: 40 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  errorText: { color: '#f87171', fontSize: 15, marginBottom: 16 },
  backBtnFull: { backgroundColor: '#1a1a2e', borderRadius: 8, paddingHorizontal: 20, paddingVertical: 10 },
  backBtnText: { color: '#00d4ff', fontWeight: '600' },
  backBtn: { marginBottom: 16 },
  backText: { color: '#00d4ff', fontSize: 13, fontWeight: '600' },

  scoreRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginBottom: 16 },
  scoreCard: { alignItems: 'center', gap: 6 },
  ring: { borderWidth: 3, justifyContent: 'center', alignItems: 'center' },
  ringNum: { fontWeight: '800' },
  scoreLabel: { color: '#888', fontSize: 11 },

  summaryRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  summaryBadge: {
    flex: 1, backgroundColor: 'rgba(57,255,20,0.1)', borderWidth: 1,
    borderColor: 'rgba(57,255,20,0.2)', borderRadius: 10,
    alignItems: 'center', paddingVertical: 10,
  },
  summaryBadgeFail: {
    backgroundColor: 'rgba(248,113,113,0.1)',
    borderColor: 'rgba(248,113,113,0.2)',
  },
  summaryNum: { color: '#39ff14', fontSize: 22, fontWeight: '800' },
  summaryLbl: { color: '#666', fontSize: 11, marginTop: 2 },

  aiCard: {
    backgroundColor: '#0d1117', borderRadius: 12, padding: 14,
    borderWidth: 1, borderColor: 'rgba(0,212,255,0.2)', marginBottom: 16,
  },
  aiTitle: { color: '#00d4ff', fontWeight: '700', fontSize: 13, marginBottom: 6 },
  aiComment: { color: '#aaa', fontSize: 13, lineHeight: 18, marginBottom: 8 },
  aiIssue: { marginTop: 6, backgroundColor: '#12121a', borderRadius: 8, padding: 10 },
  aiIssueProblem: { color: '#fbbf24', fontSize: 12, marginBottom: 4 },
  aiIssueSolution: { color: '#6ee7f7', fontSize: 12 },

  sectionTabs: { flexDirection: 'row', backgroundColor: '#12121a', borderRadius: 10, padding: 3, marginBottom: 14 },
  sectionTab: { flex: 1, paddingVertical: 9, borderRadius: 8, alignItems: 'center' },
  sectionTabActive: { backgroundColor: '#1e1e2e', borderBottomWidth: 2, borderBottomColor: '#00d4ff' },
  sectionTabText: { color: '#666', fontSize: 12, fontWeight: '600' },
  sectionTabTextActive: { color: '#fff' },

  sectionTitle: { color: '#f87171', fontWeight: '700', fontSize: 13, marginBottom: 8, marginTop: 4 },

  checkCard: {
    backgroundColor: '#12121a', borderRadius: 10, padding: 12, marginBottom: 6,
    borderLeftWidth: 3, borderWidth: 1, borderColor: '#1e1e2e',
  },
  checkHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  checkIcon: { fontSize: 14, marginTop: 2 },
  checkMeta: { flex: 1 },
  checkTitle: { color: '#fff', fontSize: 13, fontWeight: '600', lineHeight: 18 },
  checkBadges: { flexDirection: 'row', gap: 6, marginTop: 4, flexWrap: 'wrap' },
  wcagBadge: {
    backgroundColor: 'rgba(0,212,255,0.15)', color: '#00d4ff',
    fontSize: 10, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10,
  },
  levelBadge: {
    backgroundColor: 'rgba(139,92,246,0.15)', color: '#a78bfa',
    fontSize: 10, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10,
  },
  chevron: { color: '#555', fontSize: 10, marginTop: 4 },
  checkBody: { marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#1e1e2e' },
  bodyLabel: { color: '#f87171', fontSize: 11, fontWeight: '700', marginBottom: 4 },
  bodyItem: { color: '#aaa', fontSize: 12, lineHeight: 18 },
});
