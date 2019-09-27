/* globals artifacts */
var ArtSteward = artifacts.require("./ArtSteward.sol");
var Artwork = artifacts.require("./ERC721Full.sol");
var BillBoard = artifacts.require("./BillBoard.sol");

const deploymentAccount =  '0xE8B21A66d89401254045bAb95B474B52B6faC351'; //[0] address from mnemonic
const artistAccount = '0xE8B21A66d89401254045bAb95B474B52B6faC351'; // artist account [on mainnet & rinkeby]

module.exports = function(deployer, network, accounts) {
  if(network === "ropsten" || network === "rinkeby" || network === "rinkeby-fork" || network === "mainnet" || network === "mainnet-fork") {
    // deploy with mnemonic provider
    deployer.deploy(Artwork, "This Artwork Is Always OnSale", "TAIAOS").then((deployedArtwork) => {
      console.log(deployedArtwork.address);
      return deployer.deploy(BillBoard, artistAccount, deployedArtwork.address);
    });
  } else {
    // development deploy
    deployer.deploy(Artwork, "ThisArtworkIsAlwaysOnSale", "TAIAOS").then((deployedArtwork) => {
      return deployer.deploy(ArtSteward, accounts[0], deployedArtwork.address);
    });
  }

};