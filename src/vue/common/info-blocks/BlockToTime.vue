<template>
  <div class="block-to-time">
    <info-block
      v-if="timeStr"
      class="block-to-time__info"
      :title="$t('common.block-to-time.purpose-title')"
      :value="timeStr"
    />
    <skeleton-loader
      v-else
      class="block-to-time__sceleton-loader"
    />
  </div>
</template>

<script>
import InfoBlock from '@/vue/common/InfoBlock'
import SkeletonLoader from '@/vue/common/SkeletonLoader'

import { ref } from 'vue'
import { useBlockTime } from '@/vue/composables'

export default {
  name: 'block-to-time',

  components: {
    InfoBlock,
    SkeletonLoader,
  },

  setup () {
    const { calculateTimeStr } = useBlockTime()
    const timeStr = ref(calculateTimeStr())

    return {
      timeStr,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.block-to-time {
  width: 100%;
}

.block-to-time__sceleton-loader {
  width: 100%;
  height: $min-height-info-block;
}

</style>
