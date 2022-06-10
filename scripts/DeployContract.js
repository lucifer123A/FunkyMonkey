// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const {MerkleTree} = require('merkletreejs');
const keccak256 = require('keccak256');
const whitelist = require("./whitelist.js");

const BASE_URI = 'ipfs://Qmb5A1fFECM2iFHgUioii2khT814nCi6VU9aHXHHqNxHCK/';
const proxyRegistryAddressRinkeby = '0xf57b2c51ded3a29e6891aba85459d600256cf317'
const proxyRegistryAddressMainnet = '0xa5409ec958c83c3f309868babaca7c86dcb077c1'


async function main() {
  //calculating merkle root from whitelist array
  const leafNodes = whitelist.map(adrs => keccak256(adrs))
  const merkleTree = new MerkleTree(leafNodes, keccak256, {sortPairs:true})
  const root = merkleTree.getRoot()

  //deploy the contract
  const FunkyMonkey = await hre.ethers.getContractFactory('FunkyMonkey')
  const funkyMonkey = await FunkyMonkey.deploy(BASE_URI, root, proxyRegistryAddressRinkeby)

  await funkyMonkey.deployed()

  console.log("FunkyMonkey deployed to:", funkyMonkey.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
