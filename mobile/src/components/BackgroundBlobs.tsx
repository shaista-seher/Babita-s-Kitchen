import React from 'react';
import { View } from 'react-native';
import { colors } from '../theme/colors';

export function BackgroundBlobs() {
  return (
    <>
      <View
        style={{
          position: 'absolute',
          top: -80,
          right: -80,
          width: 260,
          height: 260,
          borderRadius: 130,
          backgroundColor: colors.blobPink,
          zIndex: 0,
        }}
      />
      <View
        style={{
          position: 'absolute',
          bottom: -60,
          left: -60,
          width: 200,
          height: 200,
          borderRadius: 100,
          backgroundColor: colors.blobPeach,
          zIndex: 0,
        }}
      />
    </>
  );
}
