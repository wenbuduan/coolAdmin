<template>
  <EleModal
    :form="true"
    :width="460"
    title="添加分组"
    :zIndex="baseIndex"
    :appendToBody="false"
    v-bind="modalProps || {}"
    v-model="visible"
    @open="handleOpen"
    @closed="handleClosed"
  >
    <ElForm ref="formRef" :model="form" labelWidth="82px" @submit.prevent="">
      <ElFormItem label="上级分组" prop="parentId">
        <ElTreeSelect
          v-model="form.parentId"
          :data="groupData.filter((d) => d.id !== 0 && d.id !== -1)"
          nodeKey="id"
          :props="{ label: 'name' }"
          :clearable="true"
          :checkStrictly="true"
          :defaultExpandAll="true"
          placeholder="请选择上级分组"
          :popperOptions="{ strategy: 'fixed' }"
          :teleported="false"
          class="ele-fluid"
        >
          <template #default="{ data }">
            <img
              src="/ele-file-list/ic_file_folder.png"
              class="file-picker-tree-icon"
            />
            <span>{{ data.name }}</span>
          </template>
          <template v-if="form.parentId" #prefix>
            <img
              src="/ele-file-list/ic_file_folder.png"
              class="file-picker-tree-icon"
            />
          </template>
        </ElTreeSelect>
      </ElFormItem>
      <ElFormItem
        label="分组名称"
        prop="name"
        :rules="[
          {
            required: true,
            message: '请输入分组名称',
            type: 'string',
            trigger: 'blur'
          }
        ]"
      >
        <ElInput
          :maxlength="20"
          :clearable="true"
          v-model="form.name"
          placeholder="请输入分组名称"
        />
      </ElFormItem>
    </ElForm>
    <template #footer>
      <ElButton @click="handleCancel">取消</ElButton>
      <ElButton type="primary" :loading="loading" @click="save">
        保存
      </ElButton>
    </template>
  </EleModal>
</template>

<script setup>
  import { ref } from 'vue';
  import { useFormData } from '@/utils/use-form-data';
  import { addUserFile } from '@/api/system/user-file';

  const props = defineProps({
    /** 上级分组 */
    parentId: Number,
    /** 分组数据 */
    groupData: Array,
    /** 弹窗参数 */
    modalProps: Object,
    /** 统一设置层级 */
    baseIndex: Number,
    /** 消息提示组件 */
    messageIns: [Object, Function]
  });

  const emit = defineEmits(['done']);

  /** 弹窗是否打开 */
  const visible = defineModel({ type: Boolean });

  /** 表单实例 */
  const formRef = ref(null);

  /** 提交状态 */
  const loading = ref(false);

  /** 表单数据 */
  const [form, resetFields] = useFormData({
    name: '',
    parentId: void 0
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
      addUserFile({ ...form, isDirectory: 1 })
        .then((msg) => {
          loading.value = false;
          props.messageIns?.success?.(msg);
          handleCancel();
          emit('done');
        })
        .catch((e) => {
          loading.value = false;
          props.messageIns?.error?.(e.message);
        });
    });
  };

  /** 弹窗关闭事件 */
  const handleClosed = () => {
    resetFields();
    formRef.value?.clearValidate?.();
  };

  /** 弹窗打开事件 */
  const handleOpen = () => {
    if (props.parentId != null) {
      form.parentId = props.parentId;
    }
  };
</script>
