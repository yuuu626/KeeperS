<template>
  <div class="b-1 w-75 mx-auto">
    <!-- 活動貼文管理 -->
    <h2 class="bb-1 bg-primary text-center mx-auto py-1">地標管理</h2>
        <v-data-table-server
            v-model:items-per-page="tableItemsPerPage"
            v-model:sort-by="tableSortBy"
            v-model:page="tablePage"
            :items="tableItems"
            :headers="tableHeaders"
            :loading="tableLoading"
            :items-length="tableItemsLength"
            :search="tableSearch"
            @update:items-per-page="tableLoadItems(false)"
            @update:sort-by="tableLoadItems(false)"
            @update:page="tableLoadItems(false)"
            hover
            class="mx-auto rounded-lg mb-15 px-8"
            >
            <!-- 搜尋欄位 -->
            <template #top>
            <search 
                v-model="tableSearch"
                @click-append="tableLoadItems(true)"
                @keydown.enter="tableLoadItems(true)"
                max-width="100%"
                 class="my-5"
            ></search>
            </template>
            <template #[`item.name`]="{item }">
                <td style="width: 240px;">{{ item.name }}</td>
            </template>
            <template #[`item.tel`]="{item }">
                <td style="width:120px;">{{ item.tel }}</td>
            </template>
            <template #[`item.address`]="{ item }">
            <td style="width: 300px;" class="text-left">{{ item.address }}</td>
            </template>
            <template #[`item.categories`]="{ item }">
                <!-- .join 將陣列轉換為格式化的字串 -->
                <td style="width: 200px;" class="text-center">{{ item.categories.join(' , ') }}</td>
              </template>
            <template #[`item.description`]="{ item }">
            <td style="width: 350px;" class="py-2 text-left">{{ item.description }}</td>
            </template>
            <template #[`item.action`]="{ item }">
            <td style="width: 80px;">{{ item.action }}
                <v-btn icon="mdi-delete" variant="text" color="red-darken-4" @click="deleteItem(item)"></v-btn>
            </td>
            </template>
        </v-data-table-server>
      </div>
        

</template>
<script setup>
import { ref } from 'vue'
import { useSnackbar } from 'vuetify-use-dialog'
import { useApi } from '@/composables/axios'
const {apiAuth } = useApi()
const createSnackbar = useSnackbar()


// 活動管理
// 一頁10個
const tableItemsPerPage = ref(10)
const tableSortBy = ref([
  { key: 'createdAt', order: 'desc' } 
])
const tablePage = ref(1) 
const tableItems = ref([])
const tableHeaders = [ 

{ title: '服務名稱', align: 'center', sortable: false, key: 'name' }, 
{ title: '地址', align: 'center', sortable: true, key: 'address' },
{ title: '聯絡電話', align: 'center', sortable: false, key: 'tel' },
{ title: '服務項目', align: 'center', sortable: true, key: 'categories' },
{ title: '服務介紹', align: 'center', sortable: false, key: 'description' },
{ title: '操作', align: 'center', sortable: false, key: 'action' }
]
const tableLoading = ref(true) // 進來頁面時是讀取狀態
const tableItemsLength = ref(0) // 全部有多少筆資料
const tableSearch = ref('') // 搜尋的文字

const tableLoadItems = async (reset) => {
  if (reset) tablePage.value = 1 // 重置當前頁碼，重新整理時從第一頁開始
  tableLoading.value = true
  try {
    const { data } = await apiAuth.get('/landmark/', { // 發送請求從後端取得特定資料
      // 設定路由的參數
      params: {
        page: tablePage.value,
        itemsPerPage: tableItemsPerPage.value,
        sortBy: tableSortBy.value[0]?.key || 'createdAt', // 要寫?，因為排序是可以取消的
        sortOrder: tableSortBy.value[0]?.order || 'desc',
        search: tableSearch.value
      }
    })
    console.log(data) 

    // console.log(data)
    tableItems.value.splice(0, tableItems.value.length, ...data.result.data) // 清空所有資料，再從後端取得新資料
    tableItemsLength.value = data.result.total
    // console.log(tableItems)
    // const category = tableItems.value.map(obj => obj.category);
    // console.log(category)
  } catch (error) {
    console.log(error)
    createSnackbar({
      text: error?.response?.data?.message || '發生錯誤',
      snackbarProps: {
        color: 'red'
      }
    })
  }
  tableLoading.value = false
}
tableLoadItems() // 第一次進來要呼叫一次
watch(tableSearch, () => {
  tableLoadItems(true); // 當搜尋查詢變化時重新過濾項目
});

const deleteItem = async (item) => {
  try {
    await apiAuth.delete(`/landmark/${item._id}`)
    createSnackbar({
      text: '刪除成功',
      snackbarProps: {
        color: 'green'
      }
    })
    tableLoadItems(true) // 重新加載資料表
  } catch (error) {
    console.log(error)
    createSnackbar({
      text: error?.response?.data?.message || '發生錯誤',
      snackbarProps: {
        color: 'red'
      }
    })
  } 
}

</script>
<style scoped>
::v-deep .v-data-table__thead{
  background: #D9D9D9
}
.bb-1{
  border-bottom: 1px solid #7a7a7a;
}
</style>