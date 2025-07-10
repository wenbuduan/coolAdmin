<template>
  <div>
    s<ele-page>
      <document-search @search="reload" />
      <ele-card :body-style="{ paddingTop: '8px' }">
        <ele-pro-table
          sticky
          ref="tableRef"
          row-key="organizationId"
          :columns="columns"
          :datasource="datasource"
          :show-overflow-tooltip="true"
          :highlight-current-row="true"
          :export-config="{ fileName: '机构数据' }"
          :default-expand-all="true"
          :pagination="false"
          cache-key="systemOrganizationTable"
        >
          <template #toolbar>
            <el-button
              type="primary"
              class="ele-btn-icon"
              :icon="PlusOutlined"
              @click="openEdit()"
            >
              新建
            </el-button>
            <el-button
              class="ele-btn-icon"
              :icon="ColumnHeightOutlined"
              @click="expandAll"
            >
              展开全部
            </el-button>
            <el-button
              class="ele-btn-icon"
              :icon="VerticalAlignMiddleOutlined"
              @click="foldAll"
            >
              折叠全部
            </el-button>
          </template>
          <template #action="{ row }">
            <el-link
              type="primary"
              :underline="false"
              @click="openEdit(null, row.organizationId)"
            >
              添加
            </el-link>
            <el-divider direction="vertical" />
            <el-link type="primary" :underline="false" @click="openEdit(row)">
              修改
            </el-link>
            <el-divider direction="vertical" />
            <el-link type="danger" :underline="false" @click="remove(row)">
              删除
            </el-link>
          </template>
        </ele-pro-table>
      </ele-card>
      <organization-edit
        v-model="showEdit"
        :data="current"
        :organization-id="parentId"
        :organization-data="organizationData"
        @done="reload"
      />
    </ele-page>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import { ElMessageBox } from 'element-plus/es';
  import { EleMessage, toTree } from 'ele-admin-plus/es';
  import {
    PlusOutlined,
    ColumnHeightOutlined,
    VerticalAlignMiddleOutlined
  } from '@/components/icons';
  import documentSearch from './components/document-search.vue';

  // const getLocalUrl = () => {
  //   const port = '1300';
  //   //获取地址栏url
  //   let localUrl =
  //     window.location.protocol + '//' + window.location.host + ':' + port;
  //   // console.log(localUrl);
  //   return localUrl;
  // };
  // console.log(getLocalUrl());
</script>

<style scoped lang="scss"></style>
