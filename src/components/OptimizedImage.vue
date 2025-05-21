<template>
  <div class="image-wrapper" :class="{ 'loaded': isLoaded, 'loading': !isLoaded, 'error': hasError }" :style="aspectRatioStyle">
    <img 
      v-if="!hasError" 
      ref="img"
      :data-src="src" 
      :alt="alt" 
      :width="width" 
      :height="height"
      class="optimized-image"
      @load="onLoad" 
      @error="onError"
      v-bind="$attrs"
    />
    <div v-if="!isLoaded && !hasError" class="loading-placeholder">
      <div class="spinner"></div>
    </div>
    <div v-if="hasError" class="error-placeholder">
      <svg class="error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
      </svg>
      <span v-if="errorText" class="error-text">{{ errorText }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OptimizedImage',
  props: {
    src: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      default: ''
    },
    width: {
      type: [Number, String],
      default: null
    },
    height: {
      type: [Number, String],
      default: null
    },
    aspectRatio: {
      type: String,
      default: null
    },
    errorText: {
      type: String,
      default: '加载失败'
    },
    threshold: {
      type: Number,
      default: 0.1 // 10% 可见度触发加载
    }
  },
  data() {
    return {
      isLoaded: false,
      hasError: false,
      observer: null,
      isIntersecting: false
    };
  },
  computed: {
    aspectRatioStyle() {
      if (this.aspectRatio) {
        return {
          paddingBottom: this.aspectRatio
        };
      }
      return {};
    }
  },
  mounted() {
    // 创建 IntersectionObserver 实例
    this.setupObserver();
  },
  beforeUnmount() {
    // 清理 observer
    if (this.observer) {
      this.observer.disconnect();
    }
  },
  methods: {
    setupObserver() {
      if ('IntersectionObserver' in window) {
        this.observer = new IntersectionObserver(this.onIntersection, {
          rootMargin: '50px 0px',
          threshold: this.threshold
        });
        
        this.observer.observe(this.$refs.img);
      } else {
        // 回退到立即加载
        this.loadImage();
      }
    },
    onIntersection(entries) {
      const entry = entries[0];
      
      if (entry.isIntersecting) {
        this.isIntersecting = true;
        this.loadImage();
        // 一旦图片开始加载，就不再需要观察
        this.observer.unobserve(entry.target);
      }
    },
    loadImage() {
      const img = this.$refs.img;
      if (img && img.dataset.src) {
        img.src = img.dataset.src;
      }
    },
    onLoad() {
      this.isLoaded = true;
      this.$emit('loaded');
    },
    onError() {
      this.hasError = true;
      this.$emit('error');
    }
  }
};
</script>

<style scoped>
.image-wrapper {
  position: relative;
  overflow: hidden;
  background-color: #f3f4f6;
  border-radius: 0.25rem;
  transition: all 0.3s ease;
}

.optimized-image {
  display: block;
  width: 100%;
  height: auto;
  object-fit: cover;
  transition: opacity 0.3s ease;
}

.loading .optimized-image {
  opacity: 0;
}

.loaded .optimized-image {
  opacity: 1;
}

.loading-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f3f4f6;
}

.spinner {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 3px solid rgba(79, 70, 229, 0.1);
  border-top-color: rgba(79, 70, 229, 0.8);
  animation: spin 1s infinite linear;
}

.error-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #fee2e2;
  color: #b91c1c;
  padding: 1rem;
}

.error-icon {
  width: 24px;
  height: 24px;
  margin-bottom: 0.5rem;
}

.error-text {
  font-size: 0.875rem;
  text-align: center;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
