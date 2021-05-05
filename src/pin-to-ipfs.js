const dotenv = require('dotenv')
dotenv.config()
const axios = require("axios")
const FormData = require('form-data')
const fs = require('fs')

const pinata = axios.create({
    baseURL: 'https://api.pinata.cloud',
    headers: {
        pinata_api_key: process.env.PINATA_API_KEY,
        pinata_secret_api_key: process.env.PINATA_API_SECRET
    }
})

module.exports = async (name, filePath) => {

    let data = new FormData()
    data.append('file', fs.createReadStream(filePath))

    const metadata = JSON.stringify({
        name
    })

    data.append('pinataMetaData', metadata)

    const pinataOptions = JSON.stringify({
        cidVersion: 0,
        customPinPolicy: {
            regions: [
                {
                    id: 'FRA1',
                    desiredReplicationCount: 1
                },
                {
                    id: 'NYC1',
                    desiredReplicationCount: 1
                }
            ]
        }
    })

    data.append('pinataOptions', pinataOptions)

    const response = await pinata.post('/pinning/pinFileToIPFS', data, {
        maxBodyLength: 'Infinity', // this is needed to prevent axios from erroring out with large files
        headers: {
            'Content-Type': `multipart/form-data; boundary=${data._boundary}`
        }
    }).catch(e => {

        if (e.response) {
            console.log(e.response.error)
        } else {
            console.log(e.message)
        }
    })

    const hash = response.data.IpfsHash

    return {
        hash,
        ipfsLink: `ipfs://${hash}`,
        httpLink: `https://ipfs.io/ipfs/${hash}`
    }
}