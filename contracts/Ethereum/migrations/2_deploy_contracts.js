/* globals artifacts */
var ArtSteward = artifacts.require("./ArtSteward.sol");
var Artwork = artifacts.require("./ERC721Full.sol");
var BillBoard = artifacts.require("./Billboard.sol");

const deploymentAccount =  '0xcEB8dE81eb8Cfa9ECFA36a3fAc625643d39d31fd'; //[0] address from mnemonic
const artistAccount = '0xcEB8dE81eb8Cfa9ECFA36a3fAc625643d39d31fd'; // artist account [on mainnet & rinkeby]

module.exports = function(deployer, network, accounts) {
  if(network === "ropsten" || network === "rinkeby" || network === "rinkeby-fork" || network === "mainnet" || network === "mainnet-fork") {
    // deploy with mnemonic provider
    deployer.deploy(Artwork, "This Artwork Is Always OnSale", "TAIAOS").then((deployedArtwork) => {
	console.log(deployedArtwork.address);
	console.log(artistAccount);
      return deployer.deploy(BillBoard, artistAccount, deployedArtwork.address);
    });
  } else {
    // development deploy
    deployer.deploy(Artwork, "ThisArtworkIsAlwaysOnSale", "TAIAOS").then((deployedArtwork) => {
      return deployer.deploy(ArtSteward, artistAccount, deployedArtwork.address);
    });
  }

};
