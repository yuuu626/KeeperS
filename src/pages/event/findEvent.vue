<template>
        <!-- 新增活動對話框 -->
            <v-btn
                v-if="user.isLogin"
                @click="openDialog(null)"
                class="bg-third b-1 btn-container p-0"
                
                variant="text"
                id="create"
                >
                <v-icon size="x-large">mdi-plus</v-icon>
                <v-tooltip
                    activator="parent"
                    location="top"
                >
                新增活動
                </v-tooltip>
            </v-btn>
            <v-dialog max-width="700" v-model="dialog">
                <v-card>
                        <v-container>
                            <v-card-title class="font-weight-black text-center text-h4">新增活動</v-card-title>   
                            <v-card-text>
                                <v-form  @submit.prevent="submit" :disabled="isSubmitting">
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
                                        <!-- 活動名稱 -->
                                        <v-col cols="12" md="3" class="my-auto text-center">
                                        <label class="form-label">活動名稱：</label>
                                        </v-col>
                                        <v-col cols="12" md="9">
                                            <inputText  
                                            v-model="title.value.value"
                                            :error-messages="title.errorMessage.value"
                                            />
                                        </v-col>
                                        <!-- 活動地點 -->
                                        <v-col cols="12" md="3" class="my-auto text-center">
                                            <label class="form-label">活動地點：</label>
                                        </v-col>
                                        <v-col cols="12" md="9">
                                            <inputText 
                                            v-model=" address.value.value"
                                            :error-messages=" address.errorMessage.value"
                                            ></inputText>
                                        </v-col>
                                        <!-- 活動類別 -->
                                        <v-col cols="12" md="3" class="my-auto text-center">
                                            <label class="form-label">活動類別：</label>
                                        </v-col>
                                        <v-col cols="12" md="9">
                                          <v-select
                                                v-model="category.value.value"
                                                :error-messages="category.errorMessage.value"
                                                label="選擇" 
                                                variant="outlined" 
                                                density="comfortable" 
                                                dense
                                                :items="chips"
                                                hide-details
                                                multiple
                                            >
                                          </v-select>
                                        </v-col>
                                        <!-- 活動時間 -->
                                        <v-col cols="12" md="3" class="my-auto text-center px-0">
                                            <label class="form-label">活動時間：</label>
                                        </v-col>
                                        <v-col cols="12" md="9">
                                            <inputText
                                            v-model="date.value.value"
                                            :error-messages="date.errorMessage.value"
                                            />
                                        </v-col>
                                        

                                        <!-- 主辦單位 -->
                                        <v-col cols="12" md="3" class="my-auto text-center">
                                            <label class="form-label">主辦單位：</label>
                                        </v-col>
                                        <v-col cols="12" md="9">
                                            <inputText
                                            v-model="organizer.value.value"
                                            :error-messages="organizer.errorMessage.value"
                                            />
                                        </v-col>

                                        <!-- 活動介紹 -->
                                        <v-col cols="12" md="3" class="text-center">
                                        <label class="form-label">活動介紹：</label>
                                        </v-col>
                                        <v-col cols="12" md="9">
                                            <v-textarea
                                                label="輸入文字"
                                                variant="outlined" 
                                                clearable
                                                hide-details
                                                v-model="description.value.value"
                                                :error-messages="description.errorMessage.value"
                                            ></v-textarea>
                                        </v-col>
                                    </v-row>
                                    <v-card-actions>
                                <div class="mx-auto">
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


        <!-- 搜尋欄 -->
        <!-- <v-container> -->
            <!-- 麵包屑 - 顯示目前頁面位置 -->
          <v-container>
            <v-breadcrumbs :items="items">
              <template v-slot:divider>
                <v-icon icon="mdi-chevron-right"></v-icon>
              </template>
            </v-breadcrumbs>
          </v-container>
            <v-responsive max-width="700px" class="mx-auto">
              <v-text-field
              variant="outlined"
              label="搜尋"
              prepend-inner-icon="mdi-magnify"
              hide-details
              single-line
              density="comfortable"
              clearable
              class="bg-white mx-5 mt-5 my-5"
              v-model="searchQuery"
              >
              </v-text-field>
            </v-responsive>
            <div class="text-center">
              <v-responsive max-width="900" class="mx-auto">
                    <v-sheet
                    class="w-100 mx-auto d-inline-block"
                    >
                        <v-slide-group
                            show-arrows
                            multiple
                            mobile-breakpoint="xxl"
                        >
                            <v-slide-group-item
                            v-for="category in categories"
                            :key="category.name"
                            v-slot="{ isSelected, toggle }"
                            >
                            <v-chip
                            :style="{
                                backgroundColor: isSelected ? '#616161' : '#EEEEEE',
                                color: isSelected ? 'white' : 'black'
                            }"
                            
                                class="ma-2"
                                @click="() => handleClick(category.name, toggle)"
                            >
                                {{ category.name }}
                                
                            </v-chip>
                            </v-slide-group-item>
                        </v-slide-group>
                    </v-sheet>
                  </v-responsive>
                  <div class="mx-auto" style="width:100%;">
                  <v-row class="my-3 d-flex w-lg-75 w-md-100 mx-auto" >
                    <v-col cols="12" sm="4" md="3" v-for="event in filteredEvents" :key="event._id" class="mx-0">
                      <router-link :to="'/event/'+ event._id" style="text-decoration: none">
                        <v-card  variant="flat" color="third" class="b-1 card-size">
                            <v-card-item class="p-5 text-left">
                                <div  class="d-flex justify-content-center b-1 mt-2 mb-2  bg-white">
                                    <v-img :src="event.image" rounded containr></v-img>
                                </div>
                                <v-card-title class="font-weight-black " style="font-size: 1.1rem;width: 215px;word-wrap: break-word;">{{ event.title }}
                                </v-card-title>
                                <v-card-subtitle style="width: 200px;" class="font-weight-black" >{{ event.organizer }}</v-card-subtitle>
                                <v-chip density="compact" class="mt-2 me-1"v-for="item in event.category" :key="item">{{ item }}</v-chip>
                                <!-- <v-chip density="compact" class="mt-2 me-1">{{ category }}</v-chip> -->
                            </v-card-item>
                        </v-card>
                    </router-link>  
                      <!-- <Card class="cursor-pointer" v-bind="event"></Card> -->
                    </v-col>
                  </v-row>
                </div>
            </div>
            <!-- 上下頁 -->
            <div class="text-center my-5">
                <v-pagination
                v-model="page"
                :length="pages"
                @update:model-value="loadEvents"
                rounded="circle"
                ></v-pagination>
            </div>
        <!-- </v-container> -->

</template>

<script setup>
import { ref, computed } from 'vue'
import { definePage } from 'vue-router/auto'
// import { VDateInput } from 'vuetify/labs/VDateInput'
import * as yup from 'yup'
import { useForm, useField } from 'vee-validate'
import { useApi } from '@/composables/axios'
import { useSnackbar } from 'vuetify-use-dialog'
import Card from '@/components/card.vue'
import { useUserStore } from '@/stores/user'
const user = useUserStore()

const { api, apiAuth } = useApi()
const createSnackbar = useSnackbar()

const items=ref([
{
    title: '首頁',
    disabled: false,
    href: '/',
  },
  {
    title: '活動分享',
    disabled: true,
  }
])
const chips=(['兒童', '青少年', '育兒', '長照', '精神', '照顧', '就學', '就業', '身障', '親職教育', '早療', '紓壓', '居住', '醫療', '司法', '社工', '其他'])

const categories = ref([
    { name: '兒童', selected: false },
    { name: '青少年', selected: false },
    { name: '育兒', selected: false },
    { name: '長照', selected: false },
    { name: '精神', selected: false },
    { name: '照顧', selected: false },
    { name: '就學', selected: false },
    { name: '就業', selected: false },
    { name: '身障', selected: false },
    { name: '親職教育', selected: false },
    { name: '早療', selected: false },
    { name: '紓壓', selected: false },
    { name: '居住', selected: false },
    { name: '醫療', selected: false },
    { name: '司法', selected: false },
    { name: '社工', selected: false },
    { name: '其他', selected: false }
    // 添加其他分類
  ]);


const page = ref(1) // 現在第幾頁
const pages = ref(1) // 全部有幾頁
const itemsS_PER_PAGE = 12 // 一頁12個



// const model = ref(null);
const fileAgent = ref(null)
const dialog = ref(false)

definePage({
  meta: {
    title: 'KeeperS | 活動查詢'
  }
})

const openDialog = (items) => {
  dialog.value = true
}

const closeDialog = () => {
  dialog.value = false
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
    // .string()
    .required('活動分類必填'),
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
    category: [],
    // category: [],
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

const fileRecords = ref([]) // 綁定處理後的文件記錄
const rawFileRecords = ref([]) // 綁定原始文件記錄





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
    console.log(values.category)
    // console.log(fd)
    await apiAuth.post('/event', fd) 
    createSnackbar({
      text: '新增成功' ,
      snackbarProps: {
        color: 'green'
      }
    })
    closeDialog()
    loadEvents()
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




// 選擇類別顯示相對應卡片
// 儲存選中的標籤類別
const selectedCategory = ref([]);

// 切換選中類別邏輯
const toggleCategory = (categoryName) => {
  const index = selectedCategory.value.indexOf(categoryName);
  if (index === -1) { 
    // 如果该类别不在已选类别列表中，则添加它
    selectedCategory.value.push(categoryName);
  } else { 
    // 如果该类别已经被选中，则取消选中
    selectedCategory.value.splice(index, 1);
  }
};

// 解決不能重複使用@click的問題(toggle 為內建的語法，用來更改樣式)
const handleClick = (categoryName, toggle) => {
  toggleCategory(categoryName); 
  toggle(); 
};


// 過濾選中的類別
const filteredEvents = computed(() => {
  const query = searchQuery.value.toLowerCase();

  return events.value.filter(event => {
    // 事件必须匹配所有选中的类别
    const matchesCategories = selectedCategory.value.every(category => 
      event.category.includes(category)
    );

    // 事件标题或主办方必须匹配搜索查询
    const matchesQuery = event.title.toLowerCase().includes(query) || event.organizer.toLowerCase().includes(query);
    
    return matchesCategories && matchesQuery;
  });
});
const searchQuery = ref('');
const events = ref([]); // 儲存後端資料

// 從後端加載物品資料
const loadEvents = async () => {
  try {
    const { data } = await api.get('/event', { // 從後端取得商品資訊
      params: { 
        itemssPerPage: itemsS_PER_PAGE, // 傳參數過去讓後端知道一頁有幾個
        page: page.value,
      }
    });
    pages.value = Math.ceil(data.result.total / itemsS_PER_PAGE); // 總頁數 = 總商品數量 / 每頁數量
    events.value.splice(0, events.value.length, ...data.result.data); // 更新前端的商品列表
    
  } catch (error) {
    console.log(error);
    createSnackbar({
      text: error?.response?.data?.message || '發生錯誤',
      snackbarProps: {
        color: 'red',
      },
    });
  }
};
loadEvents();


</script>
<style scoped>

.b-1{
  border: 1px solid #7a7a7a;
}
#create{
    position: fixed;
    right: 8%;
    bottom: 4%;
    border-radius: 50%;
}

.btn-container{
  width: 65px;
  height: 65px;
}

.card-size{
  /* width:295px; */
  width: 100%;
  height:390px;

  
}
@media (min-width: 500px) {
  .btn-container{
    z-index: 5;
    width: 60px;
    height: 60px;
    
  }
  .card-size{
    margin: auto;
    width:100%;
    height:420px;
    
    div{
      max-width: 330px;
      max-height: 280px;
    }
  }
}

.v-overlay__content{
    background-color: #fff;
}
.form-label{
    font-size: 20px;
    font-weight: bold;
}
::v-deep .v-input__prepend{
    margin-right: 5px;
}

::v-deep .v-field__input{
    padding: 12px 10px 12px 10px;
    /* width: 120px; */
}

</style>