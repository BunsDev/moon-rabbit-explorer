<template>
  <div class="parachains-summary">
    <div class="parachains-summary__content">
      <info-block
        :title="$t('parachains-page.parachains-summary.parachains-header')"
        :value="parachainsAmount"
      />
      <info-block
        :title="$t('parachains-page.parachains-summary.parathreads-header')"
        :value="parathreadAmount"
      />
      <info-block
        class="parachains-summary__info"
        :title="$t('parachains-page.parachains-summary.current-lease-header')"
        :value="leasePeriod?.currentPeriod?.toString()"
      />

      <progress-info-block
        class="parachains-summary__info"
        :title="$t('parachains-page.parachains-summary.lease-period-header')"
        :current="leasePeriod?.progress"
        :total="leasePeriod?.length"
      />

      <best-number
        class="parachains-summary__info"
        is-finalized
      />
      <epoch-time class="parachains-summary__info" />
    </div>
  </div>
</template>

<script>
import InfoBlock from '@/vue/common/InfoBlock'
import BestNumber from '@/vue/common/info-blocks/BestNumber'
import EpochTime from '@/vue/common/info-blocks/EpochTime'
import ProgressInfoBlock from '@/vue/common/ProgressInfoBlock'

import { LeasePeriodRecord } from '@/js/records/lease-period.record'

export default {
  name: 'parachains-summary',

  components: {
    InfoBlock,
    BestNumber,
    EpochTime,
    ProgressInfoBlock,
  },

  props: {
    parachainsAmount: { type: Number, default: 0 },
    parathreadAmount: { type: Number, default: 0 },
    leasePeriod: { type: LeasePeriodRecord, default: null },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.parachains-summary__content {
  display: grid;
  grid-gap: 1.6rem 3rem;
  grid-template-columns: repeat(6, min-content);
  justify-content: center;

  @include respond-to($media-desktop) {
    grid-template-columns: repeat(2, 1fr);
  }
}

.parachains-summary__info {
  @include respond-to($small) {
    grid-column: 1/-1;
  }
}
</style>
