<template>
  <div class="b-1 w-75 mx-auto" >
    <h2 class="bb-1 bg-accent text-center mx-auto py-1 mb-5">捐贈者聯絡資訊</h2>
    <!-- 物資回覆管理 -->
            <v-data-table-server
                v-model:items-per-page="tableItemsPerPage"
                v-model:sort-by="tableSortBy"
                v-model:page="tablePage"
                :items="tableItems"
                :headers="tableHeaders"
                :loading="tableLoading"
                :items-length="tableItemsLength"
                
                @update:items-per-page="tableLoadItems(false)"
                @update:sort-by="tableLoadItems(false)"
                @update:page="tableLoadItems(false)"
                hover
                class="mb-15 px-8 rounded-lg"
              >
              <template #[`item.image`]="{ item }">
                <v-col cols="12" md="4" class="mx-auto" style="width: 250px;">
                  <router-link :to="'/material/find/'+ item._id" style="text-decoration: none">
                    <v-img :src="item.image" width="250px" max-height="150px" class="my-5"></v-img>
                  </router-link>
                </v-col>
              </template>
              <template #[`item.donations`]="{ item }">
                    <v-col >
                      <v-card class="mb-2" outlined variant="text" v-for="(donation, index) in item.donations" :key="index" >
                        <v-card-title>
                          <v-row no-gutters>
                            <v-col cols="3" class="text-body-1 text-left">數量: {{ donation.quantity }}</v-col>
                            <v-col cols="5" class="text-body-1 text-left">服務單位: {{ donation.donator }}</v-col>
                            <v-col cols="4" class="text-body-1 text-left">聯絡電話: {{ donation.phone }}</v-col>
                          </v-row>
                          <v-divider class="100%"></v-divider>
                        </v-card-title>
                      </v-card>
                    </v-col>
            </template>
            </v-data-table-server>
  </div>

</template>
<script setup>
import { ref } from 'vue'
import { useSnackbar } from 'vuetify-use-dialog'
import { useApi } from '@/composables/axios'

const { api,apiAuth } = useApi()
const createSnackbar = useSnackbar()




// 我的分享管理
const tableItemsPerPage = ref(8)
const tableSortBy = ref([
  { key: 'createdAt', order: 'desc' }
])
const tablePage = ref(1)
const tableItems = ref([])
const tableHeaders = [
  { title: '物資', align: 'center', sortable: false, key: 'image' },
  { title: '捐贈者聯絡資訊', align: 'center', sortable: false, key: 'donations' }
]
const tableLoading = ref(true)
const tableItemsLength = ref(0)
const tableLoadItems = async (reset) => {
  if (reset) tablePage.value = 1
  tableLoading.value = true
  try {
    const { data } = await apiAuth.get('/user/find', {
      params: {
        page: tablePage.value,
        itemsPerPage: tableItemsPerPage.value,
        sortBy: tableSortBy.value[0]?.key || 'createdAt',
        sortOrder: tableSortBy.value[0]?.order || 'desc',
      }
    })
    console.log(data.result.data)

    // 確認 data.result.data 裡的 donations 是否有東西，有東西才顯示在畫面上
    const filteredData = data.result.data.filter(item => item.donations && item.donations.length > 0)    
    tableItems.value.splice(0, tableItems.value.length, ...filteredData)
    tableItemsLength.value = filteredData.length
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