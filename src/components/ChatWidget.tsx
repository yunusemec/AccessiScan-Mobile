import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Modal, TextInput,
  ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { aiAPI } from '../services/api';
import { colors } from '../theme';

interface Message { role: 'user' | 'ai'; text: string }

export default function ChatWidget({ analysisId }: { analysisId?: string }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: 'Merhaba! Web erişilebilirliği hakkında sorularınızı yanıtlamaya hazırım. 🤖' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (open) setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  }, [open, messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setMessages(prev => [...prev, { role: 'user', text }]);
    setInput('');
    setLoading(true);
    try {
      const res = await aiAPI.chat(text, analysisId);
      setMessages(prev => [...prev, { role: 'ai', text: res.data.reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: 'Bir hata oluştu. Lütfen tekrar deneyin.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => setOpen(true)} activeOpacity={0.85}>
        <Text style={styles.fabIcon}>💬</Text>
      </TouchableOpacity>

      <Modal visible={open} animationType="slide" transparent onRequestClose={() => setOpen(false)}>
        <KeyboardAvoidingView style={styles.overlay} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.panel}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <View style={styles.botIcon}><Text>🤖</Text></View>
                <View>
                  <Text style={styles.headerTitle}>AccessiScan AI</Text>
                  {analysisId ? <Text style={styles.headerSub}>Analiz bağlamı aktif</Text> : null}
                </View>
              </View>
              <TouchableOpacity onPress={() => setOpen(false)} style={styles.closeBtn}>
                <Text style={styles.closeText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Messages */}
            <ScrollView ref={scrollRef} style={styles.messages} contentContainerStyle={{ padding: 14, gap: 10 }}>
              {messages.map((m, i) => (
                <View key={i} style={[styles.bubbleRow, m.role === 'user' ? styles.rowEnd : styles.rowStart]}>
                  <View style={[styles.bubble, m.role === 'user' ? styles.bubbleUser : styles.bubbleAi]}>
                    <Text style={[styles.bubbleText, m.role === 'user' ? styles.bubbleTextUser : styles.bubbleTextAi]}>
                      {m.text}
                    </Text>
                  </View>
                </View>
              ))}
              {loading && (
                <View style={[styles.bubbleRow, styles.rowStart]}>
                  <View style={[styles.bubble, styles.bubbleAi]}>
                    <ActivityIndicator color="#888" size="small" />
                  </View>
                </View>
              )}
            </ScrollView>

            {/* Input */}
            <View style={styles.inputBar}>
              <TextInput
                style={styles.input}
                value={input}
                onChangeText={setInput}
                placeholder="Bir şey sorun..."
                placeholderTextColor="#555"
                onSubmitEditing={sendMessage}
                returnKeyType="send"
              />
              <TouchableOpacity
                style={[styles.sendBtn, (!input.trim() || loading) && { opacity: 0.4 }]}
                onPress={sendMessage}
                disabled={!input.trim() || loading}
              >
                <Text style={styles.sendIcon}>➤</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute', bottom: 24, right: 20, width: 56, height: 56, borderRadius: 18,
    backgroundColor: colors.cyan, justifyContent: 'center', alignItems: 'center',
    shadowColor: colors.cyan, shadowOpacity: 0.5, shadowRadius: 12, shadowOffset: { width: 0, height: 4 },
    elevation: 8, zIndex: 50,
  },
  fabIcon: { fontSize: 24 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  panel: { height: '75%', backgroundColor: '#0d0d18', borderTopLeftRadius: 20, borderTopRightRadius: 20, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border, backgroundColor: colors.card },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  botIcon: { width: 32, height: 32, borderRadius: 10, backgroundColor: 'rgba(0,212,255,0.2)', borderWidth: 1, borderColor: 'rgba(0,212,255,0.3)', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { color: '#fff', fontSize: 13, fontWeight: '700' },
  headerSub: { color: colors.cyan, fontSize: 10 },
  closeBtn: { width: 30, height: 30, justifyContent: 'center', alignItems: 'center' },
  closeText: { color: '#888', fontSize: 16 },
  messages: { flex: 1 },
  bubbleRow: { flexDirection: 'row' },
  rowEnd: { justifyContent: 'flex-end' },
  rowStart: { justifyContent: 'flex-start' },
  bubble: { maxWidth: '85%', paddingHorizontal: 12, paddingVertical: 9, borderRadius: 14 },
  bubbleUser: { backgroundColor: colors.cyan, borderBottomRightRadius: 4 },
  bubbleAi: { backgroundColor: '#1e1e2e', borderBottomLeftRadius: 4 },
  bubbleText: { fontSize: 13, lineHeight: 18 },
  bubbleTextUser: { color: '#0a0a0f', fontWeight: '500' },
  bubbleTextAi: { color: '#d1d5db' },
  inputBar: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.card },
  input: { flex: 1, backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.border, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10, color: '#fff', fontSize: 13 },
  sendBtn: { width: 40, height: 40, borderRadius: 14, backgroundColor: colors.cyan, justifyContent: 'center', alignItems: 'center' },
  sendIcon: { color: '#0a0a0f', fontSize: 14, fontWeight: '700' },
});
