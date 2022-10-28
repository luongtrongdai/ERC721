import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { OneOfAKind__factory } from "../typechain-types";

describe("OneOfAKind", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployNFT() {
    const [deployer, firstUser, secondUser, thirdUser] = await ethers.getSigners();

    const OneOfAKind = await ethers.getContractFactory("OneOfAKind", deployer);
    const oneOfAKind = await OneOfAKind.deploy("Test", "TTT");
    
    return {oneOfAKind, deployer, firstUser, secondUser, thirdUser};
  }

  async function deployReceiverContract() {
    const [deployer1, firstUser, secondUser, thirdUser] = await ethers.getSigners();

    const ReceiverContract = await ethers.getContractFactory("ReceiverContract", secondUser);
    const receiverContract = await ReceiverContract.deploy();
    
    return {receiverContract, deployer1, firstUser, secondUser, thirdUser};
  }

  describe("Deployment", function () {
    it("Should change owner after call transfer", async () => {
      const { oneOfAKind, deployer, firstUser } = await loadFixture(deployNFT);

      await oneOfAKind.awardItem(1);

      await oneOfAKind.transferFrom(deployer.address, firstUser.address, 1);

      expect(await oneOfAKind.ownerOf(1)).to.eq(firstUser.address);
    });

    it.skip("Should tranfer from new owner", async () => {
      const { oneOfAKind, deployer, firstUser } = await loadFixture(deployNFT);
      const { receiverContract, secondUser } = await loadFixture(deployReceiverContract);

      await oneOfAKind.awardItem(1);

      await oneOfAKind.transferFrom(deployer.address, receiverContract.address, 1);
      expect(await oneOfAKind.ownerOf(1)).to.eq(receiverContract.address);
    });

    it.skip("Should reject tranfer with safeTransferFrom", async () => {
      const { oneOfAKind, deployer, firstUser } = await loadFixture(deployNFT);
      const { receiverContract, secondUser } = await loadFixture(deployReceiverContract);

      await oneOfAKind.awardItem(1);

      await expect(oneOfAKind["safeTransferFrom(address,address,uint256)"](deployer.address, receiverContract.address, 1))
      .to.be.revertedWith("ERC721: transfer to non ERC721Receiver implementer");
    });

    it("Should cannot tranfer from new owner", async () => {
      const { oneOfAKind, deployer, firstUser } = await loadFixture(deployNFT);
      const { receiverContract, secondUser } = await loadFixture(deployReceiverContract);

      await oneOfAKind.awardItem(1);

      await oneOfAKind.transferFrom(deployer.address, receiverContract.address, 1);

      expect(await oneOfAKind.ownerOf(1)).to.eq(receiverContract.address);

      await receiverContract.sellToken(oneOfAKind.address, deployer.address, 1);

      expect(await oneOfAKind.ownerOf(1)).to.eq(deployer.address);
    });
  });
});
