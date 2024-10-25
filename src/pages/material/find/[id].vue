<template>
  <v-container id="con">
    <v-breadcrumbs :items="items">
      <template v-slot:divider>
        <v-icon icon="mdi-chevron-right"></v-icon>
      </template>
    </v-breadcrumbs>
      <v-row class="mt-5 w-100 h-66 mx-auto">
        <v-col cols="12" sm="6" md="5" lg="6" class="w-66 w-sm-100 d-flex justify-center align-start mx-auto">
          <v-img :src="provide.image" class="image b-1" contain></v-img>
        </v-col>
        <v-col cols="12" sm="6" md="6" lg="6">
        <v-card variant="flat" class="d-none d-sm-block">
            <v-card-title class="card-title" style="white-space: pre-line;">物資名稱：{{provide.name}}</v-card-title>
            <v-divider thickness="0"></v-divider>
            <v-card-text class="card-text">需求單位</v-card-text>
            <v-card-text class="card-text">{{ provide.organizer }}</v-card-text>
            <v-card-text class="card-text">物資類別</v-card-text>
            <v-card-text class="card-text">{{provide.category}}</v-card-text>
            <v-card-text class="card-text">需求介紹</v-card-text>
            <v-card-text class="card-text">{{provide.description}}</v-card-text>
            <v-card-text class="card-text">所需數量</v-card-text>
            <v-card-text class="card-text">{{ provide.quantity}}</v-card-text>
            <v-card-text></v-card-text>
          </v-card>
          <v-row  class="pl-4 d-flex d-sm-none">
            <v-col cols="12" class="font-weight-black card-title" style="white-space: pre-line;">物資名稱：{{provide.name}}</v-col>
            <v-col cols="4" class="card-text">需求單位</v-col>
            <v-col cols="8" class="card-text">{{provide.organizer}}</v-col>
            <v-col cols="4" class="card-text">物資類別</v-col>
            <v-col cols="8" class="card-text">{{provide.category}}</v-col>
            <v-col cols="4" class="card-text">需求介紹</v-col>
            <v-col cols="8" class="card-text"> {{provide.description}}</v-col>
            <v-col cols="4" class="card-text">所需數量</v-col>
            <v-col cols="8" class="card-text">{{provide.quantity}}</v-col>
          </v-row>
          <div style="width: 100%;height: 30px;text-align: right;" class="mt-5">
            <AppButton text="我要留言" width="90" class="bg-third d-inline-block" @click="scrollTo('#msg')"></AppButton>
            <AppButton text="我要捐贈" width="90" class=" bg-third d-inline-block" @click="openDialog(null)" ></AppButton>
          </div>
        </v-col>
      </v-row>
      <Comment id="msg" ref="textarea"></Comment>

      
      <!-- 我要捐贈 - 對話框 -->
      <v-dialog max-width="700px" v-model="dialog">
        <v-card class="bg-third">
          <v-container class="pt-0">
            <!-- 關閉對話框的按鈕 -->
            <v-card-actions class="pa-0 justify-end">
                <v-btn id="close" icon="$close" variant="text" @click="closeDialog()"></v-btn>
            </v-card-actions>
              <v-card-title class="font-weight-black text-left text-h5 py-0">物資名稱：{{provide.name}}</v-card-title>
              <div class="b-1 bg-white rounded-sm pt-5 mt-2 mb-4 mx-sm-2 mx-md-4" >   
                <v-card-text>
                  <v-form @submit.prevent="submit" :disabled="isSubmitting">
                    <v-row>
                      <!-- 捐贈數量 -->
                      <v-col cols="4" sm="3" class="my-auto text-center">
                        <label class="form-label">捐贈數量</label>
                      </v-col>
                      <v-col cols="8" sm="9">
                        <!-- 實驗中的元件，要記得import -->
                        <v-number-input
                        control-variant="stacked"
                        variant="outlined"
                        inset
                        label="輸入數量"
                        hide-details
                        :min="0"
                        v-model="quantity.value.value"
                        :error-messages="quantity.errorMessage.value"
                        :density="$vuetify.display.xs ? 'compact' : 'comfortable'"
                        ></v-number-input>
                      </v-col>
                      <!-- 活動對象 -->
                      <v-col cols="4" sm="3" class="my-auto text-center">
                        <label v-if="$vuetify.display.xs" class="form-label">單位名稱</label>
                        <label v-else class="form-label">單位／姓名</label>
                      </v-col>
                      <v-col cols="8" sm="9">
                        <inputText
                        v-model="donator.value.value"
                        :error-messages="donator.errorMessage.value"
                        :density="$vuetify.display.xs ? 'compact' : 'comfortable'"
                        />
                      </v-col>
                      <!-- 需求介紹 -->
                      <v-col cols="4" sm="3" class="my-auto text-center">
                        <label class="form-label">聯絡電話</label>
                      </v-col>
                      <v-col cols="8" sm="9">
                        <inputText
                        v-model="phone.value.value"
                        :error-messages="phone.errorMessage.value"
                        :density="$vuetify.display.xs ? 'compact' : 'comfortable'"
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
    to: '/',
  },
  {
    title: '我要募資',
    disabled: false,
    to: '/material/find/findMaterial',
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

        // 使用 setTimeout 確保滾動效果完成後再聚焦
        setTimeout(() => { 
            if (textarea.value && textarea.value.$refs.commentInput) {
                textarea.value.$refs.commentInput.focus();
            }
        }, 500); // 調整延遲時間以符合需求
    }
}
</script>


<style scoped>
.b-1{
  border: 1px solid #7a7a7a;
}
#con{
    padding: 0 1rem 0 1rem;
}
.card-title{
    font-weight: bold;
    padding-left: 6px;
    font-size: 20px;
}
.card-text{
    font-weight: bold;
    padding: 6px;
    &:nth-child(even){
        color:#87b3b0;
        font-size: 18px;
        }
    &:nth-child(odd){
    font-size: 16px;
    font-weight: 550;
    color: #7a7a7a;
    }
}

.image{
  min-width:240px;
  max-width:260px;
  max-height:360px;
  /* min-width:350px;
  max-width:360px;
  max-height:360px; */
}

.msg-btn{
  position: absolute;
  left: 50%;
}
.donate-btn{
  position: absolute;
  left: 75%;
}
.form-label{
    font-size: 18px;
    font-weight: bold;
}

@media(min-width:600px){
  .image{
    min-width:240px;
    max-width:280px;
  }
  .card-title{
    font-size: 19px;
  }
  .card-text{
      &:nth-child(even){
          font-size: 18px;
          }
      &:nth-child(odd){
      font-size: 17px;
      }
  }
  #con{
    padding: 0 1.8rem 0 1.8rem;
  }
  .form-label{
    font-size: 20px;
    font-weight: bold;
  }
}

@media(min-width:680px) and (max-width:959px){
  .image{
    min-width:275px;
  }
  .card-title{
    font-size: 22px;
  }
  .card-text{
      &:nth-child(even){
          font-size: 20px;
          }
      &:nth-child(odd){
      font-size: 18px;
      }
  }
}

@media(min-width:960px){
  #con{
    padding: 0 0.5rem 0 0.5rem;
  }
  .card-title{
    font-size: 23px;
  }
  .card-text{
      &:nth-child(even){
          font-size: 20px;
          }
      &:nth-child(odd){
      font-size: 18px;
      }
  }
}
@media(min-width:960px){
  .image{
    min-width:305px;
  }
  .card-title{
    font-size: 23px;
  }
  .card-text{
      &:nth-child(even){
          font-size: 21px;
          }
      &:nth-child(odd){
      font-size: 19px;
      }
  }
}
@media(min-width:1280px){
  .image{
    min-width:360px;
  }
  .card-title{
    padding-left: 9px;
    font-size: 25px;
  }
  .card-text{
      padding: 9px;
      &:nth-child(even){
          font-size: 22px;
          }
      &:nth-child(odd){
      font-size: 20px;
      }
  }
}

@media(min-width:1920px){
  #con{
    padding:0.5rem 15rem 3rem 15rem;
  }
}
/* 
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
} */

</style>