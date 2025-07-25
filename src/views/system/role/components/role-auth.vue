<!-- 角色权限分配弹窗 -->
<template>
  <ele-modal
    :width="460"
    title="分配权限"
    position="center"
    v-model="visible"
    :body-style="{ padding: '12px 0 12px 22px' }"
    @open="handleOpen"
  >
    <ele-loading
      :loading="authLoading"
      :spinner-style="{ background: 'transparent' }"
      :style="{
        paddingRight: '20px',
        height: 'calc(100vh - 192px)',
        maxHeight: 'calc(100dvh - 192px)',
        minHeight: '100px',
        overflow: 'auto'
      }"
    >
      <el-tree
        ref="treeRef"
        show-checkbox
        :data="authData"
        node-key="menuId"
        :default-expand-all="true"
        :props="{ label: 'title' }"
        :default-checked-keys="checkedKeys"
        :style="{ '--ele-tree-item-height': '28px' }"
      >
        <template #default="scope">
          <div>
            <el-icon
              v-if="scope.data.icon"
              :size="16"
              style="margin-right: 6px; vertical-align: -5px"
            >
              <component :is="scope.data.icon" />
            </el-icon>
            <span style="vertical-align: -2px">{{ scope.data.title }}</span>
          </div>
        </template>
      </el-tree>
    </ele-loading>
    <template #footer>
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" :loading="loading" @click="save">
        保存
      </el-button>
    </template>
  </ele-modal>
</template>

<script setup>
  import { ref, nextTick } from 'vue';
  import { EleMessage, toTree, eachTree } from 'ele-admin-plus/es';
  import { listRoleMenus, updateRoleMenus } from '@/api/system/role';

  const props = defineProps({
    /** 当前角色数据 */
    data: Object
  });

  /** 弹窗是否打开 */
  const visible = defineModel({ type: Boolean });

  /** 树组件实例 */
  const treeRef = ref(null);

  /** 权限数据 */
  const authData = ref([]);

  /** 权限数据请求状态 */
  const authLoading = ref(false);

  /** 提交状态 */
  const loading = ref(false);

  /** 角色权限选中的keys */
  const checkedKeys = ref([]);

  /** 查询权限数据 */
  const query = () => {
    authData.value = [];
    checkedKeys.value = [];
    if (!props.data) {
      return;
    }
    authLoading.value = true;
    listRoleMenus(props.data.roleId)
      .then((data) => {
        authLoading.value = false;
        // 转成树形结构的数据
        authData.value = toTree({
          data: data.menus,
          idField: 'menuId',
          parentIdField: 'parentId'
        });
        // 回显选中的数据
        nextTick(() => {
          const cks = [];
          eachTree(authData.value, (d) => {
            if (d.menuId && d.checked && !d.children?.length) {
              cks.push(d.menuId);
            }
          });
          checkedKeys.value = cks;
        });
      })
      .catch((e) => {
        authLoading.value = false;
        EleMessage.error(e.message);
      });
  };

  /** 关闭弹窗 */
  const handleCancel = () => {
    visible.value = false;
  };

  /** 保存权限分配 */
  const save = () => {
    loading.value = true;
    const ids =
      (treeRef.value?.getCheckedKeys?.() ?? []).concat(
        treeRef.value?.getHalfCheckedKeys?.() ?? []
      ) ?? [];
    updateRoleMenus(props.data?.roleId, ids)
      .then((msg) => {
        loading.value = false;
        EleMessage.success(msg);
        handleCancel();
      })
      .catch((e) => {
        loading.value = false;
        EleMessage.error(e.message);
      });
  };

  /** 弹窗打开事件 */
  const handleOpen = () => {
    query();
  };
</script>
