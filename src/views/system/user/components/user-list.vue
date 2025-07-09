<template>
  <user-search ref="searchRef" style="margin-bottom: -14px" @search="reload" />
  <ele-pro-table
    ref="tableRef"
    row-key="userId"
    :columns="columns"
    :datasource="datasource"
    :show-overflow-tooltip="true"
    v-model:selections="selections"
    :highlight-current-row="true"
    :export-config="{ fileName: '用户数据', datasource: exportSource }"
    :print-config="printConfig"
    :tools="['reload', 'export', 'print', 'size', 'columns', 'maximized']"
    :style="{ paddingBottom: '16px' }"
    cache-key="systemUserTable"
  >
    <template #tools>
      <!-- <el-icon>
        <plus style="transform: scale(1.2)" />
      </el-icon> -->

      <el-icon size="18"><Printer @click="openPrint" /></el-icon>
    </template>
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
        type="danger"
        class="ele-btn-icon"
        :icon="DeleteOutlined"
        @click="remove()"
      >
        删除
      </el-button>
      <el-button
        class="ele-btn-icon"
        :icon="UploadOutlined"
        @click="openImport"
      >
        导入
      </el-button>
    </template>
    <template #nickname="{ row }">
      <el-link type="primary" :underline="false" @click="openDetail(row)">
        {{ row.nickname }}
      </el-link>
    </template>
    <template #roles="{ row }">
      <el-tag
        v-for="item in row.roles"
        :key="item.roleId"
        size="small"
        :disable-transitions="true"
      >
        {{ item.roleName }}
      </el-tag>
    </template>
    <template #status="{ row }">
      <el-switch
        size="small"
        :model-value="row.status === 0"
        @change="(checked) => editStatus(checked, row)"
      />
    </template>
    <template #action="{ row }">
      <el-link type="primary" :underline="false" @click="openEdit(row)">
        修改
      </el-link>
      <el-divider direction="vertical" />
      <ele-dropdown
        :items="[
          { title: '重置密码', command: 'password' },
          { title: '删除用户', command: 'delete', danger: true, divided: true }
        ]"
        style="display: inline"
        @command="(key) => dropClick(key, row)"
      >
        <el-link type="primary" :underline="false">
          <span>更多</span>
          <el-icon :size="12" style="vertical-align: -1px; margin-left: 2px">
            <ArrowDown />
          </el-icon>
        </el-link>
      </ele-dropdown>
    </template>
  </ele-pro-table>
  <user-edit
    :data="current"
    v-model="showEdit"
    :organization-id="organizationId"
    @done="reload"
  />
  <user-import v-model="showImport" @done="reload" />
  <user-print v-model="showPrint" />
</template>

<script setup>
  import { ref, watch, reactive } from 'vue';
  import { Printer } from '@element-plus/icons-vue';
  import { useRouter } from 'vue-router';
  import { ElMessageBox } from 'element-plus/es';
  import { EleMessage } from 'ele-admin-plus/es';
  import {
    PlusOutlined,
    DeleteOutlined,
    ArrowDown,
    UploadOutlined
  } from '@/components/icons';
  import { usePageTab } from '@/utils/use-page-tab';
  import UserSearch from './user-search.vue';
  import UserEdit from './user-edit.vue';
  import UserPrint from './user-print.vue';
  import UserImport from './user-import.vue';
  import {
    pageUsers,
    removeUsers,
    updateUserStatus,
    updateUserPassword,
    listUsers
  } from '@/api/system/user';

  const props = defineProps({
    /** 机构 id */
    organizationId: Number
  });

  const { push } = useRouter();
  const { addPageTab } = usePageTab();

  /** 搜索栏实例 */
  const searchRef = ref(null);

  /** 表格实例 */
  const tableRef = ref(null);

  /** 表格列配置 */
  const columns = ref([
    {
      type: 'selection',
      columnKey: 'selection',
      width: 50,
      align: 'center',
      fixed: 'left'
    },
    {
      type: 'index',
      columnKey: 'index',
      width: 50,
      align: 'center',
      fixed: 'left'
    },
    {
      prop: 'username',
      label: '用户账号',
      sortable: 'custom',
      minWidth: 110
    },
    {
      prop: 'nickname',
      label: '用户名',
      sortable: 'custom',
      minWidth: 110,
      slot: 'nickname'
    },
    {
      prop: 'sexName',
      label: '性别',
      sortable: 'custom',
      width: 90,
      align: 'center'
    },
    {
      columnKey: 'roles',
      label: '角色',
      minWidth: 110,
      slot: 'roles',
      align: 'center',
      formatter: (row) => row.roles.map((d) => d.roleName).join(',')
    },
    {
      prop: 'createTime',
      label: '创建时间',
      sortable: 'custom',
      width: 180,
      align: 'center'
    },
    {
      prop: 'status',
      label: '状态',
      width: 90,
      align: 'center',
      sortable: 'custom',
      slot: 'status',
      formatter: (row) => (row.status == 0 ? '正常' : '冻结')
    },
    {
      columnKey: 'action',
      label: '操作',
      width: 128,
      align: 'center',
      slot: 'action',
      hideInPrint: true,
      hideInExport: true
    }
  ]);

  /** 表格选中数据 */
  const selections = ref([]);

  /** 当前编辑数据 */
  const current = ref(null);

  /** 是否显示编辑弹窗 */
  const showEdit = ref(false);

  const showPrint = ref(false);

  /** 是否显示用户导入弹窗 */
  const showImport = ref(false);

  /** 表格数据源 */
  const datasource = ({ pages, where, orders }) => {
    return pageUsers({
      ...where,
      ...orders,
      ...pages,
      organizationId: props.organizationId
    });
  };

  /** 搜索 */
  const reload = (where) => {
    selections.value = [];
    tableRef.value?.reload?.({ page: 1, where });
  };

  /** 打开编辑弹窗 */
  const openEdit = (row) => {
    current.value = row ?? null;
    showEdit.value = true;
  };

  const openPrint = () => {
    showPrint.value = true;
  };

  /** 打开编辑弹窗 */
  const openImport = () => {
    showImport.value = true;
  };

  /** 删除 */
  const remove = (row) => {
    const rows = row == null ? selections.value : [row];
    if (!rows.length) {
      EleMessage.error('请至少选择一条数据');
      return;
    }
    ElMessageBox.confirm(
      '确定要删除“' + rows.map((d) => d.nickname).join(', ') + '”吗?',
      '系统提示',
      { type: 'warning', draggable: true }
    )
      .then(() => {
        const loading = EleMessage.loading({
          message: '请求中..',
          plain: true
        });
        removeUsers(rows.map((d) => d.userId))
          .then((msg) => {
            loading.close();
            EleMessage.success(msg);
            reload();
          })
          .catch((e) => {
            loading.close();
            EleMessage.error(e.message);
          });
      })
      .catch(() => {});
  };

  /** 修改用户状态 */
  const editStatus = (checked, row) => {
    const status = checked ? 0 : 1;
    updateUserStatus(row.userId, status)
      .then((msg) => {
        row.status = status;
        EleMessage.success(msg);
      })
      .catch((e) => {
        EleMessage.error(e.message);
      });
  };

  /** 下拉菜单点击事件 */
  const dropClick = (key, row) => {
    if (key === 'password') {
      ElMessageBox.prompt(`请输入用户"${row.nickname}"的新密码：`, '重置密码', {
        inputPattern: /^[\S]{5,18}$/,
        inputErrorMessage: '密码必须为5-18位非空白字符',
        draggable: true
      })
        .then(({ value }) => {
          const loading = EleMessage.loading({
            message: '请求中..',
            plain: true
          });
          updateUserPassword(row.userId, value)
            .then((msg) => {
              loading.close();
              EleMessage.success(msg);
            })
            .catch((e) => {
              loading.close();
              EleMessage.error(e.message);
            });
        })
        .catch(() => {});
    } else if (key === 'delete') {
      remove(row);
    }
  };

  // 监听机构 id 变化
  watch(
    () => props.organizationId,
    () => {
      searchRef.value?.resetFields?.();
      reload({});
    }
  );
  // onMounted(() => {
  //   console.log(
  //     tableRef.value.tableToolsRef.openPrintModal(() => {
  //       console.log('打印');
  //     })
  //   );
  // });

  /** 导出和打印全部数据的数据源 */
  const exportSource = ({ where, orders }) => {
    return listUsers({
      ...where,
      ...orders,
      organizationId: props.organizationId
    });
  };

  const printConfig = reactive({
    datasource: exportSource,
    printerProps: {
      direction: 'landscape'
    },
    title: '用户数据',
    static: false,
    modalProps: {
      title: '打印用户数据'
    }
    // beforePrint: (params) => {
    //   params.footerData.forEach((fRow) => {
    //     params.bodyData.push(fRow);
    //   });
    //   params.footerData.splice(0, params.footerData.length);
    // }
  });
  /** 查看详情 */
  const openDetail = (row) => {
    const path = `/system/user/details/${row.userId}`;
    addPageTab({
      title: `用户详情[${row.nickname}]`,
      key: path,
      closable: true,
      meta: { icon: 'UserOutlined' }
    });
    push(path);
  };
</script>
