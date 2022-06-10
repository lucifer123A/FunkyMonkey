const {createAlchemyWeb3} = require('@alch/alchemy-web3')
const {MerkleTree} = require('merkletreejs');
const keccak256 = require('keccak256');
const whitelist = require('../scripts/whitelist')

const web3 = createAlchemyWeb3(process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL)
import {config} from '../dapp.config'

const contract = require('../artifacts/contracts/FunkyMonkey.sol/FunkyMonkey.json')
const nftContract = new web3.eth.Contract(contract.abi, config.contractAddress)

//calculating merkle root from whitelist array
const leafNodes = whitelist.map(adrs => keccak256(adrs))
const merkleTree = new MerkleTree(leafNodes, keccak256, {sortPairs:true})
const root = merkleTree.getRoot()

// writing methods to interact with the contract

export const getTotalMinted = async()=>{
    const totalMinted = await nftContract.methods.totalSupply().call()
    return totalMinted
}

export const getMaxSupply = async()=>{
    const maxSupply = await nftContract.methods.maxSupply().call()
    return maxSupply
}

export const isPausedState = async()=>{
    const pausedState = await nftContract.methods.paused().call()
    return pausedState
}

export const isPublicSaleState = async()=>{
    const publicSale = await nftContract.methods.publicM().call()
    return publicSale
}

export const isPreSaleState = async()=>{
    const preSale = await nftContract.methods.presaleM().call()
    return preSale
}

//price is not public so defined it in dapp.config
// export const getPrice = async()=>{
//     const price = await nftContract.methods.price().call()
//     return price
// }

export const presaleMint = async(mintAmount)=>{
    if(!window.ethereum.selectedAddress){
        return {
            success:false,
            status:'To be able to mint, you need to connect your wallet'
        }
    }
    const leaf = keccak256(window.ethereum.selectedAddress)
    const proof = merkleTree.getHexProof(leaf)

    //verify merkle proof
    const isValid = merkleTree.verify(proof, leaf, root)

    if(!isValid){
        return {
            success:false,
            status:'Invalid Merkle Proof - You are not on the whitelist'
        }
    }

    //nonce is used to prevent replay atx
    //i.e. a sending 20 coins to b b can replay that to empty a's balance something like this
    const nonce = await web3.eth.getTransactionCount(
        window.ethereum.selectedAddress,
        'latest'
    )

    // set up our ethereum tx
    const tx = {
        to : config.contractAddress,
        from : window.ethereum.selectedAddress,
        value : parseInt(
                web3.utils.toWei(String(config.price * mintAmount), 'ether')
            ).toString(16), // hex
        gas : String(300000 * mintAmount),
        data : nftContract.methods.presaleMint(window.ethereum.selectedAddress,mintAmount,proof).encodeABI(),
        nonce : nonce.toString(16)
    }

    try{
        const txHash = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [tx]
        })
        return{
            success: true,
            status: (
                <a href={`https://rinkeby.etherscan.io/tx/${txHash}`} target='_blank'>
                    <p>✔️ Check out your transaction on etherscan</p>
                    <p>{`https://rinkeby.etherscan.io/tx/${txHash}`}</p>
                </a>
            )
        }
    }catch(error){
        return{
            success: false,
            status: '😔 Something went wrong: '+error.message
        }
    }
}


export const publicMint = async(mintAmount)=>{
    if(!window.ethereum.selectedAddress){
        return {
            success:false,
            status:'To be able to mint, you need to connect your wallet'
        }
    }

    //nonce is used to prevent replay atx
    //i.e. a sending 20 coins to b b can replay that to empty a's balance something like this
    const nonce = await web3.eth.getTransactionCount(
        window.ethereum.selectedAddress,
        'latest'
    )

    // set up our ethereum tx
    const tx = {
        to : config.contractAddress,
        from : window.ethereum.selectedAddress,
        value : parseInt(
                web3.utils.toWei(String(config.price * mintAmount), 'ether')
            ).toString(16), // hex
        gas : String(300000 * mintAmount),
        data : nftContract.methods.publicSaleMint(mintAmount).encodeABI(),
        nonce : nonce.toString(16)
    }

    try{
        const txHash = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [tx]
        })
        return{
            success: true,
            status: (
                <a href={`https://rinkeby.etherscan.io/tx/${txHash}`} target='_blank'>
                    <p>✔️ Check out your transaction on etherscan</p>
                    <p>{`https://rinkeby.etherscan.io/tx/${txHash}`}</p>
                </a>
            )
        }
    }catch(error){
        return{
            success: false,
            status: '😔 Something went wrong: '+error.message
        }
    }
}