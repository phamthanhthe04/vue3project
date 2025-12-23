<script setup>
import { ref, onMounted } from 'vue'
import Header from './layouts/Header.vue'
import Sidebar from './layouts/Sidebar.vue'
import ToastNotification from './components/common/ToastNotification.vue'
import { useToast } from './composables/useToast'

const toastRef = ref(null)
const { setInstance } = useToast()

onMounted(() => {
  if (toastRef.value) {
    setInstance(toastRef.value)
  }
})
</script>

<template>
  <div class="container">
    <Header />
    <div class="content display-flex">
      <Sidebar />
      <div class="main-content">
        <router-view />
      </div>
    </div>

    <!-- Toast Notification -->
    <ToastNotification ref="toastRef" />
  </div>
</template>
<style scoped></style>
