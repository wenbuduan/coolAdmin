<!-- 机构选择下拉框 -->
<template>
  <el-tree-select
    clearable
    filterable
    :data="data"
    check-strictly
    default-expand-all
    node-key="organizationId"
    :props="{ label: 'organizationName' }"
    :placeholder="placeholder"
    v-model="model"
    class="ele-fluid"
    :popper-options="{ strategy: 'fixed' }"
  />
</template>

<script setup>
  import { ref, watch } from 'vue';
  import { EleMessage, toTree } from 'ele-admin-plus/es';
  import { listOrganizations } from '@/api/system/organization';

  const props = defineProps({
    /** 提示信息 */
    placeholder: {
      type: String,
      default: '请选择所属机构'
    },
    /** 指定机构下拉数据 */
    organizationData: Array
  });

  /** 选中的机构 */
  const model = defineModel({ type: [Number, String] });

  /** 机构数据 */
  const data = ref([]);

  watch(
    () => props.organizationData,
    (organizationData) => {
      if (organizationData != null) {
        data.value = organizationData;
      }
    },
    {
      immediate: true,
      deep: true
    }
  );

  /** 获取机构数据 */
  const reload = () => {
    if (props.organizationData != null) {
      return;
    }
    listOrganizations()
      .then((list) => {
        data.value = toTree({
          data: list,
          idField: 'organizationId',
          parentIdField: 'parentId'
        });
      })
      .catch((e) => {
        EleMessage.error(e.message);
      });
  };

  reload();

  defineExpose({ reload });
</script>
