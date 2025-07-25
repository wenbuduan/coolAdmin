<template>
  <div class="login-wrapper">
    <div class="login-main">
      <ele-card shadow="always" class="login-card">
        <div class="login-cover">
          <h1 class="login-title"></h1>
          <h4 class="login-subtitle"></h4>
        </div>
        <div class="login-body">
          <ele-text type="heading" style="font-size: 24px; margin-bottom: 18px">
            {{ t('login.title') }}
          </ele-text>
          <ele-segmented
            v-model="tabActive"
            :items="[
              { label: t('login.passwordType'), value: 1 },
              { label: t('login.qrcodeType'), value: 2 }
            ]"
            style="margin-bottom: 18px"
            @change="handleTabChange"
          />
          <el-form
            v-if="tabActive == 1"
            ref="formRef"
            size="large"
            :model="form"
            :rules="rules"
            @keyup.enter="submit"
            @submit.prevent=""
          >
            <el-form-item prop="username">
              <el-input
                clearable
                v-model="form.username"
                :placeholder="t('login.username')"
                :prefix-icon="UserOutlined"
              />
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                show-password
                v-model="form.password"
                :placeholder="t('login.password')"
                :prefix-icon="LockOutlined"
              />
            </el-form-item>
            <el-form-item prop="code">
              <div class="login-captcha-group">
                <el-input
                  clearable
                  v-model="form.captcha_code"
                  :placeholder="t('login.code')"
                  :prefix-icon="ProtectOutlined"
                />
                <div class="login-captcha" @click="changeCaptcha">
                  <img v-if="captcha" :src="captcha" />
                </div>
              </div>
            </el-form-item>
            <el-form-item>
              <el-checkbox v-model="isRememberMe">
                {{ t('login.remember') }}
              </el-checkbox>
            </el-form-item>
            <el-form-item>
              <el-button
                size="large"
                type="primary"
                :loading="loading"
                style="width: 100%"
                @click="submit"
              >
                {{ t('login.login') }}
              </el-button>
            </el-form-item>
          </el-form>
          <div v-else class="login-qrcode-group">
            <ele-qr-code-svg
              :size="180"
              :margin="2"
              :value="qrcode"
              class="login-qrcode"
            />
            <el-link
              type="primary"
              :underline="false"
              style="margin-top: 16px; user-select: none"
              @click="refreshQrCode"
            >
              <el-icon
                :size="15"
                style="transform: translateY(-1px); margin-right: 6px"
              >
                <ReloadOutlined />
              </el-icon>
              <span>{{ t('login.refreshQrcode') }}</span>
            </el-link>
          </div>
        </div>
      </ele-card>
    </div>
    <PageFooter style="padding-top: 0" />
  </div>
</template>
<script setup>
  import { ref, reactive, unref, watch, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { EleMessage } from 'ele-admin-plus/es';
  import {
    UserOutlined,
    LockOutlined,
    ProtectOutlined,
    ReloadOutlined
  } from '@/components/icons';
  import {
    getToken,
    saveIsRememberMe,
    savePassword,
    getPassword,
    getUserName,
    getIsRememberMe,
    saveUserName,
    removeUserName,
    removePassword
  } from '@/utils/token-util';
  import { usePageTab } from '@/utils/use-page-tab';
  import { login, getCaptcha } from '@/api/login';
  import PageFooter from '@/layout/components/page-footer.vue';
  import { useI18n } from 'vue-i18n';
  import { rsaEncrypt } from '@/utils/crypt';
  const { t } = useI18n();
  const { currentRoute } = useRouter();
  const { goHomeRoute, cleanPageTabs } = usePageTab();

  /** 页签选中 */
  const tabActive = ref(1);

  /** 表单 */
  const formRef = ref(null);

  /** 加载状态 */
  const loading = ref(false);

  const isRememberMe = ref(false);

  /** 表单数据 */
  const form = reactive({
    username: getUserName() || '', //admin
    password: getPassword() || '', //admin
    captcha_code: '', // 验证码
    captcha_key: '' //
  });

  /** 表单验证规则 */
  const rules = computed(() => {
    return {
      username: [
        {
          required: true,
          message: t('login.username'),
          type: 'string',
          trigger: 'blur'
        }
      ],
      password: [
        {
          required: true,
          message: t('login.password'),
          type: 'string',
          trigger: 'blur'
        }
      ],
      captcha_code: [
        {
          required: true,
          message: t('login.code'),
          type: 'string',
          trigger: 'blur'
        }
      ]
    };
  });

  /** 图形验证码 */
  const captcha = ref('');

  /** 验证码内容, 实际项目去掉 */
  const text = ref('');

  /** 二维码 */
  const qrcode = ref('');

  /** 提交 */
  const submit = () => {
    formRef.value?.validate?.((valid) => {
      if (!valid) {
        return;
      }
      if (form.captcha_code.toLowerCase() !== text.value) {
        EleMessage.error('验证码错误');
        return;
      }
      loading.value = true;
      login({
        username: form.username,
        password: rsaEncrypt(form.password),
        captcha_code: form.captcha_code,
        captcha_key: form.captcha_key
      })
        .then((msg) => {
          EleMessage.success(msg);
          if (isRememberMe.value) {
            saveUserName(form.username);
            savePassword(form.password);
          }
          cleanPageTabs();
          goHome();
        })
        .catch((e) => {
          loading.value = false;
          EleMessage.error(e.message);
          changeCaptcha();
        });
    });
  };

  /** 获取图形验证码 */
  const changeCaptcha = () => {
    getCaptcha()
      .then((data) => {
        // console.log(data);
        captcha.value = `data:image/png;base64,${data.captcha_img}`; // data.captcha_img;
        form.captcha_key = data.captcha_key;
        // 实际项目后端一般会返回验证码的key而不是直接返回验证码的内容, 登录用key去验证, 可以根据自己后端接口修改
        text.value = data.captcha_code;
        // 自动回填验证码, 实际项目去掉
        // form.code = data.text;
        formRef.value?.clearValidate?.();
      })
      .catch((e) => {
        EleMessage.error(e.message);
      });
  };

  /** 刷新二维码 */
  const refreshQrCode = () => {
    qrcode.value = `https://api.eleadmin.com/v2/auth/login?code=${Date.now()}`;
  };

  /** 选项卡切换事件 */
  const handleTabChange = (active) => {
    if (active === 2) {
      refreshQrCode();
    }
  };

  /** 跳转到首页 */
  const goHome = () => {
    const { query } = unref(currentRoute);
    goHomeRoute(query.from);
  };

  watch(isRememberMe, (newVal) => {
    saveIsRememberMe(newVal);
    if (newVal === false) {
      removeUserName();
      removePassword();
    }
  });

  // 如果已登录直接进入首页
  if (getToken()) {
    goHome();
  } else {
    isRememberMe.value = getIsRememberMe();
    changeCaptcha();
  }
</script>
<style lang="scss" scoped>
  .login-wrapper {
    min-height: 100vh;
    min-height: 100dvh;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    background-image: url('@/assets/login-bg.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;

    .login-main {
      flex: auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      padding: 20px;
    }

    .login-card {
      width: 920px;
      max-width: 100%;
      overflow: hidden;

      :deep(.ele-card-body) {
        display: flex;
        padding: 0;
        height: 462px;
      }
    }
  }

  .login-cover {
    flex: 1;
    padding: 32px 8px;
    box-sizing: border-box;
    background-color: #1681fd;
    background-image: url('@/assets/login-img.png');
    // background-size: 100% 100%;
    background-repeat: no-repeat;
    background-position: bottom;
    background-size: contain;
    text-align: center;
  }

  .login-body {
    width: 400px;
    flex-shrink: 0;
    padding: 32px 48px 0 48px;
    box-sizing: border-box;

    :deep(.el-checkbox) {
      height: auto;

      .el-checkbox__label {
        color: inherit;
      }
    }

    :deep(.el-input__prefix-inner > .el-icon) {
      margin-right: 12px;
      transform: scale(1.16);
    }
  }

  /* 验证码 */
  .login-captcha-group {
    width: 100%;
    display: flex;
    align-items: center;

    :deep(.el-input) {
      flex: 1;
    }

    .login-captcha {
      flex-shrink: 0;
      width: 108px;
      height: 40px;
      margin-left: 8px;
      border-radius: var(--el-border-radius-base);
      border: 1px solid var(--el-border-color);
      transition: border 0.2s;
      box-sizing: border-box;
      background: #fff;
      overflow: hidden;
      cursor: pointer;

      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        display: block;
      }

      &:hover {
        border-color: var(--el-color-primary);
      }
    }
  }

  /* 标题 */
  .login-title {
    color: rgba(255, 255, 255, 0.98);
    font-size: 28px;
    margin: 0 0 6px 0;
    font-weight: normal;
    letter-spacing: 1.2px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
      'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji',
      'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
  }

  .login-subtitle {
    color: rgba(255, 255, 255, 0.8);
    font-size: 16px;
    margin: 0;
    font-weight: normal;
    letter-spacing: 4px;
  }

  /* 二维码 */
  .login-qrcode-group {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 24px 0;
  }

  .login-qrcode {
    font-size: 0;
    display: inline-block;
    border: 1px solid #ddd;
    border-radius: var(--el-border-radius-base);
    overflow: hidden;
  }

  /* 小屏幕适应 */
  @media screen and (max-width: 680px) {
    .login-wrapper {
      background: #fff;

      .login-main {
        padding: 0;
        display: block;
      }

      .login-card {
        width: 100%;
        background: none;
        box-shadow: none;
        border-radius: 0;

        :deep(.ele-card-body) {
          display: block;
          height: auto;
        }
      }
    }

    .login-cover {
      padding: 20px 12px 100px 12px;
      background-size: 100% 100%;
    }

    .login-body {
      width: 100%;
    }
  }
</style>
<style lang="scss">
  html.dark .login-wrapper {
    background: #000;
  }
</style>
