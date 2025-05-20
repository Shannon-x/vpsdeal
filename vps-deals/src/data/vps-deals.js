// VPS 优惠数据

// KVM 虚拟化 VPS 数据
export const kvmDeals = [
  {
    name: "Vultr",
    config: "高性能云服务器",
    price: "$5/月",
    link: "https://www.vultr.com",
    buttonText: "查看详情",
    providerLogo: "",
    reviewLink: "https://example.com/vultr-review",
    details: {
      ram: "1GB 内存",
      storage: "25GB SSD",
      bandwidth: "1TB 流量",
      ipv4: "1个IPv4",
      location: "全球25个数据中心"
    }
    },
  {
    name: "DigitalOcean",
    config: "基础型云服务器",
    price: "$5/月",
    link: "https://www.digitalocean.com",
    buttonText: "查看详情",
    providerLogo: "",
    reviewLink: "",
    details: {
      ram: "1GB 内存",
      storage: "25GB SSD",
      bandwidth: "1TB 流量",
      ipv4: "1个IPv4",
      location: "全球8个数据中心"
    }
    },
  {
    name: "Linode",
    config: "共享型云服务器",
    price: "$5/月",
    link: "https://www.linode.com",
    buttonText: "查看详情",
    providerLogo: "",
    reviewLink: "",
    details: {
      ram: "1GB 内存",
      storage: "25GB SSD",
      bandwidth: "1TB 流量",
      ipv4: "1个IPv4",
      location: "全球11个数据中心"
    }
  }
];

// NAT/OpenVZ VPS 数据
export const natDeals = [
  {
    name: "BandwagonHost",
    config: "CN2 GIA-E",
    price: "$49.99/年",
    link: "https://bandwagonhost.com",
    buttonText: "查看促销",
    providerLogo: "",
    reviewLink: "https://example.com/bandwagon-review",
    details: {
      ram: "1GB 内存",
      storage: "20GB SSD",
      bandwidth: "1TB 流量/月",
      ipv4: "1个NAT IPv4",
      location: "美国CN2直连"
    }
  },
  {
    name: "RackNerd",
    config: "SSD VPS",
    price: "$10.98/年",
    link: "https://www.racknerd.com",
    buttonText: "查看详情",
    providerLogo: "",
    reviewLink: "",
    details: {
      ram: "768MB 内存",
      storage: "12GB SSD",
      bandwidth: "1TB 流量/月",
      ipv4: "1个IPv4",
      location: "美国多数据中心"
    }
  }
];

// 高配置 VPS 数据
export const highSpecDeals = [
  {
    name: "Hetzner",
    config: "高配计算型",
    price: "$12.9/月",
    link: "https://www.hetzner.com",
    buttonText: "查看详情",
    providerLogo: "",
    reviewLink: "",
    details: {
      ram: "8GB 内存",
      storage: "80GB SSD",
      bandwidth: "不限流量(公平使用)",
      ipv4: "1个IPv4",
      location: "德国、芬兰"
    }
    },
  {
    name: "OVH",
    config: "高性能服务器",
    price: "$15/月",
    link: "https://www.ovh.com",
    buttonText: "查看详情",
    providerLogo: "",
    reviewLink: "",
    details: {
      ram: "4GB 内存",
      storage: "40GB SSD",
      bandwidth: "500Mbps 不限流量",
      ipv4: "1个IPv4",
      location: "法国、加拿大"
    }
  }
];

// 存储型 VPS 数据
export const storageDeals = [
  {
    name: "Contabo",
    config: "大容量存储型",
    price: "$5.99/月",
    link: "https://contabo.com",
    buttonText: "查看详情",
    providerLogo: "",
    reviewLink: "",
    details: {
      ram: "4GB 内存",
      storage: "300GB SSD",
      bandwidth: "不限流量",
      ipv4: "1个IPv4",
      location: "德国、美国"
    }
  },
  {
    name: "HostHatch",
    config: "SSD 存储型",
    price: "$7/月",
    link: "https://hosthatch.com",
    buttonText: "查看详情",
    providerLogo: "",
    reviewLink: "",
    details: {
      ram: "2GB 内存",
      storage: "250GB SSD",
      bandwidth: "5TB 流量/月",
      ipv4: "1个IPv4",
      location: "荷兰、瑞典"
    }
  }
];

// VDS 服务器数据
export const vdsDeals = [
  {
    name: "Ionos",
    config: "VDS 性能型",
    price: "$12/月",
    link: "https://www.ionos.com",
    buttonText: "查看详情",
    providerLogo: "",
    reviewLink: "",
    details: {
      ram: "4GB 内存",
      storage: "80GB SSD",
      bandwidth: "不限流量",
      ipv4: "1个IPv4",
      location: "德国、美国、英国"
    }
  },
  {
    name: "InterServer",
    config: "VDS 企业型",
    price: "$24/月",
    link: "https://www.interserver.net",
    buttonText: "查看详情",
    providerLogo: "",
    reviewLink: "",
    details: {
      ram: "8GB 内存",
      storage: "160GB SSD",
      bandwidth: "10TB 流量/月",
      ipv4: "1个IPv4",
      location: "美国"
    }
  }
];

// 免费 VPS 数据
export const freeDeals = [
  {
    name: "Oracle Cloud",
    config: "免费层服务器",
    price: "免费永久",
    link: "https://www.oracle.com/cloud",
    buttonText: "免费申请",
    providerLogo: "",
    reviewLink: "",
    details: {
      ram: "1GB 内存",
      storage: "50GB 启动卷",
      bandwidth: "10TB 流量/月",
      ipv4: "1个IPv4",
      location: "全球多数据中心"
    }
  },
  {
    name: "Google Cloud",
    config: "免费试用",
    price: "免费3个月",
    link: "https://cloud.google.com",
    buttonText: "免费申请",
    providerLogo: "",
    reviewLink: "",
    details: {
      ram: "多种配置",
      storage: "多种配置",
      bandwidth: "多种配置",
      ipv4: "1个IPv4",
      location: "全球多数据中心"
    }
  }
];

// 月付2美元以下的VPS数据
export const monthlyUnder2Deals = [
  {
    name: "BuyVM",
    config: "入门云服务器",
    price: "$2/月",
    link: "https://buyvm.net",
    buttonText: "查看详情",
    providerLogo: "",
    reviewLink: "",
    details: {
      ram: "512MB 内存",
      storage: "10GB SSD",
      bandwidth: "1TB 流量/月",
      ipv4: "1个IPv4",
      location: "美国、卢森堡"
    }
  },
  {
    name: "AlphaVPS",
    config: "经济型服务器",
    price: "$1.5/月",
    link: "https://alphavps.com",
    buttonText: "查看详情",
    providerLogo: "",
    reviewLink: "",
    details: {
      ram: "256MB 内存",
      storage: "5GB SSD",
      bandwidth: "500GB 流量/月",
      ipv4: "1个IPv4",
      location: "欧洲多地区"
    }
  }
];

// 年付15美元以下的VPS数据
export const annualUnder15Deals = [
  {
    name: "RackNerd",
    config: "超值年付服务器",
    price: "$10.98/年",
    link: "https://racknerd.com",
    buttonText: "查看详情",
    providerLogo: "",
    reviewLink: "",
    details: {
      ram: "768MB 内存",
      storage: "12GB SSD",
      bandwidth: "1TB 流量/月",
      ipv4: "1个IPv4",
      location: "美国多数据中心"
    }
  },
  {
    name: "HostSailor",
    config: "经济年付型",
    price: "$12/年",
    link: "https://hostsailor.com",
    buttonText: "查看详情",
    providerLogo: "",
    reviewLink: "",
    details: {
      ram: "512MB 内存",
      storage: "10GB SSD",
      bandwidth: "1TB 流量/月",
      ipv4: "1个IPv4",
      location: "荷兰、迪拜"
    }
  }
];

// 年付25美元以下的VPS数据
export const annualUnder25Deals = [
  {
    name: "VirMach",
    config: "性价比年付服务器",
    price: "$20/年",
    link: "https://virmach.com",
    buttonText: "查看详情",
    providerLogo: "",
    reviewLink: "",
    details: {
      ram: "1GB 内存",
      storage: "20GB SSD",
      bandwidth: "1TB 流量/月",
      ipv4: "1个IPv4",
      location: "美国多数据中心"
    }
  },
  {
    name: "HostDare",
    config: "高性能年付型",
    price: "$24/年",
    link: "https://hostdare.com",
    buttonText: "查看详情",
    providerLogo: "",
    reviewLink: "",
    details: {
      ram: "1GB 内存",
      storage: "15GB SSD",
      bandwidth: "2TB 流量/月",
      ipv4: "1个IPv4",
      location: "美国、香港"
    }
  }
];

// NAT/OpenVZ VPS数据
export const natOpenVZDeals = [
  {
    name: "BandwagonHost",
    config: "CN2 GIA-E",
    price: "$49.99/年",
    link: "https://bandwagonhost.com",
    buttonText: "查看促销",
    providerLogo: "",
    reviewLink: "https://example.com/bandwagon-review",
    details: {
      ram: "1GB 内存",
      storage: "20GB SSD",
      bandwidth: "1TB 流量/月",
      ipv4: "1个NAT IPv4",
      location: "美国CN2直连"
    }
  },
  {
    name: "GigsGigsCloud",
    config: "APAC优化VPS",
    price: "$6/月",
    link: "https://gigsgigscloud.com",
    buttonText: "查看详情",
    providerLogo: "",
    reviewLink: "",
    details: {
      ram: "768MB 内存",
      storage: "10GB SSD",
      bandwidth: "500GB 流量/月",
      ipv4: "1个NAT IPv4",
      location: "香港、新加坡"
    }
  }
];

// 独立服务器数据
export const dedicatedDeals = [
  {
    name: "OVHcloud",
    config: "入门级独立服务器",
    price: "$59/月",
    link: "https://www.ovhcloud.com",
    buttonText: "查看详情",
    providerLogo: "",
    reviewLink: "",
    details: {
      ram: "32GB 内存",
      storage: "2x1TB HDD",
      bandwidth: "不限流量",
      ipv4: "1个IPv4",
      location: "法国、加拿大"
    }
  },
  {
    name: "Hetzner",
    config: "专业级独立服务器",
    price: "$39/月",
    link: "https://www.hetzner.com",
    buttonText: "查看详情",
    providerLogo: "",
    reviewLink: "",
    details: {
      ram: "64GB 内存",
      storage: "2x2TB HDD",
      bandwidth: "不限流量",
      ipv4: "1个IPv4",
      location: "德国、芬兰"
    }
  },
  {
    name: "Kimsufi",
    config: "经济型独立服务器",
    price: "$13/月",
    link: "https://www.kimsufi.com",
    buttonText: "查看详情",
    providerLogo: "",
    reviewLink: "",
    details: {
      ram: "16GB 内存",
      storage: "1TB HDD",
      bandwidth: "不限流量",
      ipv4: "1个IPv4",
      location: "法国、加拿大"
    }
  }
];

// 默认导出所有类型
export default {
  kvmDeals,
  natDeals,
  highSpecDeals,
  storageDeals,
  vdsDeals,
  freeDeals,
  monthlyUnder2Deals,
  annualUnder15Deals,
  annualUnder25Deals,
  natOpenVZDeals,
  dedicatedDeals
};