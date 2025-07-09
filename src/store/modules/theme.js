/**
 * 主题状态管理
 */
import { defineStore } from 'pinia';
import { changeColor } from 'ele-admin-plus/es/utils/theme-util';
import { THEME_CACHE_NAME, TAB_KEEP_ALIVE } from '@/config/setting';

/**
 * 默认值
 */
const DEFAULT_STATE = Object.freeze({
  /** 页签数据 */
  tabs: [],
  /** 是否折叠侧栏 */
  collapse: false,
  /** 侧栏一级是否紧凑风格 */
  compact: false,
  /** 内容区是否最大化 */
  maximized: false,
  /** 是否需要页签栏 */
  tabBar: true,
  /** 布局类型 */
  layout: 'default',
  /** 侧栏布局类型 */
  sidebarLayout: 'default',
  /** 顶栏风格 */
  headerStyle: 'light',
  /** 侧栏风格 */
  sidebarStyle: 'dark',
  /** 页签风格 */
  tabStyle: 'simple',
  /** 是否固定顶栏 */
  fixedHeader: true,
  /** 是否固定侧栏 */
  fixedSidebar: true,
  /** 是否固定内容区 */
  fixedBody: true,
  /** 内容区是否撑满 */
  fluid: true,
  /** 图标是否置于顶栏 */
  logoInHeader: false,
  /** 侧栏菜单是否彩色图标 */
  colorfulIcon: false,
  /** 侧栏排他展开 */
  uniqueOpened: true,
  /** 固定主页页签 */
  fixedHome: true,
  /** 页签是否置于顶栏 */
  tabInHeader: false,
  /** 路由切换动画 */
  transitionName: 'slide-right',
  /** 是否色弱模式 */
  weakMode: false,
  /** 是否暗黑模式 */
  darkMode: false,
  /** 主题色 */
  color: null,
  /** 内容区宽度 */
  contentWidth: null,
  /** 是否开启圆角主题 */
  roundedTheme: true,
  /** 菜单触发模式 */
  menuItemTrigger: 'click',
  /** 是否开启响应式 */
  responsive: true
});

/**
 * 读取缓存配置
 */
function getCacheSetting() {
  try {
    const value = localStorage.getItem(THEME_CACHE_NAME);
    if (value) {
      const cache = JSON.parse(value);
      if (typeof cache === 'object') {
        return cache;
      }
    }
  } catch (e) {
    console.error(e);
  }
  return {};
}

/**
 * 缓存配置
 */
function cacheSetting(key, value) {
  const cache = getCacheSetting();
  if (cache[key] !== value) {
    cache[key] = value;
    localStorage.setItem(THEME_CACHE_NAME, JSON.stringify(cache));
  }
}

/**
 * 开关响应式布局
 */
function changeResponsive(responsive) {
  const classes = 'ele-body-limited';
  if (responsive) {
    document.body.classList.remove(classes);
  } else {
    document.body.classList.add(classes);
  }
}

/**
 * 切换圆角主题
 */
function changeRoundedTheme(roundedTheme) {
  const classes = 'rounded';
  const $html = document.querySelector('html');
  if ($html && roundedTheme) {
    $html.classList.add(classes);
  } else if ($html) {
    $html.classList.remove(classes);
  }
}

/**
 * 切换色弱模式
 */
function changeWeakMode(weakMode) {
  const classes = 'ele-admin-weak';
  if (weakMode) {
    document.body.classList.add(classes);
  } else {
    document.body.classList.remove(classes);
  }
}

/**
 * 切换主题
 */
function changeTheme(value, dark) {
  return new Promise((resolve, reject) => {
    try {
      changeColor(value, dark);
      resolve();
    } catch (e) {
      reject(e);
    }
  });
}

export const useThemeStore = defineStore('theme', {
  state: () => {
    const state = { ...DEFAULT_STATE };
    // 读取本地缓存
    const cache = getCacheSetting();
    Object.keys(state).forEach((key) => {
      if (typeof cache[key] !== 'undefined') {
        state[key] = cache[key];
      }
    });
    return state;
  },
  getters: {
    /** 需要缓存的组件 */
    keepAliveInclude() {
      if (!TAB_KEEP_ALIVE || !this.tabBar || !this.tabs) {
        return [];
      }
      const components = new Set();
      this.tabs.forEach((t) => {
        if (t.meta?.keepAlive !== false && !t.refresh && t.components) {
          t.components.forEach((c) => {
            if (typeof c === 'string' && c) {
              components.add(c);
            }
          });
        }
      });
      return Array.from(components);
    }
  },
  actions: {
    setTabs(value) {
      this.tabs = value;
      //cacheSetting('tabs', value);
    },
    setCollapse(value) {
      this.collapse = value;
    },
    setCompact(value) {
      this.compact = value;
    },
    setMaximized(value) {
      this.maximized = value;
    },
    setTabBar(value) {
      this.tabBar = value;
      cacheSetting('tabBar', value);
    },
    setLayout(value) {
      this.layout = value;
      cacheSetting('layout', value);
    },
    setSidebarLayout(value) {
      this.sidebarLayout = value;
      cacheSetting('sidebarLayout', value);
    },
    setHeaderStyle(value) {
      this.headerStyle = value;
      cacheSetting('headerStyle', value);
    },
    setSidebarStyle(value) {
      this.sidebarStyle = value;
      cacheSetting('sidebarStyle', value);
    },
    setTabStyle(value) {
      this.tabStyle = value;
      cacheSetting('tabStyle', value);
    },
    setFixedHeader(value) {
      this.fixedHeader = value;
      cacheSetting('fixedHeader', value);
    },
    setFixedSidebar(value) {
      this.fixedSidebar = value;
      cacheSetting('fixedSidebar', value);
    },
    setFixedBody(value) {
      this.fixedBody = value;
      cacheSetting('fixedBody', value);
    },
    setFluid(value) {
      this.fluid = value;
      cacheSetting('fluid', value);
    },
    setLogoInHeader(value) {
      this.logoInHeader = value;
      cacheSetting('logoInHeader', value);
    },
    setColorfulIcon(value) {
      this.colorfulIcon = value;
      cacheSetting('colorfulIcon', value);
    },
    setUniqueOpened(value) {
      this.uniqueOpened = value;
      cacheSetting('uniqueOpened', value);
    },
    setFixedHome(value) {
      this.fixedHome = value;
      cacheSetting('fixedHome', value);
    },
    setTabInHeader(value) {
      this.tabInHeader = value;
      cacheSetting('tabInHeader', value);
    },
    setTransitionName(value) {
      this.transitionName = value;
      cacheSetting('transitionName', value);
    },
    setContentWidth(value) {
      this.contentWidth = value;
    },
    setWeakMode(value) {
      changeWeakMode(value);
      this.weakMode = value;
      cacheSetting('weakMode', value);
    },
    /**
     * 切换暗黑模式
     * @param value 是否是暗黑模式
     */
    async setDarkMode(value) {
      await changeTheme(this.color, value);
      this.darkMode = value;
      cacheSetting('darkMode', value);
    },
    /**
     * 切换主题色
     * @param value 主题色
     */
    async setColor(value) {
      await changeTheme(value, this.darkMode);
      this.color = value;
      cacheSetting('color', value);
    },
    /**
     * 重置
     */
    async resetSetting() {
      const excludes = ['tabs', 'collapse', 'contentWidth'];
      Object.keys(DEFAULT_STATE).forEach((key) => {
        if (!excludes.includes(key)) {
          this[key] = DEFAULT_STATE[key];
        }
      });
      localStorage.removeItem(THEME_CACHE_NAME);
      changeResponsive(this.responsive);
      changeRoundedTheme(this.roundedTheme);
      changeWeakMode(this.weakMode);
      await changeTheme(this.color, this.darkMode);
    },
    /**
     * 恢复主题
     */
    recoverTheme() {
      // 关闭响应式布局
      if (!this.responsive) {
        changeResponsive(false);
      }
      // 开启圆角主题
      if (this.roundedTheme) {
        changeRoundedTheme(true);
      }
      // 开启色弱模式
      if (this.weakMode) {
        changeWeakMode(true);
      }
      // 恢复主题色
      if (this.color || this.darkMode) {
        changeTheme(this.color, this.darkMode).catch((e) => {
          console.error(e);
        });
      }
    },
    /**
     * 添加页签或更新页签数据
     * @param data 页签数据
     */
    tabAdd(data) {
      const i = this.tabs.findIndex((d) => d.key === data.key);
      if (i === -1) {
        this.setTabs([...this.tabs, data]);
      } else if (data.fullPath !== this.tabs[i].fullPath) {
        const temps = [...this.tabs];
        temps[i] = data;
        this.setTabs(temps);
      }
    },
    /**
     * 关闭页签
     */
    async tabRemove({ key, active }) {
      const i = this.tabs.findIndex((t) => t.key === key || t.fullPath === key);
      if (i === -1) {
        return {};
      }
      const t = this.tabs[i];
      if (
        !t.closable ||
        (t.home && (this.tabs.length === 1 || this.fixedHome))
      ) {
        return Promise.reject();
      }
      const path = this.tabs[i + (i === 0 ? 1 : -1)]?.fullPath;
      this.setTabs(this.tabs.filter((_d, j) => j !== i));
      return t.key === active ? { path, home: !path } : {};
    },
    /**
     * 关闭左侧页签
     */
    async tabRemoveLeft({ key, active }) {
      let index = -1; // 选中页签的索引
      for (let i = 0; i < this.tabs.length; i++) {
        if (this.tabs[i].key === active) {
          index = i;
        }
        if (this.tabs[i].key === key) {
          if (i === 0) {
            break;
          }
          const temp = this.tabs.filter((d, j) => !d.closable && j < i);
          if (temp.length === i) {
            break;
          }
          const path = index === -1 ? void 0 : this.tabs[i].fullPath;
          this.setTabs(temp.concat(this.tabs.slice(i)));
          return { path };
        }
      }
      return Promise.reject();
    },
    /**
     * 关闭右侧页签
     */
    async tabRemoveRight({ key, active }) {
      let index = -1; // 选中页签的索引
      for (let i = 0; i < this.tabs.length; i++) {
        if (this.tabs[i].key === active) {
          index = i;
        }
        if (this.tabs[i].key === key) {
          if (i === this.tabs.length - 1) {
            break;
          }
          const temp = this.tabs.filter((d, j) => !d.closable && j > i);
          if (temp.length === this.tabs.length - i - 1) {
            break;
          }
          const path = index === -1 ? this.tabs[i].fullPath : void 0;
          this.setTabs(this.tabs.slice(0, i + 1).concat(temp));
          return { path };
        }
      }
      return Promise.reject();
    },
    /**
     * 关闭其它页签
     */
    async tabRemoveOther({ key, active }) {
      let path; // 关闭后跳转的地址
      const temps = this.tabs.filter((d) => {
        if (d.key === key) {
          path = d.fullPath;
        }
        return !d.closable || d.key === key;
      });
      if (temps.length === this.tabs.length) {
        return Promise.reject();
      }
      this.setTabs(temps);
      return key === active ? {} : { path };
    },
    /**
     * 关闭全部页签
     */
    async tabRemoveAll({ active }) {
      if (this.tabs.length === 1 && this.tabs[0].home) {
        return Promise.reject();
      }
      const temps = this.tabs.filter(
        (t) => !t.closable || (t.home && this.fixedHome)
      );
      if (temps.length === this.tabs.length) {
        return Promise.reject();
      }
      const t = active ? this.tabs.find((d) => d.key === active) : void 0;
      const jump = t != null && t.closable === true; // 关闭后是否跳转
      if (!temps.length) {
        const h = this.tabs.find((d) => d.home);
        if (!h) {
          this.setTabs([]);
          return { home: true };
        }
        this.setTabs([h]);
        return { home: t?.home ? void 0 : true };
      }
      this.setTabs(temps);
      return { path: jump ? temps[0].fullPath : void 0 };
    },
    /**
     * 修改页签
     * @param data 页签数据
     */
    tabSetItem(data) {
      if (!data.key && !data.fullPath) {
        if (!data.path) {
          return;
        }
        this.tabs.forEach((d) => {
          if (data.path === d.path) {
            this.tabSetItem({ ...data, key: d.key });
          }
        });
        return;
      }
      const k = data.key ? 'key' : 'fullPath';
      const i = this.tabs.findIndex((d) => data[k] === d[k]);
      if (i === -1) {
        return;
      }
      const item = { ...this.tabs[i] };
      if (data.title) {
        const title = data.title;
        item.title = title;
        if (item.meta) {
          item.meta.lang = { zh_CN: title, zh_TW: title, en: title };
        }
      }
      if (typeof data.closable === 'boolean') {
        item.closable = data.closable;
      }
      if (typeof data.refresh === 'boolean') {
        item.refresh = data.refresh;
      }
      if (data.components) {
        item.components = data.components;
      }
      const temps = [...this.tabs];
      temps[i] = item;
      this.setTabs(temps);
    },
    /** 修改菜单触发模式 */
    setMenuItemTrigger(value) {
      this.menuItemTrigger = value;
      cacheSetting('menuItemTrigger', value);
    },
    /** 切换圆角主题 */
    setRoundedTheme(value) {
      changeRoundedTheme(value);
      this.roundedTheme = value;
      cacheSetting('roundedTheme', value);
    },
    /** 修改响应式开关 */
    setResponsive(value) {
      changeResponsive(value);
      this.responsive = value;
      cacheSetting('responsive', value);
    }
  }
});
