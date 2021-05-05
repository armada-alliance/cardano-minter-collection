const cardano = require("./cardano")
const assets = require("./assets.json")
const getPolicyId = require('./get-policy-id')

const sender = cardano.wallet("ADAPI")

console.log(
    "Balance of Sender address" +
    cardano.toAda(sender.balance().amount.lovelace) + " ADA"
)

const { policyId: POLICY_ID } = getPolicyId()

function sendAssets({ receiver, assets }) {

    const txOut_amount_sender = assets.reduce((result, asset) => {

        const ASSET_ID = POLICY_ID + "." + asset
        delete result[ASSET_ID]
        return result
    }, {
        ...sender.balance().amount
    })

    const txOut_amount_receiver = assets.reduce((result, asset) => {

        const ASSET_ID = POLICY_ID + "." + asset
        result[ASSET_ID] = 1
        return result
    }, {})

    // This is depedent at the network, try to increase this amount of ADA
    // if you get an error saying: OutputTooSmallUTxO
    const MIN_ADA = 3

    const txInfo = {
        txIn: cardano.queryUtxo(sender.paymentAddr),
        txOut: [
            {
                address: sender.paymentAddr,
                amount: {
                    ...txOut_amount_sender,
                    lovelace: txOut_amount_sender.lovelace - cardano.toLovelace(MIN_ADA)
                }
            },
            {
                address: receiver,
                amount: {
                    lovelace: cardano.toLovelace(MIN_ADA),
                    ...txOut_amount_receiver
                }
            }
        ]
    }

    const raw = cardano.transactionBuildRaw(txInfo)

    const fee = cardano.transactionCalculateMinFee({
        ...txInfo,
        txBody: raw,
        witnessCount: 1
    })

    txInfo.txOut[0].amount.lovelace -= fee

    const tx = cardano.transactionBuildRaw({ ...txInfo, fee })

    const txSigned = cardano.transactionSign({
        txBody: tx,
        signingKeys: [sender.payment.skey]
    })

    const txHash = cardano.transactionSubmit(txSigned)

    console.log(txHash)
}

sendAssets({
    receiver: "addr1qydtdgqlv06s7r2qq5jjyzeq544knsp3486r9t2kzmmx7gh6k36mg2qlc9aq7qapx85067d5l8llhhr4fj6azvx384eqxx9jnm",
    assets: [
        "PIADA3", 
        "PIADA4", 
        "PIADA5",
        "PIADA6",
        "PIADA7",
        "PIADA8",
        "PIADA9",
        "PIADA10",
        "PIADA11",
        "PIADA12",
        "PIADA13",
        "PIADA14"
    ]
})