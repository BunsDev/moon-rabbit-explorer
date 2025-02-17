<template>
  <div class="account-balances">
    <template v-if="balancesAll && isLoadedStaking">
      <p
        v-tooltip="$fFullBalance(balancesAll.freeBalance)"
        class="account-balances__total"
      >
        {{ $fbalance(balancesAll.freeBalance) }}
      </p>

      <readonly-row
        v-if="!balancesAll.availableBalance.isZero()"
        class="account-balances__row"
        :tooltip="$fFullBalance(balancesAll.availableBalance)"
        :label="$t('common.account-balances.transferrable-lbl')"
        :value="$fbalance(balancesAll.availableBalance)"
      />

      <readonly-row
        v-if="!balancesAll.lockedBalance.isZero()"
        class="account-balances__row"
        :tooltip="$fFullBalance(balancesAll.lockedBalance)"
        :label="$t('common.account-balances.locked-lbl')"
        :value="$fbalance(balancesAll.lockedBalance)"
      />

      <readonly-row
        v-if="+stakingBalance.balance && !isLoadStakingFailed"
        class="account-balances__row"
        :tooltip="$fFullBalance(stakingBalance.balance)"
        :label="$t('common.account-balances.staked-lbl')"
        :value="$fbalance(stakingBalance.balance)"
      />
    </template>
    <template v-else>
      <skeleton-loader
        v-for="(item, id) in 4"
        :key="id"
        class="account-balances__sceleton-loader"
      />
    </template>
  </div>
</template>

<script>
import ReadonlyRow from '@/vue/common/ReadonlyRow'
import SkeletonLoader from '@/vue/common/SkeletonLoader'

import { reactive, toRefs } from 'vue'
import { api, stakingApi } from '@api'
import { useCall } from '@/vue/composables'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { StakingBalanceRecord } from '@/js/records/staking-balance.record'

export default {
  name: 'account-balances',

  components: { ReadonlyRow, SkeletonLoader },

  props: {
    accountAddress: { type: String, required: true },
  },

  setup (props) {
    const state = reactive({
      stakingBalance: {},
      isLoadedStaking: false,
      isLoadStakingFailed: false,
    })
    const balancesAll = useCall(api.derive.balances.all, [props.accountAddress])

    async function getStakeBalance () {
      state.isLoadedStaking = false
      state.isLoadStakingFailed = false
      try {
        const { data } = await stakingApi.get(`/api/staking/${props.accountAddress}/sum`)

        state.stakingBalance = new StakingBalanceRecord(data)
      } catch (e) {
        state.isLoadStakingFailed = true
        ErrorHandler.processWithoutFeedback(e)
      }
      state.isLoadedStaking = true
    }

    getStakeBalance()

    return {
      ...toRefs(state),
      balancesAll,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';
@import '~@scss/mixins';

.account-balances__total {
  font-size: 2rem;
  color: $col-app-accent;
  width: max-content;
}

.account-balances__row {
  margin-top: 2rem;
}

.account-balances__sceleton-loader {
  height: 1.2rem;

  & + & {
    margin-top: 2rem;
  }
}
</style>
