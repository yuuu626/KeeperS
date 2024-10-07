<template>
  <v-app-bar color="info" scroll-behavior="elevate" class="b-1">
    <v-container class="d-flex align-center">
        <v-btn to="/" :active="false" class="p-1">
          <v-img src="../../assets/logo.png" width="30" class="d-inline-block" style="vertical-align: cneter;" contain></v-img>
          <span style="text-transform:capitalize; color: #474747;" class=" text-h6 pl-1">KeeperS</span> 
        </v-btn>
      <v-spacer></v-spacer>
      <template v-if="mobile">
        <v-app-bar-nav-icon @click="drawer=true"></v-app-bar-nav-icon>
      </template>
      <template v-else>
        <template v-for="menu in menus" :key="menu.title">
        <v-menu open-on-hover transition="slide-y-transition">
          <template v-slot:activator="{ props }">
            <v-btn v-if="menu.show" v-bind="props" :ripple="false" :prepend-icon="menu.icon" class="font-weight-black pe-1">
              {{ menu.title }}
              <v-icon>mdi-menu-down</v-icon>
            </v-btn>
          </template>
          <v-list>
            <template v-for="(item, i) in menu.items" :key="i">
              <v-list-item
                v-if="item.show"  
                :to="item.to"
                link
              >
                <v-list-item-title>{{ item.text }}</v-list-item-title>
              </v-list-item>
            </template>
          </v-list>
        </v-menu>
      </template>


      <template v-for="item in navItems" >
        <v-btn 
        v-if="item.show"
        :key="item.to" 
        :prepend-icon="item.icon" 
        :to="item.to"
        :active="false"
        class="mx-1 font-weight-black pe-1"
        @click="handleItemClick(item)"
        >{{ item.text }}</v-btn>
      </template>
      <v-btn class="ms-8 bg-accent b-1" elevation="2" prepend-icon="mdi-account-arrow-right" v-if="user.isLogin" @click="logout">登出</v-btn>
      </template>
    </v-container>
  </v-app-bar>
    
    <!-- permanent 永久固定在邊邊 -->
    <v-navigation-drawer color="info" class="b-1">
    <v-tabs
        v-model="tab"
        color="black"
        direction="vertical"
        show-arrows
      >
        <v-tab prepend-icon="mdi-account-wrench" text="用戶管理" value="option-1" height="100" class="text-body-1 ms-1"></v-tab>
        <v-tab prepend-icon="mdi-map-marker-multiple" text="資源地圖" value="option-2" height="100" class="text-body-1 ms-1"></v-tab>
        <v-tab prepend-icon="mdi-calendar-cursor" text="活動分享" value="option-3" height="100" class="text-body-1 ms-1"></v-tab>
        <v-tab prepend-icon="mdi-gift" text="物資分享" value="option-4" height="100" class="text-body-1 ms-1"></v-tab>
      </v-tabs>
    <!-- <v-list>
      <v-list-item>
        <v-list-item :prepend-avatar="avatar" class="text-h6 font-weight-black">管理者</v-list-item>
      </v-list-item>
    </v-list>
    <v-divider></v-divider>
    <v-list nav>
      <v-list-item
      class="text-body-1"
      v-for="item in navItems" 
      :key="item.to"
      :prepend-icon="item.icon" 
      :to="item.to"
      :title="item.text" 
      :active="false"
      ></v-list-item>
    </v-list> -->
  </v-navigation-drawer>
  <v-card class="h-100">
    <div class="d-flex flex-row">
      <v-container>
        <v-tabs-window v-model="tab" class="my-10">
<!-- 01 基本資料管理 -->
          <v-tabs-window-item value="option-1">
          <!-- 麵包屑 - 顯示目前頁面位置 -->
           <breadcrumbs :title="profile"></breadcrumbs>
            <AllAccountTable/>
          </v-tabs-window-item>




<!-- 02 地標管理 -->
          <v-tabs-window-item value="option-2" >
            <!-- 麵包屑 - 顯示目前頁面位置 -->
           <breadcrumbs :title="mark"></breadcrumbs>
           <AllLandmark></AllLandmark>
           <!-- <v-data-table-server
                :headers="event_tableHeaders"
                hover
                class="w-75 mx-auto b-1 rounded-lg "
              >
              <template #[`item.image`]="{ value }">
                <v-img :src="value" height="50px"></v-img>
              </template>
              <template #[`item.action`]="{ item }">
                <v-btn icon="mdi-pencil" variant="text" color="blue" @click="openDialog(item)"></v-btn>
                <v-btn icon="mdi-delete" variant="text" color="blue" @click="openDialog(item)"></v-btn>
              </template>
            </v-data-table-server> -->
          </v-tabs-window-item>



<!-- 03 貼文管理 -->
          <v-tabs-window-item value="option-3">
          <!-- 麵包屑 - 顯示目前頁面位置 -->
          <breadcrumbs :title="post"></breadcrumbs>
            
            <!-- 活動管理 -->
            <div class="  mx-auto mb-5 rounded-lg">
            <AllEventTable/>
          </div>
          </v-tabs-window-item>



<!-- 04 活動收藏管理 -->
          <v-tabs-window-item value="option-4">
            <!-- 麵包屑 - 顯示目前頁面位置 -->
          <breadcrumbs :title="event"></breadcrumbs>
          <!-- 物資募資 -->
          <div class="  mx-auto mb-5 rounded-lg">
              <AllFindTable/>
            </div>
            <!-- 物資分享 -->
            <div class="  mx-auto mb-5 rounded-lg">
            <AllShareTable/>
          </div>
          
          </v-tabs-window-item>


          
        </v-tabs-window>
      </v-container>
    </div>
  </v-card>
  </template>
  <script setup>
import AllEventTable from '@/components/admin/allEventTable.vue';
import AllFindTable from '@/components/admin/allFindTable.vue';
import AllShareTable from '@/components/admin/allShareTable.vue';
import AllLandmark from '@/components/admin/allLandmark.vue';
  const profile=(['會員中心','基本資料'])
const mark=(['會員中心','地標管理'])
const post=(['會員中心','貼文管理'])
const event=(['會員中心','活動收藏'])
const tab = ref('option-1');
import { definePage } from 'vue-router/auto'

import { ref, computed } from 'vue'
import { useDisplay } from 'vuetify'
const { mobile } = useDisplay()
const router = useRouter();
const user = useUserStore()
import { useUserStore } from '@/stores/user'
import { useSnackbar } from 'vuetify-use-dialog'
const createSnackbar = useSnackbar()
const drawer = ref(false)


definePage({
  meta: {
    title: 'KeeperS | 管理者'
  }
})
const menus = computed(() => {
  return [
    {
      title: "資源地圖", icon: 'mdi-map-search', show:user.isLogin,
      items: [
        { to: "/", text: "資源查詢", show:user.isLogin },
        { to: "/map/createMark", text: "新增資源", show: user.isLogin},
      ],
    },
    {
      title: "物資分享", icon: 'mdi-package-variant' , show: user.isLogin,
      items: [
        { to: "/material/find/findMaterial", text: "我要募資" , show:user.isLogin || user.isAdmin},
        { to: "/material/share/shareMaterial", text: "我要分享" , show:user.isLogin || user.isAdmin},
      ],
    },
  ];
});



  const navItems= computed(() => {
    return[
    { to: '/', text: '資源地圖', icon: 'mdi-map-search', show:!user.isLogin },
    { to: '/event/findEvent', text: '活動分享', icon: 'mdi-calendar', show:true},
    { to: '/setting', text: '管理', icon: 'mdi-cog', show:user.isLogin },
    { to:'',text:'註冊/登入',icon:'mdi-account-plus', show:!user.isLogin},
    { to:'/admin/',text:'管理者',icon:'mdi-face-man', show:user.isLogin && user.isAdmin}
    ]
  })

  const handleItemClick = (item) => {
  if (item.text === '註冊/登入') {
    dialogOpen.value = true
  } 
}

  const logout = async () => {
  await user.logout()
  
  createSnackbar({
    text: '登出成功',
    snackbarProps: {
      color: 'green'
    }
  })
  router.push('/');
}


</script>
<style scoped>

.b-1{
  border: 1px solid #7a7a7a;
}
.v-text-field{
  margin: 8px 0 8px 0;
}
.v-footer{
  height: 50px;
  
}
.v-main {
  flex: 1; /* 使主要內容區域占據剩餘空間 */
}
</style>
<route lang="yaml">
meta:
    layout: admin
</route>