<!-- 字典组件 -->
<template>
  <template v-if="type === 'text'">
    <span v-for="item in valueData" :key="item.dictDataCode">
      {{ item.dictDataName }}
    </span>
  </template>
  <template v-else-if="type === 'tag'">
    <el-tag
      v-for="item in valueData"
      :key="item.dictDataCode"
      :disable-transitions="true"
      size="small"
    >
      {{ item.dictDataName }}
    </el-tag>
  </template>
  <el-radio-group
    v-else-if="type === 'radio'"
    :disabled="disabled"
    v-model="model"
  >
    <el-radio
      v-for="item in data"
      :key="item.dictDataCode"
      :value="item.dictDataCode"
      :label="item.dictDataName"
    />
  </el-radio-group>
  <el-checkbox-group
    v-else-if="type === 'checkbox'"
    :disabled="disabled"
    v-model="model"
  >
    <el-checkbox
      v-for="item in data"
      :key="item.dictDataCode"
      :value="item.dictDataCode"
      :label="item.dictDataName"
    />
  </el-checkbox-group>
  <el-select
    v-else
    v-model="model"
    :clearable="clearable"
    :disabled="disabled"
    :placeholder="placeholder"
    :multiple="type === 'multipleSelect'"
    :teleported="teleported"
    :filterable="filterable"
    class="ele-fluid"
  >
    <el-option
      v-for="item in data"
      :key="item.dictDataCode"
      :value="item.dictDataCode"
      :label="item.dictDataName"
    />
  </el-select>
</template>

<script setup>
  import { computed } from 'vue';
  import { useDictData } from '@/utils/use-dict-data';

  defineOptions({ name: 'DictData' });

  const props = defineProps({
    /** 字典类型 */
    code: String,
    /** 组件类型 */
    type: String,
    /** 是否禁用 */
    disabled: Boolean,
    /** 提示文本 */
    placeholder: String,
    /** select是否可清除 */
    clearable: {
      type: Boolean,
      default: true
    },
    /** select的下拉是否插入到body下 */
    teleported: {
      type: Boolean,
      default: true
    },
    /** select是否可搜索 */
    filterable: Boolean
  });

  /** 字典值 */
  const model = defineModel({
    type: [String, Number, Boolean, Array]
  });

  /** 字典数据 */
  const [data] = useDictData([props.code]);

  /** 绑定值对应的字典数据 */
  const valueData = computed(() => {
    const result = [];
    const val = model.value;
    if (val == null || val === '') {
      return result;
    }
    const values = Array.isArray(val) ? val : [val];
    values.forEach((v) => {
      const temp = data.value.find((d) => d.dictDataCode == v);
      if (temp != null) {
        result.push(temp);
      } else {
        result.push({ dictDataCode: v, dictDataName: v });
      }
    });
    return result;
  });
</script>
