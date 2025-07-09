<template>
  <ele-modal v-model="visible" title="打印" width="80%">
    <el-button @click="onPrint">打印</el-button>
    <ele-printer
      v-model="printing"
      target="_iframe"
      title="项目进度"
      margin="0mm 12mm 10mm 12mm"
      :static="false"
      :header-style="{
        padding: '26px 0 2px 0',
        fontSize: '20px',
        borderBottom: '1px solid #666',
        marginBottom: '26px',
        textAlign: 'center'
      }"
    >
      <template #header>
        <div style="color: #444">
          <img
            src="/favicon.ico"
            style="height: 15px; width: 15px; vertical-align: -2px"
          />
          <span> 用户管理列表</span>
        </div>
        <div style="color: #888">电话：027-987654321</div>
      </template>
      <ele-table size="large">
        <colgroup>
          <col width="60px" />
          <col width="200px" />
          <col width="100px" />
          <col width="180px" />
        </colgroup>
        <thead>
          <tr>
            <th></th>
            <th>项目名称</th>
            <th>状态</th>
            <th>进度</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in projectList" :key="row.id">
            <td style="text-align: center">{{ index + 1 }}</td>
            <td class="project-name">{{ row.projectName }}</td>
            <td>
              <ele-text v-if="row.status === 0" type="success">进行中</ele-text>
              <ele-text v-else-if="row.status === 1" type="danger"
                >已延期</ele-text
              >
              <ele-text v-else-if="row.status === 2" type="warning"
                >未开始</ele-text
              >
              <ele-text v-else-if="row.status === 3" type="info"
                >已结束</ele-text
              >
            </td>
            <td>
              <el-progress :percentage="row.progress" />
            </td>
          </tr>
        </tbody>
      </ele-table>
    </ele-printer>
  </ele-modal>
</template>

<script setup>
  import { ref } from 'vue';
  const printing = ref(false);
  /** 弹窗是否打开 */
  const visible = defineModel({ type: Boolean });
  const onPrint = () => {
    printing.value = true;
  };
  const projectList = ref([
    {
      id: '1',
      projectName: '项目000000001',
      status: 0,
      progress: 30
    },
    {
      id: '2',
      projectName: '项目000000002',
      status: 0,
      progress: 10
    },
    {
      id: '3',
      projectName: '项目000000003',
      status: 1,
      progress: 60
    }
  ]);
</script>

<style scoped lang="scss">
  .project-name {
    color: #1677ff;
  }
</style>
