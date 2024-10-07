<template>
<!-- 留言板 -->
<v-row class="mt-10">
  <v-col>
      <div class="b-1 info-margin  text-center text-body-1 pa-2 bg-accent rounded-t-lg font-weight-bold" style="max-width:150px;padding: 0;border-bottom: 0px;">留言板</div>
      <div class="b-1 pa-5 info-margin">
        <v-row v-for="msg in message" :key="msg._id">
          <v-col cols="5">
            <div class="pa-4">
              <div>
                <v-avatar color="primary b-1" class="me-3" size="large">
                  <v-img :src="msg.user.avatar || 'default-avatar-url'"></v-img>
                </v-avatar>
                <span class="ml-1">{{ msg.user.username }}</span>
              </div>
              <div v-if="currentEditingId !== msg._id">
                <!-- 顯示純文字 -->
                <p class="ml-16 text-body-2 d-inline">{{ msg.content }}</p>
                <!-- 編輯按鈕 -->
                <!-- 條件句部分表示留言的id與登入id相同時才會顯示 -->
                <v-btn icon="mdi-pencil" v-if="msg.user._id == currentUser" @click="startEditing(msg._id, msg.content)" variant="text" class="d-inline" color="grey"></v-btn>
                <!-- 刪除按鈕 -->
                <v-btn icon="mdi-delete" v-if="msg.user._id == currentUser" @click="deleteMessage(msg._id)" variant="text" class="d-inline" color="grey"></v-btn>
              </div>
              <div v-else style="width: 800;">
                <v-row class="mt-2 mx-8">
                  <div class="pa-4">
                    <!-- 顯示輸入框 -->
                    <v-textarea
                      v-model="currentEditingContent"
                      placeholder="請輸入新的留言內容"
                      rows="4"
                      variant="outlined" 
                      width="530" 
                      clearable
                      hide-details
                      class="ms-1"
                    ></v-textarea>
                  </div>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <div style="width: 500px;">
                      <v-btn @click="saveEdit(msg._id)" variant="text" class="rounded-md b-1 bg-primary me-2" height="30">儲存</v-btn>
                      <v-btn @click="cancelEdit" variant="text" class="rounded-md b-1 bg-info" height="30">取消</v-btn>
                    </div>
                  </v-col>
                </v-row>
              </div>
            </div>
          </v-col>
        </v-row>
                <!-- 當沒有留言時顯示提示訊息 -->
                 <v-row class="my-10">
                  <div v-if="message.length === 0" class="text-center text-body-2 mt-4 mx-auto ">
                    <h1 style="color:#bfbfbf;" class="mb-15">
                      目前暫無任何留言
                    </h1>
                  </div>
                
                  <v-divider></v-divider>
                </v-row>
                <!-- 留言發布 -->
                 <v-row class="my-2">
                <div class="pa-4">
                    <v-form @submit.prevent="submit" :disabled="isSubmitting">
                        <v-textarea 
                        ref="commentInput"
                        v-model="comment.value.value"
                        :error-messages="comment.errorMessage.value"
                        placeholder="請輸入您的留言或提問"
                        variant="outlined" 
                        width="600" 
                        maxlength="20" 
                        counter
                        clearable
                        >
                            <template v-slot:prepend v-for="file in files">
                            <v-avatar color="primary " class="me-1 b-1" size="large">
                                <v-img :src="file.avatar"></v-img>
                            </v-avatar>
                            </template>
                        </v-textarea>
                        <v-btn
                        type="submit"
                        variant="text"
                        class="rounded-md b-1 bg-accent mt-2"
                        density="comfortable"
                        :ripple="false"
                        >送出</v-btn>
                </v-form>
                </div>
                </v-row>
            </div>
            </v-col>
        </v-row>



</template>
<script setup>
import { ref, onMounted } from 'vue'
import * as yup from 'yup'
import { useForm, useField } from 'vee-validate'
import { useApi } from '@/composables/axios'
import { useSnackbar } from 'vuetify-use-dialog'
import { useRoute } from 'vue-router'
const { api, apiAuth } = useApi()
const createSnackbar = useSnackbar()
const route = useRoute()


const schema = yup.object({
  comment: yup
    .string()
    .required('留言內容必填'),
})

const { handleSubmit, isSubmitting, resetForm } = useForm({
  validationSchema: schema,
  initialValues: {
    comment: ''
  }
})

const message = ref([])
const loadComments = async () => {
  try {
    const { data } = await apiAuth.get(`/comment/`+ route.params.id)
    console.log(data)
    message.value = data.result
    console.log(message.value[0].user._id)
    
  } catch (error) {
    console.log(error)
    // createSnackbar({
    //   text: error?.response?.data?.message || '無法獲取留言',
    //   snackbarProps: {
    //     color: 'red'
    //   }
    // })
  }
}

onMounted(() => {
  loadComments()
})


const comment = useField('comment')
const submit = handleSubmit(async (values) => {
  try {
    const data = {
        content:values.comment,
        materialId: route.params.id
    }
    
    console.log(data)
    await apiAuth.post('comment/', data) 
    createSnackbar({
      text: '新增成功' ,
      snackbarProps: {
        color: 'green'
      }
    })
    resetForm()
    loadComments()
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

const files = ref([])
const currentUser = ref(null)
const loadfile = async () => {
  try {
    const { data } = await apiAuth.get('/user/profile');
    files.value = [data.result];
    console.log(files.value)
    currentUser.value = files.value[0].id
    console.log(currentUser.value)
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




const currentEditingId = ref(null)
const currentEditingContent = ref('')

const startEditing = (id, content) => {
  currentEditingId.value = id
  currentEditingContent.value = content
}




const cancelEdit = () => {
  currentEditingId.value = null
  currentEditingContent.value = ''
}


const saveEdit = async () => {
  try {
    await apiAuth.patch(`/comment/${currentEditingId.value}`, { 
      content: currentEditingContent.value
    })
    createSnackbar({
      text: '留言已更新',
      snackbarProps: {
        color: 'green'
      }
    })
    loadComments()
    cancelEdit()
  } catch (error) {
    createSnackbar({
      text: error?.response?.data?.message || '更新留言時出錯',
      snackbarProps: {
        color: 'red'
      }
    })
  }
}


const deleteMessage = async (id) => {
  try {
    await apiAuth.delete(`/comment/${id}`) 
    createSnackbar({
      text: '留言已刪除',
      snackbarProps: {
        color: 'green'
      }
    })
    loadComments()
  } catch (error) {
    createSnackbar({
      text: error?.response?.data?.message || '刪除留言時出錯',
      snackbarProps: {
        color: 'red'
      }
    })
  }
}
</script>
<style scoped>
.b-1{
  border: 1px solid #7a7a7a;
}

.info-margin{
    margin: 0 1rem 0 1rem ;
}

@media(min-width:1280px){
  .info-margin{
    margin: 0 6rem 0 6rem ;
  }
}
.v-btn{
    position: relative;
    left: 89%;
}
</style>