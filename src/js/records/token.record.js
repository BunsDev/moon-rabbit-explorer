import { TOKEN_TYPES } from '@/js/const/token.const'

export class TokenRecord {
  constructor (record) {
    this._record = record

    this.ticker = record.ticker
    this.chainId = record.originalChainId
    this.originalType = record?.originalType || ''
    this.internalType = record?.internalType || ''
    this.originalContract = record.originalContract
    this.internalContract = record.internalContract
    this.originalChainName = record?.chain?.name || ''
    this.nativeChainDecimals = record?.chain?.nativeDecimals
  }

  get isInternalTypeNative () {
    return this.internalType === TOKEN_TYPES.native
  }
}