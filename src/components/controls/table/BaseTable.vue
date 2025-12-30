<script setup>
const props = defineProps({
  columns: { type: Array, default: () => [] },
  rows: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  rowKey: { type: String, default: 'id' },
})
</script>

<template>
  <div class="base-table-container">
    <table class="data-table">
      <thead>
        <tr>
          <th v-for="col in columns" :key="col.key" :class="col.class">{{ col.label }}</th>
        </tr>
      </thead>
      <tbody id="candidates-table-body">
        <slot name="loading" v-if="loading"></slot>

        <slot name="empty" v-else-if="!loading && (!rows || rows.length === 0)"></slot>

        <template v-else>
          <slot name="row" v-for="row in rows" :row="row"></slot>
        </template>
      </tbody>
    </table>
  </div>
</template>

<style scoped src="./base-table.css"></style>
