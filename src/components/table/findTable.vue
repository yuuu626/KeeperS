<template>
  <div class="b-1 w-75 mx-auto" >
    <!-- 我的募資管理 -->
    <h2 class="bg-accent text-center mx-auto bb-1 py-1">我要募資</h2>
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
              class=" mb-15 px-8  text-body-1"
            >
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
              <router-link :to="'/material/find/'+ item._id" style="text-decoration: none">
                <v-img :src="item.image" width="80px" max-height="100px" ></v-img>
              </router-link>
              </template>
            <template #[`item.description`]="{ item }">
              <td style="width: 250px;white-space: pre-line;" class="py-2 ">{{ item.description }}</td>
            </template>
            <template #[`item.action`]="{ item }">
              <td style="width: 80px;">{{ item.action }}
                <v-btn icon="mdi-pencil" variant="text" color="blue-grey-darken-1" @click="openDialog(item)"></v-btn>
                <v-btn icon="mdi-delete" variant="text" color="red-darken-4" @click="deleteItem(item)"></v-btn>
              </td>
            </template>
          </v-data-table-server>
        </div>
          <v-dialog max-width="600" v-model="dialog.open">
                <v-card>
                    <v-container>
                        <v-card-title class="font-weight-black text-center text-h4">{{cardTitle}}</v-card-title>   
                        <v-card-text>
                            <v-form @submit.prevent="submit" :disabled="isSubmitting">
                                <v-row>
                                    <v-col >
                                        <!-- plugins > index.js 要先引入套件 -->
                                        <vue-file-agent
                                            v-model="fileRecords"
                                            v-model:raw-model-value="rawFileRecords"
                                            accept="image/jpeg,image/png"
                                            deletable
                                            max-size="1MB"
                                            help-text="選擇檔案或拖曳到這裡"
                                            :error-text="{ type: '檔案格式不支援', size: '檔案大小不能超過 1MB' }"
                                            ref="fileAgent"
                                        ></vue-file-agent>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <!-- 物資名稱 -->
                                    <v-col cols="12" md="3" class="my-auto text-left ps-6">
                                    <label class="form-label">物資名稱</label>
                                    </v-col>
                                    <v-col cols="12" md="9">
                                        <inputText
                                        v-model="name.value.value"
                                        :error-messages="name.errorMessage.value"
                                        />
                                    </v-col>
                                    <!-- 需求量 -->
                                    <v-col cols="12" md="3" class="my-auto text-left ps-6">
                                    <label class="form-label">{{numberTitle}}</label>
                                    </v-col>
                                    <v-col cols="12" md="9">
                                        <inputText
                                        v-model=" quantity.value.value"
                                        :error-messages=" quantity.errorMessage.value"
                                        />
                                    </v-col>
                                     <!-- 物資類別 -->
                                     <v-col cols="12" md="3" class="my-auto text-left ps-6">
                                    <label class="form-label">物資類別</label>
                                    </v-col>
                                    <v-col cols="12" md="9">
                                        <v-select
                                            v-model=" category.value.value"
                                            :error-messages=" category.errorMessage.value"
                                            label="選擇" 
                                            variant="outlined" 
                                            density="comfortable" 
                                            dense
                                            :items="categories"
                                            hide-details
                                        ></v-select>
                                    </v-col>
                                    <!-- 需求介紹 -->
                                    <v-col cols="12" md="3" class="my-auto text-left ps-6">
                                        <label class="form-label" >{{descriptionTitle}}</label>
                                    </v-col>
                                    <v-col cols="12" md="9">
                                        <inputText
                                        v-model=" description.value.value"
                                        :error-messages=" description.errorMessage.value"
                                        />
                                    </v-col>
                                    <!-- 單位名稱 -->
                                    <v-col cols="12" md="3" class="my-auto text-left ps-6">
                                    <label class="form-label">單位名稱</label>
                                    </v-col>
                                    <v-col cols="12" md="9">
                                        <inputText
                                        v-model="organizer.value.value"
                                        :error-messages="organizer.errorMessage.value"
                                        />
                                    </v-col>
                                </v-row>
                                <v-card-actions>
                                    <div class="mx-auto">
                                    <v-btn variant="text"class="rounded-xl b-1" density="comfortable" type="submit" :loading="isSubmitting">送出</v-btn>
                                    <v-btn
                                    text="取消"
                                    variant="text"
                                    class="rounded-xl b-1"
                                    density="comfortable"
                                    @click="closeDialog()"
                                    ></v-btn>
                                </div>
                            </v-card-actions>
                            </v-form>
                        </v-card-text>
                    </v-container>
                </v-card>
            </v-dialog>
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
    const { data } = await apiAuth.get('/user/find', {
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



// 對話框
const dialog = ref({
  open: false,
  id: ''
});
const openDialog = (item) => {
    dialog.value.open = true
    dialog.value.id = item._id // 傳入的商品id
    name.value.value = item.name 
    quantity.value.value = item.quantity
    category.value.value = item.category
    description.value.value = item.description
    organizer.value.value = item.organizer
}
const closeDialog = () => {
  dialog.value.open = false
  resetForm()
  fileAgent.value.deleteFileRecord() 
}





const schema = yup.object({
  name: yup
    .string()
    .required('物品名稱必填'),
  quantity: yup
    .number()
    .min(1, '物品數量不符')
    .required('物品數量必填'),
  category: yup
    .string()
    .required('物品分類必填')
    .test('isCategory', '商品分類錯誤', value => {
      return categories.includes(value) 
    }),
  description: yup
    .string()
    .required('物資介紹必填'),
  organizer: yup
    .string()
    .required('單位名稱必填'),
})


const { handleSubmit, isSubmitting, resetForm } = useForm({
  validationSchema: schema,
  initialValues: {
    name: '', 
    quantity: '0', // 初始值是0
    category: '',
    description: '',
    organizer:''
  }
})
const name = useField('name')
const quantity = useField('quantity')
const category = useField('category')
const description = useField('description')
const organizer = useField('organizer')

const submit = handleSubmit(async (values) => {
  if (fileRecords.value[0]?.error) return 
  if (fileRecords.value.length < 1) return
  
  try {
    const fd = new FormData()
    // fd.append(key, value)
    fd.append('name', values.name)
    fd.append('quantity', values.quantity)
    fd.append('category', values.category)
    fd.append('description', values.description)
    fd.append('organizer', values.organizer)
    fd.append('type',  props.type)
    if (fileRecords.value.length > 0) {
      fd.append('image', fileRecords.value[0].file)
    }
    console.log(fd)
    await apiAuth.patch('/material/' + dialog.value.id, fd) 
    createSnackbar({
      text: '新增成功' ,
      snackbarProps: {
        color: 'green'
      }
    })
    tableLoadItems()
    closeDialog()
  } catch (error) {
    console.log(error)
    createSnackbar({
      text: error?.response?.data?.message || '發生錯誤',
      snackbarProps: {
        color: 'red'
      }
    })
  }
})

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