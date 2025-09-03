<template>
  <div class="price-category-card group relative overflow-hidden rounded-3xl bg-gradient-to-br transition-all duration-500 hover:scale-105 cursor-pointer"
       :class="categoryClass"
       @click="navigateToCategory">
    <!-- Animated Background Pattern -->
    <div class="absolute inset-0 opacity-20">
      <div class="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float"></div>
      <div class="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl animate-float animation-delay-400"></div>
    </div>
    
    <!-- Content -->
    <div class="relative z-10 p-8">
      <!-- Icon Container -->
      <div class="mb-6">
        <div class="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <Icon :name="icon" class="w-8 h-8 text-white" />
        </div>
      </div>
      
      <!-- Category Info -->
      <h3 class="text-2xl font-display font-bold text-white mb-2 group-hover:translate-x-1 transition-transform duration-300">
        {{ title }}
      </h3>
      <p class="text-white/80 text-sm mb-4">
        {{ description }}
      </p>
      
      <!-- Count Badge -->
      <div class="flex items-center justify-between">
        <span class="text-white/60 text-sm">{{ count }} 个方案</span>
        <div class="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 transition-all duration-300">
          <Icon name="ph:arrow-right-bold" class="w-5 h-5 text-white group-hover:translate-x-1 transition-transform duration-300" />
        </div>
      </div>
    </div>
    
    <!-- Hover Glow Effect -->
    <div class="absolute inset-0 rounded-3xl ring-4 ring-white/0 group-hover:ring-white/30 transition-all duration-300"></div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  description: string
  icon: string
  count: number
  gradient: string
  category: string
}

const props = defineProps<Props>()

// Dynamic gradient classes based on category
const categoryClass = computed(() => {
  const gradients = {
    'budget': 'from-emerald-500 to-teal-600',
    'value': 'from-blue-500 to-indigo-600',
    'premium': 'from-purple-500 to-pink-600',
    'ultra': 'from-orange-500 to-red-600',
    'free': 'from-gray-600 to-gray-800',
    'vds': 'from-indigo-600 to-purple-700',
    'nat': 'from-cyan-500 to-blue-600',
    'high-end': 'from-rose-600 to-pink-700',
    'deals': 'from-amber-500 to-orange-600'
  }
  return gradients[props.gradient] || 'from-primary-500 to-primary-600'
})

const navigateToCategory = () => {
  navigateTo(`/deals?category=${props.category}`)
}
</script>

<style scoped>
.price-category-card {
  transform-style: preserve-3d;
  perspective: 1000px;
}

.price-category-card:hover {
  transform: translateY(-4px) rotateX(2deg);
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animation-delay-400 {
  animation-delay: 400ms;
}
</style>