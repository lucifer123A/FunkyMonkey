require("@nomiclabs/hardhat-etherscan")
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

  await hre.run("verify:verify", {
    address: '0x13F37fE37dBF99E53efDf0bE7cB9be02C40c5e45',
    constructorArguments: [BASE_URI, root, proxyRegistryAddressRinkeby],
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
