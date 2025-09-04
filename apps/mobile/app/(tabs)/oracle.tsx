import React, { useState, useRef, useEffect } from 'react'
import { 
  View, 
  Text, 
  TextInput, 
  ScrollView, 
  Pressable, 
  KeyboardAvoidingView, 
  Platform,
  Dimensions 
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { BlurView } from 'expo-blur'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withRepeat,
  withSequence,
  interpolate,
  Easing,
  runOnJS
} from 'react-native-reanimated'
import * as Haptics from 'expo-haptics'
import { 
  WaterRippleShader, 
  AuroraShimmer, 
  CrystalBloom,
  ChatBubble 
} from '@esh/ui'

const { width, height } = Dimensions.get('window')

interface Message {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
}

export default function OracleEnhanced() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Welcome, seeker. I am here to offer guidance and wisdom. What weighs upon your heart today?",
      isUser: false,
      timestamp: new Date()
    }
  ])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showCrystalBloom, setShowCrystalBloom] = useState(false)
  
  const scrollViewRef = useRef<ScrollView>(null)
  
  // Animation values
  const shimmerValue = useSharedValue(0)
  const breathingValue = useSharedValue(0)
  const inputGlow = useSharedValue(0)
  const sendButtonScale = useSharedValue(1)
  const typingDots = useSharedValue(0)

  useEffect(() => {
    // Continuous animations
    shimmerValue.value = withRepeat(
      withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.sin) }),
      -1,
      false
    )
    
    breathingValue.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 3000, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      false
    )
  }, [])

  useEffect(() => {
    if (isTyping) {
      typingDots.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 500 }),
          withTiming(0, { duration: 500 })
        ),
        -1,
        false
      )
    } else {
      typingDots.value = 0
    }
  }, [isTyping])

  const breathingStyle = useAnimatedStyle(() => ({
    opacity: interpolate(breathingValue.value, [0, 1], [0.7, 1]),
    transform: [
      { scale: interpolate(breathingValue.value, [0, 1], [0.99, 1.01]) }
    ]
  }))

  const inputGlowStyle = useAnimatedStyle(() => ({
    shadowOpacity: inputGlow.value * 0.3,
    shadowRadius: inputGlow.value * 10,
    borderColor: `rgba(143, 211, 255, ${inputGlow.value * 0.5})`,
  }))

  const sendButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: sendButtonScale.value }],
    opacity: inputText.length > 0 ? 1 : 0.5,
  }))

  const typingDotsStyle = useAnimatedStyle(() => ({
    opacity: typingDots.value,
    transform: [
      { scale: interpolate(typingDots.value, [0, 1], [0.8, 1.2]) }
    ]
  }))

  const handleSendMessage = async () => {
    if (!inputText.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputText('')
    setIsTyping(true)
    
    // Haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    
    // Button animation
    sendButtonScale.value = withSequence(
      withTiming(0.9, { duration: 100 }),
      withSpring(1, { damping: 15, stiffness: 300 })
    )

    // Simulate Oracle response
    setTimeout(() => {
      const oracleResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateOracleResponse(userMessage.text),
        isUser: false,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, oracleResponse])
      setIsTyping(false)
      setShowCrystalBloom(true)
      
      // Crystal bloom effect
      setTimeout(() => setShowCrystalBloom(false), 2000)
      
      // Scroll to bottom
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true })
      }, 100)
    }, 2000 + Math.random() * 2000)
  }

  const generateOracleResponse = (userText: string): string => {
    const responses = [
      "The stars whisper of transformation ahead. Trust in your inner wisdom to guide you through this period of change.",
      "I see clarity emerging from the mists of uncertainty. The path you seek will reveal itself when you quiet your mind.",
      "The universe conspires to support your highest good. What appears as challenge is actually opportunity in disguise.",
      "Your intuition speaks truth. Listen closely to the gentle voice within - it knows the way forward.",
      "The energy around you shifts toward harmony. Release what no longer serves and embrace what nurtures your soul."
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const handleInputFocus = () => {
    inputGlow.value = withTiming(1, { duration: 300 })
  }

  const handleInputBlur = () => {
    inputGlow.value = withTiming(0, { duration: 300 })
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Water Ripple Background */}
      <View style={{ position: 'absolute' }}>
        <WaterRippleShader 
          width={width} 
          height={height} 
          intensity={0.6}
        />
      </View>

      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <Animated.View style={[
          { 
            paddingTop: 60, 
            paddingHorizontal: 20, 
            paddingBottom: 20,
            alignItems: 'center'
          },
          breathingStyle
        ]}>
          <Text style={{
            fontSize: 28,
            fontWeight: '300',
            color: '#DFE7FF',
            marginBottom: 8,
            textAlign: 'center'
          }}>
            Oracle
          </Text>
          <Text style={{
            fontSize: 16,
            color: 'rgba(223, 231, 255, 0.7)',
            textAlign: 'center'
          }}>
            Seek wisdom from the cosmic consciousness
          </Text>
        </Animated.View>

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((message, index) => (
            <Animated.View
              key={message.id}
              style={[
                {
                  marginBottom: 16,
                  alignSelf: message.isUser ? 'flex-end' : 'flex-start',
                  maxWidth: '80%',
                },
                breathingStyle
              ]}
            >
              <AuroraShimmer
                colors={message.isUser 
                  ? ['#00D4FF', '#8FD3FF'] 
                  : ['#6A00F4', '#8FD3FF', '#DFE7FF']
                }
                duration={8000}
                intensity={0.3}
                style={{ borderRadius: 20 }}
              >
                <BlurView
                  intensity={20}
                  style={{
                    borderRadius: 20,
                    overflow: 'hidden',
                    borderWidth: 1,
                    borderColor: message.isUser 
                      ? 'rgba(0, 212, 255, 0.3)' 
                      : 'rgba(223, 231, 255, 0.2)'
                  }}
                >
                  <LinearGradient
                    colors={message.isUser 
                      ? ['rgba(0, 212, 255, 0.2)', 'rgba(0, 212, 255, 0.1)']
                      : ['rgba(223, 231, 255, 0.15)', 'rgba(106, 0, 244, 0.1)']
                    }
                    style={{ padding: 16 }}
                  >
                    <Text style={{
                      fontSize: 16,
                      lineHeight: 22,
                      color: '#DFE7FF'
                    }}>
                      {message.text}
                    </Text>
                    <Text style={{
                      fontSize: 12,
                      color: 'rgba(223, 231, 255, 0.5)',
                      marginTop: 8,
                      textAlign: message.isUser ? 'right' : 'left'
                    }}>
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </Text>
                  </LinearGradient>
                </BlurView>
              </AuroraShimmer>
            </Animated.View>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <Animated.View style={[
              {
                alignSelf: 'flex-start',
                marginBottom: 16,
              },
              typingDotsStyle
            ]}>
              <BlurView
                intensity={15}
                style={{
                  borderRadius: 20,
                  overflow: 'hidden',
                  borderWidth: 1,
                  borderColor: 'rgba(223, 231, 255, 0.2)'
                }}
              >
                <LinearGradient
                  colors={['rgba(223, 231, 255, 0.15)', 'rgba(106, 0, 244, 0.1)']}
                  style={{ padding: 16, flexDirection: 'row', alignItems: 'center' }}
                >
                  <Text style={{ color: '#DFE7FF', marginRight: 8 }}>Oracle is typing</Text>
                  <View style={{ flexDirection: 'row' }}>
                    {[0, 1, 2].map((i) => (
                      <Animated.View
                        key={i}
                        style={[
                          {
                            width: 6,
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: '#8FD3FF',
                            marginHorizontal: 2,
                          },
                          typingDotsStyle
                        ]}
                      />
                    ))}
                  </View>
                </LinearGradient>
              </BlurView>
            </Animated.View>
          )}
        </ScrollView>

        {/* Input Area */}
        <View style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: 20,
          paddingBottom: 40,
        }}>
          <AuroraShimmer
            colors={['#8FD3FF', '#00D4FF']}
            duration={6000}
            intensity={0.4}
            style={{ borderRadius: 25 }}
          >
            <Animated.View style={[
              {
                borderRadius: 25,
                borderWidth: 1,
                borderColor: 'rgba(143, 211, 255, 0.3)',
                shadowColor: '#8FD3FF',
                shadowOffset: { width: 0, height: 0 },
                shadowRadius: 10,
              },
              inputGlowStyle
            ]}>
              <BlurView
                intensity={25}
                style={{
                  borderRadius: 25,
                  overflow: 'hidden',
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 20,
                  paddingVertical: 12,
                }}
              >
                <TextInput
                  value={inputText}
                  onChangeText={setInputText}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  placeholder="Ask the Oracle..."
                  placeholderTextColor="rgba(223, 231, 255, 0.5)"
                  style={{
                    flex: 1,
                    fontSize: 16,
                    color: '#DFE7FF',
                    paddingVertical: 8,
                  }}
                  multiline
                  maxLength={500}
                />
                
                <Pressable
                  onPress={handleSendMessage}
                  disabled={!inputText.trim()}
                >
                  <Animated.View style={[
                    {
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: 'rgba(0, 212, 255, 0.8)',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginLeft: 12,
                    },
                    sendButtonStyle
                  ]}>
                    <Text style={{ fontSize: 18 }}>✨</Text>
                  </Animated.View>
                </Pressable>
              </BlurView>
            </Animated.View>
          </AuroraShimmer>
        </View>
      </KeyboardAvoidingView>

      {/* Crystal Bloom Effect */}
      {showCrystalBloom && (
        <View style={{ 
          position: 'absolute', 
          top: height / 2 - 50, 
          left: width / 2 - 50, 
          zIndex: 1000 
        }}>
          <CrystalBloom 
            size={100} 
            color="#DFE7FF" 
            intensity={1.5} 
            trigger={showCrystalBloom} 
          />
        </View>
      )}
    </View>
  )
}
