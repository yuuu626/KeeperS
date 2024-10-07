<template >
  <v-tabs-window-item :value="1">
    <v-form @submit.prevent="submit" :disabled="isSubmitting">
      <!-- Dialog 的內容 -->
      <v-card class=" px-6 bg-grey-lighten-3 b-1 pt-5 rounded-t-0" >
        <v-card-text >
          <!-- <template > -->
            <v-text-field
            label="服務單位"
            minlength="3"
            maxlength="20"
            variant="outlined"
            v-model="username.value.value"
            :error-messages="username.errorMessage.value"
            counter>
            </v-text-field>
            <v-text-field 
            label="公務信箱"
            type="email"
            variant="outlined"
            v-model="email.value.value"
            :error-messages="email.errorMessage.value"
            >
            </v-text-field>
            <v-text-field
            label="密碼"
            type="password"
            minlength="6"
            variant="outlined"
            v-model="password.value.value"
            :error-messages="password.errorMessage.value"
            counter
            >
            </v-text-field>
            <v-text-field
            label="確認密碼"
            type="password"
            minlength="6"
            maxlength="20"
            variant="outlined"
            v-model="passwordConfirm.value.value"
            :error-messages="passwordConfirm.errorMessage.value"
            counter
            >
            </v-text-field>
        </v-card-text>
        <v-card-actions class="mx-auto mb-5">
          <div class="mx-auto">
              <v-btn color="red" @click="handleClose" >取消</v-btn>
              <v-btn color="green" type="submit" :loading="isSubmitting">送出</v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-form>


  </v-tabs-window-item>
    
</template>

<script setup>
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import validator from 'validator'
import { useApi } from '@/composables/axios'
import { useRouter } from 'vue-router'
import { useSnackbar } from 'vuetify-use-dialog'
const { api } = useApi()
const router = useRouter()
const createSnackbar = useSnackbar()
const dialogOpen = ref(false)
const props = defineProps(['closeDialog'])
const emit = defineEmits(['notify'])
const registerSchema = yup.object({
  username:yup
    .string()
    .required('服務單位必填')
    .min(3,'服務單位長度不符')
    .max(20,'服務單位長度不符'),
  email:yup
    .string()
    .required('使用者信箱必填')
    .matches(     // 限制網域只能為org、edu、gov
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(org|edu|gov)$/,
      '必須為公務信箱， org、edu 或 gov 網域'
    )
    .test(
      'isEmail', '使用者信箱格式錯誤',
      (value) => {
        return validator.isEmail(value)
      }
    ),
    password: yup
    .string()
    .required('使用者密碼必填')
    .min(6, '使用者密碼長度不符')
    .max(20, '使用者密碼長度不符'),
    passwordConfirm: yup
      .string()
      // 代表此欄位值必須與 password 欄位的值一致
      // .oneOf(陣列, 錯誤訊息) 只允許符合陣列內其中一個值
      // .ref('password')  代表這個 schema 的 password 的欄位值
      .oneOf([yup.ref('password')], '密碼不一致')
})

const {handleSubmit, isSubmitting }=useForm({
  validationSchema:  registerSchema ,
  initialValues: {
    username: '',
    email: '',
    password: '',
    passwordConfirm: ''
  }
})

const username = useField('username')
const email = useField('email')
const password = useField('password')
const passwordConfirm = useField('passwordConfirm')



const submit = handleSubmit(async (values) => {
  try {
    await api.post('/user', {
      username: values.username,
      email: values.email,
      password: values.password
    })
    createSnackbar({
      text: '註冊成功',
      snackbarProps: {
        color: 'green'
      }
    })
    props.closeDialog()
    router.push('/')
  } catch (error) {
    createSnackbar({
      text: error?.response?.data?.message || '發生錯誤',
      snackbarProps: {
        color: 'red'
      }
    })
  }
})

const handleClose = () => {
  if (props.closeDialog) {
    props.closeDialog()
  }
}

</script>
<style scoped>
.b-1{
  border: 1px solid black;
  border-top: none;
}

</style>