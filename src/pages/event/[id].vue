<template>
    <v-container>
      <v-breadcrumbs :items="items">
              <template v-slot:divider>
                <v-icon icon="mdi-chevron-right"></v-icon>
              </template>
      </v-breadcrumbs>
        <v-row justify-center>
            <v-col cols="5" class="d-flex justify-center">
                <v-img :src="event.image" class="" max-width="400" max-height="500" contain></v-img>
            </v-col>
            <v-col cols="6">
                <v-card variant="flat">
                    <v-card-title class="font-weight-black" style="white-space: pre-line;">活動名稱：{{ event.title }}</v-card-title>
                    <v-divider thickness="0"></v-divider>
                    <v-card-text class="font-weight-black">活動時間</v-card-text>
                    <v-card-text>{{ event.date }}</v-card-text>
                    <v-card-text class="font-weight-black">活動地點</v-card-text>
                    <v-card-text>{{event.address}}</v-card-text>
                    <v-card-text class="font-weight-black">活動類別</v-card-text>
                    <v-card-text v-for="item in event.category" :key="item">{{item}}</v-card-text>
                    <v-card-text class="font-weight-black">主辦單位</v-card-text>
                    <v-card-text>{{ event.organizer }}</v-card-text>
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
                    />
                      <!-- <AppButton v-if="isFavorite" prepend-icon="mdi-bookmark" text="已收藏" class="me-15 " :style="{ backgroundColor: '#F5B4B4' } " @click="toggleFavorite"></AppButton>
                      <AppButton v-else prepend-icon="mdi-bookmark" text="我要收藏" class="me-15 bg-info" @click="toggleFavorite" ></AppButton> -->
                    
                </v-card>
            </v-col>
        </v-row justify-center class="flex-column">
        <v-row>
            <v-col cols="12" class="mt-10">
                <h2 class="info">活動介紹</h2>
            </v-col>
            <v-col cols="12">
                <div class="b-1 info pa-4">
                  <!-- white-space: pre-line 換行 -->
                    <p style="white-space: pre-line;" class="text-body-1 w-75">
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
load()



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

// 在组件挂载时加载数据
onMounted(load)


</script>


<style scoped>
.b-1{
  border: 1px solid #7a7a7a;
}
.v-container{
    padding: 0 11rem 0 11rem;
}
.v-card-title{
    padding-left: 9px;
    font-size: 25px;
}
.v-card-text{
    padding: 9px;
    &:nth-child(even){
        color:#87b3b0;
        font-size: 22px;
        }
    &:nth-child(odd){
    font-size: 18px;
    font-weight: 550;
    color: #7a7a7a;
    }
}
.info{
    margin: 0 6rem 0 6rem ;
}
.v-btn{
    position: absolute;
    right: 0%;
    bottom: 0%;
}

</style>