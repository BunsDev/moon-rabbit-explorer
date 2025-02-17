<template>
  <div class="call-expander">
    <expander
      :title="`${extractExtrinsic.section}.${extractExtrinsic.method}`"
      :subtitle="metaString"
      :is-full-width-header="isFullWidthHeader"
    >
      <template #dropdown-main>
        <params
          :params="extrinsicParamsWithValues"
          :registry="extractExtrinsic.registry"
        />
      </template>

      <template #secondary>
        <clipboard-field
          class="call-expander__secondary-item"
          v-if="extractExtrinsic.signature"
          :label="$t('common.call-expander.signature', {
            type: extractExtrinsic.signatureType
              ? `(${extractExtrinsic.signatureType })`
              : ''
          })"
          :value="extractExtrinsic.signature"
        />
        <clipboard-field
          v-if="extractExtrinsic.hash"
          class="call-expander__secondary-item"
          :label="$t('common.call-expander.hash')"
          :value="extractExtrinsic.hash"
        />
        <param-viewer
          v-if="extractExtrinsic.isSigned && blockNumber"
          class="call-expander__secondary-item"
          :label="$t('common.call-expander.lifetime')"
          :string-value="era.length
            ? $t('common.call-expander.mortal', {
              startAt: era[0],
              endsAt: era[1],
            })
            : $t('common.call-expander.immortal')
          "
        />

        <slot />
      </template>
    </expander>
  </div>
</template>

<script>
import Expander from '@/vue/common/Expander'
import Params from '@/vue/common/Params'
import ParamViewer from '@/vue/common/ParamViewer'
import ClipboardField from '@/vue/fields/ClipboardField'

import { computed, toRefs } from 'vue'
import { formatMetaPartsToString } from '@/js/helpers/blockchain-event-helper'
import { useExtrinsic } from '@/vue/composables'

export default {
  name: 'call-expander',

  components: {
    Expander,
    Params,
    ClipboardField,
    ParamViewer,
  },

  props: {
    extrinsic: { type: Object, required: true },
    blockNumber: { type: Number, default: null },
    withHash: { type: Boolean, default: false },
    withSignature: { type: Boolean, default: false },
    isFullWidthHeader: { type: Boolean, default: true },
  },

  setup (props) {
    const { extrinsic, blockNumber } = toRefs(props)
    const { extractExtrinsicState } = useExtrinsic()

    const extractExtrinsic = extractExtrinsicState({
      val: extrinsic,
      withHash: props.withHash,
      withSignature: props.withSignature,
    })

    const era = computed(() => {
      const era = extractExtrinsic?.era
      return blockNumber.value && era?.isMortalEra
        ? [
            era.asMortalEra.birth(blockNumber.value),
            era.asMortalEra.death(blockNumber.value),
          ]
        : []
    })

    const extrinsicParamsWithValues = computed(() => {
      return extractExtrinsic.params.map((item, index) => {
        return {
          param: item,
          value: extractExtrinsic.values[index],
        }
      })
    })

    const metaString = computed(() =>
      formatMetaPartsToString(extractExtrinsic.meta),
    )

    return {
      era,
      extrinsicParamsWithValues,
      metaString,
      extractExtrinsic,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.call-expander__secondary-item {
  margin-top: 1.6rem;
}
</style>
