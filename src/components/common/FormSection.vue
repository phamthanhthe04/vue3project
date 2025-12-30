<template>
  <section class="form-section">
    <h3 v-if="title" class="form-section-title">{{ title }}</h3>
    <div class="form-section-body"><slot /></div>
  </section>
</template>

<script setup>
const props = defineProps({ title: { type: String, default: '' } })
</script>

<style scoped>
.form-section {
  margin-bottom: 20px;
}
.form-section-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
}
.form-section-body {
  display: block;
}
</style>
