import hre from "hardhat";

const main = async () => {
  const DEPLOYED_CONTRACT_ADDRESS =
    "0x497CC525dc3CbDa236B51D8de92875891bE433eF";

  const owner = "0xa748409456180ccb70FA34e8ee276297B9A2a1cC";

  const voter1 = "0xA6bFcA8DAd54238a6c0951bcbA0b66A7Ace5DaAC";
  const voter2 = "0x695B1A135f23C89099C4Ce22e416799659b3f6f6";

  const signer1 = await hre.ethers.getSigner(owner);
  const signer2 = await hre.ethers.getSigner(voter1);
  const signer3 = await hre.ethers.getSigner(voter2);

  const contractInsatance = await hre.ethers.getContractAt(
    "ProposalVote",
    DEPLOYED_CONTRACT_ADDRESS
  );

  // starg scripting

  console.log("######### Create Proposal #########");
  const createProposal = await contractInsatance
    .connect(signer1)
    .createProposal("Upgrade EIP30", "This proposal blalaa blabla......", 2);

  createProposal.wait();

  console.log({ "Proposal Created to": DEPLOYED_CONTRACT_ADDRESS });
  console.log({ "Proposal Created with": createProposal });

  console.log("######### Vote on Proposal #########");
  const vote1 = await contractInsatance.connect(signer1).voteOnProposal(2);
  vote1.wait();

//   const vote2 = await contractInsatance.connect(signer2).voteOnProposal(0);
//   vote2.wait();

//   const vote3 = await contractInsatance.connect(signer3).voteOnProposal(0);
//   vote3.wait();

  console.log(vote1);

  console.log("######### Getting All Proposals #########");
  const getAllProposals = await contractInsatance
    .connect(signer1)
    .getAllProposals();

  console.table(getAllProposals);

  console.log("######### Getting Proposal #########");
  const getProposal = await contractInsatance.connect(signer1).getProposal(0);

  console.log({ "First Proposal": getProposal });
};

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
