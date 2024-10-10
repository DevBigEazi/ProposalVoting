import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { status } from "@nomicfoundation/ignition-core";
import { expect } from "chai";
import hre from "hardhat";

describe("ProposalVote Test", () => {
  const deployPropsVoteListFixture = async () => {
    const [address1, address2] = await hre.ethers.getSigners();

    const ProposalVote = await hre.ethers.getContractFactory("ProposalVote");
    const proposalVote = await ProposalVote.deploy();

    return { proposalVote, address1, address2 };
  };

  describe("Deployment", () => {
    it("should allow participant to create a proposal", async () => {
      const { proposalVote, address1 } = await loadFixture(
        deployPropsVoteListFixture
      );

      const proposal = [
        {
          title: "Changes In Payment Mode",
          desc: "bla bla bal",
          qurom: 6,
        },
      ];

      await proposalVote
        .connect(address1)
        .createProposal(proposal[0].title, proposal[0].desc, proposal[0].qurom);

      expect(await proposal[0]).to.equal(proposal[0]);
    });

    it("should revert if the proposal index is out of bounds", async function () {
      const { proposalVote } = await loadFixture(deployPropsVoteListFixture);

      const invalidIndex = 99;

      await expect(
        proposalVote.voteOnProposal(invalidIndex)
      ).to.be.revertedWith("Out of bound!");
    });


    it("should allow voting and update the proposal status", async function () {
        const { proposalVote, address1 } = await loadFixture(deployPropsVoteListFixture);

        await proposalVote.connect(address1).voteOnProposal(0);

        let proposal = await proposalVote.proposals(0);
        expect(proposal.voteCount).to.equal(1);
        expect(proposal.status).to.equal(0); 
    });
  });
});
