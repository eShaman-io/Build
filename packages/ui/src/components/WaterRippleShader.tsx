import React, { useEffect } from 'react'
import { Dimensions } from 'react-native'
import { Canvas, Shader, Skia, useValue, useTouchHandler } from '@shopify/react-native-skia'
import { useSharedValue, withRepeat, withTiming } from 'react-native-reanimated'

const { width, height } = Dimensions.get('window')

const waterRippleShader = Skia.RuntimeEffect.Make(`
uniform float2 resolution;
uniform float time;
uniform float2 touch;
uniform float touchIntensity;

vec4 main(vec2 coord) {
  vec2 uv = coord / resolution;
  vec2 center = touch / resolution;
  
  // Distance from touch point
  float dist = distance(uv, center);
  
  // Create ripple effect
  float ripple = sin(dist * 20.0 - time * 8.0) * exp(-dist * 5.0) * touchIntensity;
  
  // Base water color gradient
  vec3 deepWater = vec3(0.04, 0.06, 0.12); // #0A0F1F
  vec3 shallowWater = vec3(0.10, 0.08, 0.27); // #1A1446
  vec3 crystalBlue = vec3(0.56, 0.83, 1.0); // #8FD3FF
  
  // Vertical gradient
  float gradient = smoothstep(0.0, 1.0, uv.y);
  vec3 baseColor = mix(deepWater, shallowWater, gradient);
  
  // Add crystal highlights
  float highlight = sin(uv.x * 3.14159 + time * 0.5) * 0.1 + 0.1;
  baseColor += crystalBlue * highlight * (1.0 - gradient) * 0.3;
  
  // Apply ripple distortion
  baseColor += vec3(ripple * 0.3);
  
  // Add caustic patterns
  vec2 causticUV = uv * 4.0 + time * 0.1;
  float caustic1 = sin(causticUV.x + sin(causticUV.y * 2.0)) * 0.5 + 0.5;
  float caustic2 = sin(causticUV.y + sin(causticUV.x * 1.5)) * 0.5 + 0.5;
  float caustics = caustic1 * caustic2 * 0.2;
  
  baseColor += vec3(caustics * crystalBlue * (1.0 - gradient * 0.7));
  
  return vec4(baseColor, 1.0);
}
`)!

export interface WaterRippleShaderProps {
  width?: number
  height?: number
  intensity?: number
}

export function WaterRippleShader({ 
  width: w = width, 
  height: h = height,
  intensity = 1.0 
}: WaterRippleShaderProps) {
  const time = useValue(0)
  const touchX = useSharedValue(w / 2)
  const touchY = useSharedValue(h / 2)
  const touchIntensity = useSharedValue(0)

  useEffect(() => {
    // Animate time for continuous water movement
    const timeAnimation = () => {
      time.current = (Date.now() / 1000) % (Math.PI * 2)
      requestAnimationFrame(timeAnimation)
    }
    timeAnimation()
  }, [])

  const touchHandler = useTouchHandler({
    onStart: (event) => {
      touchX.value = event.x
      touchY.value = event.y
      touchIntensity.value = withTiming(intensity, { duration: 100 })
    },
    onActive: (event) => {
      touchX.value = event.x
      touchY.value = event.y
    },
    onEnd: () => {
      touchIntensity.value = withTiming(0, { duration: 800 })
    },
  })

  return (
    <Canvas style={{ width: w, height: h }} onTouch={touchHandler}>
      <Shader
        source={waterRippleShader}
        uniforms={{
          resolution: [w, h],
          time,
          touch: [touchX, touchY],
          touchIntensity,
        }}
      />
    </Canvas>
  )
}
