<template>
   <!-- 側邊欄 -->
  <v-navigation-drawer  class="b-1 text-center" width="250">
    <v-tabs
        v-model="tab"
        color="teal-darken-4"
        direction="vertical"
        show-arrows
      >
        <v-tab prepend-icon="mdi-account" text="基本資料" value="option-1" height="100" class="text-body-1 ms-1"></v-tab>
        <v-tab prepend-icon="mdi-lock" text="地標管理" value="option-2" height="100" class="text-body-1 ms-1"></v-tab>
        <v-tab prepend-icon="mdi-access-point" text="貼文管理" value="option-3" height="100" class="text-body-1 ms-1"></v-tab>
        <v-tab prepend-icon="mdi-book-cog" text="活動收藏" value="option-4" height="100" class="text-body-1 ms-1"></v-tab>
        <v-tab prepend-icon="mdi-package-variant-closed-check" text="物資管理" value="option-5" height="100" class="text-body-1 ms-1"></v-tab>
      </v-tabs>
  </v-navigation-drawer>
  
  <v-card class="h-100">
    <div class="d-flex flex-row">
      <v-container>
        <v-tabs-window v-model="tab" class="my-10">
<!-- 01 基本資料管理 -->
          <v-tabs-window-item value="option-1">

            <AccountTable/>
          </v-tabs-window-item>




<!-- 02 地標管理 -->
          <v-tabs-window-item value="option-2" >
            <!-- 麵包屑 - 顯示目前頁面位置 -->
            <v-breadcrumbs :items="mark">
              <template v-slot:divider>
                <v-icon icon="mdi-chevron-right"></v-icon>
              </template>
            </v-breadcrumbs>
          <LandmarkTable/>
          </v-tabs-window-item>



<!-- 03 貼文管理 -->
          <v-tabs-window-item value="option-3">
          <!-- 麵包屑 - 顯示目前頁面位置 -->
          <v-breadcrumbs :items="post">
              <template v-slot:divider>
                <v-icon icon="mdi-chevron-right"></v-icon>
              </template>
            </v-breadcrumbs>
            <!-- 物資募資 -->
            <div class="  mx-auto mb-5 rounded-lg">
              <FindTable/>
            </div>
            <!-- 物資分享 -->
            <div class="  mx-auto mb-5 rounded-lg">
            <ShareTable/>
          </div>
            <!-- 活動管理 -->
            <div class="  mx-auto mb-5 rounded-lg">
            <EventTable/>
          </div>
          </v-tabs-window-item>



          <!-- 活動收藏管理 -->
          <v-tabs-window-item value="option-4">
            <!-- 麵包屑 - 顯示目前頁面位置 -->
            <v-breadcrumbs :items="event">
              <template v-slot:divider>
                <v-icon icon="mdi-chevron-right"></v-icon>
              </template>
            </v-breadcrumbs>
          <div class="w-66 mx-auto rounded-lg my-5" style="border:1.2px solid #000;" v-for="event in events" :key="event._id">
            <v-card variant="flat" class="rounded-lg" style="background-color: #f7f2e9;">
                <v-row class="align-center my-4 ps-8" >
                    <v-col cols="3" class=" align-self-start">
                      <router-link :to="'/event/'+ event._id" style="text-decoration: none">
                        <v-img :src="event.image" class="b-1 rounded-lg" width="200px" height="220px" cover></v-img>
                      </router-link>
                      </v-col>
                    <v-col cols="7" class=" align-self-start">
                      <v-card-title class="text-h6 font-weight-black">{{ event.title }}</v-card-title>
                      <v-card-subtitle class="text-body-1 font-weight-bold">{{ event.organizer }}</v-card-subtitle>
                      <v-card-subtitle class="text-body-1 font-weight-bold mt-2">{{ event.date }}</v-card-subtitle>
                      <!-- <v-card-text style="white-space: pre-line;">{{ event.description }}</v-card-text> -->
                  </v-col>
                  <v-col cols="2" class=" align-self-start mt-2">
                    <v-btn id="btn" v-if="isFavorite"  text="取消收藏" prepend-icon="mdi-bookmark" variant="outlined" style="background-color: #F5B4B4;" @click="toggleFavorite(event._id)" class="font-weight-black " width="120" height="35"></v-btn>
                  </v-col>
                </v-row>                
            </v-card>
          </div>
          <v-row v-if="events.length==0">
            <v-col class="text-center mt-15" style="color:#bfbfbf;">
              <h1>暫無任何活動收藏</h1>
            </v-col>
          </v-row>
          
          </v-tabs-window-item>


          <!-- 讀取物資回覆 -->
          <v-tabs-window-item value="option-5">
            <!-- 麵包屑 - 顯示目前頁面位置 -->
            <v-breadcrumbs :items="material">
              <template v-slot:divider>
                <v-icon icon="mdi-chevron-right"></v-icon>
              </template>
            </v-breadcrumbs>
          <div class="  mx-auto mb-5 rounded-lg">
              <ShareReplyTable/>
              <FindReplyTable/>
            </div>
          </v-tabs-window-item>
          
        </v-tabs-window>
      </v-container>
    </div>
  </v-card>
</template>
<script setup>
import { ref } from 'vue'
import { definePage } from 'vue-router/auto'
import { useSnackbar } from 'vuetify-use-dialog'
import * as yup from 'yup'
import { useForm, useField } from 'vee-validate'
import { useApi } from '@/composables/axios'
import EventTable from '@/components/table/eventTable.vue'
import ShareTable from '@/components/table/shareTable.vue'
import FindTable from '@/components/table/findTable.vue'
import AccountTable from '@/components/table/accountTable.vue'
import MaterialTable from '@/components/table/shareReplyTable.vue'
import ShareReplyTable from '@/components/table/shareReplyTable.vue'
import FindReplyTable from '@/components/table/findReplyTable.vue'
import LandmarkTable from '@/components/table/landmarkTable.vue'
const { api,apiAuth } = useApi()
const createSnackbar = useSnackbar()
const fileAgent = ref(null)
const fileRecords = ref([]) // 綁定處理後的文件記錄
const rawFileRecords = ref([]) // 綁定原始文件記錄

definePage({
  meta: {
    title: ' KeeperS | 會員管理'
  }
})

const mark=ref([
{
    title: '會員中心',
    disabled: false,
    href: '/setting',
  },
  {
    title: '地標管理',
    disabled: true,
  }
])

const post=ref([
{
    title: '會員中心',
    disabled: false,
    href: '/setting',
  },
  {
    title: '貼文管理',
    disabled: true,
  }
])

const event=ref([
{
    title: '會員中心',
    disabled: false,
    href: '/setting',
  },
  {
    title: '活動收藏',
    disabled: true,
  }
])

const material =ref([
{
    title: '會員中心',
    disabled: false,
    href: '/setting',
  },
  {
    title: '物資管理',
    disabled: true,
  }
])


const tab = ref('option-1');



const isFavorite = ref('true');
const events=ref([])
const fetchFavoriteEventDetails = async () => {
  try {
    // 獲取用戶收藏的活動列表
    const { data } = await apiAuth.get('/user/mark');
    // 將每個活動標記為已收藏
    events.value = data.map(event => ({ ...event, isFavorite: true }));
  } catch (error) {
    console.error('Failed to fetch favorite event details:', error);
  }
};

const toggleFavorite = async (eventId) => {
  try {
    await apiAuth.patch('/user/mark', { eventId });

    // 更新本地状态，移除已取消收藏的活动
    events.value = events.value.filter(e => e._id !== eventId);

    // 如果希望在用戶取消收藏後，該活動立即從頁面上移除，則應使用 filter 方法來過濾掉該活動。
    // 如果只是想更新活動的收藏狀態，而保持它在列表中(標記為已收藏或已取消收藏)，則應使用 find 方法。
    // const event = events.value.find(e => e._id === eventId);
    // if (event) {
    //   event.isFavorite = isFavorite;
    // }


    createSnackbar({
      text: '取消收藏',
      snackbarProps: {
        color: 'info'
      }
    });
  } catch (error) {
    console.error('取消收藏失败', error);
    createSnackbar({
      text: '取消收藏失败',
      snackbarProps: {
        color: 'red',
      }
    });
  }
};

onMounted(() => {
  fetchFavoriteEventDetails();
});














</script>
  
<style scoped>
 .b-1{
  border: 1px solid #7a7a7a;
}
.bb-1{
  border-bottom: 1px solid #7a7a7a;
}
.v-data-table__thead{
  background-color:#000;
  font-size: 15px;
}
/* ::v-deep [data-v-9f35885f] .grid-block-wrapper .grid-block .file-preview {
  width: 100px;
  height: 100px;
} */
::v-deep .v-data-table__thead{
  background: #D9D9D9
}

.form-label{
    font-size: 20px;
    font-weight: bold;
}
.bg-info {
  background-color: #2196F3;
}
.bg-red {
  background-color: #F5B4B4;
}
#btn{
  position: absolute;
  bottom: 10%;
  right: 3%;
}
</style>
  








  