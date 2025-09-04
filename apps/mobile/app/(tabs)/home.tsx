import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, Pressable, Dimensions } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { BlurView } from 'expo-blur'
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming,
  withSpring,
  interpolate,
  withSequence,
  Easing,
  runOnJS
} from 'react-native-reanimated'
import * as Haptics from 'expo-haptics'
import { 
  GlassCard, 
  CrystalBloom, 
  WaterRippleShader, 
  SharedElementTransition,
  AuroraShimmer 
} from '@esh/ui'

const { width, height } = Dimensions.get('window')

// Mock data - replace with real data later
const dailyCard = {
  name: "The Star",
  meaning: "Hope, inspiration, and spiritual guidance illuminate your path today.",
  image: "⭐"
}

const lunarPhase = {
  phase: "Waxing Crescent",
  illumination: 0.25,
  emoji: "🌒"
}

export default function HomeEnhanced() {
  const [greeting, setGreeting] = useState('')
  const [showCrystalBloom, setShowCrystalBloom] = useState(false)
  const [cardPressed, setCardPressed] = useState(false)
  
  // Animation values
  const shimmerValue = useSharedValue(0)
  const pulseValue = useSharedValue(1)
  const floatValue = useSharedValue(0)
  const cardScale = useSharedValue(1)
  const breathingValue = useSharedValue(0)

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Good Morning')
    else if (hour < 18) setGreeting('Good Afternoon')
    else setGreeting('Good Evening')

    // Start premium animations
    shimmerValue.value = withRepeat(withTiming(1, { duration: 3000 }), -1, false)
    pulseValue.value = withRepeat(withTiming(1.05, { duration: 2000 }), -1, true)
    
    // Floating animation for cards
    floatValue.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 3000, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    )

    // Breathing animation for meditation elements
    breathingValue.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 4000, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      false
    )
  }, [])

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(shimmerValue.value, [0, 1], [-width, width])
      }
    ]
  }))

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseValue.value }]
  }))

  const floatStyle = useAnimatedStyle(() => ({
    transform: [
      { 
        translateY: interpolate(floatValue.value, [0, 1], [0, -8]) 
      }
    ]
  }))

  const cardScaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }]
  }))

  const breathingStyle = useAnimatedStyle(() => ({
    opacity: interpolate(breathingValue.value, [0, 1], [0.6, 1]),
    transform: [
      { scale: interpolate(breathingValue.value, [0, 1], [0.98, 1.02]) }
    ]
  }))

  const handleCardPress = () => {
    setCardPressed(true)
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    
    cardScale.value = withSequence(
      withTiming(0.95, { duration: 100 }),
      withSpring(1, { damping: 15, stiffness: 300 })
    )
    
    setShowCrystalBloom(true)
    setTimeout(() => setShowCrystalBloom(false), 2000)
  }

  const handleQuickAction = (action: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    // Navigate to respective screen
    console.log(`Navigate to ${action}`)
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Water Ripple Background */}
      <View style={{ position: 'absolute' }}>
        <WaterRippleShader 
          width={width} 
          height={height} 
          intensity={0.8}
        />
      </View>
      
      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with breathing animation */}
        <Animated.View style={[{ marginTop: 40, marginBottom: 30 }, breathingStyle]}>
          <Text style={{ 
            fontSize: 28, 
            fontWeight: '300', 
            color: '#DFE7FF', 
            marginBottom: 4 
          }}>
            {greeting}
          </Text>
          <Text style={{ 
            fontSize: 16, 
            color: 'rgba(223, 231, 255, 0.7)' 
          }}>
            What guidance do you seek today?
          </Text>
        </Animated.View>

        {/* Enhanced Daily Card with Premium Effects */}
        <SharedElementTransition
          transitionKey="daily-card"
          variant="crystal"
          isActive={cardPressed}
        >
          <Animated.View style={[pulseStyle, floatStyle]}>
            <AuroraShimmer
              colors={['#8FD3FF', '#00D4FF', '#6A00F4']}
              duration={12000}
              intensity={0.6}
              style={{ borderRadius: 24, marginBottom: 24 }}
            >
              <Pressable onPress={handleCardPress}>
                <Animated.View style={cardScaleStyle}>
                  <BlurView 
                    intensity={25} 
                    style={{
                      borderRadius: 24,
                      overflow: 'hidden',
                      borderWidth: 1,
                      borderColor: 'rgba(143, 211, 255, 0.3)'
                    }}
                  >
                    <LinearGradient
                      colors={['rgba(143, 211, 255, 0.15)', 'rgba(106, 0, 244, 0.1)']}
                      style={{ padding: 24 }}
                    >
                      <View style={{ alignItems: 'center', marginBottom: 16 }}>
                        <Text style={{ fontSize: 48, marginBottom: 8 }}>{dailyCard.image}</Text>
                        <Text style={{ 
                          fontSize: 24, 
                          fontWeight: '600', 
                          color: '#8FD3FF',
                          marginBottom: 4
                        }}>
                          {dailyCard.name}
                        </Text>
                        <Text style={{ 
                          fontSize: 14, 
                          color: 'rgba(223, 231, 255, 0.6)',
                          textTransform: 'uppercase',
                          letterSpacing: 1
                        }}>
                          Daily Card
                        </Text>
                      </View>
                      
                      <Text style={{ 
                        fontSize: 16, 
                        lineHeight: 24, 
                        color: '#DFE7FF', 
                        textAlign: 'center',
                        marginBottom: 20
                      }}>
                        {dailyCard.meaning}
                      </Text>

                      <AuroraShimmer
                        colors={['#00D4FF', '#8FD3FF']}
                        duration={8000}
                        intensity={0.8}
                        direction="horizontal"
                        style={{
                          backgroundColor: 'rgba(0, 212, 255, 0.8)',
                          paddingHorizontal: 24,
                          paddingVertical: 12,
                          borderRadius: 999,
                          alignSelf: 'center',
                        }}
                      >
                        <Text style={{ 
                          color: '#0A0F1F', 
                          fontWeight: '600',
                          fontSize: 16
                        }}>
                          Explore Meaning
                        </Text>
                      </AuroraShimmer>
                    </LinearGradient>
                  </BlurView>
                </Animated.View>
              </Pressable>
            </AuroraShimmer>
          </Animated.View>
        </SharedElementTransition>

        {/* Crystal Bloom Effect */}
        {showCrystalBloom && (
          <View style={{ 
            position: 'absolute', 
            top: 200, 
            left: width / 2 - 50, 
            zIndex: 1000 
          }}>
            <CrystalBloom 
              size={100} 
              color="#8FD3FF" 
              intensity={1.2} 
              trigger={showCrystalBloom} 
            />
          </View>
        )}

        {/* Enhanced Lunar Phase */}
        <Animated.View style={floatStyle}>
          <BlurView 
            intensity={20} 
            style={{
              borderRadius: 20,
              overflow: 'hidden',
              marginBottom: 24,
              borderWidth: 1,
              borderColor: 'rgba(255, 255, 255, 0.12)'
            }}
          >
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.04)']}
              style={{ padding: 20, flexDirection: 'row', alignItems: 'center' }}
            >
              <Animated.Text style={[{ fontSize: 32, marginRight: 16 }, breathingStyle]}>
                {lunarPhase.emoji}
              </Animated.Text>
              <View style={{ flex: 1 }}>
                <Text style={{ 
                  fontSize: 18, 
                  fontWeight: '600', 
                  color: '#DFE7FF',
                  marginBottom: 4
                }}>
                  {lunarPhase.phase}
                </Text>
                <Text style={{ 
                  fontSize: 14, 
                  color: 'rgba(223, 231, 255, 0.7)' 
                }}>
                  {Math.round(lunarPhase.illumination * 100)}% illuminated
                </Text>
              </View>
              <Animated.View style={[{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: 'rgba(143, 211, 255, 0.2)',
                borderWidth: 1,
                borderColor: 'rgba(143, 211, 255, 0.4)',
                alignItems: 'center',
                justifyContent: 'center'
              }, breathingStyle]}>
                <View style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  backgroundColor: '#8FD3FF',
                  opacity: lunarPhase.illumination
                }} />
              </Animated.View>
            </LinearGradient>
          </BlurView>
        </Animated.View>

        {/* Enhanced Quick Actions */}
        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'space-between',
          marginBottom: 24
        }}>
          {[
            { title: 'Oracle', subtitle: 'Ask a question', emoji: '🔮', color: '#00D4FF' },
            { title: 'Rituals', subtitle: 'Begin practice', emoji: '🕯️', color: '#6A00F4' },
          ].map((action, index) => (
            <Animated.View 
              key={action.title}
              style={[
                { flex: 1, marginHorizontal: index === 0 ? 0 : 8 },
                floatStyle
              ]}
            >
              <AuroraShimmer
                colors={[action.color, `${action.color}80`]}
                duration={10000}
                intensity={0.4}
                style={{ borderRadius: 16 }}
              >
                <Pressable
                  onPress={() => handleQuickAction(action.title)}
                  style={({ pressed }) => ({
                    transform: [{ scale: pressed ? 0.95 : 1 }]
                  })}
                >
                  <BlurView 
                    intensity={15} 
                    style={{
                      borderRadius: 16,
                      overflow: 'hidden',
                      borderWidth: 1,
                      borderColor: 'rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    <LinearGradient
                      colors={[`${action.color}30`, `${action.color}15`]}
                      style={{ padding: 16, alignItems: 'center' }}
                    >
                      <Text style={{ fontSize: 24, marginBottom: 8 }}>{action.emoji}</Text>
                      <Text style={{ 
                        fontSize: 16, 
                        fontWeight: '600', 
                        color: '#DFE7FF',
                        marginBottom: 2
                      }}>
                        {action.title}
                      </Text>
                      <Text style={{ 
                        fontSize: 12, 
                        color: 'rgba(223, 231, 255, 0.6)',
                        textAlign: 'center'
                      }}>
                        {action.subtitle}
                      </Text>
                    </LinearGradient>
                  </BlurView>
                </Pressable>
              </AuroraShimmer>
            </Animated.View>
          ))}
        </View>

        {/* Enhanced Affirmation with Breathing Effect */}
        <Animated.View style={[breathingStyle]}>
          <BlurView 
            intensity={12} 
            style={{
              borderRadius: 16,
              overflow: 'hidden',
              borderWidth: 1,
              borderColor: 'rgba(255, 255, 255, 0.08)'
            }}
          >
            <View style={{ padding: 20, alignItems: 'center' }}>
              <Text style={{ 
                fontSize: 14, 
                color: 'rgba(223, 231, 255, 0.6)',
                textTransform: 'uppercase',
                letterSpacing: 1,
                marginBottom: 12
              }}>
                Today's Affirmation
              </Text>
              <Text style={{ 
                fontSize: 18, 
                lineHeight: 26, 
                color: '#DFE7FF', 
                textAlign: 'center',
                fontStyle: 'italic'
              }}>
                "I trust in the wisdom of the universe and my inner guidance."
              </Text>
            </View>
          </BlurView>
        </Animated.View>

        {/* Bottom spacing */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  )
}
