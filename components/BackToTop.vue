<template>
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="opacity-0 translate-y-4"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition-all duration-200 ease-in"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 translate-y-4"
  >
    <button
      v-if="showButton"
      @click="scrollToTop"
      class="fixed bottom-8 right-8 z-40 p-3 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 group"
      aria-label="返回顶部"
    >
      <Icon name="ph:arrow-up-bold" class="w-6 h-6 group-hover:animate-bounce" />
    </button>
  </Transition>
</template>

<script setup lang="ts">
const showButton = ref(false)

const checkScroll = () => {
  showButton.value = window.scrollY > 300
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

onMounted(() => {
  window.addEventListener('scroll', checkScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', checkScroll)
})
</script>