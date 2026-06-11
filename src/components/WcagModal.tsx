import React from 'react';
import {
  Modal, View, Text, StyleSheet, ScrollView, TouchableOpacity,
} from 'react-native';
import { colors } from '../theme';

type Level = 'A' | 'AA' | 'AAA';
interface Check { wcag: string; level: Level; title: string; category: 'HTML' | 'CSS' }

const WCAG_CHECKS: Check[] = [
  { wcag: '1.1.1', level: 'A', title: 'Alt Text Kontrolü', category: 'HTML' },
  { wcag: '1.2.2', level: 'A', title: 'Video Altyazı Kontrolü', category: 'HTML' },
  { wcag: '1.2.3', level: 'A', title: 'Ses Açıklaması Kontrolü', category: 'HTML' },
  { wcag: '1.3.1', level: 'A', title: 'Semantik HTML Yapısı', category: 'HTML' },
  { wcag: '1.3.2', level: 'A', title: 'Anlamlı İçerik Sırası', category: 'HTML' },
  { wcag: '1.4.1', level: 'A', title: 'Renk Bağımlılığı', category: 'HTML' },
  { wcag: '1.4.3', level: 'AA', title: 'Renk Kontrastı (Metin)', category: 'HTML' },
  { wcag: '1.4.4', level: 'AA', title: 'Metin Boyutu', category: 'HTML' },
  { wcag: '1.4.11', level: 'AA', title: 'Metin Dışı Kontrast', category: 'HTML' },
  { wcag: '1.4.12', level: 'AA', title: 'Metin Aralığı', category: 'HTML' },
  { wcag: '2.4.6', level: 'AA', title: 'Başlık Hiyerarşisi', category: 'HTML' },
  { wcag: '2.4.2', level: 'A', title: 'Sayfa Başlığı', category: 'HTML' },
  { wcag: '2.4.7', level: 'AA', title: 'Odak Görünürlüğü', category: 'HTML' },
  { wcag: '2.4.1', level: 'A', title: 'Skip Navigation', category: 'HTML' },
  { wcag: '3.3.2', level: 'A', title: 'Form Etiket Kontrolü', category: 'HTML' },
  { wcag: '3.3.1', level: 'A', title: 'Hata Tanımlama', category: 'HTML' },
  { wcag: '3.1.1', level: 'A', title: 'Dil Attribute Kontrolü', category: 'HTML' },
  { wcag: '3.1.2', level: 'AA', title: 'Dil Değişikliği', category: 'HTML' },
  { wcag: '1.3.5', level: 'AA', title: 'Input Type Kullanımı', category: 'HTML' },
  { wcag: '2.1.1', level: 'A', title: 'Klavye Erişimi', category: 'HTML' },
  { wcag: '2.4.3', level: 'A', title: 'Tabindex Kullanımı', category: 'HTML' },
  { wcag: '4.1.2', level: 'A', title: 'Boş Buton ve Link', category: 'HTML' },
  { wcag: '4.1.2', level: 'A', title: 'ARIA Kullanımı', category: 'HTML' },
  { wcag: '1.3.1', level: 'A', title: 'Tablo Erişilebilirliği', category: 'HTML' },
  { wcag: '1.4.2', level: 'A', title: 'Otomatik Oynatılan Medya', category: 'HTML' },
  { wcag: '1.4.4', level: 'AA', title: 'Viewport Meta', category: 'HTML' },
  { wcag: '2.5.1', level: 'A', title: 'Pointer Hareketleri', category: 'HTML' },
  { wcag: '2.5.3', level: 'A', title: 'İsimde Etiket', category: 'HTML' },
  { wcag: '4.1.3', level: 'AA', title: 'Durum Mesajları', category: 'HTML' },
  { wcag: '2.3.3', level: 'AAA', title: 'Animasyon Kontrolü', category: 'HTML' },
  { wcag: '1.4.4', level: 'AA', title: 'CSS Font Boyutu', category: 'CSS' },
  { wcag: '2.4.7', level: 'AA', title: 'CSS Focus Outline', category: 'CSS' },
  { wcag: '1.4.3', level: 'AA', title: 'CSS Renk Kontrastı (UI)', category: 'CSS' },
  { wcag: '2.4.7', level: 'A', title: 'CSS Cursor', category: 'CSS' },
  { wcag: '1.4.10', level: 'AA', title: 'CSS Reflow (320px)', category: 'CSS' },
  { wcag: '2.3.3', level: 'AAA', title: 'CSS Animasyon (prefers-motion)', category: 'CSS' },
  { wcag: '1.4.13', level: 'AA', title: 'CSS Gizleme', category: 'CSS' },
  { wcag: '2.5.5', level: 'AA', title: 'Touch Target Boyutu', category: 'CSS' },
  { wcag: '1.4.12', level: 'AA', title: 'CSS Satır Yüksekliği', category: 'CSS' },
  { wcag: '1.4.12', level: 'AA', title: 'CSS Harf Aralığı', category: 'CSS' },
  { wcag: '2.4.3', level: 'A', title: 'Odak Sırası', category: 'CSS' },
  { wcag: '2.4.4', level: 'A', title: 'Bağlantı Amacı', category: 'CSS' },
  { wcag: '2.4.5', level: 'AA', title: 'Çoklu Erişim Yolları', category: 'CSS' },
  { wcag: '2.4.6', level: 'AA', title: 'Açıklayıcı Başlık & Etiket', category: 'CSS' },
  { wcag: '3.3.5', level: 'AAA', title: 'Giriş Yardımı', category: 'CSS' },
  { wcag: '3.3.4', level: 'AA', title: 'Hata Önleme', category: 'CSS' },
  { wcag: '3.2.3', level: 'AA', title: 'Tutarlı Navigasyon', category: 'CSS' },
  { wcag: '3.2.4', level: 'AA', title: 'Tutarlı Tanımlama', category: 'CSS' },
  { wcag: '1.4.13', level: 'AA', title: 'CSS İçerik Görünürlüğü', category: 'CSS' },
  { wcag: '1.4.11', level: 'AA', title: 'Non-text Renk Kontrastı (CSS)', category: 'CSS' },
];

function levelStyle(l: Level) {
  if (l === 'A') return { bg: 'rgba(239,68,68,0.18)', text: '#fca5a5' };
  if (l === 'AA') return { bg: 'rgba(245,158,11,0.18)', text: '#fcd34d' };
  return { bg: 'rgba(34,197,94,0.18)', text: '#86efac' };
}

const LEVELS = [
  { level: 'A', label: 'Temel', count: 30, c: '#f87171' },
  { level: 'AA', label: 'Standart', count: 20, c: '#fbbf24' },
  { level: 'AAA', label: 'Gelişmiş', count: 28, c: '#4ade80' },
];

function Row({ index, c }: { index: number; c: Check }) {
  const lc = levelStyle(c.level);
  return (
    <View style={styles.row}>
      <Text style={styles.rowNum}>{index}</Text>
      <Text style={styles.rowWcag}>{c.wcag}</Text>
      <View style={[styles.lvlBadge, { backgroundColor: lc.bg }]}>
        <Text style={[styles.lvlText, { color: lc.text }]}>{c.level}</Text>
      </View>
      <Text style={styles.rowTitle} numberOfLines={1}>{c.title}</Text>
    </View>
  );
}

export default function WcagModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const htmlChecks = WCAG_CHECKS.filter(c => c.category === 'HTML');
  const cssChecks = WCAG_CHECKS.filter(c => c.category === 'CSS');

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.qIcon}><Text style={styles.qText}>?</Text></View>
              <Text style={styles.headerTitle}>WCAG 2.1 Standartları Nedir?</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.body}>
            <Text style={styles.desc}>
              <Text style={styles.descBold}>WCAG</Text> (Web Content Accessibility Guidelines),
              web içeriklerinin engelli kullanıcılar için erişilebilir olmasını sağlayan
              uluslararası standartlardır. WCAG 2.1'de toplam{' '}
              <Text style={styles.cyan}>78 başarı kriteri</Text> bulunur, 3 seviyeye ayrılır:
            </Text>

            {/* Seviye kartları */}
            <View style={styles.levelRow}>
              {LEVELS.map(l => (
                <View key={l.level} style={[styles.levelCard, { borderColor: l.c + '55' }]}>
                  <Text style={[styles.levelCount, { color: l.c }]}>{l.count}</Text>
                  <Text style={styles.levelKontrol}>kontrol</Text>
                  <Text style={[styles.levelName, { color: l.c }]}>Seviye {l.level}</Text>
                  <Text style={styles.levelLabel}>{l.label}</Text>
                </View>
              ))}
            </View>

            {/* Notlar */}
            <View style={styles.noteAmber}>
              <Text style={styles.noteAmberText}>⚑ Kurumsal uyumluluk için AA seviyesi (50 kontrol) hedeflenir.</Text>
            </View>
            <View style={styles.noteCyan}>
              <Text style={styles.noteCyanText}>✓ AccessiScan, WCAG 2.1 AA seviyesinde 50 kontrol gerçekleştirir.</Text>
            </View>

            {/* HTML */}
            <View style={styles.catHeader}>
              <View style={[styles.catBadge, { backgroundColor: 'rgba(0,212,255,0.12)' }]}>
                <Text style={[styles.catBadgeText, { color: colors.cyan }]}>HTML</Text>
              </View>
              <Text style={styles.catCount}>30 kontrol</Text>
            </View>
            {htmlChecks.map((c, i) => <Row key={`h${i}`} index={i + 1} c={c} />)}

            {/* CSS */}
            <View style={[styles.catHeader, { marginTop: 14 }]}>
              <View style={[styles.catBadge, { backgroundColor: 'rgba(139,92,246,0.12)' }]}>
                <Text style={[styles.catBadgeText, { color: colors.purple2 }]}>CSS</Text>
              </View>
              <Text style={styles.catCount}>20 kontrol</Text>
            </View>
            {cssChecks.map((c, i) => <Row key={`c${i}`} index={i + 31} c={c} />)}

            <View style={{ height: 20 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: '#0e0e18', borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '92%', borderWidth: 1, borderColor: colors.border },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.border },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  qIcon: { width: 30, height: 30, borderRadius: 8, backgroundColor: 'rgba(0,212,255,0.1)', borderWidth: 1, borderColor: 'rgba(0,212,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  qText: { color: colors.cyan, fontWeight: '800' },
  headerTitle: { color: '#fff', fontWeight: '700', fontSize: 15, flex: 1 },
  closeBtn: { width: 30, height: 30, justifyContent: 'center', alignItems: 'center', borderRadius: 8 },
  closeText: { color: '#888', fontSize: 16 },
  body: { paddingHorizontal: 18, paddingTop: 16 },
  desc: { color: '#9ca3af', fontSize: 13, lineHeight: 20, marginBottom: 16 },
  descBold: { color: '#fff', fontWeight: '700' },
  cyan: { color: colors.cyan },
  levelRow: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  levelCard: { flex: 1, borderWidth: 1, borderRadius: 12, paddingVertical: 10, alignItems: 'center', backgroundColor: '#12121a' },
  levelCount: { fontSize: 22, fontWeight: '900' },
  levelKontrol: { color: '#666', fontSize: 9 },
  levelName: { fontSize: 11, fontWeight: '700', marginTop: 4 },
  levelLabel: { color: '#666', fontSize: 9, marginTop: 1 },
  noteAmber: { backgroundColor: 'rgba(245,158,11,0.08)', borderWidth: 1, borderColor: 'rgba(245,158,11,0.2)', borderRadius: 10, padding: 10, marginBottom: 8 },
  noteAmberText: { color: '#fcd34d', fontSize: 12, lineHeight: 17 },
  noteCyan: { backgroundColor: 'rgba(0,212,255,0.05)', borderWidth: 1, borderColor: 'rgba(0,212,255,0.15)', borderRadius: 10, padding: 10, marginBottom: 16 },
  noteCyanText: { color: '#7dd3fc', fontSize: 12, lineHeight: 17 },
  catHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  catBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  catBadgeText: { fontSize: 10, fontWeight: '700' },
  catCount: { color: '#666', fontSize: 10 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#12121a', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 7, marginBottom: 3 },
  rowNum: { color: '#555', fontSize: 10, width: 20, textAlign: 'right' },
  rowWcag: { color: '#888', fontSize: 10, width: 38, fontFamily: 'monospace' },
  lvlBadge: { paddingHorizontal: 5, paddingVertical: 1, borderRadius: 4 },
  lvlText: { fontSize: 9, fontWeight: '700' },
  rowTitle: { color: '#d1d5db', fontSize: 12, flex: 1 },
});
