// Utilities
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import UserRole from '@/enums/UserRole.js'
import { useApi } from '@/composables/axios'

// 定義使用者狀態管理的 Pinia store
export const useUserStore = defineStore('user', () => {
  const { api, apiAuth } = useApi()

 
  const token = ref('')
  const username = ref('')
  const email = ref('') 
  const password = ref('') 
  const role = ref(UserRole.USER) // 預設為 UserRole.USER
  const avatar = ref('') 


  // 判斷是否已登入
  const isLogin = computed(() => {
    return token.value.length > 0
  })
  // 判斷是否為管理員角色
  const isAdmin = computed(() => {
    return role.value === UserRole.ADMIN
  })

  // 如果登入成功，會將回應的 token、使用者帳號、角色和購物車資訊儲存在相應的狀態變數中。若發生錯誤，則會返回錯誤訊息
  const login = async (values) => {
    try {
      // 發送 POST 請求到 /user/login 路徑 // data 是使用者登入後的資訊
      const { data } = await api.post('/user/login', values) // 這裡只要寫後端的路徑是因為我們composables有定義baseURL基準點的概念
      // 成功登入後，從 data.result 中提取相應的資料並存儲在不同的 ref 中
      token.value = data.result.token // 儲存登入後的 token
      email.value = data.result.email // 儲存使用者信箱
      role.value = data.result.role  // 儲存使用者角色
      username.value = data.result.username
      password.value = data.result.password
      avatar.value=data.result.avatar
      return '登入成功'
    } catch (error) {
      console.log(error)
      return error?.response?.data?.message || '發生錯誤，請稍後再試'
    }
  }

  const profile = async () => {
    // 登入後 pinia 才會存他的 jwt 的資訊
    // 如果有登入再做事
    if (!isLogin.value) return 
    try {
      // data 使用者登入後的資訊
      const { data } = await apiAuth.get('/user/profile')
      email.value = data.result.email
      role.value = data.result.role
      username.value = data.result.username
      password.value = data.result.password
      avatar.value=data.result.avatar
    } catch (error) {
      token.value = ''
      email.value = ''
      role.value = UserRole.USER
    }
  }


  const logout = async () => {
    try {
      // apiAuth 登出需要 jwt
      await apiAuth.delete('/user/logout')
    } catch (error) {
      console.log(error)
    }
    // 登出後重設所有的值
    token.value = ''
    email.value = ''
    role.value = UserRole.USER
  }

  return {
    token,
    email,
    role,
    isLogin,
    isAdmin,
    login,
    profile,
    logout
  }
}, {
  // 保存的設定
  persist: {
    // key 指 localstorage的名字
    key: 'shop',
    // path 可以指定要保存的資料 - token
    paths: ['token']
  }
})
