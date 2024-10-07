<template>
    <v-container id="con">
        <v-breadcrumbs :items="items">
              <template v-slot:divider>
                <v-icon icon="mdi-chevron-right"></v-icon>
              </template>
      </v-breadcrumbs>
        <v-row class="mt-5 w-100 h-66">
            <v-col cols="5" class="d-flex justify-center align-center">
              <div class="b-1 pa-2 d-flex justify-center img">
                    <v-img :src="provide.image" max-width="330" max-height="330" contain></v-img>
                </div>
            </v-col>
            <v-col cols="6">
                <v-card variant="flat" id="resourceCard">
                    <v-card-title class="font-weight-black mb-3 text-h5">物資名稱：{{provide.name}}</v-card-title>
                    <v-divider thickness="0"></v-divider>
                    <v-row>
                        <!-- 活動名稱 -->
                        <v-col cols="12" md="3" class="my-auto">
                            <label class="form-label">需求單位</label>
                        </v-col>
                        <v-col cols="12" md="9">
                            <p>{{provide.organizer}}</p>
                        </v-col>
                        <!-- 活動對象 -->
                        <v-col cols="12" md="3" class="my-auto ">
                            <label class="form-label">物資類別</label>
                        </v-col>
                        <v-col cols="12" md="9">
                            <p>{{provide.category}}</p>
                        </v-col>
                        <!-- 需求介紹 -->
                        <v-col cols="12" md="3">
                            <label class="form-label">需求介紹</label>
                        </v-col>
                        <v-col cols="12" md="9">
                            <p>
                                {{provide.description}}
                            </p>
                        </v-col>
                        <!-- 所需數量 -->
                        <v-col cols="12" md="3" class="my-auto ">
                            <label class="form-label">所需數量</label>
                        </v-col>
                        <v-col cols="12" md="9" class="my-auto">
                            <p>2包</p> 
                        </v-col>
                    </v-row>
                    <!-- <v-card-text v-for="item in cardtext" :key="item">{{ item }}</v-card-text> -->
                    
                </v-card>
                <AppButton text="我要留言" width="90" class="me-4 bg-third" @click="scrollTo('#msg')"></AppButton>
                <AppButton text="我要索取" width="90" class=" bg-third" @click="openDialog(null)" ></AppButton>
            </v-col>
        </v-row>
        <Comment id="msg" ref="textarea"></Comment>

        
        <!-- 我要捐贈 - 對話框 -->
        <v-dialog max-width="700px" v-model="dialog">

                <!-- 定義了對話框打開時顯示的內容。插槽道具 { isActive } 用於控制對話框的打開和關閉狀態 -->
                    <v-card class="bg-third">
                        <v-container>
                            <!-- 關閉對話框的按鈕 -->
                            <v-card-actions class="pa-0">
                                <v-btn id="close" icon="$close" variant="text" @click="closeDialog()"></v-btn>
                            </v-card-actions>
                            <v-card-title class="font-weight-black text-left text-h5 py-0">物資名稱：{{provide.name}}</v-card-title>
                            <div class="b-1 bg-white rounded-sm pt-5 mt-2 mb-4 mx-4" >    
                                <v-card-text>
                                    <v-form @submit.prevent="submit" :disabled="isSubmitting">
                                        <v-row>
                                            <!-- 捐贈數量 -->
                                            <v-col cols="12" md="3" class="my-auto text-center">
                                            <label class="form-label">索取數量</label>
                                            </v-col>
                                            <v-col cols="12" md="9">
                                                <!-- 實驗中的元件，要記得import -->
                                                <v-number-input
                                                control-variant="stacked"
                                                variant="outlined"
                                                density="comfortable"
                                                inset
                                                label="輸入數量"
                                                hide-details
                                                :min="0"
                                                v-model="quantity.value.value"
                                                :error-messages="quantity.errorMessage.value"
                                                ></v-number-input>
                                            </v-col>
                                            <!-- 活動對象 -->
                                            <v-col cols="12" md="3" class="my-auto text-center">
                                            <label class="form-label">單位／姓名</label>
                                            </v-col>
                                            <v-col cols="12" md="9">
                                                <inputText
                                                v-model="donator.value.value"
                                                :error-messages="donator.errorMessage.value"
                                                />
                                            </v-col>
                                            <!-- 需求介紹 -->
                                            <v-col cols="12" md="3" class="my-auto text-center">
                                                <label class="form-label">聯絡電話</label>
                                            </v-col>
                                            <v-col cols="12" md="9">
                                                <inputText
                                                v-model="phone.value.value"
                                                :error-messages="phone.errorMessage.value"
                                                />
                                            </v-col>
                                        </v-row>
                                            <v-card-actions>
                                                <div class="mx-auto">
                                                    <v-btn
                                                    type="submit"
                                                    text="送出"
                                                    variant="text"
                                                    class="rounded-xl b-1 bg-primary"
                                                    density="comfortable"
                                                    :loading="isSubmitting"
                                                    ></v-btn>
                                                </div>    
                                            </v-card-actions>
                                    </v-form>
                                </v-card-text>

                            </div>
                        </v-container>
                    </v-card>
            </v-dialog>

    </v-container>
</template>
<script setup>
import { VNumberInput } from 'vuetify/labs/VNumberInput'
import { ref, nextTick  } from 'vue'
import * as yup from 'yup'
import { useForm, useField } from 'vee-validate'
import { definePage } from 'vue-router/auto'
import { useRoute } from 'vue-router'
import { useApi } from '@/composables/axios'
import { useSnackbar } from 'vuetify-use-dialog'
import Comment from '@/components/comment.vue'

const { api,apiAuth } = useApi()
const route = useRoute()
const createSnackbar = useSnackbar()

const dialog = ref(false)
const openDialog = (item) => {
  dialog.value = true
}
const closeDialog = () => {
  dialog.value = false
}

const items=ref([
  {
    title: '首頁',
    disabled: false,
    href: '/',
  },
  {
    title: '我要分享',
    disabled: false,
    href: '/material/share/shareMaterial',
  },
  {
    title: '物資詳情',
    disabled: true,
  }
])

definePage({
  meta: {
    title: 'keeperS | 物資',
    login: false,
    admin: false
  }
})

const provide = ref({
  _id: '',
  name: '',
  quantity: 0, // 預設0
  category: '',
  description: '',
  image: '',
})




const textarea = ref(null);


const load = async () => {
  try { // 透過'/material/' + route.params.id 來取得特定商品的資料
    const { data } = await api.get('/material/' + route.params.id)
    provide.value._id = data.result._id
    provide.value.name = data.result.name
    provide.value.quantity = data.result.quantity
    provide.value.category = data.result.category
    provide.value.description = data.result.description
    provide.value.organizer = data.result.organizer
    provide.value.image = data.result.image
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
load()



const schema = yup.object({
  donator: yup
    .string()
    .required('服務單位必填'),
  quantity: yup
    .number()
    .min(1, '數量不符')
    .required('數量必填'),
  phone: yup
    .string()
    .required('聯絡電話必填'),
})


const { handleSubmit, isSubmitting, resetForm } = useForm({
  // validationSchema 用於驗證表單的各個字段，確保所有字段都符合預期的格式和要求
  // 定義表單的驗證格式是上面定義的東東
  validationSchema: schema,
  // initialValues  定義表單的初始值(表單在第一次渲染時會有預設的值)
  initialValues: {
    donator: '', 
    quantity: 0, // 初始值是0
    phone: ''
  }
})
const donator = useField('donator')
const quantity = useField('quantity')
const phone = useField('phone')


const submit = handleSubmit(async (values) => {
  try {
    console.log(provide.value._id)
    const data = {
        donator:values.donator,
        quantity:values.quantity,
        phone:values.phone,
        id:provide.value._id
    }
    
    console.log(data)
    await apiAuth.post('material/donate', data) 
    createSnackbar({
      text: '新增成功' ,
      snackbarProps: {
        color: 'green'
      }
    })
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




// 點擊我要留言按鈕跳到留言板
function scrollTo(selector) { // 找到想滾動到的元素css選擇器
    const element = document.querySelector(selector);
    if (element) { 
        // scrollIntoView 方法使該元素滾動到視窗內部
        // behavior: 'smooth' 使滾動效果平滑過渡，而不是瞬間跳轉
        element.scrollIntoView({ behavior: 'smooth' });
        nextTick(() => { // 滾動後再執行
            textarea.value.focus();
        });
    }
}
</script>


<style scoped>
.b-1{
  border: 1px solid #7a7a7a;
}

@media(min-width:1920px){
  #con{
    padding:0.5rem 15rem 3rem 15rem;
  }
}



.img{
    width: 80%;
    
    
  }
  @media(min-width:1280px){
  .img{
    /* width: 340px;
    height: 340px; */
    width:60%;
    margin: 0;
  }
  #resourceCard{
    .v-card-text{
    padding: 9px;
        &:nth-child(even){
            color:#87b3b0;
            font-size: 20px;
            }
        &:nth-child(odd){
        font-size: 16px;
        }
    }
    .form-label{
    font-size: 20px;
    font-weight: bold;
    color:#87b3b0;
    margin-left: 0.8rem;
  }
}
}
.v-card-title{
    padding-left: 9px;
    font-size: 30px;
}

.info-margin{
    margin: 0 6rem 0 6rem ;
}
#submit{
    position: relative;
    left: 51%;
    padding: 0;
}
.v-btn{
    position: relative;
    left: 65%;
}
#close{
    position: relative;
    left: 95%;
}
p{
  font-size: 19px;
    font-weight: bold;
    color: gray;
}

</style>