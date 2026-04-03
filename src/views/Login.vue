<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { post } from '../utils/request'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const form = ref({
  username: '',
  password: '',
})

const loading = ref(false)
const errorMsg = ref('')

const handleSubmit = async () => {
  if (!form.value.username || !form.value.password) {
    errorMsg.value = '请输入用户名和密码'
    return
  }

  loading.value = true
  errorMsg.value = ''

  try {
    // 这里是示例，实际应调用后端登录接口
    // const res = await post<{ token: string; username: string }>('/login', form.value)
    // auth.setAuth(res.token, res.username)

    await new Promise((resolve) => setTimeout(resolve, 800))
    auth.setAuth('fake-token-demo', form.value.username)

    const redirect = (route.query.redirect as string) || '/'
    router.replace(redirect)
  } catch (error) {
    console.error(error)
    errorMsg.value = '登录失败，请重试'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-card">
      <h1 class="title">Demo 登录</h1>
      <p class="subtitle">Vue3 + TS + Axios + Pinia</p>

      <form class="form" @submit.prevent="handleSubmit">
        <label class="field">
          <span>用户名</span>
          <input v-model="form.username" type="text" placeholder="请输入用户名" />
        </label>

        <label class="field">
          <span>密码</span>
          <input v-model="form.password" type="password" placeholder="请输入密码" />
        </label>

        <p v-if="errorMsg" class="error">{{ errorMsg }}</p>

        <button class="submit" type="submit" :disabled="loading">
          {{ loading ? '登录中...' : '登录' }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at top, #1e293b, #020617);
  color: #e5e7eb;
}

.login-card {
  width: 360px;
  padding: 32px 28px;
  border-radius: 18px;
  background: rgba(15, 23, 42, 0.9);
  box-shadow:
    0 24px 80px rgba(15, 23, 42, 0.9),
    0 0 0 1px rgba(148, 163, 184, 0.15);
  backdrop-filter: blur(18px);
}

.title {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
}

.subtitle {
  margin: 4px 0 20px;
  font-size: 13px;
  color: #9ca3af;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 8px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
}

.field span {
  color: #cbd5f5;
}

input {
  padding: 9px 11px;
  border-radius: 9px;
  border: 1px solid rgba(148, 163, 184, 0.5);
  background: rgba(15, 23, 42, 0.8);
  color: #e5e7eb;
  font-size: 14px;
  outline: none;
  transition: all 0.15s ease;
}

input:focus {
  border-color: #60a5fa;
  box-shadow: 0 0 0 1px rgba(37, 99, 235, 0.75);
}

.submit {
  margin-top: 4px;
  padding: 10px;
  border-radius: 999px;
  border: none;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  color: #0f172a;
  background: linear-gradient(135deg, #38bdf8, #6366f1);
  box-shadow:
    0 14px 40px rgba(56, 189, 248, 0.4),
    0 0 0 1px rgba(15, 23, 42, 0.9);
  transition: all 0.15s ease;
}

.submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  box-shadow: none;
}

.submit:not(:disabled):hover {
  transform: translateY(-1px);
}

.error {
  margin: 0;
  font-size: 12px;
  color: #f97373;
}
</style>

