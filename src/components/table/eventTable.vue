<template>
    <!-- 活動貼文管理 -->
    <div class="b-1 mx-auto event-container" >
    <h2 class="bb-1 bg-accent text-center mx-auto py-1">活動管理</h2>
            <v-data-table-server
                v-model:items-per-page="tableItemsPerPage"
                v-model:sort-by="tableSortBy"
                v-model:page="tablePage"
                :items="tableItems"
                :headers="$vuetify.display.xs? XstableHeaders:$vuetify.display.sm?SmtableHeaders:$vuetify.display.md?MdtableHeaders : tableHeaders"
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
                  v-model="tableSearch"
                  @click-append="tableLoadItems(true)"
                  @keydown.enter="tableLoadItems(true)"
                  max-width="100%"
                   class="my-5"
                ></search>
              </template>
              <template #[`item.image`]="{item }">
                <router-link :to="'/event/'+ item._id" style="text-decoration: none">
                  <v-img :src="item.image" class="table-image my-2"></v-img>
                </router-link>
              </template>
              <template #[`item.title`]="{ item }">
                <td  class="text-center table-title">{{ item.title }}</td>
              </template>
              <template #[`item.address`]="{ item }">
                <td class="text-left table-address">{{ item.address }}</td>
              </template>
              <template #[`item.category`]="{ item }">
                <!-- .join 將陣列轉換為格式化的字串 -->
                <td  class="table-category">{{ item.category.join(' , ') }}</td>
              </template>
              <template #[`item.date`]="{ item }">
                <td  class="py-2 table-date">{{ item.date }}</td>
              </template>
              <template #[`item.organizer`]="{ item }">
                <td  class="py-2 table-organizer">{{ item.organizer }}</td>
              </template>
              <template #[`item.description`]="{ item }">
                <td  class="py-2 table-description">{{ item.description }}</td>
              </template>
              <template #[`item.action`]="{ item }">
                <td style="width: 80px;">{{ item.action }}
                  <v-btn icon="mdi-pencil" variant="text" color="blue-grey-darken-1" @click="openDialog(item)"></v-btn>
                  <v-btn icon="mdi-delete" variant="text" color="red-darken-4" @click="deleteItem(item)"></v-btn>
                </td>
              </template>
            </v-data-table-server>
</div>
           
            <v-dialog max-width="700" v-model="dialog.open">
                <v-card>
                        <v-container>
                            <v-card-title class="font-weight-black text-center text-h4">修改活動貼文</v-card-title>   
                            <v-card-text>
                              <v-form  @submit.prevent="submit" :disabled="isSubmitting">
                <v-row>
                  <v-col cols="1" ></v-col>
                  <v-col cols="10" md="12">
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
                  <!-- 活動名稱 -->
                  <v-col cols="4" class="my-auto text-center dialog-col">
                    <label class="form-label">活動名稱：</label>
                  </v-col>
                  <v-col cols="8" >
                    <inputText  
                    v-model="title.value.value"
                    :error-messages="title.errorMessage.value"
                    :density="$vuetify.display.xs ? 'compact' : 'comfortable'"
                    />
                  </v-col>
                  <!-- 活動地點 -->
                  <v-col cols="4"class="my-auto text-center dialog-col">
                      <label class="form-label">活動地點：</label>
                  </v-col>
                  <v-col cols="8">
                    <inputText 
                    v-model=" address.value.value"
                    :error-messages=" address.errorMessage.value"
                    :density="$vuetify.display.xs ? 'compact' : 'comfortable'"
                    ></inputText>
                  </v-col>
                  <!-- 活動類別 -->
                  <v-col cols="4"class="my-auto text-center dialog-col">
                      <label class="form-label">活動類別：</label>
                  </v-col>
                  <v-col cols="8">
                    <v-select
                      v-model="category.value.value"
                      :error-messages="category.errorMessage.value"
                      label="選擇" 
                      variant="outlined" 
                      :density="$vuetify.display.xs ? 'compact' : 'comfortable'"
                      dense
                      :items="chips"
                      hide-details
                      multiple
                      >
                    </v-select>
                  </v-col>
                  <!-- 活動時間 -->
                  <v-col cols="4" class="my-auto text-center px-0 dialog-col">
                      <label class="form-label">活動時間：</label>
                  </v-col>
                  <v-col cols="8" >
                    <inputText
                    v-model="date.value.value"
                    :error-messages="date.errorMessage.value"
                    :density="$vuetify.display.xs ? 'compact' : 'comfortable'"
                    />
                  </v-col>
                  <!-- 主辦單位 -->
                  <v-col cols="4" class="my-auto text-center dialog-col">
                    <label class="form-label">主辦單位：</label>
                  </v-col>
                  <v-col cols="8">
                    <inputText
                    v-model="organizer.value.value"
                    :error-messages="organizer.errorMessage.value"
                    :density="$vuetify.display.xs ? 'compact' : 'comfortable'"
                    />
                  </v-col>

                  <!-- 活動介紹 -->
                  <v-col cols="4" class="text-center dialog-col mt-3">
                    <label class="form-label">活動介紹：</label>
                  </v-col>
                  <v-col cols="8" >
                    <v-textarea
                    auto-grow
                    label="輸入文字"
                    variant="outlined" 
                    clearable
                    hide-details
                    v-model="description.value.value"
                    :error-messages="description.errorMessage.value"
                    :density="$vuetify.display.xs ? 'compact' : 'comfortable'"
                    :rows="$vuetify.display.xs ? '3' : '4'"
                    ></v-textarea>
                  </v-col>
                </v-row>
                <v-card-actions>
              <div class="mx-auto mt-3">
                  <v-btn variant="text"class="rounded-xl b-1 bg-accent" density="comfortable" type="submit" :loading="isSubmitting">送出</v-btn>
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
const { api,apiAuth } = useApi()
const createSnackbar = useSnackbar()
const fileAgent = ref(null)
const fileRecords = ref([]) // 綁定處理後的文件記錄
const rawFileRecords = ref([]) // 綁定原始文件記錄

// 活動管理
// 一頁10個
const tableItemsPerPage = ref(10)
// 可以一次支援很多欄位去做排序，前端要支援這個功能的話後端的api就要把這個功能寫出來(這裡只舉一個欄位做排序)
const tableSortBy = ref([
  { key: 'createdAt', order: 'desc' } // createdAt建立的日期 ， order代表正序或倒序(desc 倒序)
])
const tablePage = ref(1) // 表格被翻到哪一頁，預設在第一頁
const tableItems = ref([])
const tableHeaders = [ // 因為欄位是固定的，所以不用ref
// align 靠哪邊排，sortable 欄位可不可以排序，key 要跟資料庫的欄位對到(會自動把符合的key的值帶進這個欄位)

// 圖片會直接以文字的方法顯示(直接把image的資料放上來)，因為他會當成是一般的文字，不會顯示圖片
// 可以在上面 template 上面定義資料的顯示方式
  { title: '圖片', align: 'center', sortable: false, key: 'image' }, 
  { title: '活動名稱', align: 'center', sortable: false, key: 'title' },
  { title: '活動地點', align: 'center', sortable: false, key: 'address' },
  { title: '活動類別', align: 'center', sortable: true, key: 'category' },
  { title: '活動時間', align: 'center', sortable: true, key: 'date' },
  { title: '操作', align: 'center', sortable: false, key: 'action' }
]

const XstableHeaders = [ 
  { title: '活動名稱', align: 'center', sortable: false, key: 'title' },
  { title: '活動時間', align: 'center', sortable: true, key: 'date' },
  { title: '操作', align: 'center', sortable: false, key: 'action' }
]
const SmtableHeaders = [ 
  { title: '活動名稱', align: 'center', sortable: false, key: 'title' },
  { title: '活動類別', align: 'center', sortable: true, key: 'category' },
  { title: '活動時間', align: 'center', sortable: true, key: 'date' },
  { title: '操作', align: 'center', sortable: false, key: 'action' }
]

const MdtableHeaders = [ 
  { title: '圖片', align: 'center', sortable: false, key: 'image' }, 
  { title: '活動名稱', align: 'center', sortable: false, key: 'title' },
  { title: '活動類別', align: 'center', sortable: true, key: 'category' },
  { title: '活動時間', align: 'center', sortable: true, key: 'date' },
  { title: '操作', align: 'center', sortable: false, key: 'action' }
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
    const { data } = await apiAuth.get('/user/event', { // 發送請求從後端取得特定資料
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

const chips=['兒童','青少年','育兒','長照','精神','照顧','就學','就業','身障','親職教育','早療','紓壓','居住','醫療','司法','社工','其他']
// 活動貼文管理對話框
const dialog = ref({
  open: false,
  id: ''
});
const openDialog = (item) => {
    dialog.value.open = true
    dialog.value.id = item._id // 傳入的商品id
    title.value.value = item.title 
    date.value.value = item.date
    address.value.value = item.address
    category.value.value = item.category
    organizer.value.value = item.organizer
    description.value.value = item.description
    
}
const closeDialog = () => {
  dialog.value.open = false
  resetForm()
  fileAgent.value.deleteFileRecord() 
}


const schema = yup.object({
  title: yup
    .string()
    .required('活動標題必填'),
  date: yup
    .string()
    .required('活動日期必填'),
  address: yup
    .string()
    .required('活動地點必填'),
  category: yup
    .array()
    .required('活動分類必填')
    // 自訂驗證規則，檢查分類是否在預定一的 categories 中
    // isCategory 驗證名稱可自定義，第二個是錯誤訊息，第三個是驗證的function
    ,
  organizer: yup
    .string()
    .required('主辦單位必填'),
  description: yup
    .string()
    .required('活動介紹必填'),
})


const { handleSubmit, isSubmitting, resetForm } = useForm({
  // validationSchema 用於驗證表單的各個字段，確保所有字段都符合預期的格式和要求
  // 定義表單的驗證格式是上面定義的東東
  validationSchema: schema,
  // initialValues  定義表單的初始值(表單在第一次渲染時會有預設的值)
  initialValues: {
    title: '', 
    date: '', // 初始值是0
    address:'',
    category: '',
    organizer:'',
    description: ''
  }
})

const title = useField('title')
const date = useField('date')
const address = useField('address')
const category = useField('category')
const organizer = useField('organizer')
const description = useField('description')

const submit = handleSubmit(async (values) => {
  // 如果 vue.file.agent 這個元件選到的檔案有 error 的話就 return，[0]代表第一個檔案，如果第一個檔案有error就return
  // ?.沒選檔案的時候是undefined，if不會過 > return
  if (fileRecords.value[0]?.error) return 
  if (fileRecords.value.length < 1) return
  // 建立 FormData 物件並添加要上傳的資料
  
  try {
    // 要先建立 FormData 物件，然後把東西放進去
    // 用append方法把要放進formdata的資料放進去
    const fd = new FormData()
    // fd.append(key, value)
    fd.append('title', values.title)
    fd.append('date', values.date)
    fd.append('address', values.address)
    fd.append('category', values.category)
    fd.append('organizer', values.organizer)
    fd.append('description', values.description)
    // 如果有選擇圖片，將圖片添加到 FormData
    // 如果大於0，才要把檔案放進去
    if (fileRecords.value.length > 0) {
      fd.append('image', fileRecords.value[0].file)
    }
    await apiAuth.patch('/event/' + dialog.value.id, fd) 
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
watch(tableSearch, () => {
  tableLoadItems(true); // 當搜尋查詢變化時重新過濾項目
});


const deleteItem = async (item) => {
  // console.log(item._id)
  try {
    await apiAuth.delete(`/event/${item._id}`)
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
.form-label{
  font-size: 18px;
  font-weight: bold;
}
.event-container{
  width: 100%;
}

.table-title{
  min-width: 100px;
  max-width: 120px;
  font-size: 15px;
}
.table-date{
  min-width: 90px;
  max-width: 90px;
  font-size: 15px;
}
.table-action{
  min-width:40px;
}
@media(min-width:600px){
  .form-label{
    font-size: 20px;
    font-weight: bold;
  }
  .event-container{
    width: 95%;
  }
}
@media(min-width:960px){
  .event-container{
    width: 90%;
  }
  .table-image{
    min-width: 100px;
    max-width: 120px ;
    min-height: 115px;
    max-height: 115px;
  }
}
@media(min-width:1280px){
  .event-container{
    width: 87%;
  }
  .table-description{
    white-space: pre-line;
  }
}
@media(min-width:1500px){
  .event-container{
    width: 85%;
  }
}
@media(min-width:1920px){
  .event-container{
    width: 70%;
  }
}
</style>