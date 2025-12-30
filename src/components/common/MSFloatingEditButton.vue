<template>
  <button
    class="ms-floating-edit-btn"
    :style="{ top }"
    @click="onClick"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
    :title="title"
  >
    <slot>
      <div class="icon icon-edit"></div>
    </slot>
  </button>
</template>

<script setup>
// Base form, chưa nhận props, chỉ slot và sự kiện
const props = defineProps({
  top: { type: String, default: '0px' },
  title: { type: String, default: 'Sửa thông tin ứng viên' },
  onClick: { type: Function },
  onMouseEnter: { type: Function },
  onMouseLeave: { type: Function },
})
</script>

<style scoped>
.ms-floating-edit-btn {
  position: fixed;
  right: 24px;
  transform: translateY(-50%);
  width: 36px;
  height: 36px;
  border-radius: 4px;
  border: 1px solid #d9d9d9;
  background-color: #ffffff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.ms-floating-edit-btn:hover {
  background-color: #f5f7fa;
  border-color: #3990ff;
  box-shadow: 0 4px 12px rgba(57, 144, 255, 0.2);
}
.ms-floating-edit-btn .icon-edit {
  width: 20px;
  height: 20px;
  background-color: #666666;
  transition: background-color 0.2s ease;
}
.ms-floating-edit-btn:hover .icon-edit {
  background-color: #3990ff;
}
</style>
