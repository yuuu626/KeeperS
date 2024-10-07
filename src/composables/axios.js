import axios from 'axios'
import { useUserStore } from '@/stores/user'

const api = axios.create({
    baseURL: import.meta.env.VITE_API
})
const apiAuth = axios.create({
    baseURL: import.meta.env.VITE_API
  })

// 身分驗證
// 攔截器送出的時候會自動加上jwt驗證
apiAuth.interceptors.request.use(config => {
    const user = useUserStore()
    config.headers.Authorization = 'Bearer ' + user.token
    return config
})

apiAuth.interceptors.response.use(res => {
return res // 成功的請求 return 回呼叫它的地方
// 失敗的話加第二個參數
// 錯誤401(jwt驗證失敗)可能代表token過期
}, async error => {
if (error.response) { // 如果失敗有回應(網路斷線也算是失敗，網路斷線不會有回應)
    // 如果得到登入過期的回應訊息，且網址不是舊換新，才會出錯
    if (error.response.data.message === '登入過期' && error.config.url !== '/user/extend') {
    const user = useUserStore()
    try {
        // 傳送舊換新請求 (發送請求以刷新 token)
        const { data } = await apiAuth.patch('/user/extend')
        // 舊換新成功，更新 store 的 token
        user.token = data.result
        // 修改原本發生錯誤的請求的設定 (修改原始請求的 Authorization 標頭並重新發送請求)
        error.config.headers.Authorization = 'Bearer ' + user.token
        // 重新傳送一次原本的請求
        return axios(error.config)
    } catch (_) {
        // 舊換新錯誤，登出
        user.logout()
    }
    }
}
// 回傳原本請求的錯誤到呼叫 apiAuth 的地方
return Promise.reject(error)
})

export const useApi = () => {
return { api, apiAuth }
}