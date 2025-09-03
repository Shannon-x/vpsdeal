import type { Config } from 'tailwindcss'

// Tailwind CSS 配置文件
export default {
  // 需要处理的文件路径
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue',
  ],
  // 暗色模式配置（使用class切换）
  darkMode: 'class',
  // 主题配置
  theme: {
    extend: {
      // 字体配置
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],      // 默认字体
        display: ['Space Grotesk', 'system-ui', 'sans-serif'],            // 展示字体
      },
      // 颜色配置
      colors: {
        // 主色调
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        // 强调色
        accent: {
          neon: '#00D9FF',    // 霓虹蓝
          purple: '#A855F7',  // 紫色
          pink: '#EC4899',    // 粉色
          orange: '#F97316',  // 橙色
        },
        // 玻璃态效果颜色
        glass: {
          white: 'rgba(255, 255, 255, 0.1)',     // 白色玻璃
          dark: 'rgba(0, 0, 0, 0.1)',            // 深色玻璃
          border: 'rgba(255, 255, 255, 0.18)',  // 玻璃边框
        }
      },
      // 背景图像
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',                                              // 径向渐变
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',                       // 圆锥渐变
        'gradient-mesh': 'linear-gradient(to right, #667eea 0%, #764ba2 100%)',                                     // 网格渐变
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',  // 玻璃渐变
      },
      // 动画配置
      animation: {
        'float': 'float 6s ease-in-out infinite',                       // 浮动效果
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite', // 缓慢脉冲
        'gradient-x': 'gradient-x 15s ease infinite',                   // X轴渐变
        'gradient-y': 'gradient-y 15s ease infinite',                   // Y轴渐变
        'gradient-xy': 'gradient-xy 15s ease infinite',                 // XY轴渐变
        'glow': 'glow 2s ease-in-out infinite alternate',               // 发光效果
        'text-shimmer': 'text-shimmer 2.5s ease-out infinite alternate', // 文字闪烁
      },
      // 关键帧定义
      keyframes: {
        // 浮动动画
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        // X轴渐变动画
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        },
        // Y轴渐变动画
        'gradient-y': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'center top'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'center bottom'
          }
        },
        // XY轴渐变动画
        'gradient-xy': {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': 'left center'
          },
          '25%': {
            'background-size': '400% 400%',
            'background-position': 'right center'
          },
          '50%': {
            'background-size': '400% 400%',
            'background-position': 'right bottom'
          },
          '75%': {
            'background-size': '400% 400%',
            'background-position': 'left bottom'
          }
        },
        // 发光动画
        glow: {
          '0%': { 
            'box-shadow': '0 0 5px rgb(59, 130, 246), 0 0 10px rgb(59, 130, 246), 0 0 15px rgb(59, 130, 246)' 
          },
          '100%': { 
            'box-shadow': '0 0 10px rgb(59, 130, 246), 0 0 20px rgb(59, 130, 246), 0 0 30px rgb(59, 130, 246)' 
          }
        },
        // 文字闪烁动画
        'text-shimmer': {
          '0%': { 'background-position': '0% 50%' },
          '100%': { 'background-position': '100% 50%' }
        }
      },
      // 背景模糊
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  // Tailwind插件
  plugins: [],
} satisfies Config