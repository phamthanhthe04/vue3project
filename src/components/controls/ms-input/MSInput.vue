<script setup>
import { ref, watch } from 'vue'

const prop = defineProps({
  label: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: 'Search...',
  },
  icon: {
    type: String,
    default: '',
  },
  value: {
    type: String,
    default: '',
  },
})
</script>
