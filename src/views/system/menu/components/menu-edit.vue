<!-- 编辑弹窗 -->
<template>
  <ele-modal
    form
    :width="740"
    v-model="visible"
    :title="isUpdate ? '修改菜单' : '新建菜单'"
    @open="handleOpen"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px"
      :validate-on-rule-change="false"
      @submit.prevent=""
    >
      <el-row :gutter="16">
        <el-col :sm="12" :xs="24">
          <el-form-item label="上级菜单" prop="parentId">
            <menu-select ref="menuSelectRef" v-model="form.parentId" />
          </el-form-item>
          <el-form-item label="菜单名称" prop="title">
            <el-input
              clearable
              :maxlength="20"
              v-model="form.title"
              placeholder="请输入菜单名称"
            />
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="菜单类型" prop="menuType">
            <el-radio-group
              v-model="form.menuType"
              @change="handleMenuTypeChange"
            >
              <el-radio :value="0" label="目录" />
              <el-radio :value="1" label="菜单" />
              <el-radio :value="2" label="按钮" />
            </el-radio-group>
          </el-form-item>
          <el-form-item label="打开方式">
            <el-radio-group
              v-model="form.openType"
              :disabled="form.menuType === 0 || form.menuType === 2"
              @change="handleOpenTypeChange"
            >
              <el-radio :value="0" label="组件" />
              <el-radio :value="1" label="内嵌" />
              <el-radio :value="2" label="外链" />
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-divider style="margin: 8px 0 22px 0; opacity: 0.6" />
      <el-row :gutter="16">
        <el-col :sm="12" :xs="24">
          <el-form-item label="菜单图标" prop="icon">
            <icon-select
              clearable
              filterable="popper"
              :popper-width="460"
              :popper-height="388"
              :popper-options="{ strategy: 'fixed' }"
              placeholder="请选择图标"
              v-model="form.icon"
              :disabled="form.menuType === 2"
            />
          </el-form-item>
          <el-form-item prop="path">
            <template #label>
              <ele-tooltip
                v-if="form.openType === 2"
                content="需要以`http://`、`https://`、`//`开头"
                placement="top-start"
                :popper-options="{
                  modifiers: [
                    { name: 'offset', options: { offset: [-12, 10] } }
                  ]
                }"
              >
                <el-icon
                  :size="15"
                  style="align-self: center; margin-right: 4px; cursor: help"
                >
                  <QuestionCircleOutlined style="opacity: 0.6" />
                </el-icon>
              </ele-tooltip>
              <span>{{ form.openType === 2 ? '外链地址' : '路由地址' }}</span>
            </template>
            <el-input
              clearable
              :maxlength="100"
              v-model="form.path"
              :disabled="form.menuType === 2"
              :placeholder="
                form.openType === 2 ? '请输入外链地址' : '请输入路由地址'
              "
            />
          </el-form-item>
          <el-form-item prop="component">
            <template #label>
              <ele-tooltip
                v-if="form.openType === 1"
                content="需要以`http://`、`https://`、`//`开头"
                placement="top-start"
                :popper-options="{
                  modifiers: [
                    { name: 'offset', options: { offset: [-12, 10] } }
                  ]
                }"
              >
                <el-icon
                  :size="15"
                  style="align-self: center; margin-right: 4px; cursor: help"
                >
                  <QuestionCircleOutlined style="opacity: 0.6" />
                </el-icon>
              </ele-tooltip>
              <span>{{ form.openType === 1 ? '内嵌地址' : '组件路径' }}</span>
            </template>
            <el-input
              clearable
              :maxlength="100"
              v-model="form.component"
              :disabled="
                form.menuType === 0 ||
                form.menuType === 2 ||
                form.openType === 2
              "
              :placeholder="
                form.openType === 1 ? '请输入内嵌地址' : '请输入组件路径'
              "
            />
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="权限标识" prop="authority">
            <el-input
              clearable
              v-model="form.authority"
              placeholder="请输入权限标识"
              :disabled="
                form.menuType === 0 ||
                (form.menuType === 1 && form.openType === 2)
              "
            />
          </el-form-item>
          <el-form-item label="排序号" prop="sortNumber">
            <el-input-number
              :min="0"
              :max="99999"
              v-model="form.sortNumber"
              placeholder="请输入排序号"
              controls-position="right"
              class="ele-fluid"
            />
          </el-form-item>
          <el-form-item label="是否展示">
            <el-switch
              inline-prompt
              active-text="是"
              inactive-text="否"
              :model-value="form.hide === 0"
              :disabled="form.menuType === 2"
              @change="updateHideValue"
            />
            <!-- <el-form-item label="是否启用">
              <el-switch
                inline-prompt
                active-text="是"
                inactive-text="否"
                :model-value="form.status === 0"
                :disabled="form.menuType === 2"
                @change="updateStatusValue"
              />
            </el-form-item> -->

            <ele-tooltip
              content="选择不展示只注册路由不展示在侧边栏, 比如添加页面应该选择不展示"
              :popper-style="{ maxWidth: '240px' }"
            >
              <el-icon :size="15" style="margin-left: 16px; cursor: help">
                <QuestionCircleOutlined style="opacity: 0.6" />
              </el-icon>
            </ele-tooltip>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="状态">
            <el-switch
              v-model="form.status"
              inline-prompt
              :active-value="'ENABLED'"
              :inactive-value="'DISABLED'"
              active-text="启用"
              inactive-text="停用"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="路由元数据" prop="meta">
        <el-input
          :rows="4"
          type="textarea"
          :maxlength="200"
          v-model="form.meta"
          placeholder="请输入JSON格式的路由元数据"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" :loading="loading" @click="save">
        保存
      </el-button>
    </template>
  </ele-modal>
</template>

<script setup>
  import { ref, nextTick, computed } from 'vue';
  import { EleMessage, isExternalLink } from 'ele-admin-plus/es';
  import { QuestionCircleOutlined } from '@/components/icons';
  import { useFormData } from '@/utils/use-form-data';
  import IconSelect from '@/components/IconSelect/index.vue';
  import MenuSelect from './menu-select.vue';
  import { addMenu, updateMenu } from '@/api/system/menu';

  const props = defineProps({
    /** 修改回显的数据 */
    data: Object,
    /** 添加时上级菜单id */
    parentId: Number
  });

  const emit = defineEmits(['done']);

  /** 弹窗是否打开 */
  const visible = defineModel({ type: Boolean });

  /** 是否是修改 */
  const isUpdate = ref(false);

  /** 提交状态 */
  const loading = ref(false);

  /** 表单实例 */
  const formRef = ref(null);

  /** 表单数据 */
  const [form, resetFields, assignFields] = useFormData({
    menuId: void 0,
    parentId: void 0,
    title: '',
    menuType: 0,
    openType: 0,
    icon: '',
    path: '',
    component: '',
    authority: '',
    sortNumber: void 0,
    hide: 0,
    status: 0,
    meta: ''
  });

  /** 表单验证规则 */
  const rules = computed(() => {
    const obj = {
      title: [
        {
          required: true,
          type: 'string',
          message: '请输入菜单名称',
          trigger: 'blur'
        }
      ],
      sortNumber: [
        {
          required: true,
          type: 'number',
          message: '请输入排序号',
          trigger: 'blur'
        }
      ],
      //meta必填
      meta: [
        {
          type: 'string',
          validator: (_rule, value, callback) => {
            if (value) {
              console.log('value', value);
              const msg = '请输入正确的JSON格式';
              try {
                const obj = JSON.parse(value);

                if (obj == null || typeof obj !== 'object') {
                  callback(msg);
                  return;
                }
              } catch (_e) {
                callback(msg);
                return;
              }
            }
            callback();
          },
          trigger: 'blur'
        }
      ]
    };
    if (form.menuType !== 2) {
      obj.path = [
        {
          required: true,
          type: 'string',
          message: form.openType === 2 ? '请输入外链地址' : '请输入路由地址',
          trigger: 'blur'
        },
        {
          type: 'string',
          validator: (_rule, value, callback) => {
            if (value) {
              if (form.openType === 2) {
                if (!isExternalLink(value)) {
                  callback('请输入正确的链接地址');
                  return;
                }
              } else {
                if (value === '/') {
                  callback('路由地址不能为 /');
                  return;
                }
                if (!value.startsWith('/')) {
                  callback('路由地址需要以 / 开头');
                  return;
                }
              }
            }
            callback();
          },
          trigger: 'blur'
        }
      ];
      if (form.menuType === 1 && form.openType !== 2) {
        obj.component = [
          {
            required: true,
            type: 'string',
            message: form.openType === 1 ? '请输入内嵌地址' : '请输入组件路径',
            trigger: 'blur'
          },
          {
            type: 'string',
            validator: (_rule, value, callback) => {
              if (value) {
                if (form.openType === 1) {
                  if (!isExternalLink(value)) {
                    callback('请输入正确的链接地址');
                    return;
                  }
                }
              }
              callback();
            },
            trigger: 'blur'
          }
        ];
      }
    }
    return obj;
  });

  /** 关闭弹窗 */
  const handleCancel = () => {
    visible.value = false;
  };

  /** 保存编辑 */
  const save = () => {
    formRef.value?.validate?.((valid) => {
      if (!valid) {
        return;
      }
      loading.value = true;
      const saveOrUpdate = isUpdate.value ? updateMenu : addMenu;
      console.log('form', form);
      // return false;

      saveOrUpdate({
        ...form,
        // menuType 对应的值与后端不一致在前端处理
        menuType: form.menuType === 2 ? 1 : 0,
        parentId: form.parentId || 0,
        meta: form.meta || ''
      })
        .then((msg) => {
          loading.value = false;
          EleMessage.success(msg);
          handleCancel();
          emit('done');
        })
        .catch((e) => {
          loading.value = false;
          EleMessage.error(e.message);
        });
    });
  };

  /** menuType选择改变 */
  const handleMenuTypeChange = () => {
    if (form.menuType === 0) {
      form.authority = '';
      form.openType = 0;
      form.component = '';
    } else if (form.menuType === 1) {
      if (form.openType === 2) {
        form.authority = '';
      }
    } else {
      form.openType = 0;
      form.icon = '';
      form.path = '';
      form.component = '';
      form.hide = 0;
    }
    formRef.value?.clearValidate?.();
  };

  /** openType选择改变 */
  const handleOpenTypeChange = () => {
    if (form.openType === 2) {
      form.component = '';
      form.authority = '';
    }
    formRef.value?.clearValidate?.();
  };

  /** hide选择改变 */
  const updateHideValue = (value) => {
    form.hide = value ? 0 : 1;
  };

  /** 判断是否是目录 */
  const isDirectory = (d) => {
    return !!d.children?.length && !d.component;
  };

  /** 弹窗打开事件 */
  const handleOpen = () => {
    if (props.data) {
      const isExternal = isExternalLink(props.data.path);
      const isInner = isExternalLink(props.data.component);
      // menuType对应的值与后端不一致在前端处理
      const menuType =
        props.data.menuType === 1 ? 2 : isDirectory(props.data) ? 0 : 1;
      assignFields({
        ...props.data,
        menuType,
        openType: isExternal ? 2 : isInner ? 1 : 0,
        parentId: props.data.parentId === 0 ? void 0 : props.data.parentId
      });
      isUpdate.value = true;
    } else {
      resetFields();
      form.parentId = props.parentId;
      isUpdate.value = false;
    }
    nextTick(() => {
      nextTick(() => {
        formRef.value?.clearValidate?.();
      });
    });
  };

  /** 菜单下拉选择组件 */
  const menuSelectRef = ref(null);

  /** 刷新菜单下拉选择数据 */
  const reloadMenuSelectData = () => {
    menuSelectRef.value?.reload?.();
  };

  defineExpose({ reloadMenuSelectData });
</script>
