<script setup lang="ts">
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import { get } from '../utils/request'
import { ref } from 'vue'
import { escapeHtml } from '../utils/security'

const auth = useAuthStore()
const router = useRouter()

const apiResult = ref<string>('')
const userInput = ref('<img src=x onerror=alert(1) />')
const safePreview = ref('')

const handleLogout = () => {
  auth.clearAuth()
  router.replace('/login')
}

const callApi = async () => {
  try {
    // 示例：调用需要登录的接口
    // const res = await get<{ message: string }>('/protected')
    // apiResult.value = res.message

    const res = await get<{ message: string }>('/mock-protected')
    apiResult.value = res.message
  } catch (error) {
    console.error(error)
    apiResult.value = '请求失败（请根据实际后端调整接口）'
  }
}

const previewSafeHtml = () => {
  safePreview.value = escapeHtml(userInput.value)
}
</script>

<template>
  <div class="home">
    <header class="topbar">
      <div class="left">
        <span class="logo-dot" />
        <span class="logo-text">Demo 控制台</span>
      </div>
      <div class="right">
        <span class="user">👤 {{ auth.username || '未登录' }}</span>
        <button class="logout" @click="handleLogout">退出登录</button>
      </div>
    </header>

    <main class="content">
      <section class="card">
        <h2>登录拦截 + 请求封装示例</h2>
        <p class="desc">
          当前页面为受保护路由，未登录时会被路由守卫强制跳转到登录页。
        </p>

        <button class="primary" @click="callApi">调用示例接口（带 token）</button>

        <p v-if="apiResult" class="result">{{ apiResult }}</p>

        <div class="xss-demo">
          <h3>XSS 安全渲染示例</h3>
          <textarea
            v-model="userInput"
            class="editor"
            rows="4"
            placeholder="输入一段可能含有 HTML 的内容"
          />
          <button class="secondary" @click="previewSafeHtml">安全预览</button>
          <div v-if="safePreview" class="preview">
            <p class="label">转义后输出（可安全用 v-html）</p>
            <div class="output" v-html="safePreview" />
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.home {
  min-height: 100vh;
  background: radial-gradient(circle at top, #1e293b,rgb(41, 73, 218));
  color: #e5e7eb;
}

.topbar {
  height: 56px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(148, 163, 184, 0.3);
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(16px);
}

.left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo-dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: conic-gradient(from 210deg, #38bdf8, #a855f7, #f97316, #38bdf8);
}

.logo-text {
  font-weight: 600;
}

.right {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
}

.user {
  color: #cbd5f5;
}

.logout {
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.6);
  background: transparent;
  color: #e5e7eb;
  font-size: 13px;
  cursor: pointer;
}

.content {
  padding: 40px 24px;
  display: flex;
  justify-content: center;
}

.card {
  width: 520px;
  padding: 24px 20px;
  border-radius: 18px;
  background: rgba(15, 23, 42, 0.9);
  box-shadow:
    0 28px 80px rgba(15, 23, 42, 0.9),
    0 0 0 1px rgba(148, 163, 184, 0.16);
}

.card h2 {
  margin: 0 0 8px;
  font-size: 20px;
}

.desc {
  margin: 0 0 20px;
  font-size: 14px;
  color: #9ca3af;
}

.primary {
  padding: 9px 18px;
  border-radius: 999px;
  border: none;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  color: #0f172a;
  background: linear-gradient(135deg, #4ade80, #22c55e);
  box-shadow:
    0 14px 40px rgba(34, 197, 94, 0.45),
    0 0 0 1px rgba(15, 23, 42, 0.9);
}

.result {
  margin-top: 16px;
  padding: 10px 12px;
  border-radius: 10px;
  background: rgba(15, 23, 42, 0.9);
  border: 1px solid rgba(148, 163, 184, 0.6);
  font-size: 13px;
}

.xss-demo {
  margin-top: 18px;
  padding-top: 14px;
  border-top: 1px solid rgba(148, 163, 184, 0.3);
}

.xss-demo h3 {
  margin: 0 0 10px;
  font-size: 16px;
}

.editor {
  width: 100%;
  border-radius: 10px;
  padding: 10px;
  border: 1px solid rgba(148, 163, 184, 0.6);
  color: #e5e7eb;
  background: rgba(15, 23, 42, 0.9);
  resize: vertical;
}

.secondary {
  margin-top: 10px;
  padding: 7px 12px;
  border-radius: 8px;
  border: 1px solid rgba(148, 163, 184, 0.5);
  color: #e2e8f0;
  background: transparent;
  cursor: pointer;
}

.preview {
  margin-top: 10px;
}

.label {
  margin: 0 0 6px;
  color: #9ca3af;
  font-size: 12px;
}

.output {
  border-radius: 10px;
  border: 1px dashed rgba(148, 163, 184, 0.5);
  padding: 10px;
  font-size: 13px;
}
</style>

