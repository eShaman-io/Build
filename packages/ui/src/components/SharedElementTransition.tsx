import React, { useEffect } from 'react'
import { View, ViewProps } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  interpolate,
  Easing,
  runOnJS,
} from 'react-native-reanimated'

export interface SharedElementTransitionProps extends ViewProps {
  children: React.ReactNode
  isActive?: boolean
  transitionKey: string
  fromBounds?: { x: number; y: number; width: number; height: number }
  toBounds?: { x: number; y: number; width: number; height: number }
  duration?: number
  onTransitionComplete?: () => void
  variant?: 'fade' | 'scale' | 'slide' | 'depth' | 'crystal'
}

export function SharedElementTransition({
  children,
  isActive = false,
  transitionKey,
  fromBounds,
  toBounds,
  duration = 300,
  onTransitionComplete,
  variant = 'crystal',
  style,
  ...props
}: SharedElementTransitionProps) {
  const progress = useSharedValue(0)
  const scale = useSharedValue(1)
  const opacity = useSharedValue(1)
  const translateX = useSharedValue(0)
  const translateY = useSharedValue(0)
  const rotateZ = useSharedValue(0)
  const blur = useSharedValue(0)

  useEffect(() => {
    if (isActive && fromBounds && toBounds) {
      // Calculate transformation values
      const scaleX = toBounds.width / fromBounds.width
      const scaleY = toBounds.height / fromBounds.height
      const deltaX = toBounds.x - fromBounds.x
      const deltaY = toBounds.y - fromBounds.y

      // Start transition based on variant
      switch (variant) {
        case 'crystal':
          // Crystal-like transformation with depth and shimmer
          progress.value = withTiming(1, {
            duration,
            easing: Easing.out(Easing.cubic),
          }, (finished) => {
            if (finished && onTransitionComplete) {
              runOnJS(onTransitionComplete)()
            }
          })
          
          scale.value = withSpring(Math.max(scaleX, scaleY), {
            damping: 15,
            stiffness: 150,
          })
          
          translateX.value = withTiming(deltaX, {
            duration,
            easing: Easing.out(Easing.cubic),
          })
          
          translateY.value = withTiming(deltaY, {
            duration,
            easing: Easing.out(Easing.cubic),
          })
          
          rotateZ.value = withTiming(360, {
            duration: duration * 1.5,
            easing: Easing.out(Easing.cubic),
          })
          
          blur.value = withTiming(10, {
            duration: duration * 0.3,
          }, () => {
            blur.value = withTiming(0, {
              duration: duration * 0.7,
            })
          })
          break

        case 'depth':
          // Depth-fade with parallax layers
          progress.value = withTiming(1, {
            duration,
            easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
          }, (finished) => {
            if (finished && onTransitionComplete) {
              runOnJS(onTransitionComplete)()
            }
          })
          
          scale.value = withTiming(Math.max(scaleX, scaleY), {
            duration,
            easing: Easing.out(Easing.cubic),
          })
          
          opacity.value = withTiming(0.3, {
            duration: duration * 0.4,
          }, () => {
            opacity.value = withTiming(1, {
              duration: duration * 0.6,
            })
          })
          break

        case 'scale':
          scale.value = withSpring(Math.max(scaleX, scaleY), {
            damping: 20,
            stiffness: 200,
          }, (finished) => {
            if (finished && onTransitionComplete) {
              runOnJS(onTransitionComplete)()
            }
          })
          break

        case 'fade':
          opacity.value = withTiming(0, {
            duration: duration * 0.5,
          }, () => {
            opacity.value = withTiming(1, {
              duration: duration * 0.5,
            }, (finished) => {
              if (finished && onTransitionComplete) {
                runOnJS(onTransitionComplete)()
              }
            })
          })
          break

        case 'slide':
          translateX.value = withTiming(deltaX, {
            duration,
            easing: Easing.out(Easing.cubic),
          })
          translateY.value = withTiming(deltaY, {
            duration,
            easing: Easing.out(Easing.cubic),
          }, (finished) => {
            if (finished && onTransitionComplete) {
              runOnJS(onTransitionComplete)()
            }
          })
          break
      }
    }
  }, [isActive, fromBounds, toBounds, variant])

  const animatedStyle = useAnimatedStyle(() => {
    const shimmerOpacity = variant === 'crystal' 
      ? interpolate(progress.value, [0, 0.5, 1], [1, 0.7, 1])
      : 1

    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
        { rotateZ: `${rotateZ.value}deg` },
      ],
      opacity: opacity.value * shimmerOpacity,
      shadowOpacity: variant === 'crystal' 
        ? interpolate(progress.value, [0, 0.5, 1], [0.2, 0.8, 0.3])
        : 0.2,
      shadowRadius: variant === 'crystal'
        ? interpolate(progress.value, [0, 1], [5, 20])
        : 5,
    }
  })

  const glowStyle = useAnimatedStyle(() => {
    if (variant !== 'crystal') return { opacity: 0 }
    
    return {
      position: 'absolute',
      top: -10,
      left: -10,
      right: -10,
      bottom: -10,
      backgroundColor: '#8FD3FF',
      borderRadius: 20,
      opacity: interpolate(progress.value, [0, 0.3, 0.7, 1], [0, 0.3, 0.1, 0]),
      transform: [
        { scale: interpolate(progress.value, [0, 1], [1, 1.2]) }
      ],
    }
  })

  return (
    <View style={style} {...props}>
      {variant === 'crystal' && (
        <Animated.View style={glowStyle} />
      )}
      <Animated.View style={animatedStyle}>
        {children}
      </Animated.View>
    </View>
  )
}
