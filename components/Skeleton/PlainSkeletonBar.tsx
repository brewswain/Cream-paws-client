import { useEffect, useRef } from "react";
import {
  Animated,
  type DimensionValue,
  type StyleProp,
  type ViewStyle,
} from "react-native";

type PlainSkeletonBarProps = {
  width?: DimensionValue;
  height?: number;
  style?: StyleProp<ViewStyle>;
};

/** Avoids @rneui Skeleton without ThemeProvider (empty theme colors → invalid brush). */
export function PlainSkeletonBar({
  width = "100%",
  height = 14,
  style,
}: PlainSkeletonBarProps) {
  const pulse = useRef(new Animated.Value(0.55)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 750,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0.45,
          duration: 750,
          useNativeDriver: true,
        }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [pulse]);

  return (
    <Animated.View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        {
          width,
          height,
          borderRadius: 4,
          backgroundColor: "#c5cdd5",
          opacity: pulse,
        },
        style,
      ]}
    />
  );
}
