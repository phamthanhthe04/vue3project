<template>
  <div class="ms-candidate-info display-flex align-items-center">
    <div class="ms-avatar" :class="avatarColorClass">
      <img v-if="avatar" :src="avatar" :alt="name" class="ms-avatar-image" />
      <span v-else class="ms-avatar-text">{{ avatarText }}</span>
    </div>
    <div class="ms-candidate-details">
      <div class="ms-candidate-name">
        <slot name="name">{{ name }}</slot>
        <span v-if="isEmployee" class="ms-badge-employee"></span>
      </div>
      <slot name="details"></slot>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  avatar: String,
  avatarText: String,
  avatarColorClass: String,
  name: String,
  isEmployee: Boolean,
})
</script>

<style scoped>
.ms-candidate-info {
  gap: 12px;
}
.ms-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
  color: #ffffff;
  flex-shrink: 0;
  text-transform: uppercase;
  overflow: hidden;
}
.ms-avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}
.ms-avatar-text {
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
}
.ms-candidate-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}
.ms-candidate-name {
  font-weight: 500;
  color: #111111;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  align-items: center;
}
.ms-badge-employee {
  display: inline-block;
  width: 16px;
  height: 16px;
  background-color: #28c76f;
  border-radius: 50%;
  margin-left: 6px;
  position: relative;
}
.ms-badge-employee::before {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 10px;
  font-weight: bold;
}
</style>
