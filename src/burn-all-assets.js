const cardano = require("./cardano")
const getPolicyId = require("./get-policy-id")
const prompt = require('prompt-sync')({sigint: true});

// This script will burn all assets in the Wallet specifed below. Good for minting errors. Use with Caution!

const wallet = cardano.wallet("ADAPI")

const { policyId: POLICY_ID, mintScript } = getPolicyId()

const wallet_assets = {
   ...wallet.balance().value,
}
for (const [key, value] of Object.entries(wallet_assets)) {
  if (key == 'lovelace') {
    delete wallet_assets[key]
  }
}
const wallet_assets_keys = Object.keys(wallet_assets)


const txOut_value = {
   ...wallet.balance().value,
}
for (const [key, value] of Object.entries(txOut_value)) {
  if (key != 'lovelace') {
    txOut_value[key] = 0
  }
}
console.log("The following Assets will be burned: ", wallet_assets_keys)

const mint_actions = wallet_assets_keys.map(asset => ({ action: "mint", quantity: -1, asset: asset, script: mintScript }))


const tx = {
    txIn: wallet.balance().utxo,
    txOut: [
        {
            address: wallet.paymentAddr,
            value: txOut_value
        }
    ],
    mint: mint_actions,
    witnessCount: 2
}

const buildTransaction = (tx) => {

    const raw = cardano.transactionBuildRaw(tx)
    const fee = cardano.transactionCalculateMinFee({
        ...tx,
        txBody: raw
    })

    tx.txOut[0].value.lovelace -= fee

    return cardano.transactionBuildRaw({ ...tx, fee })
}
prompt("Are you sure to burn all tokens ?")
const raw = buildTransaction(tx)

// 9. Sign transaction

const signTransaction = (wallet, tx) => {

    return cardano.transactionSign({
        signingKeys: [wallet.payment.skey, wallet.payment.skey],
        txBody: tx
    })
}

const signed = signTransaction(wallet, raw, mintScript)

// 10. Submit transaction
prompt("Are you really sure? No going back!")
const txHash = cardano.transactionSubmit(signed)

console.log(txHash)
