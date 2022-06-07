import { init } from '@web3-onboard/react'
import injectedModule from '@web3-onboard/injected-wallets'
import walletConnectModule from '@web3-onboard/walletconnect'
import fortmaticModule from '@web3-onboard/fortmatic'
import coinbaseModule from '@web3-onboard/coinbase'
import ApeIcon from '../Ape'

const RPC_URL = process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL

const injected = injectedModule()
const coinbase = coinbaseModule()
const walletConnect = walletConnectModule()
const fortmatic = fortmaticModule({
    apiKey: process.env.NEXT_PUBLIC_FORTMATIC_KEY
  })



const initOnboard = init({
    wallets: [
        injected,
        coinbase,
        walletConnect,
        fortmatic,
      ],
      chains: [
        // {
        //   id: '0x1',
        //   token: 'ETH',
        //   label: 'Ethereum Mainnet',
        //   rpcUrl: 'https://mainnet.infura.io/v3/ababf9851fd845d0a167825f97eeb12b'
        // },
        // {
        //   id: '0x3',
        //   token: 'tROP',
        //   label: 'Ethereum Ropsten Testnet',
        //   rpcUrl: 'https://ropsten.infura.io/v3/ababf9851fd845d0a167825f97eeb12b'
        // },
        {
          id: '0x4',
          token: 'rETH',
          label: 'Ethereum Rinkeby Testnet',
          rpcUrl: RPC_URL
        }
        // {
        //   id: '0x89',
        //   token: 'MATIC',
        //   label: 'Matic Mainnet',
        //   rpcUrl: 'https://matic-mainnet.chainstacklabs.com'
        // }
      ],
      appMetadata: {
        name: 'FunkyMonkey',
        icon: ApeIcon,
        description: "We're some Funky Monkeys",
        recommendedInjectedWallets: [
          { name: 'MetaMask', url: 'https://metamask.io' },
          { name: 'Coinbase', url: 'https://wallet.coinbase.com/' }
        ],
        agreement:{
            version: '1.0.0',
            termsUrl: 'https://www.blocknative.com/terms-conditions',
            privacyUrl: 'https://www.blocknative.com/privacy-policy'
        },
        gettingStartedGuide : 'https://docs.blocknative.com/onboard#',
        explore: 'https://www.blocknative.com'
      },
      accountCenter: {
        desktop: {
          position: 'topRight',
          enabled: true,
          minimal: true
        },
        mobile: {
          position: 'topRight',
          enabled: true,
          minimal: true
        }
      }
})

export {initOnboard}
