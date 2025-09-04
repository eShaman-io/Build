import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, Pressable, Dimensions } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { BlurView } from 'expo-blur'
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming,
  interpolate
} from 'react-native-reanimated'

const { width } = Dimensions.get('window')

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

export default function Home() {
  const [greeting, setGreeting] = useState('')
  const shimmerValue = useSharedValue(0)
  const pulseValue = useSharedValue(1)

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Good Morning')
    else if (hour < 18) setGreeting('Good Afternoon')
    else setGreeting('Good Evening')

    // Start animations
    shimmerValue.value = withRepeat(withTiming(1, { duration: 3000 }), -1, false)
    pulseValue.value = withRepeat(withTiming(1.05, { duration: 2000 }), -1, true)
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

  return (
    <ScrollView 
      style={{ flex: 1, backgroundColor: '#0A0F1F' }}
      contentContainerStyle={{ padding: 20 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={{ marginTop: 40, marginBottom: 30 }}>
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
      </View>

      {/* Daily Card */}
      <Animated.View style={[pulseStyle]}>
        <BlurView 
          intensity={20} 
          style={{
            borderRadius: 24,
            overflow: 'hidden',
            marginBottom: 24,
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.15)'
          }}
        >
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
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

            <Pressable
              style={({ pressed }) => ({
                backgroundColor: 'rgba(0, 212, 255, 0.8)',
                paddingHorizontal: 24,
                paddingVertical: 12,
                borderRadius: 999,
                alignSelf: 'center',
                transform: [{ scale: pressed ? 0.95 : 1 }]
              })}
            >
              <Text style={{ 
                color: '#0A0F1F', 
                fontWeight: '600',
                fontSize: 16
              }}>
                Explore Meaning
              </Text>
            </Pressable>
          </LinearGradient>
        </BlurView>
      </Animated.View>

      {/* Lunar Phase */}
      <BlurView 
        intensity={15} 
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
          <Text style={{ fontSize: 32, marginRight: 16 }}>{lunarPhase.emoji}</Text>
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
          <View style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: 'rgba(143, 211, 255, 0.2)',
            borderWidth: 1,
            borderColor: 'rgba(143, 211, 255, 0.4)',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <View style={{
              width: 20,
              height: 20,
              borderRadius: 10,
              backgroundColor: '#8FD3FF',
              opacity: lunarPhase.illumination
            }} />
          </View>
        </LinearGradient>
      </BlurView>

      {/* Quick Actions */}
      <View style={{ 
        flexDirection: 'row', 
        justifyContent: 'space-between',
        marginBottom: 24
      }}>
        {[
          { title: 'Oracle', subtitle: 'Ask a question', emoji: '🔮', color: '#00D4FF' },
          { title: 'Rituals', subtitle: 'Begin practice', emoji: '🕯️', color: '#6A00F4' },
        ].map((action, index) => (
          <Pressable
            key={action.title}
            style={({ pressed }) => ({
              flex: 1,
              marginHorizontal: index === 0 ? 0 : 8,
              marginHorizontal: index === 1 ? 8 : 0,
              transform: [{ scale: pressed ? 0.95 : 1 }]
            })}
          >
            <BlurView 
              intensity={12} 
              style={{
                borderRadius: 16,
                overflow: 'hidden',
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.1)'
              }}
            >
              <LinearGradient
                colors={[`${action.color}20`, `${action.color}10`]}
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
        ))}
      </View>

      {/* Affirmation */}
      <BlurView 
        intensity={10} 
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

      {/* Bottom spacing */}
      <View style={{ height: 40 }} />
    </ScrollView>
  )
}
