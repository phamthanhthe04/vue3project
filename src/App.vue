<script setup>
import Header from './layouts/Header.vue'
import Sidebar from './layouts/Sidebar.vue'
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
  </div>
</template>
<style scoped></style>
