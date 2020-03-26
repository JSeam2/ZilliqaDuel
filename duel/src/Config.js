const { bytes } = require('@zilliqa-js/util');

export const ContractAddress = 'zil1gtdgvn0xf2yq3mrvy2tcg2et2wdg454m25qdrf';
export const chainId = 333; // chainId of the developer testnet
export const msgVersion = 1; // current msgVersion
export const VERSION = bytes.pack(chainId, msgVersion);