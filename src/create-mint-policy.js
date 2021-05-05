const fs = require("fs")
const cardano = require("./cardano")

const wallet = cardano.wallet("ADAPI")

const mintScript = {
    keyHash: cardano.addressKeyHash(wallet.name),
    type: "sig"
}

fs.writeFileSync(__dirname + "/mint-policy.json", JSON.stringify(mintScript, null, 2))
fs.writeFileSync(__dirname + "/mint-policy-id.txt", cardano.transactionPolicyid(mintScript))