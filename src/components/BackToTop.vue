<template>
  <div 
    v-show="visible" 
    class="back-to-top"
    @click="scrollToTop"
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 11l7-7 7 7M5 19l7-7 7 7" />
    </svg>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';

export default {
  name: 'BackToTop',
  setup() {
    const visible = ref(false);
    
    const toggleVisibility = () => {
      visible.value = window.pageYOffset > 500;
    };
    
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    };
    
    onMounted(() => {
      window.addEventListener('scroll', toggleVisibility);
    });
    
    onUnmounted(() => {
      window.removeEventListener('scroll', toggleVisibility);
    });
    
    return {
      visible,
      scrollToTop
    };
  }
}
</script>

<style scoped>
.back-to-top {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  background-color: var(--color-primary-600);
  color: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  transition: background-color 0.3s, transform 0.3s;
  z-index: 990;
}

.back-to-top:hover {
  background-color: var(--color-primary-700);
  transform: translateY(-3px);
}
</style>
