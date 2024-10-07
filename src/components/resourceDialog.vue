<template>
  <v-btn
    @click="openDialog(null)"
    class="rounded-lg bg-info b-1 font-weight-black text-body-1 mt-10"
    prepend-icon="mdi-plus"
    variant="text"
    height="50"
    width="150"
    id="create"
    :ripple="false"
    >{{cardTitle}}
</v-btn>
<v-dialog max-width="600" v-model="dialog">
    <v-card>
        <v-container>
            <v-card-title class="font-weight-black text-center text-h4">{{cardTitle}}</v-card-title>   
            <v-card-text>
                <v-form @submit.prevent="submit" :disabled="isSubmitting">
                    <v-row>
                        <v-col >
                            <!-- plugins > index.js 要先引入套件 -->
                            <vue-file-agent
                                v-model="fileRecords"
                                v-model:raw-model-value="rawFileRecords"
                                accept="image/jpeg,image/png"
                                deletable
                                max-size="1MB"
                                help-text="選擇檔案或拖曳到這裡"
                                :error-text="{ type: '檔案格式不支援', size: '檔案大小不能超過 1MB' }"
                                ref="fileAgent"
                            ></vue-file-agent>
                        </v-col>
                    </v-row>
                    <v-row>
                        <!-- 物資名稱 -->
                        <v-col cols="12" md="3" class="my-auto text-left ps-6">
                        <label class="form-label">物資名稱</label>
                        </v-col>
                        <v-col cols="12" md="9">
                            <inputText
                            v-model="name.value.value"
                            :error-messages="name.errorMessage.value"
                            />
                        </v-col>
                        <!-- 需求量 -->
                        <v-col cols="12" md="3" class="my-auto text-left ps-6">
                        <label class="form-label">{{numberTitle}}</label>
                        </v-col>
                        <v-col cols="12" md="9">
                            <inputText
                            type="number"
                            min="0"
                            v-model=" quantity.value.value"
                            :error-messages=" quantity.errorMessage.value"
                            />
                        </v-col>
                        <!-- 物資類別 -->
                        <v-col cols="12" md="3" class="my-auto text-left ps-6">
                        <label class="form-label">物資類別</label>
                        </v-col>
                        <v-col cols="12" md="9">
                            <v-select
                                v-model=" category.value.value"
                                :error-messages=" category.errorMessage.value"
                                label="選擇" 
                                variant="outlined" 
                                density="comfortable" 
                                dense
                                :items="categories"
                                hide-details
                            ></v-select>
                        </v-col>
                        <!-- 需求介紹 -->
                        <v-col cols="12" md="3" class="my-auto text-left ps-6">
                            <label class="form-label" >{{descriptionTitle}}</label>
                        </v-col>
                        <v-col cols="12" md="9">
                            <inputText
                            v-model=" description.value.value"
                            :error-messages=" description.errorMessage.value"
                            />
                        </v-col>
                        <!-- 單位名稱 -->
                        <v-col cols="12" md="3" class="my-auto text-left ps-6">
                        <label class="form-label">單位名稱</label>
                        </v-col>
                        <v-col cols="12" md="9">
                            <inputText
                            v-model="organizer.value.value"
                            :error-messages="organizer.errorMessage.value"
                            />
                        </v-col>
                    </v-row>
                    <v-card-actions>
                        <div class="mx-auto">
                        <v-btn variant="text"class="rounded-xl b-1 bg-accent" density="comfortable" type="submit" :loading="isSubmitting">送出</v-btn>
                        <v-btn
                        text="取消"
                        variant="text"
                        class="rounded-xl b-1 bg-info"
                        density="comfortable"
                        @click="closeDialog()"
                        ></v-btn>
                    </div>
                </v-card-actions>
                </v-form>
            </v-card-text>
        </v-container>
    </v-card>
</v-dialog>

</template>
<script setup>
import { ref } from 'vue'
import * as yup from 'yup'
import { useForm, useField } from 'vee-validate'
import { useApi } from '@/composables/axios'
import { useSnackbar } from 'vuetify-use-dialog'
const emit =defineEmits(["update"])
const { apiAuth } = useApi()
const createSnackbar = useSnackbar()


const props = defineProps({
 cardTitle: {
     type: String,
     default: '發布需求'
 },
 numberTitle:{
     type:String,
     default:'需求量'
 },
 descriptionTitle:{
     type:String,
     default:'需求介紹'
 },
 type: { // **新增 type prop**
 type: String,
 default: 'share'
}
});
const categories = ['食品', '服飾配件', '日用品', '家具', '輔具', '教育用品', '嬰幼兒用品', '電器', '休閒用品', '其他']



const dialog = ref(false)
const openDialog = (item) => {
dialog.value = true
}

const closeDialog = () => {
dialog.value = false
resetForm()
fileAgent.value.deleteFileRecord() 
}

// 上傳圖片
const fileAgent = ref(null)
const fileRecords = ref([]) // 綁定處理後的文件記錄
const rawFileRecords = ref([]) // 綁定原始文件記錄


const schema = yup.object({
name: yup
 .string()
 .required('物品名稱必填'),
quantity: yup
 .number()
 .min(1, '物品數量不符')
 .required('物品數量必填'),
category: yup
 .string()
 .required('物品分類必填')
 // 自訂驗證規則，檢查分類是否在預定一的 categories 中
 // isCategory 驗證名稱可自定義，第二個是錯誤訊息，第三個是驗證的function
 .test('isCategory', '商品分類錯誤', value => {
   return categories.includes(value) // 分類的陣列有沒有包含這個值
 }),
description: yup
 .string()
 .required('物資介紹必填'),
organizer: yup
 .string()
 .required('單位名稱必填'),
})


const { handleSubmit, isSubmitting, resetForm } = useForm({
// validationSchema 用於驗證表單的各個字段，確保所有字段都符合預期的格式和要求
// 定義表單的驗證格式是上面定義的東東
validationSchema: schema,
// initialValues  定義表單的初始值(表單在第一次渲染時會有預設的值)
initialValues: {
 name: '', 
 quantity: '0', // 初始值是0
 category: '',
 description: '',
 organizer:''
}
})
const name = useField('name')
const quantity = useField('quantity')
const category = useField('category')
const description = useField('description')
const organizer = useField('organizer')

const submit = handleSubmit(async (values) => {
// ?.沒選檔案的時候是undefined，if不會過 > return
if (fileRecords.value[0]?.error) return 
if (fileRecords.value.length < 1) return
// 建立 FormData 物件並添加要上傳的資料

try {
 // 要先建立 FormData 物件，然後把東西放進去
 // 用append方法把要放進formdata的資料放進去
 const fd = new FormData()
 // fd.append(key, value)
 fd.append('name', values.name)
 fd.append('quantity', values.quantity)
 fd.append('category', values.category)
 fd.append('description', values.description)
 fd.append('organizer', values.organizer)
 fd.append('type',  props.type)
 if (fileRecords.value.length > 0) {
   fd.append('image', fileRecords.value[0].file)
 }
 console.log(fd)
 await apiAuth.post('/material', fd) 
 createSnackbar({
   text: '新增成功' ,
   snackbarProps: {
     color: 'green'
   }
 })

 emit("update")
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









</script>
<style scoped>
.b-1{
border: 1px solid #7a7a7a;
}
.form-label{
 font-size: 20px;
 font-weight: bold;
 color: rgb(80, 80, 80);
}


</style>