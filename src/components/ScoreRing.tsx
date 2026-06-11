import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { scoreColor, scoreLabel } from '../theme';

interface Props {
  score: number;
  size?: number;
  showLabel?: boolean;
  caption?: string;
}

// SVG'siz, çalışır halka: renkli kenarlık + ortada skor
export default function ScoreRing({ score, size = 90, showLabel = false, caption }: Props) {
  const color = scoreColor(score);
  return (
    <View style={{ alignItems: 'center', gap: 6 }}>
      <View
        style={[
          styles.ring,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderColor: color,
            borderWidth: Math.max(4, size * 0.07),
          },
        ]}
      >
        <Text style={[styles.num, { color: '#fff', fontSize: size * 0.34 }]}>{score}</Text>
        <Text style={[styles.outOf, { fontSize: size * 0.13 }]}>/100</Text>
        {showLabel && (
          <Text style={[styles.label, { color, fontSize: size * 0.13 }]}>{scoreLabel(score)}</Text>
        )}
      </View>
      {caption ? <Text style={styles.caption}>{caption}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  ring: { justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent' },
  num: { fontWeight: '800', lineHeight: undefined },
  outOf: { color: '#555', marginTop: -2 },
  label: { fontWeight: '700', marginTop: 1 },
  caption: { color: '#888', fontSize: 11, fontWeight: '500' },
});
