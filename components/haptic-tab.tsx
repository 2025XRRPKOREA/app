import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import * as Haptics from 'expo-haptics';
import { Animated, Easing } from 'react-native';
import { useRef } from 'react';

export function HapticTab(props: BottomTabBarButtonProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const animatePress = () => {
    // Scale down animation
    Animated.sequence([
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0.85,
          duration: 100,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.6,
          duration: 100,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 4,
          tension: 100,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  };

  return (
    <Animated.View
      style={{
        transform: [{ scale: scaleAnim }],
        opacity: opacityAnim,
      }}
    >
      <PlatformPressable
        {...props}
        onPressIn={(ev) => {
          if (process.env.EXPO_OS === 'ios') {
            // Add a soft haptic feedback when pressing down on the tabs.
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
          animatePress();
          props.onPressIn?.(ev);
        }}
      />
    </Animated.View>
  );
}
