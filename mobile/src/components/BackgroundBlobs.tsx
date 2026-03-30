import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Defs, Line, Pattern, Rect } from 'react-native-svg';
import { colors } from '../constants/theme';

export function BackgroundBlobs({ softened = false }: { softened?: boolean }) {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
      <View
        style={[
          styles.blob,
          styles.topBlob,
          { backgroundColor: softened ? 'rgba(123,27,27,0.05)' : colors.blobMaroon },
        ]}
      />
      <View
        style={[
          styles.blob,
          styles.bottomBlob,
          { backgroundColor: softened ? 'rgba(201,123,46,0.06)' : colors.blobPeach },
        ]}
      />
      <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
        <Defs>
          <Pattern id="linen" width="18" height="18" patternUnits="userSpaceOnUse">
            <Line x1="0" y1="18" x2="18" y2="0" stroke={colors.primaryDust} strokeOpacity="0.05" strokeWidth="0.8" />
            <Line x1="0" y1="9" x2="9" y2="0" stroke={colors.primaryDust} strokeOpacity="0.03" strokeWidth="0.8" />
          </Pattern>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#linen)" />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  blob: {
    position: 'absolute',
    zIndex: 0,
  },
  topBlob: {
    top: -88,
    right: -72,
    width: 260,
    height: 260,
    borderRadius: 130,
  },
  bottomBlob: {
    bottom: -72,
    left: -56,
    width: 220,
    height: 220,
    borderRadius: 110,
  },
});
