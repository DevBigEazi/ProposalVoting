import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const ProposalVoteModule = buildModule("ProposalVoteModule", (m) => {
  const proposalVote = m.contract("ProposalVote");

  return { proposalVote };
});

export default ProposalVoteModule;
