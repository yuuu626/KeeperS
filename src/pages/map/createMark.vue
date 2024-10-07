<template>
    <v-container>
      <!-- 麵包屑 -->
      <v-breadcrumbs :items="items">
          <template v-slot:divider>
          <v-icon icon="mdi-chevron-right"></v-icon>
          </template>
      </v-breadcrumbs>
    </v-container>
    <!-- 地圖 -->


    <v-row style="height: 95vh;">
      <v-col cols="12" lg="8" class="map_col order-2 order-lg-1">
        <div id="map" ref="map" ></div>
      </v-col >
      <v-col cols="12" lg="4" class="map_col order-1 order-lg-2">
        <v-card  variant="outlined" class="overflow-y-auto find-resource">
        <v-toolbar color="secondary bb-1" prominent >
            <v-toolbar-title >
                新增資源
            </v-toolbar-title>
        </v-toolbar>
        <div class="px-6">
            <v-form @submit.prevent="submit" :disabled="isSubmitting">
                <Search class="mx-auto my-5" 
                max-width="1000px"
                v-model="address"
                :error-messages="addressError "
                label="輸入資源地址"
                ></Search>
                <v-row class="my-5">
                    <!-- 服務名稱 -->
                    <v-col cols="12" md="3" class="my-auto text-left ps-6">
                    <label class="form-label">服務名稱</label>
                    </v-col>
                    <v-col cols="12" md="9">
                        <inputText 
                        v-model="name.value.value"
                        :error-messages="name.errorMessage.value"
                        />
                    </v-col>
                    <!-- 服務電話 -->
                    <v-col cols="12" md="3" class="my-auto text-left ps-6">
                    <label class="form-label">服務電話</label>
                    </v-col>
                    <v-col cols="12" md="9">
                        <inputText 
                        v-model="tel.value.value"
                        :error-messages="tel.errorMessage.value"
                        />
                    </v-col>
                    <!-- 服務類別 -->
                    <v-col cols="12" md="3" class="my-auto text-left ps-6">
                    <label class="form-label">服務類別</label>
                    </v-col>
                    <v-col cols="12" md="9" class="my-auto">
                        <v-select
                        :items="clients"
                        label="服務類別"
                        density="comfortable"
                        variant="outlined"
                        v-model="cl.value.value"
                        :error-messages="cl.errorMessage.value"
                        hide-details
                        
                        >
                        </v-select>
                    </v-col>
                        <!-- 服務項目 -->
                        <v-col cols="12" md="3" class="mt-2 text-left ps-6">
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
                    <v-col cols="12" md="3" class="text-left ps-6">
                        <label class="form-label">服務介紹</label>
                    </v-col>
                    <v-col cols="12" md="9">
                        <v-textarea 
                        style="white-space: pre-line;"
                        variant="outlined" clearable
                        v-model="description.value.value"
                        :error-messages="description.errorMessage.value"
                        ></v-textarea>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col class="text-center" >
                        <submitButton type="submit" class="b-1 bg-accent  mb-8" @click="addMarker"></submitButton>
                    </v-col>
                </v-row>
            </v-form>
        </div>
    </v-card>
      </v-col>
    </v-row>

</template>
<script setup>
import { ref, onMounted } from 'vue';
import * as yup from 'yup'
import { useForm, useField } from 'vee-validate'
import { useRoute } from 'vue-router'
import { useApi } from '@/composables/axios'
import { useSnackbar } from 'vuetify-use-dialog'
import axios from 'axios';
import { definePage } from 'vue-router/auto'

import * as L from 'leaflet';


import "leaflet/dist/leaflet.css";
import Search from '@/components/search.vue';

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
    title: '新增資源',
    disabled: true,
  }
])


const client = ['長期照顧','身心障礙','婦女','兒童及少年','心理衛生','保護性服務','社會救助','綜合','其他']
const care = ['日照中心','護理之家','居家服務','交通接送','家庭托顧']
const disability =['身心障礙者服務中心','輔具中心','職業重建中心','小作所','庇護工場']
const child = ['少年福利服務中心','親子館','課後班']
const assistance = ['經濟補助','待用餐','基金會','社會福利中心']
const women = ['婦女福利服務中心','新住民家庭服務中心']

const clients = ref(['長期照顧','身心障礙','婦女','兒童及少年','心理衛生','保護性服務','社會救助','綜合','其他'])

// const safetyNet = ['衛政','社政','警政','勞政','司法','教育']
definePage({
meta: {
title: 'KeeperS | 新建資源'
}
})




const schema = yup.object({
  name: yup
    .string()
    .required('服務單位必填'),
address: yup
    .string()
    .required('服務地址必填'),
tel: yup
    .string(),
cl:yup
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
    cl:'',
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
const cl = useField('cl')
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
  // Leaflet map reference
const initialMap = ref(null);
// const address = ref('');
// const name = ref('');
// const tel = ref('');
// const description = ref('');

// 用來存取地址轉換的經緯度(要傳到資料庫的)
const latitude = ref(null);
const longitude = ref(null);
onMounted(() => {
// Initialize Leaflet map
initialMap.value = L.map('map').setView([25.049183268037577, 121.51342818384893], 12);


L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(initialMap.value);
});

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

const normalizeAddress = (address) => {
  // 替换常见的繁体字和简体字
  return address.replace(/臺北市/g, '台北市');
};


// 新增地標資料到後端資料庫
const submit = handleSubmit(async (values) => {
  try {
    const normalizeAddress = (address) => {
  // 替换常见的繁体字和简体字
  return address.replace(/臺北市/g, '台北市');
};
const normalizedAddress = normalizeAddress(address.value);
    console.log(normalizeAddress)
    // 更新地址值
    address.value = normalizedAddress;
    console.log(address.value)    
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
        cl:values.cl,
        categories: categories,
        description:values.description,
        lat: latitude.value, 
        lng: longitude.value 
    }
    console.log(data)
    await apiAuth.post('landmark/', data) 
    createSnackbar({
      text: '新增成功' ,
      snackbarProps: {
        color: 'green'
      }
    })
    initialMap.value.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        initialMap.value.removeLayer(layer);
      }
    });
// 在地圖上添加新標註
const icon = categoryIcons[values.cl] || categoryIcons['綜合'];
    const marker = L.marker([latitude.value, longitude.value], { icon })
      .bindPopup(
        `<h2 style="margin:5px 0 5px 0;text-decoration: underline;">${values.name}</h2>
        <h3 style="margin: 2px 0 2px 0;color:gray;">地址：${values.address}</h3>
        <h3 style="margin: 2px 0 2px 0;color:gray;">電話：${values.tel}</h3>
        <h4 style="margin: 2px 0 2px 0;color:gray;">類別：${categories.join(' | ')}</h4>
        <p style="margin: 2px 0 2px 0;color:gray;">簡介：<br>${values.description}</p>`,
        {
          className: 'custom-popup-class',
          maxWidth: 400,
          minWidth: 100,
          maxHeight: 250,
          minHeight: 100,
          closeOnClick: false,
          autoPan: true
        }
      )
      .addTo(initialMap.value)
      marker.openPopup()
    // 重置表單
    resetForm();


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

const categoryIcons =  {
  '服務對象': L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/2377/2377871.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  }),
  '長期照顧': L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/12264/12264430.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  }),
  '身心障礙': L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/17573/17573294.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  }),
  '兒童及少年': L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/5759/5759522.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  }),
  '心理衛生': L.icon({
    iconUrl:'https://cdn-icons-png.flaticon.com/512/4010/4010654.png',
    // iconUrl: 'https://cdn-icons-png.flaticon.com/512/1090/1090903.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  }),
  '婦女': L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/7457/7457069.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  }),
  '社會救助': L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/784/784791.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  }),
  '綜合': L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/5153/5153858.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  }),
  '其他': L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/5672/5672993.png',
    // iconUrl: 'https://cdn-icons-png.flaticon.com/512/3010/3010860.png',
    // https://cdn-icons-png.flaticon.com/512/2684/2684763.png
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  })
};



// 取得後端所有地標資料
const marks = ref([])
const loadMap = async () => {
  try {
    const { data } = await apiAuth.get('/landmark');
    marks.value.splice(0, marks.value.length, ...data.result.data); // 更新前端的商品列表
    console.log(data)
    
    // 清空地圖上的所有現有標註
    initialMap.value.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        initialMap.value.removeLayer(layer);
      }
    });
    console.log(marks.value)
    // 在地圖上添加地標標註


    
    marks.value.forEach((mark) => {
        const cl = mark.cl
        const icon = categoryIcons[cl] || categoryIcons['綜合']
      L.marker([mark.lat, mark.lng], { icon })
        .bindPopup(
        `<h2 style="margin:5px 0 5px 0;text-decoration: underline;">${mark.name}</h2>
        <h3 style="margin: 2px 0 2px 0;color:gray;">${mark.address}</h3>
        <h3 style="margin: 2px 0 2px 0;color:gray;">${mark.tel}</h3>
        <h4 style="margin: 2px 0 2px 0;color:gray;">類別：${mark.categories.join(' | ') }</h4>
        <p style="margin: 2px 0 2px 0;color:gray;">簡介：<br>${mark.description}</p>`
        ,
          {
            className: 'custom-popup-class',
            maxWidth: 400, // 設置最大寬度
            minWidth: 100, // 設置最小寬度
            maxHeight: 250, // 設置最大高度
            minHeight: 100,
            closeOnClick: false, 
          autoPan: false  
          }
        )
        .addTo(initialMap.value);
    });
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
loadMap();




</script>
<style scoped>
.map_col{
    position: relative;
    height: 60%;
    width: 100%;
  }
@media(min-width:1280px){
  .map_col{
    position: relative;
    height: 100%;
    width: 100%;
  }
}
.find-resource{
  height: 80%;
  min-width: 450px;
  width: 80%;
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%,-40%);
  
}

@media(min-width:1280px){
  .find-resource{
    height: 75%;
    top: 20%;
    left: 42%;
    transform: translate(-50%,-20%);
  }
}




#map {
  min-width: 450px;
  width:80%;
  height: 85%;
  border: 1px solid #000;
  border-radius: 15px;
  position: absolute;
  top: 10%;
  left: 50%;
  transform: translate(-50%,-10%);
}

@media(min-width:1280px){
  #map{
    height: 75%;
    position: absolute;
    top: 20%;
    left: 80%;
    transform: translate(-80%,-20%);
  }
}
/* #map {
width: 50%;
height: 650px;
border: 1px solid #000;
border-radius: 15px;
position: absolute;
top: 18%;
left: 12%;
} */
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
p{
    color:rgb(94, 94, 94);
}
/* .v-col{
    padding: 5px 10px 5px 10px;
} */
.form-label{
 font-size: 18px;
 font-weight: bold;
 color: rgb(80, 80, 80);
}
</style>