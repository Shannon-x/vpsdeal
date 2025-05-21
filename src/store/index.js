import { createStore } from 'vuex';
import { kvmDeals, natDeals, highSpecDeals, storageDeals, vdsDeals, freeDeals, dedicatedDeals } from '../data/vps-deals';
import vpsDealsData from '../data/vps-deals';
import bcrypt from 'bcryptjs';
import { getVpsData, login as loginApi, addVps as addVpsApi, updateVps as updateVpsApi, deleteVps as deleteVpsApi } from '../services/api';

// 安全性增强：使用更强的加密方法代替简单的Base64编码
// 注意：这只是前端防护，真正安全的做法是使用后端认证系统

// bcrypt 配置
const SALT_ROUNDS = 10; // 哈希加盐轮数，越高越安全但也越慢

// 使用 bcrypt 生成密码哈希
const hashPassword = async (password) => {
  try {
    // 生成盐值
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    // 生成哈希
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (e) {
    console.error('密码哈希生成失败:', e);
    // 如果bcrypt失败则回退到旧方法
    return simpleHash(password + Math.random().toString(36).substring(2, 10));
  }
};

// 验证密码
const verifyPassword = async (inputPassword, hashedPassword) => {
  try {
    // 如果是bcrypt格式的哈希（以$2a$、$2b$或$2y$开头）
    if (typeof hashedPassword === 'string' && hashedPassword.match(/^\$2[aby]\$\d+\$/)) {
      console.log('使用bcrypt进行密码验证');
      return await bcrypt.compare(inputPassword, hashedPassword);
    } 
    // 直接比较（如果是纯文本默认密码）
    else if (inputPassword === hashedPassword) {
      console.log('使用直接比较进行密码验证');
      return true;
    }
    // 兼容旧格式的哈希
    else if (hashedPassword === deriveKey(inputPassword, 'g4h7k9p2r1m3t5w8')) {
      console.log('使用旧的哈希函数进行密码验证');
      return true;
    }
    // 特殊处理：如果是默认凭据
    else if (inputPassword === 'xetwuh-supqyw-7xidQy') {
      // 额外检查是否使用默认用户登录
      const credentials = loadAdminCredentials();
      if (credentials.username === 'shannon2206' && !credentials.isCustomized) {
        console.log('默认凭据验证成功');
        return true;
      }
    }
    console.log('所有密码验证方法均失败');
    return false;
  } catch (e) {
    console.error('密码验证失败:', e);
    // 如果出错，但输入是默认密码，也允许通过
    if (inputPassword === 'xetwuh-supqyw-7xidQy') {
      return true;
    }
    return false;
  }
};

// 秘钥派生函数 - 使用多轮哈希增加复杂度
const deriveKey = (password, salt, iterations = 1000) => {
  let key = password + salt;
  
  // 简单的多轮哈希 (生产环境应使用PBKDF2)
  for (let i = 0; i < iterations; i++) {
    // 使用简单的字符串哈希算法
    key = simpleHash(key + i);
  }
  
  return key;
};

// 简单的字符串哈希函数
const simpleHash = (str) => {
  let hash = 0;
  if (str.length === 0) return hash.toString(16);
  
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  return hash.toString(16);
};

// 改进版加密函数
const encrypt = (text) => {
  try {
    if (!text) return '';
    
    // 生成随机盐值
    const salt = Math.random().toString(36).substring(2, 10);
    
    // 派生密钥
    const derivedKey = deriveKey(text, salt);
    
    // 混合原始文本和密钥
    const mixed = Array.from(text).map((char, index) => {
      const keyChar = derivedKey.charAt(index % derivedKey.length);
      return String.fromCharCode(char.charCodeAt(0) ^ keyChar.charCodeAt(0));
    }).join('');
    
    // 将加密后的文本转为Base64并添加盐值
    return salt + '.' + btoa(mixed);
  } catch (e) {
    console.error('加密失败:', e);
    // 失败时回退到简单加密
    return Math.random().toString(36).substring(2, 10) + '_' + btoa(text);
  }
};

// 改进版解密函数
const decrypt = (encoded) => {
  try {
    if (!encoded) return '';
    
    // 检查是否使用新的加密格式
    if (encoded.includes('.')) {
      const [salt, encryptedBase64] = encoded.split('.');
      const encrypted = atob(encryptedBase64);
      
      // 派生与加密时相同的密钥
      const derivedKey = deriveKey(encrypted, salt);
      
      // 解密文本
      return Array.from(encrypted).map((char, index) => {
        const keyChar = derivedKey.charAt(index % derivedKey.length);
        return String.fromCharCode(char.charCodeAt(0) ^ keyChar.charCodeAt(0));
      }).join('');
    } else if (encoded.includes('_')) {
      // 旧版格式 (prefix_base64)
      const parts = encoded.split('_');
      return atob(parts[1]);
    } else {
      // 尝试作为纯Base64解码
      return atob(encoded);
    }
  } catch (e) {
    console.error('解密失败:', e);
    return '';
  }
};

// 将数据保存到localStorage
const saveToLocalStorage = (data) => {
  try {
    // 创建一个包含所有可能分类的对象
    const dataToSave = {};
    
    // 添加所有标准分类
    const categoryKeys = [
      'kvmDeals', 'natDeals', 'highSpecDeals', 'storageDeals', 
      'vdsDeals', 'freeDeals', 'dedicatedDeals', 
      'monthlyUnder2Deals', 'annualUnder15Deals', 'annualUnder25Deals', 'natOpenVZDeals'
    ];
    
    // 遍历所有标准分类键，保存对应的数据
    categoryKeys.forEach(key => {
      dataToSave[key] = data[key] || [];
    });
    
    // 添加额外的分类数据(如果存在)
    Object.keys(data).forEach(key => {
      if (key.endsWith('Deals') && !categoryKeys.includes(key)) {
        dataToSave[key] = data[key];
      }
    });
    
    localStorage.setItem('vps-data', JSON.stringify(dataToSave));
    console.log('数据保存成功，包含分类:', Object.keys(JSON.parse(localStorage.getItem('vps-data'))));
  } catch (e) {
    console.error('保存数据到本地存储失败：', e);
  }
};

// 尝试从localStorage加载保存的数据
const loadFromLocalStorage = () => {
  try {
    const savedData = localStorage.getItem('vps-data');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      console.log('从本地存储加载的分类:', Object.keys(parsedData));
      return {
        kvmDeals: parsedData.kvmDeals || [],
        natDeals: parsedData.natDeals || [],
        highSpecDeals: parsedData.highSpecDeals || [],
        storageDeals: parsedData.storageDeals || [],
        vdsDeals: parsedData.vdsDeals || [],
        freeDeals: parsedData.freeDeals || [],
        dedicatedDeals: parsedData.dedicatedDeals || [],
        monthlyUnder2Deals: parsedData.monthlyUnder2Deals || [],
        annualUnder15Deals: parsedData.annualUnder15Deals || [],
        annualUnder25Deals: parsedData.annualUnder25Deals || [],
        natOpenVZDeals: parsedData.natOpenVZDeals || []
      };
    }
  } catch (e) {
    console.error('从本地存储加载数据失败：', e);
  }
  // 如果没有保存的数据或加载失败，则使用默认数据
  return {
    kvmDeals,
    natDeals,
    highSpecDeals,
    storageDeals,
    vdsDeals,
    freeDeals,
    dedicatedDeals,
    monthlyUnder2Deals: [],
    annualUnder15Deals: [],
    annualUnder25Deals: [],
    natOpenVZDeals: []
  };
};

// 加载网站设置
const loadSiteSettings = () => {
  try {
    const savedSettings = localStorage.getItem('site-settings');
    if (savedSettings) {
      return JSON.parse(savedSettings);
    }
  } catch (e) {
    console.error('从本地存储加载网站设置失败：', e);
  }
  // 返回默认设置
  return {
    siteTitle: '优惠VPS推荐',
    siteDescription: 'KVM、NAT、OpenVZ等高性价比服务器推荐',
    siteLogo: '',
    siteShortTitle: '优惠VPS',
    contactEmail: 'cheapvpsdeals@gmail.com',
    lastUpdated: '2025-05-19',
    globalNotice: '',
    logoSize: 'normal',
    // 底部统计数据
    footerStats: {
      vpsCount: '13',
      providerCount: '6',
      datacenterCount: '15+'
    }
  };
};

// 加载用户留言
const loadUserMessages = () => {
  try {
    const savedMessages = localStorage.getItem('user-messages');
    if (savedMessages) {
      return JSON.parse(savedMessages);
    }
  } catch (e) {
    console.error('从本地存储加载用户留言失败：', e);
  }
  // 返回默认示例留言
  return [
    {
      name: '张三',
      email: 'zhangsan@example.com',
      subject: '关于VPS选择的咨询',
      message: '您好，我是一位新手站长，对VPS选择有些疑问。我计划建立一个中小型博客网站，预计日均访问量500-1000，请问有哪些适合的VPS推荐？预算在每年$30以内。\n\n感谢您的帮助！',
      date: new Date(2023, 10, 15, 14, 30).toISOString(),
      read: true
    },
    {
      name: '李四',
      email: 'lisi@example.com',
      subject: '服务器稳定性问题',
      message: '我购买了贵站推荐的某VPS服务商的产品，但最近遇到了稳定性问题，经常无法访问。能否提供一些故障排查建议？',
      date: new Date(2023, 10, 18, 9, 15).toISOString(),
      read: false
    }
  ];
};

// 保存用户留言
const saveUserMessages = (messages) => {
  try {
    localStorage.setItem('user-messages', JSON.stringify(messages));
  } catch (e) {
    console.error('保存用户留言到本地存储失败：', e);
  }
};

// 默认导航分类
const defaultCategories = [
  { id: 'home', name: '首页', path: '/', isMainNav: true, order: 0 },
  { id: 'under15', name: '年付15美元以下', path: '/under15', isMainNav: true, order: 1 },
  { id: 'under25', name: '年付25美元以下', path: '/under25', isMainNav: true, order: 2 },
  { id: 'monthly', name: '月付2美元以下', path: '/monthly', isMainNav: true, order: 3 },
  { id: 'free', name: '免费VPS', path: '/free', isMainNav: true, order: 4 },
  { id: 'vds', name: 'VDS服务器', path: '/vds', isMainNav: true, order: 5 },
  { id: 'nat', name: 'NAT/OpenVZ主机', path: '/nat', isMainNav: true, order: 6 },
  { id: 'storage', name: '存储型主机', path: '/storage', isMainNav: false, order: 7 },
  { id: 'highspec', name: '高配VPS主机', path: '/highspec', isMainNav: false, order: 8 },
  { id: 'contact', name: '联系我们', path: '/contact', isMainNav: false, order: 9 }
];

// 加载导航分类设置
const loadCategories = () => {
  try {
    const savedCategories = localStorage.getItem('categories');
    if (savedCategories) {
      return JSON.parse(savedCategories);
    }
  } catch (e) {
    console.error('从本地存储加载导航分类失败：', e);
  }
  // 返回默认导航分类
  return defaultCategories;
};

// 保存导航分类到localStorage
const saveCategories = (categories) => {
  try {
    localStorage.setItem('categories', JSON.stringify(categories));
  } catch (e) {
    console.error('保存导航分类失败：', e);
  }
};

// 从localStorage加载管理员凭据
const loadAdminCredentials = () => {
  try {
    const data = localStorage.getItem('admin-credentials');
    if (data) {
      const credentials = JSON.parse(data);
      console.log('加载到的凭据:', {
        username: credentials.username,
        hasPassword: !!credentials.password,
        hasPasswordHash: !!credentials.passwordHash,
        usesBcrypt: !!credentials.usesBcrypt,
        isCustomized: !!credentials.isCustomized
      });
      
      // 安全检查：如果找到旧的默认凭据，强制更新为新的默认凭据
      if (credentials.username === 'admin' && 
          (credentials.password === 'admin' || 
           (!credentials.isEncrypted && credentials.password === 'admin') || 
           (credentials.isEncrypted && decrypt(credentials.password) === 'admin'))) {
        
        console.log('检测到旧凭据，强制更新为新凭据');
        
        // 创建新的默认凭据
        const defaultCredentials = {
          username: 'shannon2206',
          password: 'xetwuh-supqyw-7xidQy',
          passwordHash: null,
          usesBcrypt: false,
          isCustomized: false
        };
        
        // 异步方式保存，但不等待
        hashPassword('xetwuh-supqyw-7xidQy').then(hashedPassword => {
          const newCredentials = {
            username: 'shannon2206',
            passwordHash: hashedPassword,
            usesBcrypt: true,
            isCustomized: false
          };
          localStorage.setItem('admin-credentials', JSON.stringify(newCredentials));
        });
        
        return defaultCredentials;
      }
      
      // 确保返回一个一致格式的凭据对象
      const result = {
        username: credentials.username || 'shannon2206',
        usesBcrypt: !!credentials.usesBcrypt,
        isCustomized: !!credentials.isCustomized
      };
      
      // 处理密码/哈希
      if (credentials.usesBcrypt && credentials.passwordHash) {
        result.passwordHash = credentials.passwordHash;
      } else if (credentials.password) {
        if (credentials.isEncrypted) {
          try {
            result.password = decrypt(credentials.password);
          } catch (e) {
            console.error('密码解密失败，使用默认密码');
            result.password = 'xetwuh-supqyw-7xidQy';
          }
        } else {
          result.password = credentials.password;
        }
      } else {
        // 缺少密码信息，使用默认密码
        result.password = 'xetwuh-supqyw-7xidQy';
        result.isCustomized = false;
      }
      
      return result;
    }
  } catch (e) {
    console.error('加载管理员凭据失败:', e);
  }
  
  // 返回默认凭据（立即可用）
  console.log('未找到有效凭据，返回默认凭据');
  return {
    username: 'shannon2206',
    password: 'xetwuh-supqyw-7xidQy',
    passwordHash: null,
    usesBcrypt: false,
    isCustomized: false
  };
};

const adminCredentials = loadAdminCredentials();

// 保存网站设置
const saveSiteSettings = (settings) => {
  try {
    localStorage.setItem('site-settings', JSON.stringify(settings));
  } catch (e) {
    console.error('保存网站设置失败：', e);
  }
};

// 登录保护相关变量和函数
// 获取登录失败信息
const getLoginAttempts = () => {
  try {
    const loginAttemptsData = localStorage.getItem('login-attempts');
    if (loginAttemptsData) {
      return JSON.parse(loginAttemptsData);
    }
  } catch (e) {
    console.error('读取登录尝试记录失败:', e);
  }
  
  return {
    count: 0,
    lastAttempt: 0,
    lockedUntil: 0
  };
};

// 存储登录失败信息
const saveLoginAttempts = (attempts) => {
  try {
    localStorage.setItem('login-attempts', JSON.stringify(attempts));
  } catch (e) {
    console.error('保存登录尝试记录失败:', e);
  }
};

// 检查账户是否被锁定
const isAccountLocked = () => {
  const attempts = getLoginAttempts();
  const now = Date.now();
  
  // 如果锁定时间已过，重置计数
  if (attempts.lockedUntil > 0 && now > attempts.lockedUntil) {
    attempts.count = 0;
    attempts.lockedUntil = 0;
    saveLoginAttempts(attempts);
    return false;
  }
  
  return attempts.lockedUntil > now;
};

// 增加失败次数并可能锁定账户
const incrementLoginFailures = () => {
  const attempts = getLoginAttempts();
  const now = Date.now();
  
  // 超过24小时的失败尝试重置
  if (now - attempts.lastAttempt > 24 * 60 * 60 * 1000) {
    attempts.count = 1;
  } else {
    attempts.count++;
  }
  
  attempts.lastAttempt = now;
  
  // 根据失败次数计算锁定时间
  if (attempts.count >= 10) {
    // 10次以上失败，锁定24小时
    attempts.lockedUntil = now + 24 * 60 * 60 * 1000;
    console.warn('账户锁定24小时');
  } else if (attempts.count >= 5) {
    // 5-9次失败，锁定30分钟
    attempts.lockedUntil = now + 30 * 60 * 1000;
    console.warn('账户锁定30分钟');
  } else if (attempts.count >= 3) {
    // 3-4次失败，锁定5分钟
    attempts.lockedUntil = now + 5 * 60 * 1000;
    console.warn('账户锁定5分钟');
  }
  
  saveLoginAttempts(attempts);
  return attempts;
};

// 重置登录失败计数
const resetLoginFailures = () => {
  const attempts = getLoginAttempts();
  attempts.count = 0;
  attempts.lockedUntil = 0;
  attempts.lastAttempt = Date.now();
  saveLoginAttempts(attempts);
};

// 创建存储
const store = createStore({
  state() {
    const siteSettings = loadSiteSettings();
    // 确保加载最新的管理员凭据
    const latestCredentials = loadAdminCredentials();
    
    // 从本地存储加载数据
    const savedData = loadFromLocalStorage();
    
    // 如果任何关键的VPS分类是空的，初始化它们
    if (!savedData.kvmDeals || savedData.kvmDeals.length === 0) {
      savedData.kvmDeals = [
        {
          name: "Vultr",
          config: "高性能云服务器",
          details: {
            cpu: "1 vCPU",
            ram: "1GB",
            storage: "25GB SSD",
            bandwidth: "1TB",
            ipv4: "1个",
            location: "全球25个数据中心"
          },
          price: "$5/月",
          link: "https://www.vultr.com",
          buttonText: "查看详情",
          providerLogo: "https://www.vultr.com/media/logo_onwhite.svg"
        },
        {
          name: "DigitalOcean",
          config: "基础型云服务器",
          details: {
            cpu: "1 vCPU",
            ram: "1GB",
            storage: "25GB SSD",
            bandwidth: "1TB",
            ipv4: "1个",
            location: "多个全球位置"
          },
          price: "$5/月",
          link: "https://www.digitalocean.com",
          buttonText: "查看详情",
          providerLogo: "https://images.prismic.io/www-static/49aa0a09-06d2-4bba-ad20-4bcbe56ac507_logo.png?auto=compress,format"
        }
      ];
    }
    
    if (!savedData.vdsDeals || savedData.vdsDeals.length === 0) {
      savedData.vdsDeals = [
        {
          name: "OVHcloud VPS",
          config: "高性能VDS",
          details: {
            cpu: "2 vCPU",
            ram: "4GB",
            storage: "80GB SSD",
            bandwidth: "不限",
            ipv4: "1个",
            location: "欧洲"
          },
          price: "$12/月",
          link: "https://www.ovhcloud.com",
          buttonText: "查看详情",
          providerLogo: ""
        }
      ];
    }
    
    if (!savedData.dedicatedDeals || savedData.dedicatedDeals.length === 0) {
      savedData.dedicatedDeals = [
        {
          name: "Hetzner 独立服务器",
          config: "专用物理服务器",
          details: {
            cpu: "6核心",
            ram: "32GB",
            storage: "2x 512GB SSD",
            bandwidth: "不限",
            ipv4: "1个",
            location: "德国"
          },
          price: "€39/月",
          link: "https://www.hetzner.com",
          buttonText: "查看详情",
          providerLogo: ""
        }
      ];
    }
    
    // 将修改后的数据保存到本地存储
    saveToLocalStorage(savedData);
    
    return {
      ...savedData,
      categories: loadCategories(),
      loading: false,
      pageTitle: siteSettings.siteTitle,
      pageDescription: siteSettings.siteDescription,
      siteSettings,
      notification: {
        show: false,
        type: 'info',
        message: '',
        timeout: 5000
      },
      adminAuth: {
        isLoggedIn: !!localStorage.getItem('token'),
        username: localStorage.getItem('username') || '',
        token: localStorage.getItem('token') || null
      },
      // VPS数据(确保接收从loadFromLocalStorage加载的数据)
      userMessages: loadUserMessages(),
      // 网站访问统计
      visitStats: {
        totalVisits: localStorage.getItem('total-visits') ? parseInt(localStorage.getItem('total-visits')) : 0,
        todayVisits: localStorage.getItem('today-visits') ? parseInt(localStorage.getItem('today-visits')) : 0,
        onlineUsers: localStorage.getItem('online-users') ? parseInt(localStorage.getItem('online-users')) : 0,
        lastUpdated: localStorage.getItem('visits-last-updated') || new Date().toISOString().split('T')[0]
      }
    };
  },
  mutations: {
    // 设置加载状态
    setLoading(state, status) {
      state.loading = status;
    },
    // 设置页面标题
    setPageTitle(state, title) {
      state.pageTitle = title;
      // 更新文档标题
      document.title = title;
    },
    // 设置页面描述
    setPageDescription(state, description) {
      state.pageDescription = description;
      // 更新meta描述
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', description);
      }
    },
    // 更新网站设置
    updateSiteSettings(state, settings) {
      state.siteSettings = { ...state.siteSettings, ...settings };
      saveSiteSettings(state.siteSettings);
      
      // 如果更新了标题或描述，同时更新它们
      if (settings.siteTitle) {
        this.commit('setPageTitle', settings.siteTitle);
      }
      if (settings.siteDescription) {
        this.commit('setPageDescription', settings.siteDescription);
      }
    },
    // 添加VPS
    addVps(state, { category, vps }) {
      // 映射 category 到实际 state 属性
      let stateKey = category;
      
      // 特殊映射处理
      if (category === 'vpsDeals') {
        stateKey = 'kvmDeals';
      } else if (category === 'monthly2' || category === 'monthly') {
        stateKey = 'monthlyUnder2Deals';
      } else if (category === 'annual15' || category === 'under15') {
        stateKey = 'annualUnder15Deals';
      } else if (category === 'annual25' || category === 'under25') {
        stateKey = 'annualUnder25Deals';
      } else if (category === 'natopenVZ' || category === 'nat') {
        stateKey = 'natOpenVZDeals';
      } else if (category === 'highSpec' || category === 'highspec') {
        stateKey = 'highSpecDeals';
      }
      
      if (!state[stateKey]) {
        console.log('创建新的集合:', stateKey);
        state[stateKey] = [];
      }
      console.log('添加VPS到集合:', stateKey, vps);
      state[stateKey].push(vps);
      saveToLocalStorage(state);
      console.log('保存成功, 当前集合大小:', state[stateKey].length);
    },
    // 编辑现有VPS
    updateVps(state, { category, index, vps }) {
      // 映射 category 到实际 state 属性
      let stateKey = category;
      
      // 特殊映射处理
      if (category === 'vpsDeals') {
        stateKey = 'kvmDeals';
      } else if (category === 'monthly2' || category === 'monthly') {
        stateKey = 'monthlyUnder2Deals';
      } else if (category === 'annual15' || category === 'under15') {
        stateKey = 'annualUnder15Deals';
      } else if (category === 'annual25' || category === 'under25') {
        stateKey = 'annualUnder25Deals';
      } else if (category === 'natopenVZ' || category === 'nat') {
        stateKey = 'natOpenVZDeals';
      } else if (category === 'highSpec' || category === 'highspec') {
        stateKey = 'highSpecDeals';
      }
      
      if (!state[stateKey]) {
        console.log('分类不存在，创建新的集合:', stateKey);
        state[stateKey] = [];
      }
      if (state[stateKey] && index >= 0 && index < state[stateKey].length) {
        console.log('更新VPS:', stateKey, index, vps);
        state[stateKey][index] = vps;
        saveToLocalStorage(state);
        console.log('更新成功');
      } else {
        console.error('更新VPS失败: 无效索引或分类', stateKey, index, state[stateKey]?.length);
      }
    },
    // 删除VPS
    deleteVps(state, { category, index }) {
      // 映射 category 到实际 state 属性
      let stateKey = category;
      
      // 特殊映射处理
      if (category === 'vpsDeals') {
        stateKey = 'kvmDeals';
      } else if (category === 'monthly2' || category === 'monthly') {
        stateKey = 'monthlyUnder2Deals';
      } else if (category === 'annual15' || category === 'under15') {
        stateKey = 'annualUnder15Deals';
      } else if (category === 'annual25' || category === 'under25') {
        stateKey = 'annualUnder25Deals';
      } else if (category === 'natopenVZ' || category === 'nat') {
        stateKey = 'natOpenVZDeals';
      } else if (category === 'highSpec' || category === 'highspec') {
        stateKey = 'highSpecDeals';
      }
      
      if (!state[stateKey]) {
        console.error('删除失败: 分类不存在', stateKey);
        return;
      }
      if (state[stateKey] && index >= 0 && index < state[stateKey].length) {
        console.log('删除VPS:', stateKey, index);
        state[stateKey].splice(index, 1);
        saveToLocalStorage(state);
        console.log('删除成功, 剩余项目:', state[stateKey].length);
      } else {
        console.error('删除VPS失败: 无效索引', stateKey, index, state[stateKey]?.length);
      }
    },
    // 重置为默认数据
    resetData(state) {
      state.kvmDeals = [...kvmDeals];
      state.natDeals = [...natDeals];
      state.highSpecDeals = [...highSpecDeals];
      state.storageDeals = [...storageDeals];
      state.vdsDeals = [...vdsDeals];
      state.freeDeals = [...freeDeals];
      state.dedicatedDeals = [...dedicatedDeals];
      state.monthlyUnder2Deals = [...vpsDealsData.monthlyUnder2Deals];
      state.annualUnder15Deals = [...vpsDealsData.annualUnder15Deals];
      state.annualUnder25Deals = [...vpsDealsData.annualUnder25Deals];
      state.natOpenVZDeals = [...vpsDealsData.natOpenVZDeals];
      saveToLocalStorage(state);
    },
    // 添加导航分类
    addCategory(state, category) {
      // 生成唯一ID
      const id = category.name.toLowerCase().replace(/\s+/g, '-');
      
      // 使用提供的路径或根据ID生成
      const path = category.path || `/${id}`;
      
      // 检查是否已存在同名分类
      const existingCategory = state.categories.find(c => c.id === id);
      if (existingCategory) {
        throw new Error(`已存在同名分类: ${category.name}`);
      }
      
      // 添加新分类
      const newCategory = {
        id,
        name: category.name,
        path,
        isMainNav: category.isMainNav || false,
        order: state.categories.length,
        description: category.description || ''
      };
      
      state.categories.push(newCategory);
      saveCategories(state.categories);
      
      // 如果需要创建对应的数据集合
      if (category.createCollection) {
        state[`${id}Deals`] = [];
        saveToLocalStorage(state);
      }
    },
    // 更新导航分类
    updateCategory(state, { id, category }) {
      const index = state.categories.findIndex(c => c.id === id);
      if (index !== -1) {
        state.categories[index] = {
          ...state.categories[index],
          ...category
        };
        saveCategories(state.categories);
      }
    },
    // 删除导航分类
    deleteCategory(state, id) {
      // 首页不能删除
      if (id === 'home') {
        throw new Error('首页不能被删除');
      }
      
      const index = state.categories.findIndex(c => c.id === id);
      if (index !== -1) {
        state.categories.splice(index, 1);
        saveCategories(state.categories);
        
        // 如果存在对应的数据集合，也一并删除
        if (state[`${id}Deals`]) {
          delete state[`${id}Deals`];
          saveToLocalStorage(state);
        }
      }
    },
    // 重排序导航分类
    reorderCategories(state, { id, newOrder }) {
      const category = state.categories.find(c => c.id === id);
      if (category) {
        const oldOrder = category.order;
        
        // 更新其他分类的顺序
        state.categories.forEach(c => {
          if (c.id !== id) {
            if (newOrder > oldOrder && c.order > oldOrder && c.order <= newOrder) {
              c.order--;
            } else if (newOrder < oldOrder && c.order < oldOrder && c.order >= newOrder) {
              c.order++;
            }
          }
        });
        
        // 更新当前分类的顺序
        category.order = newOrder;
        
        saveCategories(state.categories);
      }
    },
    // 重置导航分类为默认值
    resetCategories(state) {
      state.categories = [...defaultCategories];
      saveCategories(state.categories);
    },
    // 设置全局通知
    setNotification(state, { show, type, message, timeout }) {
      state.notification = {
        show,
        type: type || 'info',
        message,
        timeout: timeout || 5000
      };
    },
    // 隐藏全局通知
    hideNotification(state) {
      state.notification.show = false;
    },
    // 基于 JWT token 同步登录状态
    syncLoginStatus(state) {
      const token = localStorage.getItem('token');
      if (token) {
        state.adminAuth.token = token;
        state.adminAuth.isLoggedIn = true;
        state.adminAuth.username = localStorage.getItem('username') || '';
      } else {
        state.adminAuth.token = null;
        state.adminAuth.isLoggedIn = false;
        state.adminAuth.username = '';
      }
    },
    // 设置登录状态
    setLogin(state, { token, username }) {
      localStorage.setItem('token', token);
      state.adminAuth.token = token;
      state.adminAuth.isLoggedIn = true;
      if (username) {
        state.adminAuth.username = username;
        localStorage.setItem('username', username);
      }
    },
    // 登出
    logout(state) {
      state.adminAuth.isLoggedIn = false;
      state.adminAuth.username = '';
      state.adminAuth.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('username');
    },
    // 初始化集合
    initializeCollection(state, category) {
      // 根据category确定实际的state属性名
      let stateKey = category;
      
      // 特殊映射处理
      const categoryMapping = {
        'vpsDeals': 'kvmDeals',
        'monthly2': 'monthlyUnder2Deals',
        'annual15': 'annualUnder15Deals',
        'annual25': 'annualUnder25Deals',
        'natopenVZ': 'natOpenVZDeals',
        'highSpec': 'highSpecDeals',
        'storage': 'storageDeals',
        'free': 'freeDeals',
        'vds': 'vdsDeals'
      };
      
      // 先检查映射表
      if (categoryMapping[category]) {
        stateKey = categoryMapping[category];
      } else if (!category.endsWith('Deals') && category !== 'categories' && category !== 'siteSettings') {
        // 自动为非标准分类名添加"Deals"后缀
        stateKey = category + 'Deals';
      }
      
      if (!state[stateKey]) {
        console.log('初始化集合:', category, '-> 实际状态键:', stateKey);
        state[stateKey] = [];
        saveToLocalStorage(state);
      }
    },
    // 添加用户留言
    addUserMessage(state, message) {
      const newMessage = {
        ...message,
        date: new Date().toISOString(),
        read: false
      };
      state.userMessages.unshift(newMessage); // 添加到开头
      saveUserMessages(state.userMessages);
    },
    // 标记留言为已读/未读
    updateMessageReadStatus(state, { index, read }) {
      if (state.userMessages[index]) {
        state.userMessages[index].read = read;
        saveUserMessages(state.userMessages);
      }
    },
    // 删除留言
    deleteUserMessage(state, index) {
      state.userMessages.splice(index, 1);
      saveUserMessages(state.userMessages);
    },
    
    // 更新访问统计数据
    updateVisitStats(state, stats) {
      state.visitStats = { ...state.visitStats, ...stats };
      
      // 保存到本地存储
      if (stats.totalVisits !== undefined) {
        localStorage.setItem('total-visits', stats.totalVisits.toString());
      }
      if (stats.todayVisits !== undefined) {
        localStorage.setItem('today-visits', stats.todayVisits.toString());
      }
      if (stats.onlineUsers !== undefined) {
        localStorage.setItem('online-users', stats.onlineUsers.toString());
      }
      if (stats.lastUpdated !== undefined) {
        localStorage.setItem('visits-last-updated', stats.lastUpdated);
      }
    },
    
    // 增加访问计数
    incrementVisits(state) {
      // 检查日期，重置今日访问量
      const today = new Date().toISOString().split('T')[0];
      if (state.visitStats.lastUpdated !== today) {
        state.visitStats.todayVisits = 1;
        state.visitStats.lastUpdated = today;
      } else {
        state.visitStats.todayVisits++;
      }
      
      // 增加总访问量
      state.visitStats.totalVisits++;
      
      // 保存到本地存储
      localStorage.setItem('total-visits', state.visitStats.totalVisits.toString());
      localStorage.setItem('today-visits', state.visitStats.todayVisits.toString());
      localStorage.setItem('visits-last-updated', state.visitStats.lastUpdated);
    },
    
    // 更新管理员密码
    updateAdminPassword(state, newPassword) {
      // 异步生成bcrypt哈希
      hashPassword(newPassword).then(hash => {
        // 更新状态
        state.adminAuth.credentials = {
          ...state.adminAuth.credentials,
          password: newPassword, // 保留明文仅用于当前会话
          passwordHash: hash,
          usesBcrypt: true,
          isCustomized: true
        };
        
        // 保存到localStorage
        try {
          localStorage.setItem('admin-credentials', JSON.stringify({
            username: state.adminAuth.credentials.username,
            passwordHash: hash,
            usesBcrypt: true,
            isCustomized: true
          }));
          
          // 更新登录状态
          const authData = localStorage.getItem('admin-auth');
          if (authData) {
            const data = JSON.parse(authData);
            data.timestamp = Date.now(); // 更新时间戳
            localStorage.setItem('admin-auth', JSON.stringify(data));
          }
          
          console.log('管理员密码已成功更新 (使用bcrypt哈希)');
        } catch (e) {
          console.error('保存管理员凭据失败:', e);
        }
      }).catch(error => {
        console.error('生成密码哈希失败:', error);
      });
    },
    
    // 更新管理员用户名
    updateAdminUsername(state, newUsername) {
      state.adminAuth.credentials.username = newUsername;
      state.adminAuth.username = newUsername;
      
      // 更新localStorage中的登录状态和凭据
      try {
        // 更新登录状态
        const authData = localStorage.getItem('admin-auth');
        if (authData) {
          const data = JSON.parse(authData);
          data.username = newUsername;
          localStorage.setItem('admin-auth', JSON.stringify(data));
        }
        
        // 获取当前凭据
        const currentCredentials = loadAdminCredentials();
        
        // 更新存储的凭据（保持加密状态）
        localStorage.setItem('admin-credentials', JSON.stringify({
          username: newUsername,
          password: encrypt(currentCredentials.password),
          isEncrypted: true
        }));
      } catch (e) {
        console.error('更新localStorage中的用户名失败:', e);
      }
    },
    
    // 重置管理员账户为默认凭据
    resetAdmin(state) {
      try {
        // 清除所有登录数据
        localStorage.removeItem('admin-auth');
        
        // 使用bcrypt哈希生成默认密码的安全存储
        hashPassword('xetwuh-supqyw-7xidQy').then(hash => {
          // 设置默认凭据
          const defaultCredentials = {
            username: 'shannon2206',
            passwordHash: hash,
            usesBcrypt: true,
            isCustomized: false
          };
          
          // 更新localStorage
          localStorage.setItem('admin-credentials', JSON.stringify(defaultCredentials));
          
          // 更新state（存储明文值用于当前会话）
          state.adminAuth.credentials = {
            username: 'shannon2206',
            password: 'xetwuh-supqyw-7xidQy',
            passwordHash: hash,
            usesBcrypt: true,
            isCustomized: false
          };
          state.adminAuth.username = 'shannon2206';
          
          // 创建新的登录状态
          const authData = {
            isLoggedIn: true,
            username: 'shannon2206',
            timestamp: Date.now()
          };
          localStorage.setItem('admin-auth', JSON.stringify(authData));
          
          console.log('已重置管理员凭据为默认值 shannon2206/xetwuh-supqyw-7xidQy（使用bcrypt哈希）');
        });
      } catch (e) {
        console.error('重置管理员凭据失败:', e);
      }
    },
    // 设置服务器获取的 VPS 数据
    setVpsData(state, data) {
      Object.keys(data).forEach(category => {
        state[category] = data[category];
      });
    }
  },
  getters: {
    getDeals: (state) => (category) => {
      // 处理映射关系
      const categoryMapping = {
        // 标准分类ID
        'monthlyUnder2Deals': state.monthlyUnder2Deals || [],
        'annualUnder15Deals': state.annualUnder15Deals || [],
        'annualUnder25Deals': state.annualUnder25Deals || [],
        'natOpenVZDeals': state.natOpenVZDeals || [],
        'highSpecDeals': state.highSpecDeals || [],
        'kvmDeals': state.kvmDeals || [],
        'vpsDeals': state.kvmDeals || [],
        'vdsDeals': state.vdsDeals || [],
        'dedicatedDeals': state.dedicatedDeals || [],
        'freeDeals': state.freeDeals || [],
        'storageDeals': state.storageDeals || [],
        'natDeals': state.natDeals || [],
        
        // 路由ID映射
        'monthly2': state.monthlyUnder2Deals || [],
        'annual15': state.annualUnder15Deals || [],
        'annual25': state.annualUnder25Deals || [],
        'natopenVZ': state.natOpenVZDeals || [],
        'highSpec': state.highSpecDeals || [],
        'storage': state.storageDeals || [],
        'free': state.freeDeals || [],
        'vds': state.vdsDeals || [],
        'kvm': state.kvmDeals || [],
        'nat': state.natDeals || [],
        'dedicated': state.dedicatedDeals || []
      };

      console.log('请求分类:', category);
      
      // 尝试从映射中获取
      if (categoryMapping[category]) {
        const result = categoryMapping[category];
        console.log('从映射获取分类数据:', category, '数据长度:', result.length);
        return result;
      }
      
      // 尝试直接从state获取
      if (state[category]) {
        const result = state[category];
        console.log('直接从state获取分类数据:', category, '数据长度:', result.length);
        return result;
      }
      
      console.log('找不到分类数据:', category, '返回空数组');
      return [];
    },
    getAllDeals: (state) => {
      return {
        kvmDeals: state.kvmDeals,
        natDeals: state.natDeals,
        highSpecDeals: state.highSpecDeals,
        storageDeals: state.storageDeals,
        vdsDeals: state.vdsDeals,
        freeDeals: state.freeDeals
      };
    },
    // 获取所有分类
    getAllCategories: (state) => {
      return [...state.categories].sort((a, b) => a.order - b.order);
    },
    // 获取主导航分类
    getMainNavCategories: (state) => {
      return [...state.categories]
        .filter(c => c.isMainNav)
        .sort((a, b) => a.order - b.order);
    },
    // 获取更多导航分类
    getMoreNavCategories: (state) => {
      return [...state.categories]
        .filter(c => !c.isMainNav && c.id !== 'home')
        .sort((a, b) => a.order - b.order);
    },
    isLoading: (state) => state.loading,
    getPageTitle: (state) => state.pageTitle,
    getPageDescription: (state) => state.pageDescription,
    getSiteSettings: (state) => state.siteSettings,
    getNotification: (state) => state.notification,
    isLoggedIn: state => state.adminAuth.isLoggedIn,
    getUsername: (state) => state.adminAuth.username,
    // 获取用户留言
    getUserMessages: (state) => state.userMessages,
    // 获取未读留言数量
    getUnreadMessageCount: (state) => {
      return state.userMessages.filter(msg => !msg.read).length;
    },
    // 获取访问统计数据
    getVisitStats: (state) => {
      return state.visitStats;
    }
  },
  actions: {
    // 初始化时检查登录状态
    init({ commit }) {
      // 移除凭据迁移检查，直接同步登录状态
      commit('syncLoginStatus');
    },
    // 确保分类集合已存在
    ensureCategoryExists({ commit, state }, category) {
      if (!state[category]) {
        commit('initializeCollection', category);
        return true;
      }
      return false;
    },
    // 从后端获取所有 VPS 数据
    async fetchVpsData({ commit }) {
      try {
        const res = await getVpsData();
        commit('setVpsData', res.data);
      } catch (error) {
        console.error('获取 VPS 数据失败', error);
      }
    },
    // 管理员登录
    async login({ commit }, { username, password }) {
      commit('setLoading', true);
      try {
        const response = await loginApi(username, password);
        if (response.data.token) {
          // Pass both token and username to the setLogin mutation
          commit('setLogin', { token: response.data.token, username: username }); 
          commit('setNotification', { show: true, type: 'success', message: '登录成功！正在跳转...' });
          return { success: true };
        } else {
          // Backend should send error in response.data.error
          const errorMessage = response.data.error || '登录失败，未收到令牌或未知错误';
          throw new Error(errorMessage);
        }
      } catch (error) {
        // console.error('登录操作失败:', error);
        // Handle errors from API (e.g., 401 Unauthorized) or network errors
        const message = error.response?.data?.error || error.message || '登录时发生未知错误';
        commit('setNotification', { show: true, type: 'error', message });
        // It's important that AdminLogin.vue checks the return value of this action
        return { success: false, message }; 
      } finally {
        commit('setLoading', false);
      }
    },
    // 添加 VPS 到服务器并刷新数据
    async addVpsServer({ dispatch, state }, { category, vps }) {
      await addVpsApi(category, vps, state.adminAuth.token);
      await dispatch('fetchVpsData');
    },
    // 编辑 VPS 并刷新数据
    async updateVpsServer({ dispatch, state }, { category, index, vps }) {
      await updateVpsApi(category, index, vps, state.adminAuth.token);
      await dispatch('fetchVpsData');
    },
    // 删除 VPS 并刷新数据
    async deleteVpsServer({ dispatch, state }, { category, index }) {
      await deleteVpsApi(category, index, state.adminAuth.token);
      await dispatch('fetchVpsData');
    }
  }
});

// 初始化时检查登录状态
store.dispatch('init');
// 初始化时获取后端 VPS 数据
store.dispatch('fetchVpsData');

export default store;
