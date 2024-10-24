<template>
  <div class="b-1 mx-auto share-container">
    <!-- 我的分享管理 -->
    <h2 class="bg-accent text-center mx-auto bb-1 py-1">我要分享</h2>
            <v-data-table-server
                v-model:items-per-page="tableItemsPerPage"
                v-model:sort-by="tableSortBy"
                v-model:page="tablePage"
                :items="tableItems"
                :headers="$vuetify.display.xs ||  $vuetify.display.sm? SmtableHeaders:$vuetify.display.md?MdtableHeaders : tableHeaders"
                :loading="tableLoading"
                :items-length="tableItemsLength"
                :search="tableSearch"
                @update:items-per-page="tableLoadItems(false)"
                @update:sort-by="tableLoadItems(false)"
                @update:page="tableLoadItems(false)"
                hover
                class="mx-auto mb-15 px-2 px-md-8 text-body-1 rounded-sm"
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
              <template #[`item.image`]="{ item }">
              <router-link :to="'/material/share/'+ item._id" style="text-decoration: none">
                <v-img :src="item.image" class="table-image my-2" ></v-img>
              </router-link>
              </template>
            <template #[`item.name`]="{item }">
                <td class="table-name text-left">{{ item.name }}</td>
            </template>
            <template #[`item.quantity`]="{item }">
                <td class="table-quantity text-center">{{ item.quantity }}</td>
            </template>
            <template #[`item.category`]="{item }">
                <td class="table-category text-center">{{ item.category }}</td>
            </template>
            <template #[`item.description`]="{ item }">
              <td class="py-2 table-description">{{ item.description }}</td>
            </template>
              <template #[`item.action`]="{ item }">
                <td>{{ item.action }}
                  <v-btn icon="mdi-pencil" variant="text" color="blue-grey-darken-1" @click="openDialog(item)"></v-btn>
                  <v-btn icon="mdi-delete" variant="text" color="red-darken-4" @click="confirmDelete(item)"></v-btn>
                </td>
              </template>
            </v-data-table-server>
             <!-- 確認刪除對話框 -->
            <v-dialog v-model="deleteDialog" max-width="400">
              <v-card>
                <v-card-title class="headline">確認刪除</v-card-title>
                <v-card-text>你確定要刪除這個項目嗎？</v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="grey" text @click="cancelDelete">取消</v-btn>
                  <v-btn color="red" text @click="executeDelete">刪除</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
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
                                    <v-col cols="4" md="3" class="my-auto text-left ps-6">
                                    <label class="form-label">物資名稱</label>
                                    </v-col>
                                    <v-col cols="8" md="9">
                                        <inputText
                                        v-model="name.value.value"
                                        :error-messages="name.errorMessage.value"
                                        :density="$vuetify.display.xs ? 'compact' : 'comfortable'"
                                        />
                                    </v-col>
                                    <!-- 需求量 -->
                                    <v-col cols="4" md="3" class="my-auto text-left ps-6">
                                    <label class="form-label">{{numberTitle}}</label>
                                    </v-col>
                                    <v-col cols="8" md="9">
                                        <inputText
                                        v-model=" quantity.value.value"
                                        :error-messages=" quantity.errorMessage.value"
                                        :density="$vuetify.display.xs ? 'compact' : 'comfortable'"
                                        />
                                    </v-col>
                                    <!-- 物資類別 -->
                                    <v-col cols="4" md="3" class="my-auto text-left ps-6">
                                    <label class="form-label">物資類別</label>
                                    </v-col>
                                    <v-col cols="8" md="9">
                                        <v-select
                                            v-model=" category.value.value"
                                            :error-messages=" category.errorMessage.value"
                                        :density="$vuetify.display.xs ? 'compact' : 'comfortable'"
                                            label="選擇" 
                                            variant="outlined" 
                                            dense
                                            :items="categories"
                                            hide-details
                                        ></v-select>
                                    </v-col>
                                    <!-- 需求介紹 -->
                                    <v-col cols="4" md="3" class="my-auto text-left ps-6">
                                        <label class="form-label" >{{descriptionTitle}}</label>
                                    </v-col>
                                    <v-col cols="8" md="9">
                                        <inputText
                                        v-model=" description.value.value"
                                        :error-messages=" description.errorMessage.value"
                                        :density="$vuetify.display.xs ? 'compact' : 'comfortable'"
                                        />
                                    </v-col>
                                    <!-- 單位名稱 -->
                                    <v-col cols="4" md="3" class="my-auto text-left ps-6">
                                    <label class="form-label">單位名稱</label>
                                    </v-col>
                                    <v-col cols="8" md="9">
                                        <inputText
                                        v-model="organizer.value.value"
                                        :error-messages="organizer.errorMessage.value"
                                        :density="$vuetify.display.xs ? 'compact' : 'comfortable'"
                                        />
                                    </v-col>
                                </v-row>
                                <v-card-actions>
                                  <div class="mx-auto">
                                    <v-btn variant="text" class="rounded-xl b-1 bg-accent" density="comfortable" type="submit" :loading="isSubmitting">送出</v-btn>
                                    <v-btn
                                    text="取消"
                                    variant="text"
                                    class="rounded-xl b-1 bg-info"
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
  { title: '操作', align: 'center', sortable: false, key: 'action' }
]

const SmtableHeaders = [
  { title: '名稱', align: 'center', sortable: false, key: 'name' },
  { title: '分類', align: 'center', sortable: true, key: 'category' },
  { title: '操作', align: 'center', sortable: false, key: 'action' }
]

const MdtableHeaders = [
{ title: '圖片', align: 'center', sortable: false, key: 'image' },
  { title: '名稱', align: 'center', sortable: false, key: 'name' },
  { title: '數量', align: 'center', sortable: false, key: 'quantity' },
  { title: '分類', align: 'center', sortable: true, key: 'category' },
  { title: '操作', align: 'center', sortable: false, key: 'action' }
]

const tableLoading = ref(true)
const tableItemsLength = ref(0)
const tableSearch = ref('')
const tableLoadItems = async (reset) => {
  if (reset) tablePage.value = 1
  tableLoading.value = true
  try {
    const { data } = await apiAuth.get('/user/share', {
      params: {
        page: tablePage.value,
        itemsPerPage: tableItemsPerPage.value,
        sortBy: tableSortBy.value[0]?.key || 'createdAt',
        sortOrder: tableSortBy.value[0]?.order || 'desc',
        search: tableSearch.value
      }
    })
    console.log(data)
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
    // 自訂驗證規則，檢查分類是否在預定一的 categories 中
    // isCategory 驗證名稱可自定義，第二個是錯誤訊息，第三個是驗證的function
    .test('isCategory', '商品分類錯誤', value => {
      return categories.includes(value) // 分類的陣列有沒有包含這個值
    }),
  description: yup
    .string()
    .required('物資介紹必填'),
  organizer: yup
    .string()
    .required('單位名稱必填'),
})


const { handleSubmit, isSubmitting, resetForm } = useForm({
  // validationSchema 用於驗證表單的各個字段，確保所有字段都符合預期的格式和要求
  // 定義表單的驗證格式是上面定義的東東
  validationSchema: schema,
  // initialValues  定義表單的初始值(表單在第一次渲染時會有預設的值)
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
  // ?.沒選檔案的時候是undefined，if不會過 > return
  if (fileRecords.value[0]?.error) return 
  if (fileRecords.value.length < 1) return
  // 建立 FormData 物件並添加要上傳的資料
  
  try {
    // 要先建立 FormData 物件，然後把東西放進去
    // 用append方法把要放進formdata的資料放進去
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
    closeDialog()
    tableLoadItems()
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

const deleteDialog = ref(false);
const itemToDelete = ref(null);
watch(tableSearch, () => {
  tableLoadItems(true); // 當搜尋查詢變化時重新過濾項目
});
// 確認刪除
const confirmDelete = (item) => {
  itemToDelete.value = item; // 設置要刪除的項目
  deleteDialog.value = true; // 打開對話框
};

const cancelDelete = () => {
  deleteDialog.value = false; // 關閉對話框
  itemToDelete.value = null; // 重置
};

const executeDelete = async () => {
  if (itemToDelete.value) {
    await deleteItem(itemToDelete.value); // 調用刪除函數
    deleteDialog.value = false; // 關閉對話框
    itemToDelete.value = null; // 重置
  }
};

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
.share-container{
  width: 100%;
}
.table-name{
  max-width: 100px;
  font-size: 15px;
}
.table-quantity{
  min-width: 60px;
  font-size: 15px;
}
.table-category{
  min-width: 80px;
}
.table-action{
  min-width:40px;
}
@media(min-width:600px){
  .share-container{
    width: 95%;
  }

  .table-name{
    min-width: 150px;
    font-size: 16px;
  }
  .table-quantity{
    min-width: 50px;
    font-size: 16px;
  }
  .table-action{
    min-width: 20px;
  }
}
@media(min-width:960px){
  .share-container{
    width: 90%;
  }
  .table-image{
    min-width: 100px;
    max-width: 120px ;
    min-height: 115px;
    max-height: 115px;
  }
  .table-name{
    width: 30%;
    font-size: 16px;
  }
  .table-quantity{
    width: 30%;
    font-size: 16px;
  }
  .table-category{
    min-width: 20px;
  }
  .table-action{
    max-width: 50px;
  }
  .table-description{
    width: 350px;
    white-space: pre-line;
  }
}
@media(min-width:1280px){
  .share-container{
    width: 87%;
  }
 

  .table-description{
    white-space: pre-line;
  }
}
@media(min-width:1500px){
  .share-container{
    width: 85%;
  }
}
@media(min-width:1920px){
  .share-container{
    width: 70%;
  }
}
</style>