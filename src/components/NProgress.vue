<template>
  <div v-if="loading" class="nprogress-container">
    <div class="nprogress-bar" :style="{ width: percent + '%' }"></div>
  </div>
</template>

<script>
export default {
  name: 'NProgress',
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    percent: {
      type: Number,
      default: 0
    }
  }
};
</script>

<style scoped>
.nprogress-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  z-index: 9999;
  pointer-events: none;
}

.nprogress-bar {
  background: linear-gradient(to right, var(--color-primary-500), var(--color-primary-400));
  height: 100%;
  transition: width 0.2s ease;
}
</style>
