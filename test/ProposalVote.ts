import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("ProposalVote Test", () => {
  const deployPropsVoteListFixture = async () => {
    const [address1, address2, address3] = await hre.ethers.getSigners();

    const ProposalVote = await hre.ethers.getContractFactory("ProposalVote");
    const proposalVote = await ProposalVote.deploy();

    return { proposalVote, address1, address2, address3 };
  };

  describe("Proposal Creation", () => {
    it("should allow participant to create a proposal", async () => {
      const { proposalVote, address1 } = await loadFixture(
        deployPropsVoteListFixture
      );

      const proposal = {
        title: "Changes In Payment Mode",
        desc: "bla bla bal",
        quorum: 2,
      };

      await proposalVote
        .connect(address1)
        .createProposal(proposal.title, proposal.desc, proposal.quorum);

      const getProposal = await proposalVote.getProposal(0);

      expect(getProposal.title_).to.equal(proposal.title);
      expect(getProposal.desc_).to.equal(proposal.desc);
      expect(getProposal.quorum_).to.equal(proposal.quorum);
      expect(getProposal.voteCount_).to.equal(0); // No votes yet
    });
  });

  describe("Voting on Proposal", () => {
    it("should allow users to vote on a proposal and update vote count", async () => {
      const { proposalVote, address1, address2 } = await loadFixture(
        deployPropsVoteListFixture
      );

      await proposalVote
        .connect(address1)
        .createProposal("Proposal A", "Test Proposal A", 2);

      await proposalVote.connect(address1).voteOnProposal(0);

      const getProposal = await proposalVote.getProposal(0);
      expect(getProposal.voteCount_).to.equal(1);
      expect(getProposal.status_).to.equal(2); // Pending

      //Updating staus and count
      await proposalVote.connect(address2).voteOnProposal(0);

      const updatedProposal = await proposalVote.getProposal(0);
      expect(updatedProposal.voteCount_).to.equal(2);
      expect(updatedProposal.status_).to.equal(3); // Accepted
    });

    it("should revert if user tries to vote twice on the same proposal", async () => {
      const { proposalVote, address1 } = await loadFixture(
        deployPropsVoteListFixture
      );

      await proposalVote
        .connect(address1)
        .createProposal("Proposal B", "Test Proposal B", 2);

      // Address1 votes on the proposal
      await proposalVote.connect(address1).voteOnProposal(0);

      // Address1 tries to vote again
      await expect(
        proposalVote.connect(address1).voteOnProposal(0)
      ).to.be.revertedWith("You've voted already");
    });

    it("should revert if the proposal index is out of bounds", async function () {
      const { proposalVote } = await loadFixture(deployPropsVoteListFixture);

      const invalidIndex = 99;

      await expect(
        proposalVote.voteOnProposal(invalidIndex)
      ).to.be.revertedWith("Out of bound!");
    });

    it("should revert if user votes after the proposal is accepted", async () => {
      const { proposalVote, address1, address2, address3 } = await loadFixture(
        deployPropsVoteListFixture
      );

      // Create a proposal
      await proposalVote
        .connect(address1)
        .createProposal("Proposal C", "Test Proposal C", 2);

      // Address1 and Address2 vote to meet the quorum and accept the proposal
      await proposalVote.connect(address1).voteOnProposal(0);
      await proposalVote.connect(address2).voteOnProposal(0);

      // Address3 tries to vote after quorum is reached
      await expect(
        proposalVote.connect(address3).voteOnProposal(0)
      ).to.be.revertedWith("This proposal has been accepted");
    });
  });
});
