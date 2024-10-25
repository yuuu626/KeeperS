<template>
<!-- 留言板 -->
<v-row class="mt-10">
  <v-col>
      <div class="b-1 info-margin text-center text-body-1 pa-1 pa-sm-2 bg-accent rounded-t-lg font-weight-bold comment-tag">留言板</div>
      <div class="b-1 pa-5 info-margin">
        <v-row v-for="msg in message" :key="msg._id">
          <v-col cols="10" md="9">
            <div class="pa-1 pa-md-4">
              <div>
                <v-avatar color="primary b-1" class="me-3" :size="$vuetify.display.xs ? 'default' : 'large'">
                  <v-img :src="msg.user.avatar"></v-img>
                </v-avatar>
                <span class="ml-1 font-weight-bold name-fz">{{ msg.user.username }}</span>
              </div>
              <div v-if="currentEditingId !== msg._id">
                <!-- 顯示純文字 -->
                <p class="mt-4 ml-4 ml-sm-16 info-fz" style="white-space: pre-line;word-wrap: break-word;">{{ msg.content }}</p>
              </div>
              <div v-else class="w-100 h-100 mt-4">
                <!-- <v-row class="mt-2 mx-8">
                  <div class="pa-4"> -->
                    <!-- 顯示輸入框 -->
                    <v-textarea
                      v-model="currentEditingContent"
                      placeholder="請輸入新的留言內容"
                      variant="outlined" 
                      :rows="$vuetify.display.xs ? '3' : '4'"
                      :clearable="!$vuetify.display.xs"
                      hide-details
                      class="ms-1 w-100 w-sm-75 w-md-100 px-3 pb-3"
                      auto-grow
                      maxlength="150" 
                      style="word-break: break-word;"
                    ></v-textarea>
                    <div style="height: 35px;" class="w-100 w-sm-75 w-md-100 pe-2 text-end">
                      <v-btn @click="saveEdit(msg._id)" variant="text" class="rounded-md b-1 bg-primary me-2 d-inline-block" :height="$vuetify.display.xs ? '25' : '30'">儲存</v-btn>
                      <v-btn @click="cancelEdit" variant="text" class="rounded-md b-1 bg-info d-inline-block" :height="$vuetify.display.xs ? '25' : '30'">取消</v-btn>
                    </div>
            </div>
            </div>
          </v-col>
          <v-col cols="2" md="3" class="text-end">
            <v-menu location="end" class="cursor-pointer">
            <template v-if="msg.user._id == currentUser" v-slot:activator="{ props }">
              <v-btn icon="mdi-dots-vertical" variant="plain" v-bind="props" :size="$vuetify.display.xs ? 'small' : 'default'"></v-btn>
            </template>
            <v-list density="comfortable">
              <v-list-item>
                <!-- 條件句部分表示留言的id與登入id相同時才會顯示 -->
                <v-list-item-title @click="startEditing(msg._id, msg.content)" variant="text" >編輯</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title @click="deleteMessage(msg._id)" variant="text" >刪除</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          </v-col>
        </v-row>
                <!-- 當沒有留言時顯示提示訊息 -->
                <v-row class="mt-4 mt-sm-5 mt-md-8 mt-lg-10 mb-2">
                  <div v-if="message.length === 0" class="text-center text-body-2 mt-4 mx-auto ">
                    <h1 style="color:#bfbfbf;" class="mb-15">
                      目前暫無任何留言
                    </h1>
                  </div>
                  <v-divider></v-divider>
                </v-row>
                <!-- 留言發布 -->
                <v-row class="my-2">
                  <v-col cols="12">
                    <div class="pa-1 pa-md-4" v-for="file in files">
                    <div>
                      <v-avatar color="primary b-1" class="me-3" :size="$vuetify.display.xs ? 'default' : 'large'">
                        <v-img :src="file.avatar"></v-img>
                      </v-avatar>
                      <span class="ml-1 font-weight-bold name-fz">{{ file.username }}</span>
                    </div>
                  </div>
                  </v-col>
                  <v-col cols="12" md="9">
                    <v-form @submit.prevent="submit" :disabled="isSubmitting">
                      <v-textarea 
                      ref="commentInput"
                      v-model="comment.value.value"
                      :error-messages="comment.errorMessage.value"
                      placeholder="請輸入您的留言或提問"
                      variant="outlined" 
                      maxlength="150" 
                      counter
                      :clearable="!$vuetify.display.xs"
                      :rows="$vuetify.display.xs ? '4' : '5'"
                      auto-grow
                      class="ms-1 w-100 w-sm-75 w-md-100 px-3 pb-1"
                      ></v-textarea>
                    <div style="height: 35px;" class="pe-2 text-end w-100 w-sm-75 w-md-100">
                      <v-btn
                      type="submit"
                      variant="text"
                      class="rounded-md b-1 bg-accent"
                      density="comfortable"
                      :ripple="false"
                      >送出</v-btn>
                    </div>
                  </v-form>
                </v-col>
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
        // content:comment.value.value 
        content:values.comment,
        materialId: route.params.id
    }
    
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

.comment-tag{
  max-width:105px;
  padding: 0;
  border-bottom: 0px;
}

.name-fz{
  font-size: 1rem;
}
.info-fz{
  font-size: 15px;
}
@media(min-width:400px) {
  .comment-tag{
    max-width:120px;
  }
}
@media(min-width:600px) {
  .comment-tag{
    max-width:150px;
  }
  .name-fz{
    font-size: 1.1rem;
  }
  .info-fz{
    font-size: 1rem;
  }
}
@media(min-width:1280px){
  .info-margin{
    margin: 0 1rem 0 5rem ;
  }
}

</style>