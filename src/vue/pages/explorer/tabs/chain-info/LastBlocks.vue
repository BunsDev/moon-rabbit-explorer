<template>
  <div class="last-blocks">
    <h1 class="last-blocks__title">
      {{ $t('explorer-page.last-blocks.title') }}
    </h1>
    <template v-if="lastHeaders.length">
      <div class="last-blocks__body">
        <div
          v-for="item in lastHeaders"
          class="last-blocks__row"
          :key="item.number"
        >
          <router-link
            class="last-blocks__row-number-link"
            :to="{
            ...$routes.blockInfoTab,
            query: {
              blockIdent: item.hash.toHex(),
            }
            }"
          >
            {{ item.number }}
          </router-link>
          <span class="last-blocks__row-block-id">
            {{ item.hash.toHex() }}
          </span>
          <account-address
            class="last-blocks__row-block-account"
            :account-address="item.author.toString()"
          />
        </div>
      </div>
    </template>
    <template v-else>
      <no-data-message
        is-row-block
        :message="$t('explorer-page.last-blocks.no-data-message')"
      />
    </template>
  </div>
</template>

<script>
import AccountAddress from '@/vue/common/AccountAddress'
import NoDataMessage from '@/vue/common/NoDataMessage'

import { getAddress } from '@/js/helpers/account-helper'
import { computed } from 'vue'
import { useStore } from 'vuex'
import { vuexTypes } from '@/vuex'

export default {
  name: 'last-blocks',

  components: { AccountAddress, NoDataMessage },

  setup () {
    const store = useStore()
    const lastHeaders = computed(() => {
      return store.getters[vuexTypes.lastHeaders]
    })

    return {
      lastHeaders,
      getAddress,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.last-blocks__title {
  margin-bottom: 2rem;
}

.last-blocks__body {
  max-height: 50vh;
  overflow-x: auto;

  @include scrollbar;
}

.last-blocks__row {
  display: grid;
  grid-template-columns: max-content 0.7fr minmax(8rem, 1fr);
  grid-gap: 0 1.4rem;
  align-items: center;
  height: 5.2rem;
  padding: 0 1.6rem;

  @include content-block;

  & + & {
    margin-top: 0.4rem;
  }

  @include respond-to($small) {
    grid-template-columns: 1fr 1fr;
  }
}

.last-blocks__row-number-link {
  font-size: 1.6rem;

  @include respond-to($small) {
    grid-column: 1/2;
  }
}

.last-blocks__row-block-id {
  overflow: hidden;
  text-overflow: ellipsis;

  @include respond-to($small) {
    grid-column: 1/2;
  }
}

.last-blocks__row-block-account {
  @include respond-to($small) {
    grid-row: 1/3;
    grid-column: 2/3;
  }
}

</style>
