<template >
  <v-tabs-window-item :value="2">
    <v-form @submit.prevent="submit" :disabled="isSubmitting">
      <!-- Dialog 的內容 -->
      <v-card class=" px-6 bg-grey-lighten-3 b-1 pt-5 rounded-t-0" >
        <v-card-text class="pb-0 pb-sm-4">
          <!-- <template> -->
            <v-text-field 
              label="公務信箱"
              type="email"
              variant="outlined"
              v-model="email.value.value"
              :error-messages="email.errorMessage.value"
              :density="$vuetify.display.xs ? 'comfortable' : 'default'"
            ></v-text-field>
            <v-text-field
              label="密碼"
              type="password"
              variant="outlined"
              minlength="6"
              v-model="password.value.value"
              :error-messages="password.errorMessage.value"
              :density="$vuetify.display.xs ? 'comfortable' : 'default'"
              counter
            ></v-text-field>
          <!-- </template> -->
        </v-card-text>
          <v-card-actions class="mb-5">
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
import { useRouter } from 'vue-router'
import validator from 'validator'
import { useUserStore } from '@/stores/user'
import { useSnackbar } from 'vuetify-use-dialog'
const emit = defineEmits(['notify'])
const props = defineProps(['closeDialog'])
const router = useRouter()
const user = useUserStore()
const createSnackbar = useSnackbar()

const loginSchema = yup.object({
  email: yup
    .string()
    .required('使用者信箱必填')
    .matches(
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(org|edu|gov)$/, // 限制網域只能為org、edu、gov
    '使用者信箱必須是 org、edu 或 gov 網域'
    )
    .test('isEmail', '信箱格式錯誤', (value) => validator.isEmail(value)),
  password: yup
    .string()
    .required('使用者密碼必填')
    .min(6, '密碼長度不符')
    .max(20, '密碼長度不符'),
})


const {handleSubmit, isSubmitting}=useForm({
  validationSchema: loginSchema,
  initialValues: {
    email: '444444@gmail.org', // 預設信箱
    password: '444444' // 預設密碼
  }
})

const email = useField('email')
const password = useField('password')


const submit = handleSubmit(async (values) => {
  // console.log(values) // 有東西的，信箱、密碼
  const result = await user.login(values)
  // console.log(result)
  if (result === '登入成功') {
    createSnackbar({
      text: result,
      snackbarProps: {
        color: 'green'
      }
    })
    props.closeDialog()
    router.push('/')
  } else {
    createSnackbar({
      text: result,
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