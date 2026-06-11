import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScoreRing from '../components/ScoreRing';
import ChatWidget from '../components/ChatWidget';
import { colors, scoreColor } from '../theme';

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

// CSS check ID'leri (web AnalysisDetail ile aynı)
const CSS_IDS = new Set([
  'css_font_size', 'css_focus_outline', 'css_contrast', 'css_cursor',
  'css_reflow', 'css_animation', 'css_display_none', 'touch_target',
  'css_line_height', 'css_letter_spacing', 'focus_order', 'link_purpose',
  'multiple_ways', 'headings_labels', 'input_assistance', 'error_prevention',
  'consistent_nav', 'consistent_id', 'css_visibility', 'non_text_contrast_css',
]);

// POUR kategori haritası
type PourKey = 'P' | 'O' | 'U' | 'R';
const POUR_MAP: Record<string, PourKey> = {
  alt_text: 'P', heading_hierarchy: 'P', form_labels: 'P', css_font_size: 'P', font_size: 'P',
  css_contrast: 'P', contrast: 'P', viewport_meta: 'P', input_types: 'P', table_accessibility: 'P',
  autoplay_media: 'P', css_line_height: 'P', css_letter_spacing: 'P', non_text_contrast_css: 'P', css_reflow: 'P',
  tabindex: 'O', skip_navigation: 'O', page_title: 'O', css_focus_outline: 'O', css_cursor: 'O',
  touch_target: 'O', focus_order: 'O', link_purpose: 'O', multiple_ways: 'O', headings_labels: 'O', css_animation: 'O',
  lang_attribute: 'U', input_assistance: 'U', error_prevention: 'U', consistent_nav: 'U', consistent_id: 'U',
  empty_buttons_links: 'R', aria_references: 'R', css_display_none: 'R', css_visibility: 'R',
};
const POUR_DEFS: { key: PourKey; icon: string; name: string; sub: string; color: string }[] = [
  { key: 'P', icon: '🎨', name: 'Algılanabilirlik', sub: 'Perceivable', color: '#00d4ff' },
  { key: 'O', icon: '⌨️', name: 'Kullanılabilirlik', sub: 'Operable', color: '#39ff14' },
  { key: 'U', icon: '💡', name: 'Anlaşılabilirlik', sub: 'Understandable', color: '#f59e0b' },
  { key: 'R', icon: '🔧', name: 'Sağlamlık', sub: 'Robust', color: '#8b5cf6' },
];

function calcScore(results: CheckResult[]): number {
  if (!results.length) return 0;
  const earned = results.reduce((s, r) => s + (r.score || 0), 0);
  const max = results.reduce((s, r) => s + (r.maxScore || 0), 0);
  return max > 0 ? Math.round((earned / max) * 100) : 0;
}

function CheckItem({ check, expanded, onToggle }: { check: CheckResult; expanded: boolean; onToggle: () => void }) {
  return (
    <TouchableOpacity
      style={[s.checkCard, { borderLeftColor: check.passed ? '#22c55e' : '#ef4444' }]}
      onPress={onToggle}
      activeOpacity={0.7}
    >
      <View style={s.checkHeader}>
        <Text style={s.checkIcon}>{check.passed ? '✅' : '❌'}</Text>
        <View style={s.checkMeta}>
          <Text style={s.checkTitle} numberOfLines={expanded ? undefined : 2}>{check.title}</Text>
          <View style={s.checkBadges}>
            {!!check.wcag && <Text style={s.wcagBadge}>WCAG {check.wcag}</Text>}
            {!!check.level && <Text style={s.levelBadge}>{check.level}</Text>}
          </View>
        </View>
        <Text style={s.chevron}>{expanded ? '▲' : '▼'}</Text>
      </View>
      {expanded && (
        <View style={s.checkBody}>
          {check.issues?.length > 0 && (
            <>
              <Text style={s.bodyLabel}>Sorunlar</Text>
              {check.issues.map((iss, i) => <Text key={i} style={s.bodyItem}>• {iss}</Text>)}
            </>
          )}
          {check.suggestions?.length > 0 && (
            <>
              <Text style={[s.bodyLabel, { color: colors.cyan, marginTop: 8 }]}>Öneriler</Text>
              {check.suggestions.map((sug, i) => <Text key={i} style={[s.bodyItem, { color: '#6ee7f7' }]}>→ {sug}</Text>)}
            </>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

export default function ResultScreen({ route, navigation }: any) {
  const raw = route.params?.result;
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const toggle = (id: string) => setExpanded(prev => {
    const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next;
  });

  // Normalize: hem analiz cevabı hem geçmiş kaydı
  const data = useMemo(() => {
    if (!raw) return null;
    let htmlResults: CheckResult[];
    let cssResults: CheckResult[];
    let htmlScore: number, cssScore: number, totalScore: number;
    let aiInsights = raw.aiInsights ?? null;
    let analysisId = raw.analysisId ?? raw.id;

    if (Array.isArray(raw.htmlResults) || Array.isArray(raw.cssResults)) {
      htmlResults = raw.htmlResults ?? [];
      cssResults = raw.cssResults ?? [];
      htmlScore = raw.htmlScore ?? calcScore(htmlResults);
      cssScore = raw.cssScore ?? calcScore(cssResults);
      totalScore = raw.totalScore ?? raw.score ?? 0;
    } else {
      const all: CheckResult[] = Array.isArray(raw.results) ? raw.results : [];
      htmlResults = all.filter(r => !CSS_IDS.has(r.id));
      cssResults = all.filter(r => CSS_IDS.has(r.id));
      htmlScore = calcScore(htmlResults);
      cssScore = calcScore(cssResults);
      totalScore = raw.score ?? 0;
    }
    return { htmlResults, cssResults, htmlScore, cssScore, totalScore, aiInsights, analysisId };
  }, [raw]);

  if (!data) {
    return (
      <SafeAreaView style={s.container}>
        <View style={s.center}>
          <Text style={s.errText}>Sonuç bulunamadı.</Text>
          <TouchableOpacity style={s.backFull} onPress={() => navigation.goBack()}>
            <Text style={s.backFullText}>← Geri Dön</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const allChecks = [...data.htmlResults, ...data.cssResults];
  const totalPassed = allChecks.filter(c => c.passed).length;
  const totalFailed = allChecks.length - totalPassed;

  // POUR gruplama
  const byPour = (key: PourKey) => allChecks.filter(c => POUR_MAP[c.id] === key);

  return (
    <SafeAreaView style={s.container} edges={['top']}>
      <ScrollView contentContainerStyle={s.inner}>
        <TouchableOpacity style={s.back} onPress={() => navigation.goBack()}>
          <Text style={s.backText}>← Geri</Text>
        </TouchableOpacity>

        {/* Skor halkaları */}
        <View style={s.scoreCard}>
          <ScoreRing score={data.totalScore} size={120} showLabel caption="Genel Skor" />
          <View style={s.subRings}>
            <ScoreRing score={data.htmlScore} size={64} caption="HTML" />
            <ScoreRing score={data.cssScore} size={64} caption="CSS" />
          </View>
        </View>

        {/* Özet */}
        <View style={s.statsRow}>
          <View style={[s.statCard, { borderColor: 'rgba(34,197,94,0.3)' }]}>
            <Text style={[s.statNum, { color: '#22c55e' }]}>{totalPassed}</Text>
            <Text style={s.statLbl}>Geçti</Text>
          </View>
          <View style={[s.statCard, { borderColor: 'rgba(239,68,68,0.3)' }]}>
            <Text style={[s.statNum, { color: '#ef4444' }]}>{totalFailed}</Text>
            <Text style={s.statLbl}>Başarısız</Text>
          </View>
          <View style={[s.statCard, { borderColor: colors.border }]}>
            <Text style={[s.statNum, { color: colors.cyan }]}>{allChecks.length}</Text>
            <Text style={s.statLbl}>Toplam</Text>
          </View>
        </View>

        {/* AI Insights */}
        {data.aiInsights && (
          <View style={s.aiCard}>
            <Text style={s.aiTitle}>🤖 AI Yorumu</Text>
            {!!data.aiInsights.scoreComment && <Text style={s.aiComment}>{data.aiInsights.scoreComment}</Text>}
            {(data.aiInsights.criticalIssues ?? []).slice(0, 3).map((ci: any, i: number) => (
              <View key={i} style={s.aiIssue}>
                <Text style={s.aiProblem}>⚠ {ci.issue}</Text>
                <Text style={s.aiSolution}>→ {ci.solution}</Text>
              </View>
            ))}
            {!!data.aiInsights.generalAdvice && <Text style={s.aiAdvice}>{data.aiInsights.generalAdvice}</Text>}
          </View>
        )}

        {/* POUR kategorileri */}
        {POUR_DEFS.map(def => {
          const checks = byPour(def.key);
          if (checks.length === 0) return null;
          const passed = checks.filter(c => c.passed).length;
          return (
            <View key={def.key} style={s.pourSection}>
              <View style={s.pourHeader}>
                <Text style={s.pourIcon}>{def.icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[s.pourName, { color: def.color }]}>{def.name}</Text>
                  <Text style={s.pourSub}>{def.sub}</Text>
                </View>
                <Text style={[s.pourCount, { color: def.color }]}>{passed}/{checks.length}</Text>
              </View>
              {checks.map(c => (
                <CheckItem key={c.id} check={c} expanded={expanded.has(c.id)} onToggle={() => toggle(c.id)} />
              ))}
            </View>
          );
        })}

        {/* Sınıflandırılmamış kontroller (POUR haritasında olmayanlar) */}
        {(() => {
          const rest = allChecks.filter(c => !POUR_MAP[c.id]);
          if (rest.length === 0) return null;
          return (
            <View style={s.pourSection}>
              <View style={s.pourHeader}>
                <Text style={s.pourIcon}>📋</Text>
                <View style={{ flex: 1 }}><Text style={[s.pourName, { color: '#9ca3af' }]}>Diğer Kontroller</Text></View>
                <Text style={[s.pourCount, { color: '#9ca3af' }]}>{rest.filter(c => c.passed).length}/{rest.length}</Text>
              </View>
              {rest.map(c => (
                <CheckItem key={c.id} check={c} expanded={expanded.has(c.id)} onToggle={() => toggle(c.id)} />
              ))}
            </View>
          );
        })()}

        <View style={{ height: 80 }} />
      </ScrollView>

      <ChatWidget analysisId={data.analysisId} />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  inner: { padding: 16, paddingBottom: 40 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  errText: { color: colors.redText, fontSize: 15, marginBottom: 16 },
  backFull: { backgroundColor: colors.surface, borderRadius: 8, paddingHorizontal: 20, paddingVertical: 10 },
  backFullText: { color: colors.cyan, fontWeight: '600' },
  back: { marginBottom: 14 },
  backText: { color: colors.cyan, fontSize: 14, fontWeight: '600' },
  scoreCard: { backgroundColor: colors.card, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: colors.border, alignItems: 'center', marginBottom: 14 },
  subRings: { flexDirection: 'row', gap: 36, marginTop: 18 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  statCard: { flex: 1, backgroundColor: colors.card, borderWidth: 1, borderRadius: 12, alignItems: 'center', paddingVertical: 12 },
  statNum: { fontSize: 22, fontWeight: '800' },
  statLbl: { color: '#666', fontSize: 11, marginTop: 2 },
  aiCard: { backgroundColor: '#0d1117', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: 'rgba(0,212,255,0.2)', marginBottom: 14 },
  aiTitle: { color: colors.cyan, fontWeight: '700', fontSize: 14, marginBottom: 8 },
  aiComment: { color: '#cbd5e1', fontSize: 13, lineHeight: 19, marginBottom: 8 },
  aiIssue: { backgroundColor: colors.card, borderRadius: 8, padding: 10, marginBottom: 6 },
  aiProblem: { color: '#fbbf24', fontSize: 12, marginBottom: 4, lineHeight: 17 },
  aiSolution: { color: '#6ee7f7', fontSize: 12, lineHeight: 17 },
  aiAdvice: { color: '#9ca3af', fontSize: 12, lineHeight: 18, marginTop: 4, fontStyle: 'italic' },
  pourSection: { marginBottom: 16 },
  pourHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  pourIcon: { fontSize: 20 },
  pourName: { fontWeight: '700', fontSize: 15 },
  pourSub: { color: '#666', fontSize: 11 },
  pourCount: { fontWeight: '800', fontSize: 14 },
  checkCard: { backgroundColor: colors.card, borderRadius: 10, padding: 12, marginBottom: 6, borderLeftWidth: 3, borderWidth: 1, borderColor: colors.border },
  checkHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  checkIcon: { fontSize: 14, marginTop: 2 },
  checkMeta: { flex: 1 },
  checkTitle: { color: '#fff', fontSize: 13, fontWeight: '600', lineHeight: 18 },
  checkBadges: { flexDirection: 'row', gap: 6, marginTop: 4, flexWrap: 'wrap' },
  wcagBadge: { backgroundColor: 'rgba(0,212,255,0.15)', color: colors.cyan, fontSize: 10, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10, overflow: 'hidden' },
  levelBadge: { backgroundColor: 'rgba(139,92,246,0.15)', color: '#a78bfa', fontSize: 10, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10, overflow: 'hidden' },
  chevron: { color: '#555', fontSize: 10, marginTop: 4 },
  checkBody: { marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: colors.border },
  bodyLabel: { color: '#f87171', fontSize: 11, fontWeight: '700', marginBottom: 4 },
  bodyItem: { color: '#9ca3af', fontSize: 12, lineHeight: 18 },
});
