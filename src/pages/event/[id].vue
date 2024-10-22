<template>
    <v-container >
      <v-breadcrumbs :items="items">
        <template v-slot:divider>
          <v-icon icon="mdi-chevron-right"></v-icon>
        </template>
      </v-breadcrumbs>
        <v-row justify-center class="mt-2 flex-column flex-sm-row">
            <v-col cols="12" sm="6" md="5" lg="6" class="w-66 w-sm-100 d-flex justify-center align-start mx-auto" style="margin-top: 20px;">
                <v-img :src="event.image" class="image"  contain></v-img>
            </v-col>
            <v-col cols="12" sm="6" md="7" lg="6">
              <v-card variant="flat" class="d-none d-sm-block">
                  <v-card-title class="card-title" style="white-space: pre-line;">活動名稱：{{ event.title }}</v-card-title>
                  <v-divider thickness="0"></v-divider>
                  <v-card-text class="card-text">活動時間</v-card-text>
                  <v-card-text class="card-text">{{ event.date }}</v-card-text>
                  <v-card-text class="card-text">活動地點</v-card-text>
                  <v-card-text class="card-text">{{event.address}}</v-card-text>
                  <v-card-text class="card-text">活動類別</v-card-text>
                  <v-card-text class="card-text" v-for="item in event.category" :key="item">{{item}}</v-card-text>
                  <v-card-text class="card-text">主辦單位</v-card-text>
                  <v-card-text class="card-text">{{ event.organizer }}</v-card-text>
                  <v-card-text></v-card-text>
                  <v-card-text></v-card-text>
                  <v-card-text></v-card-text>
                    <!-- 按收藏按鈕切換樣式 -->
                    <AppButton
                      v-if="user.isLogin"
                      :prepend-icon="isFavorite ? 'mdi-bookmark' : 'mdi-bookmark-outline'"
                      :text="isFavorite ? '已收藏' : '我要收藏'"
                      :class="isFavorite ? 'me-15' : 'me-15 bg-info'"
                      :style="isFavorite ? { backgroundColor: '#F5B4B4' } : {}"
                      @click="toggleFavorite"
                      width="125"
                      height="32"
                      class="text-body-3"
                      :ripple="false"
                  />
              </v-card>
              <v-row class="pl-4 d-flex d-sm-none">
                <v-col cols="12" class="font-weight-black card-title" style="white-space: pre-line;">活動名稱：{{ event.title }}</v-col>
                <v-col cols="4" class="card-text">活動時間</v-col>
                <v-col cols="8" class="card-text">{{ event.date }}</v-col>
                <v-col cols="4" class="card-text">活動地點</v-col>
                <v-col cols="8" class="card-text">{{ event.address }}</v-col>
                <v-col cols="4" class="card-text">活動類別</v-col>
                <v-col cols="8" class="card-text" v-for="item in event.category" :key="item">{{item}}</v-col>
                <v-col cols="4" class="card-text">主辦單位</v-col>
                <v-col cols="8" class="card-text">{{ event.organizer }}</v-col>
                <v-col cols="12" class="mt-6" style="position: relative;">
                <v-btn
                v-if="user.isLogin"
                color="medium-emphasis"
                :icon="isFavorite ? 'mdi-heart' : 'mdi-heart-outline'"
                :class="isFavorite ? 'me-5 mb-2 bg-red-lighten-4' : 'me-5 mb-2 bg-info'"
                size="small"
                class="bg-transparent xs-btn m-0"
                @click="toggleFavorite"
                elevation="0"
                variant="text"
                ></v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" class="d-none d-sm-flex mt-lg-2 py-0">
                <h2 class="info">活動介紹</h2>
            </v-col>
            <v-col cols="12">
                <div class="b-1 info pa-4 mb-5">
                  <!-- white-space: pre-line 換行 -->
                    <h3 class="info d-sm-none mb-2">活動介紹</h3>
                    <p style="white-space: pre-line;" class="text-sm-body-1 w-100">
                      {{ event.description }}
                    </p>
                </div>
            </v-col>
          </v-row>
    </v-container>
</template>
<script setup>
import { ref } from 'vue'
import { definePage } from 'vue-router/auto'
import { useRoute } from 'vue-router'
import { useApi } from '@/composables/axios'
import { useSnackbar } from 'vuetify-use-dialog'
import { useUserStore } from '@/stores/user'
const user = useUserStore()

definePage({
  meta: {
    title: 'keeperS | 活動',
    login: false,
    admin: false
  }
})

const { api,apiAuth } = useApi()
const route = useRoute()
const createSnackbar = useSnackbar()
const items=ref([
  {
    title: '首頁',
    disabled: false,
    href: '/',
  },
  {
    title: '活動分享',
    disabled: false,
    href: '../event/findEvent.vue',
  },
  {
    title: '物資詳情',
    disabled: true,
  }
])
// 商品欄位
const event = ref({
  _id: '',
  title: '',
  date: '',
  address: '',
  category: '',
  organizer:'',
  description: '',
  image: ''
})



const props = defineProps({
  event: Object,
  isFavorite: Boolean
})
const isFavorite = ref(props.isFavorite);


// 從後端加載商品的資料到前端去
const load = async () => {
  try { // 透過'/event/' + route.params.id 來取得特定活動的資料
    const { data } = await api.get('/event/' + route.params.id)
    // Object.assign(target, ...sources) 
    // target：目標對象，將接收來源對象的屬性。
    // sources：來源對象，這些對象的屬性將被複製到目標對象。
    // Object.assign 將 data.result 中的所有屬性合併到 event.value 中
    Object.assign(event.value, data.result) 
    // event.value._id = data.result._id
    // event.value.title = data.result.title
    // event.value.date = data.result.date
    // event.value.address = data.result.address
    // event.value.category = data.result.category
    // event.value.organizer = data.result.organizer
    // event.value.description = data.result.description
    // event.value.image = data.result.image

    if (user.isLogin) {
      isFavorite.value = await checkIfFavorite(event.value._id)
    }
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




const checkIfFavorite = async (eventId) => {
  try {
    const { data: markedEvents } = await apiAuth.get('/user/mark')
    return markedEvents.some(markedEvent => markedEvent._id === eventId)
  } catch (error) {
    console.log(error)
    createSnackbar({
      text: error?.response?.data?.message || '發生錯誤',
      snackbarProps: {
        color: 'red'
      }
    })
    return false
  }
}



const toggleFavorite = async () => {
  if (!user.isLogin) {
    createSnackbar({
      text: '請登入後再收藏活動',
      snackbarProps: {
        color: 'red'
      }
    })
    return
  }

  try {
    const response = await apiAuth.post('/user/toggleFavorite', { eventId: event.value._id })
    isFavorite.value = response.data.isFavorite
    console.log(isFavorite.value)
    createSnackbar({
      text: response.data.isFavorite ? '已收藏' : '取消收藏',
      snackbarProps: {
        color: response.data.isFavorite ? '#F5B4B4' : 'info'
      }
    })
  } catch (error) {
    console.error('收藏操作失败', error)
    createSnackbar({
      text: '收藏操作失败',
      snackbarProps: {
        color: 'red'
      }
    })
  }
}
onMounted(load)


</script>


<style scoped>
.b-1{
  border: 1px solid #7a7a7a;
}
.v-container{
    padding: 0 2rem 0 2rem;
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

.v-btn{
    position: absolute;
    right: 0%;
    bottom: 0%;
}
p{
  font-size: 15px;
}
.image{
  min-width:350px;
  max-width:400px;
  max-height:360px;
}
.xs-btn{
  position: absolute;

}
@media(min-width:600px){
  .image{
    min-width:auto;
  }
  .info{
    margin: 0 1rem 0 1rem ;
  }
  .card-title{
    font-size: 18px;
  }
  .card-text{
      &:nth-child(even){
          font-size: 17px;
          }
      &:nth-child(odd){
      font-size: 16px;
      }
  }
}

@media(min-width:960px){
  .v-container{
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
@media(min-width:1280px){
  .info{
      margin: 0 3rem 0 3rem ;
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
      font-size: 18px;
      }
  }
  .image{
  max-height:400px;
}
}
@media(min-width:1920px){
  .v-container{
    padding: 0 10% 0 10%;
  }
  .info{
      margin: 0 4rem 0 4rem ;
  }
  .image{
    min-width:450px;
    max-width:480px;
    max-height:500px;
  }
  .card-title{
    padding-left: 7px;
    font-size: 25px;
  }
  .card-text{
      padding: 7px;
      &:nth-child(even){
          font-size: 23px;
          }
      &:nth-child(odd){
      font-size: 19px;
      }
  }
}
</style>