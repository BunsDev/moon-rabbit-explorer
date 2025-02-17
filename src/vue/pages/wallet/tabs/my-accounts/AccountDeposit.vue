<template>
  <div class="account-deposit">
    <template v-if="isLoaded">
      <template v-if="isLoadFailed">
        <error-message
          :header="$t('wallet-page.account-deposit.error-header')"
          :message="$t('wallet-page.account-deposit.error-message')"
        />
      </template>
      <template v-else>
        <p class="account-deposit__info">
          {{ $t('wallet-page.account-deposit.info-text') }}
        </p>
        <clipboard-field
          class="account-deposit__clipboard"
          :value="depositId"
        />
        <qr-code-wrapper
          :value="depositId"
          :size="250"
        />
      </template>
    </template>
    <template v-else>
      <loader />
    </template>
  </div>
</template>

<script>
import QrCodeWrapper from '@/vue/common/QrCodeWrapper'
import ErrorMessage from '@/vue/common/ErrorMessage'
import Loader from '@/vue/common/Loader'
import { ClipboardField } from '@/vue/fields'

import { reactive, toRefs } from 'vue'
import { bridgeApi } from '@api'
import { ErrorHandler } from '@/js/helpers/error-handler'

export default {
  name: 'account-deposit',

  components: {
    ClipboardField,
    QrCodeWrapper,
    ErrorMessage,
    Loader,
  },

  props: {
    accountAddress: { type: String, required: true },
  },

  setup (props) {
    const state = reactive({
      isLoaded: true,
      isLoadFailed: false,
      depositId: '',
    })

    async function getDepositId () {
      const response = await bridgeApi.post('bridge/addresses', {
        data: {
          attributes: {
            moonrabbit_address: props.accountAddress,
          },
        },
      })
      return response?._rawResponse?.data?.id ?? ''
    }

    async function init () {
      state.isLoaded = false
      state.isLoadFailed = false
      try {
        state.depositId = await getDepositId()
      } catch (e) {
        state.isLoadFailed = true
        ErrorHandler.processWithoutFeedback(e)
      }

      state.isLoaded = true
    }

    init()

    return {
      ...toRefs(state),
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.account-deposit {
  padding: 0 $drawer-padding;
}

.account-deposit__info {
  color: $col-app-secondary;
  line-height: 1.6rem;
  margin-bottom: 5rem;
}

.account-deposit__clipboard {
  margin-bottom: 3rem;

  .clipboard-field__value {
    font-size: 1.4rem;
  }
}
</style>
