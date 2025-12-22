<script setup>
import { ref, watch } from 'vue'
import { CandidateStatus, CandidateSource, EducationLevel } from '../../../utils/enums'

const prop = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  filters: {
    type: Object,
    default: () => ({
      status: '',
      source: '',
      educationLevel: '',
      position: '',
    }),
  },
})
</script>
