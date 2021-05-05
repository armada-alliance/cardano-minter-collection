const fs = require("fs")
const cardano = require("./cardano")

const wallet = cardano.wallet("ADAPI")

const { slot } = cardano.queryTip()

const SLOTS_PER_EPOCH = 5 * 24 * 60 * 60 // 432000

const mintScript = {
    type: "all",
    scripts: [
        {
            slot: slot + (SLOTS_PER_EPOCH * 5),
            type: "before"
        },
        {
            keyHash: cardano.addressKeyHash(wallet.name),
            type: "sig"
        }
    ]
}

fs.writeFileSync(__dirname + "/mint-policy.json", JSON.stringify(mintScript, null, 2))
fs.writeFileSync(__dirname + "/mint-policy-id.txt", cardano.transactionPolicyid(mintScript))