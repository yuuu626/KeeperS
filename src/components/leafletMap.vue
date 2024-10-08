<template>
  <v-container>
    <div id="map" ref="map"></div>
  </v-container>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import "leaflet/dist/leaflet.css";
import 'leaflet.locatecontrol/dist/L.Control.Locate.css'; // 导入 CSS
import * as L from 'leaflet';
import 'leaflet.locatecontrol'; // 导入插件
import 'leaflet.markercluster';
import { useApi } from '@/composables/axios'
import { useSnackbar } from 'vuetify-use-dialog'
import '@fortawesome/fontawesome-free/css/all.min.css';

const createSnackbar = useSnackbar()
const initialMap = ref(null);
const markers = ref([]);
const marks = ref([]);

const { api } = useApi()

// 接收從父組件傳來的搜尋字串
const props = defineProps({
  searchQuery: {
    type: String,
    default: ''
  },
  selectedCity: {
    type: String,
    default: null
  },
  selectedArea: {
    type: String,
    default: null
  },
  selectedSubcategories: {
    type: Array,
    default: () => []
  },
  selectedclient: {
    type: String,
    default: null
  }
});
// 地圖初始化和地標加載
const initializeMap = () => {
  initialMap.value = L.map('map').setView([25.049183268037577, 121.51342818384893], 12);

  if (initialMap.value) {
    
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(initialMap.value);

    // 確保移除舊的定位控件
    initialMap.value.eachLayer(layer => {
      if (layer instanceof L.Control.Locate) {
        initialMap.value.removeControl(layer);
      }
    });


    L.control.locate({
      position: 'topleft',
      drawCircle: true, // 以位置為中心一定距離的圓
      drawMarker: true,
      markerStyle: { // 設置標記的樣式
        color: 'black',
        opacity: 0.8,
        weight: 0.8
      },
        locateOptions: { // 配置定位的選項
        enableHighAccuracy: true,
        maxZoom: 16
        },
      icon: 'fa fa-solid fa-crosshairs', // 設置定位標記的icon
      onLocationError: function (err) {
        console.error(err.message);
        createSnackbar({
          text: err.message,
          snackbarProps: {
            color: 'red',
          },
        });
      }
    }).addTo(initialMap.value);
  } else {
    console.error('Map initialization failed.');
  }
};
  // const Now = new L.Icon({
  //   iconUrl: 'https://cdn-icons-png.flaticon.com/512/3138/3138736.png',
  //   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  //   iconSize: [40, 41],
  //   iconAnchor: [12, 41],
  //   popupAnchor: [1, -34],
  //   shadowSize: [41, 41]
  // });

  // // 獲取使用者位置
  // if (navigator.geolocation) {
  //   navigator.geolocation.getCurrentPosition( // web API 用於獲取用戶當前位置
  //     (position) => {
  //       const lat = position.coords.latitude;
  //       const lng = position.coords.longitude;
  //       L.marker([lat, lng], { icon: Now })
  //         .addTo(initialMap.value) // 標記放到地圖上
  //         .bindPopup('<h2>目前位置</h2>')
  //         .openPopup();
  //       initialMap.value.setView([lat, lng], 12);
  //     },
  //     (error) => {
  //       console.error('Error getting user location:', error);
  //     }
  //   );
  // } else {
  //   console.warn('Geolocation is not supported by this browser.');
  // }

const loadMapData = async () => {
  try {
    const { data } = await api.get('/landmark');
    console.log(data)
    marks.value = data.result.data;
    updateMarkers();
    console.log(marks.value)
  } catch (error) {
    console.error('Error fetching data:', error);
    createSnackbar({
      text: error?.response?.data?.message || '發生錯誤',
      snackbarProps: {
        color: 'red',
      },
    });
  }
};


const categoryIcons = {
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



// 更新標記 (包括篩選功能)
const updateMarkers = () => {
  if (!initialMap.value) return;

  // 清除现有的标记
  markers.value.forEach(marker => initialMap.value.removeLayer(marker));
  markers.value = [];

  // 过滤数据
  const filteredMarks = marks.value.filter(item => {
    // 根据筛选条件进行过滤
    const matchesCity = !props.selectedCity || item.address.includes(props.selectedCity);
    const matchesArea = !props.selectedArea || item.address.includes(props.selectedArea);
    const matchsQuery = !props.searchQuery || item.name.toLowerCase().includes(props.searchQuery.toLowerCase()) 
    const matchesSubcategory = props.selectedSubcategories.length === 0 ||
      item.categories.some(subcat => props.selectedSubcategories.includes(subcat));
    
    return matchesCity && matchesArea && matchesSubcategory && matchsQuery
  });

  // 遍历过滤后的数据并添加标记
  filteredMarks.forEach(item => {
    const lat = parseFloat(item.lat);
    const lng = parseFloat(item.lng);
    const cl = item.cl; // 取出类别
    const icon = categoryIcons[cl] || categoryIcons['綜合']; // 默认图标为 '綜合'

    if (isFinite(lat) && isFinite(lng)) {
      const marker = L.marker([lat, lng], { icon })
        .addTo(initialMap.value)
        .bindPopup(`<h2 style="margin:5px 0 5px 0;text-decoration: underline;color:#1b3f63;">${item.name}</h2>
        <h3 style="margin: 2px 0 2px 0;color:gray;">地址：${item.address}</h3>
        <h3 style="margin: 2px 0 2px 0;color:gray;">電話：${item.tel}</h3>
        <span style="font-size: 1.17em;font-weight: bold;color:gray;">類別：</span><span style="font-size: 1.17em;font-weight: bold;margin: 2px 0 2px 0;color:#7b97a6;">${item.categories.join(' | ') }</span>
        <div><span style="font-size: 1.17em;font-weight: bold;color:gray;">簡介：</span><h4 style="margin: 2px 0 2px 0;color:gray;white-space: pre-line;">${item.description}</h4></div>`);
      
      markers.value.push(marker);
    } else {
      console.warn(`Invalid coordinates for item: ${JSON.stringify(item)}`);
    }
  });
};
// 監聽搜尋字串變化
watch(() => [props.searchQuery, props.selectedCity, props.selectedArea, props.selectedSubcategories, props.selectedclient], updateMarkers);

onMounted(async () => {
  initializeMap();
  await loadMapData();
});



</script>

<style scoped>
#map{
    min-width: 450px;
    width:100%;
    height: 100vh;
    border: 1px solid #000;
  }
@media(min-width:960px){
  #map {
    min-width: 450px;
    border: 1px solid #000;
    border-radius: 15px;
    position: absolute;
    top: 10%;
    left: 50%;
    transform: translate(-50%,-10%);
  }
}

@media(min-width:1280px){
  #map{
    width: 85%;
    height: 75%;
    position: absolute;
    top: 50%;
    left: 80%;
    transform: translate(-80%,-50%);
  }
}
::v-deep .leaflet-popup {
  background-color: white;
  border: 1px solid #000; /* 邊框顏色 */
  border-radius: 5px; /* 邊框圓角 */
}

::v-deep .leaflet-popup-content{
  color:rgb(85, 85, 85);
}


</style>



