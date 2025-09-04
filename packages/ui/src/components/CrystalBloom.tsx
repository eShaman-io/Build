import React, { useEffect } from 'react'
import { View } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  interpolate,
  Easing,
} from 'react-native-reanimated'

export interface CrystalBloomProps {
  size?: number
  color?: string
  intensity?: number
  trigger?: boolean
}

export function CrystalBloom({ 
  size = 100, 
  color = '#8FD3FF', 
  intensity = 1,
  trigger = false 
}: CrystalBloomProps) {
  const scale = useSharedValue(0)
  const rotation = useSharedValue(0)
  const opacity = useSharedValue(0)
  const shimmer = useSharedValue(0)

  useEffect(() => {
    if (trigger) {
      // Crystal bloom animation sequence
      scale.value = withSequence(
        withTiming(0, { duration: 0 }),
        withTiming(1.2, { duration: 400, easing: Easing.out(Easing.cubic) }),
        withTiming(1, { duration: 200, easing: Easing.inOut(Easing.quad) })
      )
      
      opacity.value = withSequence(
        withTiming(0, { duration: 0 }),
        withTiming(1, { duration: 300 }),
        withTiming(0.8, { duration: 500 })
      )
      
      rotation.value = withTiming(360, { 
        duration: 800, 
        easing: Easing.out(Easing.cubic) 
      })
      
      // Continuous shimmer effect
      shimmer.value = withRepeat(
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.sine) }),
        -1,
        true
      )
    }
  }, [trigger])

  const crystalStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` }
    ],
    opacity: opacity.value,
  }))

  const shimmerStyle = useAnimatedStyle(() => ({
    opacity: interpolate(shimmer.value, [0, 1], [0.3, 0.8]) * intensity,
  }))

  const createCrystalShard = (index: number, totalShards: number) => {
    const angle = (360 / totalShards) * index
    const distance = size * 0.3
    
    return (
      <Animated.View
        key={index}
        style={[
          {
            position: 'absolute',
            width: size * 0.15,
            height: size * 0.4,
            backgroundColor: color,
            borderRadius: size * 0.075,
            transform: [
              { translateX: Math.cos((angle * Math.PI) / 180) * distance },
              { translateY: Math.sin((angle * Math.PI) / 180) * distance },
              { rotate: `${angle + 90}deg` }
            ],
          },
          shimmerStyle
        ]}
      />
    )
  }

  return (
    <View style={{ 
      width: size, 
      height: size, 
      alignItems: 'center', 
      justifyContent: 'center' 
    }}>
      <Animated.View style={[crystalStyle]}>
        {/* Central crystal core */}
        <Animated.View
          style={[
            {
              width: size * 0.3,
              height: size * 0.3,
              backgroundColor: color,
              borderRadius: size * 0.15,
              position: 'absolute',
              shadowColor: color,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.8,
              shadowRadius: size * 0.1,
              elevation: 10,
            },
            shimmerStyle
          ]}
        />
        
        {/* Crystal shards */}
        {Array.from({ length: 8 }, (_, i) => createCrystalShard(i, 8))}
        
        {/* Outer glow ring */}
        <Animated.View
          style={[
            {
              width: size * 0.8,
              height: size * 0.8,
              borderRadius: size * 0.4,
              borderWidth: 2,
              borderColor: color,
              position: 'absolute',
              opacity: 0.3,
            },
            shimmerStyle
          ]}
        />
      </Animated.View>
    </View>
  )
}
