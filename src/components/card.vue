<template>
    <router-link :to="'/event/'+ _id" style="text-decoration: none">
    <v-card width="300px" height="400px" variant="flat" color="third" class="b-1">
        <v-card-item class="p-5 text-left">
            <div style="width: 264px;height:264px;" class="d-flex justify-content-center b-1 mt-2 mb-2  bg-white">
                <v-img :src="image" rounded containr></v-img>
            </div>
            <v-card-title class="font-weight-black " style="font-size: 1.1rem;width: 215px;white-space: pre-line;">{{ title }}
            </v-card-title>
            <v-card-subtitle style="width: 200px;" class="font-weight-black" >{{ organizer }}</v-card-subtitle>
            <v-chip density="compact" class="mt-2 me-1"v-for="item in category" :key="item">{{ item }}</v-chip>
            <!-- <v-chip density="compact" class="mt-2 me-1">{{ category }}</v-chip> -->
        </v-card-item>
    </v-card>
</router-link>
</template>
<script setup>
const props = defineProps(['_id','title','date','address','category','organizer','description','image']);



</script>
<style scoped>
.b-1{
  border: 1px solid #7a7a7a;
}
.v-btn{
    position: absolute;
    right: 1%;
    bottom: 21%;
}
</style>