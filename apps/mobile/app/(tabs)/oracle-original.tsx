import React, { useState, useRef, useEffect } from 'react'
import { 
  View, 
  Text, 
  TextInput, 
  Pressable, 
  FlatList, 
  KeyboardAvoidingView, 
  Platform,
  ActivityIndicator,
  Alert
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { BlurView } from 'expo-blur'
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming,
  interpolate
} from 'react-native-reanimated'

type Message = { 
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  isTyping?: boolean
}

const oracleResponses = [
  "✨ The Star card appears in your reading. Hope and inspiration guide your path forward.",
  "🌙 The Moon whispers of intuition. Trust what your heart already knows.",
  "⚡ The Tower suggests transformation. What seems like an ending is truly a beginning.",
  "🌊 The flow of water teaches patience. Allow events to unfold naturally.",
  "🔥 Inner fire burns bright within you. Channel this energy toward your highest purpose.",
  "🌸 Like a lotus rising from mud, beauty emerges from your challenges.",
  "🦋 Metamorphosis is upon you. Embrace the changes with grace and trust.",
  "⭐ Your light shines brightest in the darkness. Be the beacon others need.",
]

export default function Oracle() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: "welcome", 
      role: "assistant", 
      content: "Welcome, seeker. I am here to offer guidance and clarity. What weighs upon your heart today?",
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const flatListRef = useRef<FlatList>(null)
  const shimmerValue = useSharedValue(0)

  useEffect(() => {
    shimmerValue.value = withRepeat(withTiming(1, { duration: 2000 }), -1, false)
  }, [])

  const shimmerStyle = useAnimatedStyle(() => ({
    opacity: interpolate(shimmerValue.value, [0, 0.5, 1], [0.3, 1, 0.3])
  }))

  const generateOracleResponse = async (userMessage: string): Promise<string> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000))
    
    // Simple keyword-based responses (replace with actual OpenAI API call)
    const keywords = userMessage.toLowerCase()
    
    if (keywords.includes('love') || keywords.includes('relationship')) {
      return "💕 The heart's wisdom transcends logic. Open yourself to both giving and receiving love authentically."
    }
    if (keywords.includes('career') || keywords.includes('work') || keywords.includes('job')) {
      return "🎯 Your talents are seeds waiting to bloom. Trust in your abilities and take the next step forward."
    }
    if (keywords.includes('fear') || keywords.includes('anxiety') || keywords.includes('worry')) {
      return "🕊️ Fear is the shadow of growth. Breathe deeply and remember: you are stronger than you know."
    }
    if (keywords.includes('decision') || keywords.includes('choice') || keywords.includes('choose')) {
      return "⚖️ The answer lies within you. Quiet the mind and listen to your inner voice of wisdom."
    }
    
    // Random response for general questions
    return oracleResponses[Math.floor(Math.random() * oracleResponses.length)]
  }

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [userMessage, ...prev])
    setInput("")
    setIsLoading(true)

    try {
      const response = await generateOracleResponse(userMessage.content)
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant", 
        content: response,
        timestamp: new Date()
      }

      setMessages(prev => [assistantMessage, ...prev])
    } catch (error) {
      Alert.alert("Connection Error", "Unable to reach the Oracle. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={{ 
      alignSelf: item.role === "user" ? "flex-end" : "flex-start", 
      maxWidth: "85%", 
      marginVertical: 8,
      marginHorizontal: 16
    }}>
      <BlurView 
        intensity={item.role === "user" ? 15 : 10}
        style={{
          borderRadius: 20,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: item.role === "user" 
            ? 'rgba(0, 212, 255, 0.3)' 
            : 'rgba(255, 255, 255, 0.15)'
        }}
      >
        <LinearGradient
          colors={item.role === "user" 
            ? ['rgba(0, 212, 255, 0.2)', 'rgba(0, 212, 255, 0.1)']
            : ['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.04)']
          }
          style={{ padding: 16 }}
        >
          <Text style={{
            color: item.role === "user" ? "#DFE7FF" : "#DFE7FF",
            fontSize: 16,
            lineHeight: 22,
            fontWeight: item.role === "assistant" ? "300" : "400"
          }}>
            {item.content}
          </Text>
          
          <Text style={{
            color: 'rgba(223, 231, 255, 0.5)',
            fontSize: 12,
            marginTop: 8,
            textAlign: item.role === "user" ? "right" : "left"
          }}>
            {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </LinearGradient>
      </BlurView>
    </View>
  )

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor: '#0A0F1F' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <BlurView intensity={20} style={{ paddingTop: 50, paddingBottom: 16, paddingHorizontal: 20 }}>
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
          style={{ borderRadius: 16, padding: 16 }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Animated.View style={[shimmerStyle]}>
              <Text style={{ fontSize: 24, marginRight: 8 }}>🔮</Text>
            </Animated.View>
            <Text style={{ 
              fontSize: 20, 
              fontWeight: '600', 
              color: '#DFE7FF',
              fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif'
            }}>
              Oracle
            </Text>
          </View>
          <Text style={{ 
            textAlign: 'center', 
            color: 'rgba(223, 231, 255, 0.7)', 
            fontSize: 14,
            marginTop: 4
          }}>
            Seek wisdom • Find clarity • Trust intuition
          </Text>
        </LinearGradient>
      </BlurView>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderMessage}
        inverted
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 8 }}
      />

      {/* Typing Indicator */}
      {isLoading && (
        <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
          <BlurView intensity={10} style={{ 
            alignSelf: 'flex-start',
            borderRadius: 20,
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.15)'
          }}>
            <View style={{ 
              flexDirection: 'row', 
              alignItems: 'center', 
              padding: 16,
              backgroundColor: 'rgba(255, 255, 255, 0.05)'
            }}>
              <ActivityIndicator size="small" color="#8FD3FF" style={{ marginRight: 8 }} />
              <Text style={{ color: 'rgba(223, 231, 255, 0.7)', fontSize: 14 }}>
                Oracle is contemplating...
              </Text>
            </View>
          </BlurView>
        </View>
      )}

      {/* Input */}
      <BlurView intensity={20} style={{ 
        paddingHorizontal: 16, 
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.1)'
      }}>
        <View style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-end' }}>
          <View style={{ flex: 1 }}>
            <BlurView intensity={15} style={{
              borderRadius: 20,
              overflow: 'hidden',
              borderWidth: 1,
              borderColor: 'rgba(255, 255, 255, 0.15)'
            }}>
              <TextInput
                value={input}
                onChangeText={setInput}
                placeholder="Share what's on your mind..."
                placeholderTextColor="rgba(223, 231, 255, 0.5)"
                multiline
                maxLength={500}
                style={{
                  color: '#DFE7FF',
                  fontSize: 16,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  maxHeight: 100,
                  backgroundColor: 'rgba(255, 255, 255, 0.05)'
                }}
                onSubmitEditing={sendMessage}
                blurOnSubmit={false}
              />
            </BlurView>
          </View>
          
          <Pressable
            onPress={sendMessage}
            disabled={!input.trim() || isLoading}
            style={({ pressed }) => ({
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: input.trim() && !isLoading 
                ? 'rgba(0, 212, 255, 0.8)' 
                : 'rgba(255, 255, 255, 0.1)',
              alignItems: 'center',
              justifyContent: 'center',
              transform: [{ scale: pressed ? 0.95 : 1 }]
            })}
          >
            <Text style={{ 
              fontSize: 20,
              color: input.trim() && !isLoading ? '#0A0F1F' : 'rgba(223, 231, 255, 0.5)'
            }}>
              ↑
            </Text>
          </Pressable>
        </View>
      </BlurView>
    </KeyboardAvoidingView>
  )
}
