import { reactive, unref } from 'vue'
import { Enum, GenericCall, getTypeDef } from '@polkadot/types'

export function useExtrinsic () {
  function isExtrinsic (value) {
    return !!value.signature
  }

  function extractExtrinsicState (val, withHash = true, withSignature = true) {
    const extr = unref(val)
    const { meta, method, section } = extr.registry.findMetaCall(extr.callIndex)

    const state = reactive({
      values: extr.args,
      params: [],
      hash: withHash ? extr.hash.toHex() : null,
      signature: null,
      signatureType: null,
      meta: meta,
      method: method,
      section: section,
      tip: extr.tip?.toBn(),
      isSigned: extr.isSigned,
      era: extr.era,
    })

    state.params =
      GenericCall.filterOrigin(extr.meta).map(({ name, type }) => ({
        name: name.toString(),
        type: getTypeDef(type.toString()),
      }))

    if (withSignature && isExtrinsic(extr) && extr.isSigned) {
      const raw = extr._raw?.signature?.multiSignature

      state.signature = extr.signature.toHex()
      state.signatureType = raw instanceof Enum
        ? raw.type
        : null
    }

    return state
  }

  return {
    extractExtrinsicState,
    isExtrinsic,
  }
}
