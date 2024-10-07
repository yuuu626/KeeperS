<template>
  <div class="b-1 w-75 mx-auto" >
    <!-- 活動貼文管理 -->
    <h2 class="bb-1 bg-primary text-center mx-auto py-1">帳號管理</h2>
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
                class="mb-15 px-8 rounded-lg"
                style="font-size: 15px;"
            >
            <!-- 搜尋欄位 -->
            <template #top>
            <search 
                class="my-5"
                v-model="tableSearch"
                @click-append="tableLoadItems(true)"
                @keydown.enter="tableLoadItems(true)"
                max-width="100%"
            ></search>
            </template>
            <template #[`item.avatar`]="{item }">
              <div class="text-center">
                <v-img :src="item.avatar"  width="100px" max-height="140px"  class="my-5 mx-auto"></v-img>
              </div>
              </template>
            <template #[`item.address`]="{ item }">
            <td style="width: 220px;">{{ item.address }}</td>
            </template>
            <template #[`item.description`]="{ item }">
            <td style="width: 350px;" class="py-2">{{ item.description }}</td>
            </template>
            </v-data-table-server>
          </div>
</template>
<script setup>
import { ref } from 'vue'
import { useSnackbar } from 'vuetify-use-dialog'
import * as yup from 'yup'
import { useForm, useField } from 'vee-validate'
import { useApi } from '@/composables/axios'
const { api,apiAuth } = useApi()
const createSnackbar = useSnackbar()

// 活動管理
// 一頁10個
const tableItemsPerPage = ref(10)
// 可以一次支援很多欄位去做排序，前端要支援這個功能的話後端的api就要把這個功能寫出來(這裡只舉一個欄位做排序)
const tableSortBy = ref([
  { key: 'createdAt', order: 'desc' } // createdAt建立的日期 ， order代表正序或倒序(desc 倒序)
])
const tablePage = ref(1) // 表格被翻到哪一頁，預設在第一頁
const tableItems = ref([])
const tableHeaders = [ 
{ title: '圖片', align: 'center', sortable: false, key: 'avatar' }, 
{ title: '使用者', align: 'center', sortable: false, key:'_id'}, 
  { title: '服務單位', align: 'center', sortable: false, key:'username'},
  { title: '信箱', align: 'center', sortable: false, key:'email'}
]
const tableLoading = ref(true) // 進來頁面時是讀取狀態
const tableItemsLength = ref(0) // 全部有多少筆資料
const tableSearch = ref('') // 搜尋的文字





const tableLoadItems = async (reset) => {
  if (reset) tablePage.value = 1 // 重置當前頁碼，重新整理時從第一頁開始
  tableLoading.value = true
  try {
    // 取得表格資料
    // get(網址參數，請求的設定)
    const { data } = await apiAuth.get('/user/', { // 發送請求從後端取得特定資料

      // 設定路由的參數
      params: {
        page: tablePage.value,
        itemsPerPage: tableItemsPerPage.value,
        sortBy: tableSortBy.value[0]?.key || 'createdAt', // 要寫?，因為排序是可以取消的
        sortOrder: tableSortBy.value[0]?.order || 'desc',
        search: tableSearch.value
      }
      
    })

    tableItems.value.splice(0, tableItems.value.length, ...data.result.data) // 清空所有資料，再從後端取得新資料
    console.log(tableItems.value)
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

</script>
<style scoped>

::v-deep .v-data-table__thead{
  background: #D9D9D9;
  font-size: 15px;
  font-weight: bold;
}
.b-1{
  border: 1px solid #7a7a7a;
}
.bb-1{
  border-bottom: 1px solid #7a7a7a;
}
</style>