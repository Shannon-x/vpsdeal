<template>
  <div class="animated-background">
    <!-- Floating Particles -->
    <div class="particles">
      <div v-for="i in 50" :key="i" class="particle" :style="getParticleStyle(i)"></div>
    </div>
    
    <!-- Gradient Orbs -->
    <div class="orb orb-1"></div>
    <div class="orb orb-2"></div>
    <div class="orb orb-3"></div>
    
    <!-- Mesh Grid -->
    <svg class="mesh-grid" viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grid-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#7c3aed;stop-opacity:0.1" />
          <stop offset="50%" style="stop-color:#ec4899;stop-opacity:0.05" />
          <stop offset="100%" style="stop-color:#06b6d4;stop-opacity:0.1" />
        </linearGradient>
      </defs>
      <pattern id="grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="url(#grid-gradient)" stroke-width="1" opacity="0.3"/>
      </pattern>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
    
    <!-- Animated Lines -->
    <div class="lines">
      <div v-for="i in 5" :key="`line-${i}`" class="line" :style="getLineStyle(i)"></div>
    </div>
  </div>
</template>

<script setup>
const getParticleStyle = (index) => {
  const size = Math.random() * 4 + 1
  const duration = Math.random() * 20 + 20
  const delay = Math.random() * 20
  const startX = Math.random() * 100
  const startY = Math.random() * 100
  
  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${startX}%`,
    top: `${startY}%`,
    animationDuration: `${duration}s`,
    animationDelay: `${delay}s`
  }
}

const getLineStyle = (index) => {
  const duration = 15 + index * 5
  const delay = index * 2
  
  return {
    animationDuration: `${duration}s`,
    animationDelay: `${delay}s`,
    top: `${index * 20}%`
  }
}
</script>

<style scoped>
.animated-background {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

/* Particles */
.particles {
  position: absolute;
  inset: 0;
}

.particle {
  position: absolute;
  background: radial-gradient(circle, rgba(124, 58, 237, 0.8) 0%, transparent 70%);
  border-radius: 50%;
  animation: float 20s infinite ease-in-out;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) translateX(0) scale(1);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  50% {
    transform: translateY(-100vh) translateX(100px) scale(1.5);
  }
}

/* Gradient Orbs */
.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  animation: morph 20s infinite ease-in-out;
}

.orb-1 {
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(124, 58, 237, 0.4) 0%, transparent 70%);
  top: -10%;
  left: -10%;
  animation-delay: 0s;
}

.orb-2 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(236, 72, 153, 0.4) 0%, transparent 70%);
  bottom: -10%;
  right: -10%;
  animation-delay: 7s;
}

.orb-3 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(6, 182, 212, 0.4) 0%, transparent 70%);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation-delay: 14s;
}

@keyframes morph {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(100px, -100px) scale(1.2);
  }
  66% {
    transform: translate(-100px, 100px) scale(0.8);
  }
}

/* Mesh Grid */
.mesh-grid {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0.5;
}

/* Animated Lines */
.lines {
  position: absolute;
  inset: 0;
}

.line {
  position: absolute;
  left: -100%;
  width: 200%;
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, rgba(124, 58, 237, 0.8) 50%, transparent 100%);
  animation: scan 15s infinite linear;
  transform: rotate(-45deg);
}

@keyframes scan {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}
</style>