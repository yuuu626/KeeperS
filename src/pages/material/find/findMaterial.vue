
<template>
  <!-- 物資card -->
  <v-container class="h-100">
    <!-- 麵包屑 - 顯示目前頁面位置 -->
    <v-breadcrumbs :items="items">
      <template v-slot:divider>
        <v-icon icon="mdi-chevron-right"></v-icon>
      </template>
    </v-breadcrumbs>
      <!-- 小尺寸新增紐 及 篩選 -->
    <resourceDialog v-if="mobile" type="find" @update="loadMaterials"></resourceDialog>
    <v-responsive max-width="900" class="mx-auto d-xl-none d-lg-block">
      <v-sheet
      class="w-100 mx-auto d-inline-block"
      >
        <v-slide-group
        show-arrows
        multiple
        mobile-breakpoint="xxl"
        >
        <v-slide-group-item v-slot="{ toggle }">
          <v-chip
          :style="{
            backgroundColor: allSelected ? '#616161' : '#EEEEEE',
            color: allSelected ? 'white' : 'black'
          }"
          class="ma-2"
          @click="() => handleAllClick(toggle)"
          >
            全部
          </v-chip>
        </v-slide-group-item>
          <v-slide-group-item
          v-for="category in categories"
          :key="category.name"
          v-slot="{isSelected, toggle }"
          >
            <v-chip
            :style="{
            backgroundColor: allSelected || isSelected? '#616161' : '#EEEEEE',
            color: allSelected || isSelected ? 'white' : 'black'
            }"
            class="ma-2"
            @click="() => handleClick(category, toggle)"
            >
            {{ category.name }}
            </v-chip>
          </v-slide-group-item>
        </v-slide-group>
      </v-sheet>
    </v-responsive>
    <v-row class="pl-lg-15 h-100">
      <!-- filteredItems -->
      <v-col
      v-for="provide in filteredItems"
      :key="provide.id"
      cols="12"
      md="6">
        <v-card variant="flat">
          <v-row class="align-content-center h-100 my-4">
            <v-col cols="6" sm="7" md="6" class="ml-5 ml-sm-0" >
              <router-link :to="'/material/find/'+ provide._id">
                <div class="d-flex justify-content-center b-1 item-img">
                  <v-img :src="provide.image" contain ></v-img>
                </div>
              </router-link>
              </v-col>
              <v-col cols="5" sm="5" md="5">
                <v-card-title class="text-h6  text-md-h6 font-weight-bold ms-md-1">{{ provide.name }}</v-card-title>
                <v-card-subtitle style="font-size: 16px;" class="ms-md-1 ">{{ provide.organizer }}</v-card-subtitle>
                <v-card-text style="font-size: 15px;" class="ms-md-1 pt-sm-1 pb-sm-2">數量：{{ provide.quantity }}</v-card-text>
                <AppButton text="詳細說明" class="bg-third ms-md-4 ms-3 " :to="'/material/find/'+ provide._id"></AppButton>
              </v-col>
          </v-row>                
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-pagination v-model="page" :length="pages" rounded="circle" @update:model-value="loadMaterials"></v-pagination>
      </v-col>
    </v-row>
  </v-container>



  <!-- 側邊欄 -->
  <v-navigation-drawer class="bg-primary b-1 text-center" width="300">
    <!-- 新增需求對話框 -->
    <resourceDialog type="find" @update="loadMaterials"></resourceDialog>
    <!-- 搜尋欄 -->
    <v-responsive >
      <v-text-field
      variant="outlined"
      label="搜尋"
      prepend-inner-icon="mdi-magnify"
      hide-details
      single-line
      density="comfortable"
      clearable
      width="250" 
      class="bg-white mx-auto mt-5 my-5"
      v-model="searchQuery"
      >
      </v-text-field>
    </v-responsive>
    <v-list-item class="text-h5 font-weight-black text-left ml-2">物資類別</v-list-item>
    <v-divider thickness="2" length="250" class="mx-auto"></v-divider>
    <!-- 物資分類 -->
    <v-container>
      <v-checkbox
        v-model="allSelected"
        label="所有物品"
        @change="selectAll()"
        hide-details
        density="comfortable"
      ></v-checkbox>

      <v-checkbox
        v-for="category in categories"
        :key="category.name"
        v-model="category.selected"
        :label="category.name"
        @change="filterItems"
        hide-details
        class="ml-5 "
        density="comfortable"
      ></v-checkbox>
    </v-container>
  </v-navigation-drawer>
        







</template>
<script setup>
import { ref, computed, watch } from 'vue';
import { definePage } from 'vue-router/auto'
import { useApi } from '@/composables/axios'
import { useSnackbar } from 'vuetify-use-dialog'
import { useDisplay } from 'vuetify'
const { mobile } = useDisplay()
const { api } = useApi()
const createSnackbar = useSnackbar()
definePage({
  meta: {
    title: 'KeeperS | 我要募資'
  }
})


const items=ref([
{
    title: '首頁',
    disabled: false,
    to: '/',
  },
  {
    title: '我要募資',
    disabled: true,
  }
])
const categories = ref([
    { name: '食品', selected: false },
    { name: '服飾配件', selected: false },
    { name: '日用品', selected: false },
    { name: '家具', selected: false },
    { name: '輔具', selected: false },
    { name: '教育用品', selected: false },
    { name: '嬰幼兒用品', selected: false },
    { name: '電器', selected: false },
    { name: '休閒用品', selected: false },
    { name: '其他', selected: false }
    // 添加其他分類
  ]);
  


  const allSelected = ref(true); // 用於追蹤是否所有類別都被選中
  const filteredItems = ref([]); // 用於存儲篩選後的項目
  
  const searchQuery = ref('')


const filterItems = () => {
  // 獲取選中的分類
  const selectedCategories = categories.value
    .filter(category => category.selected)
    .map(category => category.name);
    const query = searchQuery.value?searchQuery.value.toLowerCase():''; // 將搜尋查詢轉換為小寫

  if (allSelected.value) {
    // 如果「所有物品」被勾選，顯示所有符合搜尋查詢的項目
    filteredItems.value = provides.value.filter(provide => {
      // 物資名字和機構名字是否包含查詢的內容
      return provide.name.toLowerCase().includes(query) ||
      provide.organizer.toLowerCase().includes(query);
    });
  } else {
    // 如果「所有物品」未勾選
    if (selectedCategories.length === 0 && query.trim() === '') {
      // 如果沒有選擇任何分類且搜尋欄為空，顯示空陣列
      filteredItems.value = [];
    } else {
      // 如果有選中的分類，則根據選中的分類和搜尋查詢過濾項目
      filteredItems.value = provides.value.filter(provide => {
        const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(provide.category);
        const matchesSearchQuery = provide.name.toLowerCase().includes(query) || 
        provide.organizer.toLowerCase().includes(query);
        return matchesCategory && matchesSearchQuery;
      });
    }
  }
};

watch(searchQuery, () => {
  filterItems(); // 當搜尋查詢變化時重新過濾項目
});

// 監聽分類選擇狀態的變化
watch(
  () => categories.value.map(category => category.selected),
  () => {
    filterItems(); // 當分類選擇狀態變化時重新過濾項目
    // 更新 allSelected 的值，判斷是否所有類別都被選中
    allSelected.value = categories.value.every(category => category.selected);
  },
  { deep: true } // 深度監聽，監聽 categories 中每個 category 的 selected 屬性
);

const selectAll = () => {
  // 根據 allSelected 的值設置所有類別的 selected 狀態
  categories.value.forEach(category => {
    category.selected = allSelected.value;
  });
  filterItems(); // 全選或取消全選後重新過濾項目
};
onMounted(() => {
  selectAll(true); // 當組件首次加載時，設置所有選項為勾選狀態
});




const handleClick = (category, toggle) => {
  if (allSelected.value) {
    // 若之前是全選狀態,現在取消某個類別
    allSelected.value = false;
    categories.value.forEach(cat => {
      cat.selected = cat === category;
    });
  } else {
    category.selected = !category.selected;
    allSelected.value = categories.value.every(cat => cat.selected);
  }
  toggle();
  filterItems();
};


const handleAllClick = (toggle) => {
  allSelected.value = !allSelected.value;
  categories.value.forEach(category => {
    category.selected = allSelected.value;
  });
  if (toggle) toggle();
  filterItems();
};









const page = ref(1) // 現在第幾頁
const pages = ref(1) // 全部有幾頁
const ITEMS_PER_PAGE = 8

const provides = ref([])

// 加載物資資料
const loadMaterials = async () => {
  try {
    const { data } = await api.get('/material/find', { // 從後端取得商品資訊
      params: { 
        itemsPerPage: ITEMS_PER_PAGE, // 傳參數過去讓後端知道一頁有幾個
        page: page.value
      }
    })
    pages.value = Math.ceil(data.result.total / ITEMS_PER_PAGE) // 總頁數 = 總商品數量 / 每頁數量
    provides.value.splice(0, provides.value.length, ...data.result.data) // 更新前端的商品列表
    filterItems()
    console.log(provides)
    console.log(provides.value)
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
loadMaterials()







</script>
<style scoped>

.v-card{
  max-width: 650px;
  max-height: 300px;
}
.item-img{
  width: 85%;
  aspect-ratio: 1; 
}
@media (min-width: 960px) and (max-width: 1280px) {
  .item-img{
    margin-left: 30px;
  width: 90%;
}
}
@media (min-width: 600px) and (max-width: 960px) {
  .item-img{
    margin-left: 50px;
    width: 65%;
}
}
.b-1{
  border: 1px solid #7a7a7a;
}
.v-row{
    height: 300px;
}
#button{
    position: relative;
    top: 35%;
    left: 60%;
}
::v-deep .v-breadcrumbs{
  padding:8px 12px 6px 12px ;
}
.v-divider{
  margin: 0px 0 1rem 80px;
}
</style>