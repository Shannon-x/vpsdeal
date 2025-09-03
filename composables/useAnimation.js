export const useScrollAnimation = () => {
  const observeElements = () => {
    if (process.client) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in')
            // 可选：动画完成后不再观察
            // observer.unobserve(entry.target)
          }
        })
      }, {
        threshold: 0.1,
        rootMargin: '50px'
      })

      // 观察所有需要动画的元素
      const elements = document.querySelectorAll('.scroll-animate')
      elements.forEach((el) => observer.observe(el))

      return observer
    }
  }

  onMounted(() => {
    const observer = observeElements()
    
    onUnmounted(() => {
      if (observer) {
        observer.disconnect()
      }
    })
  })
}

// 鼠标跟随效果
export const useMouseFollow = () => {
  const mouse = reactive({ x: 0, y: 0 })
  
  const handleMouseMove = (e) => {
    mouse.x = e.clientX
    mouse.y = e.clientY
  }
  
  onMounted(() => {
    if (process.client) {
      window.addEventListener('mousemove', handleMouseMove)
    }
  })
  
  onUnmounted(() => {
    if (process.client) {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  })
  
  return { mouse }
}

// 数字动画效果
export const useNumberAnimation = (endValue, duration = 2000) => {
  const displayValue = ref(0)
  
  const animate = () => {
    const startTime = Date.now()
    const startValue = 0
    
    const updateValue = () => {
      const currentTime = Date.now()
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // 使用缓动函数
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      displayValue.value = Math.floor(startValue + (endValue - startValue) * easeOutQuart)
      
      if (progress < 1) {
        requestAnimationFrame(updateValue)
      }
    }
    
    requestAnimationFrame(updateValue)
  }
  
  return { displayValue, animate }
}