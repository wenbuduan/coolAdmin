<!-- 搜索表单 -->
<template>
  <el-form label-width="84px" @keyup.enter="search" @submit.prevent="">
    <el-row :gutter="8">
      <el-col :lg="8" :md="8" :sm="12" :xs="24">
        <el-form-item label="字典数据名">
          <el-input
            clearable
            v-model.trim="form.dictDataName"
            placeholder="请输入"
          />
        </el-form-item>
      </el-col>
      <el-col :lg="8" :md="8" :sm="12" :xs="24">
        <el-form-item label="字典数据值">
          <el-input
            clearable
            v-model.trim="form.dictDataCode"
            placeholder="请输入"
          />
        </el-form-item>
      </el-col>
      <el-col :lg="8" :md="8" :sm="12" :xs="24">
        <el-form-item label-width="16px">
          <el-button type="primary" @click="search">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script setup>
  import { useFormData } from '@/utils/use-form-data';

  const emit = defineEmits(['search']);

  /** 表单数据 */
  const [form, resetFields] = useFormData({
    dictDataName: '',
    dictDataCode: ''
  });

  /** 搜索 */
  const search = () => {
    emit('search', { ...form });
  };

  /**  重置 */
  const reset = () => {
    resetFields();
    search();
  };

  defineExpose({ resetFields });
</script>
