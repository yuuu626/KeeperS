<template>
    <div class="b-1 w-75 mx-auto" >
    <h2 class="bg-accent text-center mx-auto bb-1 py-1">地標管理</h2>
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
                class="mx-auto mb-15 px-8 text-body-1  rounded-lg"
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
                    <v-btn icon="mdi-pencil" variant="text" color="grey-darken-2" @click="openDialog(item)"></v-btn>
                    <v-btn icon="mdi-delete" variant="text" color="red-darken-4" @click="deleteItem(item)"></v-btn>
                </td>
                </template>
            </v-data-table-server>
        </div>
           
            <v-dialog max-width="700" v-model="dialog.open">
                <v-card>
                    <v-toolbar color="secondary" prominent class=" bb-1" height="55">
                        <v-toolbar-title class="mt-3 text-center">
                            修改地標
                        </v-toolbar-title>
                    </v-toolbar>
                <div class="px-6 my-2">
            <v-form @submit.prevent="submit" :disabled="isSubmitting">
                <v-row class="my-1">
                    <v-col cols="12" md="3" class="my-auto text-center ps-6">
                        <label class="form-label">服務地址</label>
                    </v-col>
                    <v-col cols="12" md="9">
                        <Search 
                        v-model="address"
                        :error-messages="addressError "
                        label="輸入資源地址"
                        max-width="1000px"
                        ></Search>
                    </v-col>
                    <!-- 物資名稱 -->
                    <v-col cols="12" md="3" class="my-auto text-center ps-6">
                    <label class="form-label">服務名稱</label>
                    </v-col>
                    <v-col cols="12" md="9">
                        <inputText 
                        v-model="name.value.value"
                        :error-messages="name.errorMessage.value"
                        />
                    </v-col>
                    <!-- 需求量 -->
                    <v-col cols="12" md="3" class="my-auto text-center ps-6">
                    <label class="form-label">服務電話</label>
                    </v-col>
                    <v-col cols="12" md="9">
                        <inputText 
                        v-model="tel.value.value"
                        :error-messages="tel.errorMessage.value"
                        />
                    </v-col>
                        <!-- 物資類別 -->
                        <v-col cols="12" md="3" class="mt-2 text-center ps-6">
                    <label class="form-label">服務項目</label>
                    </v-col>
                    <v-col cols="12" md="9">
                        <v-expansion-panels variant="accordion">
                            <v-expansion-panel title="選擇類別">
                                <v-expansion-panel-text>
                                    <v-container>
                                        <v-row>
                                            <v-col>
                                                <p>服務對象</p>
                                                <div>
                                                    <v-chip-group
                                                        v-model="category1.value.value"
                                                        :error-messages="category1.errorMessage.value"
                                                        column
                                                        multiple
                                                    >
                                                        <v-chip
                                                        v-for="item in client"
                                                        :text="item"
                                                        :value="item"
                                                        filter
                                                        density="compact"
                                                        ></v-chip>
                                                    </v-chip-group>
                                                </div>
                                                <v-divider></v-divider>
                                            </v-col>
                                        </v-row>
                                        
                                        <v-row>
                                            <v-col>
                                                <p>長期照顧</p>
                                                <div>
                                                    <v-chip-group
                                                        v-model="category2.value.value"
                                                        :error-messages="category2.errorMessage.value"
                                                        column
                                                        multiple
                                                    >
                                                        <v-chip
                                                        v-for="item in care"
                                                        :text="item"
                                                        :value="item"
                                                        filter
                                                        density="compact"
                                                        ></v-chip>
                                                    </v-chip-group>
                                                </div>
                                                <v-divider></v-divider>
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col>
                                                <p>身心障礙</p>
                                                <div>
                                                    <v-chip-group
                                                        v-model="category3.value.value"
                                                        :error-messages="category3.errorMessage.value"
                                                        column
                                                        multiple
                                                    >
                                                        <v-chip
                                                        v-for="item in disability"
                                                        :text="item"
                                                        :value="item"
                                                        filter
                                                        density="compact"
                                                        ></v-chip>
                                                    </v-chip-group>
                                                </div>
                                                <v-divider></v-divider>
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col>
                                                <p>兒童及少年</p>
                                                <div>
                                                    <v-chip-group
                                                        v-model="category4.value.value"
                                                        :error-messages="category4.errorMessage.value"
                                                        column
                                                        multiple
                                                    >
                                                        <v-chip
                                                        v-for="item in child"
                                                        :text="item"
                                                        :value="item"
                                                        filter
                                                        density="compact"
                                                        ></v-chip>
                                                    </v-chip-group>
                                                </div>
                                                <v-divider></v-divider>
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col>
                                                <p>社會救助</p>
                                                <div>
                                                    <v-chip-group
                                                        v-model="category5.value.value"
                                                        :error-messages="category5.errorMessage.value"
                                                        column
                                                        multiple
                                                    >
                                                        <v-chip
                                                        v-for="item in assistance"
                                                        :text="item"
                                                        :value="item"
                                                        filter
                                                        density="compact"
                                                        ></v-chip>
                                                    </v-chip-group>
                                                </div>
                                                <v-divider></v-divider>
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col>
                                                <p>婦女</p>
                                                <div>
                                                    <v-chip-group
                                                        v-model="category7.value.value"
                                                        :error-messages="category7.errorMessage.value"
                                                        column
                                                        multiple
                                                    >
                                                        <v-chip
                                                        v-for="item in women"
                                                        :text="item"
                                                        :value="item"
                                                        filter
                                                        density="compact"
                                                        ></v-chip>
                                                    </v-chip-group>
                                                </div>
                                                <v-divider></v-divider>
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col>
                                                <p>其他</p>
                                                <v-chip-group
                                                    v-model="category6.value.value"
                                                    :error-messages="category6.errorMessage.value"
                                                    column
                                                    multiple
                                                    >
                                                    <v-chip
                                                    value="其他"
                                                    text="其他"
                                                    filter
                                                    density="compact"
                                                    ></v-chip>
                                                </v-chip-group>
                                            </v-col>
                                        </v-row>
                                    </v-container>
                                </v-expansion-panel-text>
                            </v-expansion-panel>
                        </v-expansion-panels>
                    </v-col>
                    <!-- 需求介紹 -->
                    <v-col cols="12" md="3" class="text-center ps-6">
                        <label class="form-label">服務介紹</label>
                    </v-col>
                    <v-col cols="12" md="9">
                        <v-textarea 
                        style="white-space: pre-line;"
                        variant="outlined" clearable
                        v-model="description.value.value"
                        :error-messages="description.errorMessage.value"
                        hide-details
                        ></v-textarea>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col class="text-center" >
                        <submitButton text="修改" type="submit" class="b-1 bg-accent mb-8" @click="addMarker"></submitButton>
                    </v-col>
                </v-row>
            </v-form>
        </div>
                </v-card>
            </v-dialog>
            
</template>
<script setup>
import { ref } from 'vue'
import { useSnackbar } from 'vuetify-use-dialog'
import * as yup from 'yup'
import { useForm, useField } from 'vee-validate'
import { useApi } from '@/composables/axios'
import axios from 'axios';
import * as L from 'leaflet';
import "leaflet/dist/leaflet.css";

const { api,apiAuth } = useApi()
const createSnackbar = useSnackbar()


const client = ['長期照顧','身心障礙','婦女','兒童及少年','保護性服務']
const care = ['日照中心','護理之家','居家服務','交通接送','家庭托顧']
const disability =['身心障礙者服務中心','輔具中心','職業重建中心','小作所','庇護工場']
const child = ['少年福利服務中心','親子館','課後班']
const assistance = ['經濟補助','待用餐','基金會','社會福利中心']
const women = ['婦女福利服務中心','新住民家庭服務中心']



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
    // 取得表格資料
    // get(網址參數，請求的設定)
    const { data } = await apiAuth.get('/user/landmark', { // 發送請求從後端取得特定資料
      
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
});
const openDialog = (item) => {
    dialog.value.open = true
    dialog.value.id = item._id
    name.value.value = item.name 
    tel.value.value = item.tel
    description.value.value = item.description
    
}
const closeDialog = () => {
  dialog.value.open = false
  resetForm()
}


const schema = yup.object({
  name: yup
    .string()
    .required('服務單位必填'),
address: yup
    .string()
    .required('服務地址必填'),
tel: yup
    .string(),
category5:yup.array().of(yup.string())
    .required('分類必填'),
category2:yup.array().of(yup.string())
.required('分類必填'),
category3:yup.array().of(yup.string())
.required('分類必填'),
category4:yup.array().of(yup.string())
.required('分類必填'),
category5:yup.array().of(yup.string())
.required('分類必填'),
category6:yup.array().of(yup.string())
.required('分類必填'),
category7:yup.array().of(yup.string())
.required('分類必填'),
description: yup
    .string(),
})


const { handleSubmit, isSubmitting, resetForm } = useForm({
  // validationSchema 用於驗證表單的各個字段，確保所有字段都符合預期的格式和要求
  // 定義表單的驗證格式是上面定義的東東
    validationSchema: schema,
    // initialValues  定義表單的初始值(表單在第一次渲染時會有預設的值)
    initialValues: {
    name: '', 
    address: '', // 初始值是0
    tel: '',
    category1:[],
    category2:[],
    category3:[],
    category4:[],
    category5:[],
    category6:[],
    category7:[],
    description:''
    }
})

const name = useField('name')
// const address = useField('address')
const tel = useField('tel')
const category1 = useField('category1')
const category2 = useField('category2')
const category3 = useField('category3')
const category4 = useField('category4')
const category5 = useField('category5')
const category6 = useField('category6')
const category7 = useField('category7')
const description = useField('description')
const { value: address, errorMessage: addressError } = useField('address');








// Google Maps API 密鑰
const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
console.log(googleMapsApiKey);



// 用來存取地址轉換的經緯度(要傳到資料庫的)
const latitude = ref(null);
const longitude = ref(null);

const addMarker = async () => {
if (!address.value) {
    alert('找不到地址~');
    return;
}
// Google Maps Geocoding API URL
const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address.value)}&key=${googleMapsApiKey}`;

try {
    const response = await axios.get(geocodeUrl);
    const data = response.data;
    console.log(data)
    if (data.results && data.results.length > 0) {
    const lat = data.results[0].geometry.location.lat;
    const lng = data.results[0].geometry.location.lng;
 
    latitude.value = lat;
    longitude.value = lng;

    console.log(latitude.value)
    console.log(data.results)
    console.log(lat)
    console.log(lng)

    } else {
    alert('找不到地址~');
    }
} catch (error) {
    console.error('新增地標錯誤:', error);
    alert('新增地標失敗~');
}
};





// 新增地標資料到後端資料庫
const submit = handleSubmit(async (values) => {
  try {
    await addMarker() // 避免取到經緯度時就已經執行了submit()，沒有這行會取不到lat、lng
    console.log(latitude.value)

    const categories = [
      ...values.category1,
      ...values.category2,
      ...values.category3,
      ...values.category4,
      ...values.category5,
      ...values.category6,
      ...values.category7
    ];

    const data = {
        name:values.name,
        address:values.address,
        tel:values.tel,
        categories: categories,
        description:values.description,
        lat: latitude.value, 
        lng: longitude.value 
    }
    console.log(data)
    await apiAuth.patch('landmark/' + dialog.value.id, data) 
    createSnackbar({
      text: '修改成功' ,
      snackbarProps: {
        color: 'green'
      }
    })
    closeDialog()
    // 重置表單
    resetForm();
    tableLoadItems(true)
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

<style setup>
.b-1{
  border: 1px solid #7a7a7a;
}
.bb-1{
    border-bottom: 1px solid #7a7a7a;
}
::v-deep .v-expansion-panel__shadow{
    box-shadow:none;
}
.v-expansion-panel{
    border: 1px solid rgb(180, 180, 180);
    .v-chip{
    color:rgb(94, 94, 94);
}
}
::v-deep .v-expansion-panel--active > .v-expansion-panel-title:not(.v-expansion-panel-title--static) {
    min-height: 48px;
}
::v-deep .v-expansion-panel-title{
    padding: 12px 16px;
    color:gray;
    letter-spacing: 1.2px;
}
::v-deep .v-expansion-panel-text__wrapper{
    padding: 0 8px 0 8px ;
}
.form-label{
 font-size: 20px;
 font-weight: bold;
 color: rgb(80, 80, 80);
}
</style>