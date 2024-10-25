<template>
  <v-card flat >
    <v-form @submit.prevent="submit" :disabled="isSubmitting" >
      <v-card-text class="pa-0 pa-sm-2">
        <div class="b-1 account-container text-center rounded-lg mx-auto">
          <v-toolbar color="info" class="mb-10 rounded-t-lg bb-1" prominent>
            <v-toolbar-title class="ms-0 font-weight-bold"  style="font-size:23px;color: #616161;">基本資料</v-toolbar-title>
          </v-toolbar>
          <vue-file-agent
            id="account"
            class="d-flex justify-center mb-5"
            accept="image/jpeg,image/png"
            deletable
            max-size="1MB"
            help-text="上傳大頭照"
            :error-text="{ type: '檔案格式不支援', size: '檔案大小不能超過 1MB' }"
            v-model="fileRecords"
            v-model:raw-model-value="rawFileRecords"
            ref="fileAgent"
          ></vue-file-agent>

          <!-- <template v-for="item in files" :key="item.id">
            <div id="img" style="width: 170px; height: 170px;" class="rounded-circle d-flex justify-center align-center bg-grey-lighten-5 mx-auto my-5 b-1" >
              <v-img  :src="item.avatar" cover></v-img>
            </div>
            <div id="upload">編輯</div>
            
          </template> -->
          
          <!-- :files="files" 將 files 屬性綁定到該組件，用於顯示預設圖片或上傳的圖片 -->
          <v-container>
            <v-row class="text-left justify-center">
              <v-col cols="0" md="1" lg="2"></v-col>
              <v-col cols="4" md="3" lg="3" class=" info-text my-auto pl-5 pl-sm-13 pl-md-0 pl-lg-12">服務單位</v-col>
              <template v-for="item in files" :key="item.id" >
                <v-col cols="5" md="4" lg="4" class="px-0 my-auto">
                  <p v-if="!item.isEditing" style="color: #616161;"  class="info-text pl-4 pl-md-0">
                    {{ item.username }}
                  </p>
                  <v-text-field
                    v-else
                    class="my-auto"
                    variant="outlined"
                    single-line
                    density="compact"
                    clearable
                    dense
                    v-model="newUsername"
                    :error-messages="usernameError"
                    @keydown.enter="saveChanges(item)"
                    hide-details
                  ></v-text-field>
                </v-col>
                <v-col cols="3" md="2" lg="2" class="text-center text-sm-left" >
                  <v-btn
                    @click="toggleEdit(item)"
                    icon="mdi-pencil"
                    variant="text"
                    color="blue-grey-darken-1"
                  ></v-btn>
                </v-col>
              </template>
              <v-divider></v-divider>
            </v-row>


            
            <v-row class="text-left justify-center ">
              <v-col cols="0" md="1" lg="2"></v-col>
              <v-col cols="4" md="3" lg="3" class="info-text my-auto pl-5 pl-sm-13 pl-md-0 pl-lg-12">電子信箱</v-col>
              <template v-for="item in files" :key="item.id">
                <v-col cols="5" md="4" lg="4" class="px-0 my-auto">
                  <p style="color: #616161;" class="info-text pl-4 pl-md-0">
                    {{ item.email }}
                  </p>
                </v-col>
              </template>
              <v-col cols="3" md="2" lg="2" class="text-center">
                  <v-btn
                    @click="passwordtoggleEdit(item)"
                    icon="mdi-pencil"
                    variant="text"
                    color="transparent"
                    disabled
                  ></v-btn>
                </v-col>
              <v-divider></v-divider>
            </v-row>
            <v-row class="text-left justify-center">
              <v-col cols="0" md="1" lg="2"></v-col>
              <v-col cols="4" md="3" lg="3" class="info-text my-auto pl-5 pl-sm-13 pl-md-0 pl-lg-12">密碼</v-col>
              <template v-for="item in files" :key="item.id">
                <v-col cols="5" md="4" lg="4" class="px-0 my-auto">
                  <!-- 非編輯狀態時顯示原用戶名 -->
                  <p v-if="!item.passwordisEditing" style="color: #616161;" class="info-text pl-4  pl-md-0 ">
                    {{ item.password }}
                  </p>
                  <v-text-field
                    v-else
                    class="info-text"
                    variant="outlined"
                    single-line
                    density="compact"
                    clearable
                    dense
                    v-model="newPassword"
                    :error-messages="passwordError"
                    @keydown.enter="passwordsaveChanges(item)"
                    hide-details
                  ></v-text-field>
                </v-col>
                <v-col cols="3" md="2" lg="2" class="text-center text-sm-left">
                  <v-btn
                    @click="passwordtoggleEdit(item)"
                    icon="mdi-pencil"
                    variant="text"
                    color="blue-grey-darken-1"
                  ></v-btn>
                </v-col>
              </template>
              <v-divider></v-divider>
            </v-row>   
            <v-row>
              <v-col class="my-md-5">
                <AppButton text="提交" class="mx-auto my-1 bg-accent text-body-1 d-inline-block" width="80" height="30"></AppButton>
              </v-col>
            </v-row>
          </v-container>
        </div>
      </v-card-text>
    </v-form>
  </v-card>
</template>

<script setup>
import { ref } from 'vue';
import { useSnackbar } from 'vuetify-use-dialog';
import * as yup from 'yup';
import { useForm, useField } from 'vee-validate';
import { useApi } from '@/composables/axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const { apiAuth } = useApi();
const createSnackbar = useSnackbar();
const fileAgent = ref(null)
const fileRecords = ref([]) // 綁定處理後的文件記錄
const rawFileRecords = ref([])
const files = ref([]);



const loadfile = async () => {
  try {
    const { data } = await apiAuth.get('/user/profile');
    files.value = [data.result];
    files.value[0].password = '********';
    files.value[0].newUsername = files.value[0].username;
    files.value[0].newPassword = ''; // 用於存儲新密碼   
    console.log(files.value)
    // fileRecords.value = [{
    //   urlValue: files.value[0].avatar,
    //   urlResized: null,
    //   // 其他必要的屬性
    // }];


    console.log(fileRecords.value);
  } catch (error) {
    createSnackbar({
      text: error?.response?.data?.message || '發生錯誤',
      snackbarProps: {
        color: 'red',
      },
    });
  }
};
loadfile();

const schema = yup.object({
  newUsername: yup.string().min(3, '服務單位長度不符').max(20, '服務單位長度不符'),
  newPassword: yup.string().min(6, '使用者密碼長度不符').max(20, '使用者密碼長度不符'),
});

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: schema,
});

// useField 會將輸入值綁定到 value 變數
// errorMessage 用來顯示 yup 驗證後的錯誤訊息
const { value: newUsername, errorMessage: usernameError } = useField('newUsername');
const { value: newPassword, errorMessage: passwordError } = useField('newPassword');

const submit = handleSubmit(async () => {
  try {
    const item = files.value[0]; // 用戶的資料
    const fd = new FormData(); // 創建 FormData 對象

    // 添加字段到 FormData 對象
    if (newUsername.value && newUsername.value !== item.username) {
      fd.append('username', newUsername.value);
    }
    if (newPassword.value &&  newPassword.value !== '') {
      fd.append('password', newPassword.value);
    }
    if (fileRecords.value.length !==  0) {
      fd.append('image', fileRecords.value[0].file)
    }
    for (let [key, value] of fd.entries()) {
  console.log(`${key}:`, value);
}
    if (fd.get('username') === null && fd.get('password') === null && fd.get('image') === null) {
      createSnackbar({
        text: '沒有任何變更',
        snackbarProps: {
          color: 'accent',
        },
      });
      return;
    }
    console.log(fd)
    // 發送 PATCH 請求
    const response=await apiAuth.patch('/user/change', fd);
    if (response.data.success) {
      createSnackbar({
      text: '資料修改成功' ,
      snackbarProps: {
        color: 'green'
      }
    })
      router.push('/');
    } else {
      createSnackbar({
        text: response.data.message || '發生錯誤',
        snackbarProps: {
          color: 'red',
        },
      });
    }
  } catch (error) {
    createSnackbar({
      text: error?.response?.data?.message || '發生錯誤',
      snackbarProps: {
        color: 'red',
      },
    });
  }
});
const toggleEdit = (item) => {
  item.isEditing = !item.isEditing;
};

const saveChanges = (item) => {
  item.isEditing = false;
};

const passwordtoggleEdit = (item) => {
  item.passwordisEditing = !item.passwordisEditing;
};

const passwordsaveChanges = (item) => {
  item.passwordisEditing = false;
};


</script>
<style scoped>
.b-1 {
  border: 1px solid #7a7a7a;
}
.bb-1 {
  border-bottom: 1px solid #7a7a7a;
}
::v-deep .vue-file-agent.file-input-wrapper {
  border: none;
}
::v-deep .file-preview-wrapper {
  border-radius: 50%;
  overflow: hidden;
  border: 1px solid #7a7a7a;
}
#account{
  position: relative;
}
#img{
 position: absolute;
 top: 14%;
 left: 50%;
 z-index: 5;
 transform: translate(-50%);
 overflow: hidden;
}
#upload{
  border-radius: 3px;
  border: 1px solid rgb(133, 133, 133);
  color: rgb(133, 133, 133);
  box-shadow: 0.8px 0.8px rgba(94, 94, 94, 0.5);
  width: 40px;
  background: white;
  font-family: "微軟正黑體";
  position: absolute;
  top: 36.5%;
  left: 50%;
  z-index: 8;
  transform: translateX(-50%);
}
.account-container{
  width: 100%;
  min-height: 500px;
}
.info-text{
  font-size: 1.1rem;
  font-weight: bold;
}

@media(min-width:600px){
  .account-container{
    width: 85%;
  }
  .info-text{
    font-size: 1.25rem;
  }
}
@media(min-width:960px){
  .account-container{
    width: 90%;
    min-height: 650px; 
  }
  .info-text{
    font-size: 1.3rem;
  }
}
@media(min-width:1280px){
  .account-container{
    width: 85%;
  }
}
@media(min-width:1500px){
  .account-container{
    width: 80%;
  }
}
@media(min-width:1920px){
  .account-container{
    width: 60%;
  }
}
</style>