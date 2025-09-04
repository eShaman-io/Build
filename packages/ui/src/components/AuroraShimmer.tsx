import React, { useEffect } from 'react'
import { View, ViewProps } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
  Easing,
} from 'react-native-reanimated'
import { LinearGradient } from 'expo-linear-gradient'

export interface AuroraShimmerProps extends ViewProps {
  children: React.ReactNode
  colors?: string[]
  duration?: number
  intensity?: number
  direction?: 'horizontal' | 'vertical' | 'diagonal'
  isActive?: boolean
}

export function AuroraShimmer({
  children,
  colors = ['#6A00F4', '#00D4FF', '#8FD3FF', '#FFC1E3'],
  duration = 14000,
  intensity = 1,
  direction = 'diagonal',
  isActive = true,
  style,
  ...props
}: AuroraShimmerProps) {
  const shimmerProgress = useSharedValue(0)
  const pulseProgress = useSharedValue(0)

  useEffect(() => {
    if (isActive) {
      // Main aurora sweep animation
      shimmerProgress.value = withRepeat(
        withTiming(1, {
          duration,
          easing: Easing.inOut(Easing.sin),
        }),
        -1,
        false
      )

      // Subtle pulse animation
      pulseProgress.value = withRepeat(
        withTiming(1, {
          duration: duration * 0.3,
          easing: Easing.inOut(Easing.quad),
        }),
        -1,
        true
      )
    }
  }, [isActive, duration])

  const shimmerStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      shimmerProgress.value,
      [0, 1],
      direction === 'horizontal' ? [-200, 200] : [-100, 100]
    )
    
    const translateY = interpolate(
      shimmerProgress.value,
      [0, 1],
      direction === 'vertical' ? [-200, 200] : [-50, 50]
    )

    const opacity = interpolate(
      shimmerProgress.value,
      [0, 0.2, 0.5, 0.8, 1],
      [0.1, 0.6, 0.8, 0.6, 0.1]
    ) * intensity

    const scale = interpolate(
      pulseProgress.value,
      [0, 1],
      [1, 1.05]
    )

    return {
      transform: [
        { translateX },
        { translateY },
        { scale },
      ],
      opacity,
    }
  })

  const overlayStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      shimmerProgress.value,
      [0, 0.3, 0.7, 1],
      [0, 0.2, 0.2, 0]
    ) * intensity

    return {
      opacity,
    }
  })

  const getGradientDirection = () => {
    switch (direction) {
      case 'horizontal':
        return { start: { x: 0, y: 0.5 }, end: { x: 1, y: 0.5 } }
      case 'vertical':
        return { start: { x: 0.5, y: 0 }, end: { x: 0.5, y: 1 } }
      case 'diagonal':
      default:
        return { start: { x: 0, y: 0 }, end: { x: 1, y: 1 } }
    }
  }

  return (
    <View style={style} {...props}>
      {/* Base content */}
      {children}
      
      {/* Aurora shimmer overlay */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: (style as any)?.borderRadius || 0,
            overflow: 'hidden',
          },
          shimmerStyle,
        ]}
        pointerEvents="none"
      >
        <LinearGradient
          colors={[
            'transparent',
            ...colors.map(color => `${color}40`),
            'transparent',
          ]}
          {...getGradientDirection()}
          style={{
            flex: 1,
            transform: [
              { rotate: direction === 'diagonal' ? '45deg' : '0deg' }
            ],
          }}
        />
      </Animated.View>

      {/* Subtle glow overlay */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            top: -2,
            left: -2,
            right: -2,
            bottom: -2,
            borderRadius: ((style as any)?.borderRadius || 0) + 2,
            backgroundColor: colors[1],
          },
          overlayStyle,
        ]}
        pointerEvents="none"
      />
    </View>
  )
}
