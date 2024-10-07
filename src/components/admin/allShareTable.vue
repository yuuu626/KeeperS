<template>
  <div class="b-1 w-75 mx-auto" >
    <!-- 我的分享管理 -->
    <h2 class="bb-1 bg-primary text-center mx-auto py-1">我要分享</h2>
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
              <template #[`item.image`]="{ item }">
              <router-link :to="'/material/share/'+ item._id" style="text-decoration: none">
                <v-img :src="item.image" width="80px" max-height="100px" ></v-img>
              </router-link>
              </template>
              <template #[`item.description`]="{ item }">
                <td style="width: 250px;" class="py-2">{{ item.description }}</td>
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
import * as yup from 'yup'
import { useForm, useField } from 'vee-validate'
import { useApi } from '@/composables/axios'
import EventTable from '@/components/table/eventTable.vue'
const { api,apiAuth } = useApi()
const createSnackbar = useSnackbar()


const props = defineProps({
    cardTitle: {
        type: String,
        default: '發布需求'
    },
    numberTitle:{
        type:String,
        default:'需求量'
    },
    descriptionTitle:{
        type:String,
        default:'需求介紹'
    },
    type: { // **新增 type prop**
    type: String,
    default: 'share'
  }
});


const fileAgent = ref(null)
const fileRecords = ref([]) // 綁定處理後的文件記錄
const rawFileRecords = ref([]) // 綁定原始文件記錄



// 我的分享管理
const tableItemsPerPage = ref(8)
const tableSortBy = ref([
  { key: 'createdAt', order: 'desc' }
])
const tablePage = ref(1)
const tableItems = ref([])
const tableHeaders = [
  { title: '圖片', align: 'center', sortable: false, key: 'image' },
  { title: '名稱', align: 'center', sortable: false, key: 'name' },
  { title: '數量', align: 'center', sortable: false, key: 'quantity' },
  { title: '分類', align: 'center', sortable: true, key: 'category' },
  { title: '概況', align: 'center', sortable: false, key: 'description' },
  { title: '單位', align: 'center', sortable: false, key: 'organizer' },
  { title: '操作', align: 'center', sortable: false, key: 'action' }
]
const tableLoading = ref(true)
const tableItemsLength = ref(0)
const tableSearch = ref('')
const tableLoadItems = async (reset) => {
  if (reset) tablePage.value = 1
  tableLoading.value = true
  try {
    const { data } = await apiAuth.get('/material/share', {
      params: {
        page: tablePage.value,
        itemsPerPage: tableItemsPerPage.value,
        sortBy: tableSortBy.value[0]?.key || 'createdAt',
        sortOrder: tableSortBy.value[0]?.order || 'desc',
        search: tableSearch.value
      }
    })
    tableItems.value.splice(0, tableItems.value.length, ...data.result.data)
    tableItemsLength.value = data.result.total
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
tableLoadItems()

const categories = ['食品', '服飾配件', '日用品', '家具', '輔具', '教育用品', '嬰幼兒用品', '電器', '休閒用品', '其他']


watch(tableSearch, () => {
  tableLoadItems(true); // 當搜尋查詢變化時重新過濾項目
});

const deleteItem = async (item) => {
  // console.log(item._id)
  try {
    await apiAuth.delete(`/Material/${item._id}`)
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
  background: #D9D9D9;
  font-size: 16px;
  font-weight: bold;
}
.b-1{
  border: 1px solid #7a7a7a;
}
.bb-1{
  border-bottom: 1px solid #7a7a7a;
}
</style>