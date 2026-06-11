import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme';
import WcagModal from './WcagModal';

function planBadge(plan: string, cancelling: boolean) {
  if (plan === 'PRO' && cancelling) return { label: '⚠ Pro — İptal Sürecinde', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.4)', text: '#fbbf24' };
  if (plan === 'PRO') return { label: '⚜ Pro', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.4)', text: '#fbbf24' };
  if (plan === 'STARTER' && cancelling) return { label: '⚠ Starter — İptal', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)', text: '#fbbf24' };
  if (plan === 'STARTER') return { label: 'Starter', bg: 'rgba(0,212,255,0.1)', border: 'rgba(0,212,255,0.3)', text: colors.cyan };
  return { label: 'Free Plan', bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.1)', text: '#9ca3af' };
}

export default function Navbar() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [wcagOpen, setWcagOpen] = useState(false);

  const plan = user?.plan ?? 'FREE';
  const cancelling = user?.subscriptionStatus === 'cancelling';
  const badge = planBadge(plan, cancelling);
  const hasHistory = plan === 'STARTER' || plan === 'PRO';

  const go = (screen: string) => { setMenuOpen(false); navigation.navigate(screen); };

  return (
    <>
      <WcagModal visible={wcagOpen} onClose={() => setWcagOpen(false)} />

      <View style={[styles.bar, { paddingTop: insets.top + 8 }]}>
        {/* Logo */}
        <TouchableOpacity style={styles.logoWrap} onPress={() => navigation.navigate('Home')} activeOpacity={0.7}>
          <View style={styles.logoIcon}>
            <Text style={styles.logoPlus}>⊕</Text>
          </View>
          <Text style={styles.brand}>Accessi<Text style={styles.brandCyan}>Scan</Text></Text>
        </TouchableOpacity>

        {/* Sağ taraf */}
        {user && (
          <View style={styles.right}>
            {plan !== 'PRO' ? (
              <View style={styles.tokenPill}>
                <Text style={[styles.tokenText, { color: plan === 'STARTER' ? colors.cyan : '#9ca3af' }]}>
                  {user.tokens} token
                </Text>
              </View>
            ) : (
              <View style={styles.infinityPill}>
                <Text style={styles.infinityText}>∞ Sınırsız</Text>
              </View>
            )}

            <TouchableOpacity style={styles.menuBtn} onPress={() => setMenuOpen(true)}>
              <View style={styles.hamLine} />
              <View style={styles.hamLine} />
              <View style={styles.hamLine} />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Dropdown menü */}
      <Modal visible={menuOpen} transparent animationType="fade" onRequestClose={() => setMenuOpen(false)}>
        <Pressable style={styles.menuOverlay} onPress={() => setMenuOpen(false)}>
          <Pressable style={[styles.menu, { marginTop: insets.top + 56 }]} onPress={(e) => e.stopPropagation()}>
            {/* Email */}
            <View style={styles.menuAccount}>
              <Text style={styles.menuAccountLabel}>Hesap</Text>
              <Text style={styles.menuAccountEmail} numberOfLines={1}>{user?.email}</Text>
            </View>

            {/* Plan badge */}
            <TouchableOpacity
              style={[styles.menuItem, { backgroundColor: badge.bg, borderColor: badge.border, borderWidth: 1 }]}
              onPress={() => go('Pricing')}
            >
              <Text style={[styles.menuItemText, { color: badge.text, fontWeight: '700' }]}>{badge.label}</Text>
              {plan === 'PRO' && <Text style={styles.menuRight}>∞ Sınırsız</Text>}
            </TouchableOpacity>

            {/* Token */}
            {plan !== 'PRO' && (
              <View style={styles.menuItemPlain}>
                <Text style={styles.menuItemText}>Token</Text>
                <Text style={[styles.menuRight, { color: plan === 'STARTER' ? colors.cyan : '#d1d5db' }]}>{user?.tokens}</Text>
              </View>
            )}

            {/* Geçmiş */}
            <TouchableOpacity style={styles.menuItemPlain} onPress={() => go(hasHistory ? 'History' : 'Pricing')}>
              <Text style={[styles.menuItemText, !hasHistory && { color: '#666' }]}>🕘  Geçmiş</Text>
              {!hasHistory && <Text style={styles.lockBadge}>Kilitli</Text>}
            </TouchableOpacity>

            {/* Planlar */}
            <TouchableOpacity style={styles.menuItemPlain} onPress={() => go('Pricing')}>
              <Text style={styles.menuItemText}>💎  Planlar</Text>
            </TouchableOpacity>

            {/* WCAG */}
            <TouchableOpacity style={styles.menuItemPlain} onPress={() => { setMenuOpen(false); setWcagOpen(true); }}>
              <Text style={[styles.menuItemText, { color: colors.cyan }]}>?  WCAG Standartları Nedir?</Text>
            </TouchableOpacity>

            {/* Hesap Ayarları */}
            <TouchableOpacity style={styles.menuItemPlain} onPress={() => go('Account')}>
              <Text style={styles.menuItemText}>⚙  Hesap Ayarları</Text>
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            {/* Çıkış */}
            <TouchableOpacity style={styles.menuItemPlain} onPress={() => { setMenuOpen(false); logout(); }}>
              <Text style={[styles.menuItemText, { color: colors.redText }]}>⎋  Çıkış Yap</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingBottom: 12,
    backgroundColor: 'rgba(10,10,15,0.98)', borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  logoWrap: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoIcon: { width: 30, height: 30, borderRadius: 8, backgroundColor: 'rgba(0,212,255,0.2)', borderWidth: 1, borderColor: 'rgba(0,212,255,0.4)', justifyContent: 'center', alignItems: 'center' },
  logoPlus: { color: colors.cyan, fontSize: 16, fontWeight: '700' },
  brand: { fontSize: 18, fontWeight: '800', color: '#fff' },
  brandCyan: { color: colors.cyan },
  right: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  tokenPill: { backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5 },
  tokenText: { fontSize: 12, fontWeight: '700' },
  infinityPill: { backgroundColor: 'rgba(245,158,11,0.05)', borderWidth: 1, borderColor: 'rgba(245,158,11,0.3)', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4 },
  infinityText: { color: '#fbbf24', fontSize: 10, fontWeight: '700' },
  menuBtn: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center', gap: 4 },
  hamLine: { width: 18, height: 1.8, backgroundColor: '#9ca3af', borderRadius: 2 },
  menuOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  menu: { marginHorizontal: 12, backgroundColor: '#0d0d18', borderRadius: 14, borderWidth: 1, borderColor: colors.border, padding: 8, gap: 4 },
  menuAccount: { paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.03)', marginBottom: 2 },
  menuAccountLabel: { color: '#666', fontSize: 10, marginBottom: 2 },
  menuAccountEmail: { color: '#d1d5db', fontSize: 14 },
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 11, borderRadius: 10 },
  menuItemPlain: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 11, borderRadius: 10 },
  menuItemText: { color: '#d1d5db', fontSize: 14 },
  menuRight: { color: '#fbbf24', fontSize: 12, fontWeight: '700' },
  lockBadge: { color: '#666', fontSize: 10, borderWidth: 1, borderColor: '#444', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  menuDivider: { height: 1, backgroundColor: colors.border, marginVertical: 4 },
});
