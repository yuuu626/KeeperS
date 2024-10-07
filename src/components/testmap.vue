<template>
    <v-container>
        <search v-model="address" max-width="1000"/>
      <!-- <v-text-field v-model="address" label="Enter Address"></v-text-field> -->
      <v-btn @click="addMarker">新增</v-btn>
      <div id="map" ref="map" style="height: 500px;"></div>
    </v-container>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import "leaflet/dist/leaflet.css";
  import * as L from 'leaflet';
  
  // Google Maps API Key
  const googleMapsApiKey = 'AIzaSyAyML8H2ENbc_kzs_ZSI6qYf7CCbBt0dAA';
  
  // Leaflet map reference
  const initialMap = ref(null);
  const address = ref('');
  
  onMounted(() => {
    // Initialize Leaflet map
    initialMap.value = L.map('map').setView([25.044323702498108, 121.41975163438377], 12);
  
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(initialMap.value);
  });
  
  const addMarker = async () => {
    if (!address.value) {
      alert('Please enter an address');
      return;
    }
  
    // Google Maps Geocoding API URL
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address.value)}&key=${googleMapsApiKey}`;
  
    try {
      const response = await axios.get(geocodeUrl);
      const data = response.data;
  
      if (data.results && data.results.length > 0) {
        const lat = data.results[0].geometry.location.lat;
        const lng = data.results[0].geometry.location.lng;
  
        // Define a custom icon for the marker
        const greenIcon = new L.Icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        });
  
        // Add a marker to the Leaflet map
        L.marker([lat, lng], { icon: greenIcon })
          .addTo(initialMap.value)
          .bindPopup(`<h2>服務單位:</h2><p>${address.value}</p>`)
          .openPopup();
      } else {
        alert('No location found');
      }
    } catch (error) {
      console.error('Error fetching geocoding data:', error);
      alert('Failed to add marker');
    }
  };
  </script>
  
  <style scoped>
  #map {
    width: 50%;
    height: 60%;
    border: 1px solid #000;
    border-radius: 25px;
    position: absolute;
    top: 30%;
    left: 12%;
  }
  </style>



<!-- Nominatim API -->
<!-- <template>
    <v-container>
      <v-text-field v-model="address" label="Enter Address"></v-text-field>
      <v-btn @click="addMarker">Add Marker</v-btn>
      <div id="map" ref="map"></div>
    </v-container>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import "leaflet/dist/leaflet.css";
  import * as L from 'leaflet';
  
  const initialMap = ref(null);
  const address = ref('');
  
  onMounted(() => {
    initialMap.value = L.map('map').setView([25.044323702498108, 121.41975163438377], 12);
  
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(initialMap.value);
  });
  
  const addMarker = async () => {
    if (!address.value) {
      alert('Please enter an address');
      return;
    }
  
    // 使用 Nominatim API 進行地理編碼
    const geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address.value)}`;
  
    try {
      const response = await axios.get(geocodeUrl);
      const data = response.data;
  
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
  
        const greenIcon = new L.Icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        });
  
        L.marker([lat, lng], { icon: greenIcon })
          .addTo(initialMap.value)
          .bindPopup(`<h2>New Landmark</h2><p>${address.value}</p>`)
          .openPopup();
      } else {
        alert('No location found');
      }
    } catch (error) {
      console.error('Error fetching geocoding data:', error);
      alert('Failed to add marker');
    }
  };
  </script>
  
  <style scoped>
  #map {
    width: 50%;
    height: 65%;
    border: 1px solid #000;
    border-radius: 25px;
    position: absolute;
    top: 30%;
    left: 12%;
  }
  </style> -->
  