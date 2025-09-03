// 智能分类映射系统
const logger = require('./simple-logger');

class CategoryMapper {
  constructor() {
    // 定义分类规则
    this.categoryRules = {
      'exclusive-deals': {
        name: '独家优惠',
        conditions: [
          { field: 'sourceCategory', value: 'Exclusive Deals', type: 'exact' },
          { field: 'priceInfo.isPromo', value: true, type: 'boolean' },
          { field: 'priceInfo.discount', value: 30, type: 'greaterThan' }
        ]
      },
      'kvm-under-15': {
        name: 'KVM年付15美元以下',
        conditions: [
          { field: 'specs.virtualization', value: 'KVM', type: 'exact' },
          { field: 'priceInfo.period', value: 'yearly', type: 'exact' },
          { field: 'priceInfo.amount', value: 15, type: 'lessThanOrEqual' }
        ]
      },
      'kvm-under-25': {
        name: 'KVM年付25美元以下',
        conditions: [
          { field: 'specs.virtualization', value: 'KVM', type: 'exact' },
          { field: 'priceInfo.period', value: 'yearly', type: 'exact' },
          { field: 'priceInfo.amount', value: 25, type: 'lessThanOrEqual' },
          { field: 'priceInfo.amount', value: 15, type: 'greaterThan' }
        ]
      },
      'monthly-under-2': {
        name: '月付2美元以下',
        conditions: [
          { field: 'priceInfo.period', value: 'monthly', type: 'exact' },
          { field: 'priceInfo.amount', value: 2, type: 'lessThanOrEqual' }
        ]
      },
      'nat-vps': {
        name: 'NAT/OpenVZ/LXC',
        conditions: [
          { field: 'specs.virtualization', value: ['NAT', 'OpenVZ', 'LXC'], type: 'includes' },
          { field: 'specs.network.ipv4', value: 0, type: 'equal' }
        ]
      },
      'high-spec': {
        name: '高配置VPS',
        conditions: [
          { field: 'specs.cpu.cores', value: 4, type: 'greaterThanOrEqual' },
          { field: 'specs.ram.size', value: 8, type: 'greaterThanOrEqual' }
        ]
      },
      'storage-vps': {
        name: '存储型VPS',
        conditions: [
          { field: 'specs.storage.size', value: 500, type: 'greaterThanOrEqual' },
          { field: 'specs.storage.type', value: ['HDD', 'SATA'], type: 'includes' }
        ]
      },
      'premium-vps': {
        name: '高端VPS',
        conditions: [
          { field: 'priceInfo.amount', value: 20, type: 'greaterThanOrEqual' },
          { field: 'specs.cpu.type', value: ['EPYC', 'Ryzen', 'Gold'], type: 'includes' }
        ]
      },
      'asia-vps': {
        name: '亚洲VPS',
        conditions: [
          { field: 'specs.location.country', value: ['新加坡', '日本', '香港', '韩国'], type: 'includes' }
        ]
      },
      'us-vps': {
        name: '美国VPS',
        conditions: [
          { field: 'specs.location.country', value: '美国', type: 'exact' }
        ]
      },
      'europe-vps': {
        name: '欧洲VPS',
        conditions: [
          { field: 'specs.location.country', value: ['英国', '德国', '荷兰', '法国'], type: 'includes' }
        ]
      }
    };

    // 源分类到本地分类的映射
    this.sourceCategoryMap = {
      'Exclusive Deals': ['exclusive-deals'],
      'KVM under $15/year': ['kvm-under-15'],
      'KVM under $25/year': ['kvm-under-25'],
      'Monthly under $2': ['monthly-under-2'],
      'NAT/OpenVZ/LXC': ['nat-vps'],
      'High Spec VPS': ['high-spec'],
      'Storage VPS': ['storage-vps'],
      'VDS Deals': ['premium-vps'],
      'Free VPS': ['monthly-under-2']
    };
  }

  // 获取对象属性的值
  getFieldValue(obj, fieldPath) {
    const fields = fieldPath.split('.');
    let value = obj;
    
    for (const field of fields) {
      if (value && typeof value === 'object' && field in value) {
        value = value[field];
      } else {
        return undefined;
      }
    }
    
    return value;
  }

  // 检查条件是否满足
  checkCondition(vpsData, condition) {
    const fieldValue = this.getFieldValue(vpsData, condition.field);
    
    if (fieldValue === undefined) {
      return false;
    }

    switch (condition.type) {
      case 'exact':
        return fieldValue === condition.value;
      
      case 'includes':
        if (Array.isArray(condition.value)) {
          return condition.value.includes(fieldValue);
        }
        return fieldValue.includes(condition.value);
      
      case 'greaterThan':
        return parseFloat(fieldValue) > parseFloat(condition.value);
      
      case 'greaterThanOrEqual':
        return parseFloat(fieldValue) >= parseFloat(condition.value);
      
      case 'lessThan':
        return parseFloat(fieldValue) < parseFloat(condition.value);
      
      case 'lessThanOrEqual':
        return parseFloat(fieldValue) <= parseFloat(condition.value);
      
      case 'equal':
        return parseFloat(fieldValue) === parseFloat(condition.value);
      
      case 'boolean':
        return Boolean(fieldValue) === Boolean(condition.value);
      
      default:
        return false;
    }
  }

  // 将VPS数据映射到分类
  mapToCategories(vpsData) {
    const categories = [];

    // 首先尝试使用源分类映射
    if (vpsData.sourceCategory && this.sourceCategoryMap[vpsData.sourceCategory]) {
      categories.push(...this.sourceCategoryMap[vpsData.sourceCategory]);
    }

    // 然后应用规则匹配
    for (const [categoryId, rule] of Object.entries(this.categoryRules)) {
      let allConditionsMet = true;
      
      for (const condition of rule.conditions) {
        if (!this.checkCondition(vpsData, condition)) {
          allConditionsMet = false;
          break;
        }
      }
      
      if (allConditionsMet && !categories.includes(categoryId)) {
        categories.push(categoryId);
      }
    }

    // 如果没有匹配到任何分类，根据价格分配默认分类
    if (categories.length === 0) {
      if (vpsData.priceInfo.amount < 5) {
        categories.push('monthly-under-2');
      } else if (vpsData.priceInfo.amount < 15) {
        categories.push('kvm-under-15');
      } else {
        categories.push('premium-vps');
      }
    }

    // 添加地理位置分类
    if (vpsData.specs.location.country) {
      const country = vpsData.specs.location.country;
      if (['新加坡', '日本', '香港', '韩国'].includes(country)) {
        categories.push('asia-vps');
      } else if (country === '美国') {
        categories.push('us-vps');
      } else if (['英国', '德国', '荷兰', '法国'].includes(country)) {
        categories.push('europe-vps');
      }
    }

    // 去重
    return [...new Set(categories)];
  }

  // 获取分类信息
  getCategoryInfo(categoryId) {
    return this.categoryRules[categoryId] || null;
  }

  // 获取所有分类
  getAllCategories() {
    return Object.entries(this.categoryRules).map(([id, rule]) => ({
      id,
      name: rule.name
    }));
  }

  // 批量映射VPS数据
  mapMultipleVPS(vpsDataArray) {
    const results = [];
    
    for (const vpsData of vpsDataArray) {
      const categories = this.mapToCategories(vpsData);
      results.push({
        vpsData,
        categories,
        categoryNames: categories.map(catId => this.categoryRules[catId]?.name || catId)
      });
      
      logger.info(`VPS ${vpsData.uniqueId} 映射到分类: ${categories.join(', ')}`);
    }
    
    return results;
  }

  // 分析并推荐新分类
  analyzeAndRecommendCategories(vpsDataArray) {
    const uncategorized = [];
    const categoryStats = {};

    // 统计现有分类
    for (const vpsData of vpsDataArray) {
      const categories = this.mapToCategories(vpsData);
      
      if (categories.length === 0) {
        uncategorized.push(vpsData);
      }
      
      categories.forEach(cat => {
        categoryStats[cat] = (categoryStats[cat] || 0) + 1;
      });
    }

    // 分析未分类的VPS特征
    const recommendations = [];
    
    if (uncategorized.length > 5) {
      // 分析价格范围
      const priceRanges = {};
      uncategorized.forEach(vps => {
        const price = vps.priceInfo.amount;
        const range = Math.floor(price / 10) * 10;
        priceRanges[range] = (priceRanges[range] || 0) + 1;
      });

      // 推荐新的价格分类
      Object.entries(priceRanges).forEach(([range, count]) => {
        if (count > 3) {
          recommendations.push({
            name: `${range}-${parseInt(range) + 10}美元区间`,
            count,
            suggestion: `创建价格区间 $${range}-$${parseInt(range) + 10} 的分类`
          });
        }
      });
    }

    return {
      categoryStats,
      uncategorized: uncategorized.length,
      recommendations
    };
  }
}

module.exports = CategoryMapper;