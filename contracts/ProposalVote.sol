// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

contract ProposalVote {

    enum PropsStatus{ None, Created, Pending, Accepted }

    struct Proposal {
        string title;
        string description;
        uint16 voteCount;
        address[] voters;
        uint16 quorum;
        PropsStatus status;
    }

    mapping (address voter => mapping (uint8 indexOfProps => bool)) hasVoted;

    Proposal[] public proposals;

    // events
    event ProposalCreated(string indexed title, uint16 quorum);
    event ProposalActive(string indexed title, uint16 voteCount);
    event ProposalApproved(string indexed title, uint16 voteCount);

    function createProposal(string memory _title, string memory _desc, uint16 _quorum) external {
        require(msg.sender != address(0), "Zero address is not allowed");

        Proposal memory newProposal;
        newProposal.title = _title;
        newProposal.description = _desc;
        newProposal.quorum = _quorum;
        newProposal.status = PropsStatus.Created;

        proposals.push(newProposal);

        emit ProposalCreated(_title, _quorum);
    }

    function voteOnProposal(uint8 _index) external {
        require(msg.sender != address(0), "Zero address is not allowed");
        require(_index < proposals.length, "Out of bound!");
        require(!hasVoted[msg.sender][_index], "You've voted already");

        Proposal storage currentProposal = proposals[_index];

        require(currentProposal.status != PropsStatus.Accepted, "This proposal has been accepted");


        currentProposal.voteCount += 1;

        currentProposal.voters.push(msg.sender);

        hasVoted[msg.sender][_index] = true;

        currentProposal.status = PropsStatus.Pending;

        if (currentProposal.voteCount >= currentProposal.quorum) {
            currentProposal.status = PropsStatus.Accepted;

            emit ProposalApproved(currentProposal.title, currentProposal.voteCount);
        } else {          
            emit ProposalActive(currentProposal.title, currentProposal.voteCount);
        }
        
    }

    function getAllProposals () external view returns (Proposal[] memory) {
        return proposals;
    }

    function getProposal(uint8 _index) external view returns (
        string memory title_, string memory desc_, uint16 voteCount_, address[] memory voters_, uint16 quorum_, PropsStatus status_
    ) {
        require(msg.sender != address(0), "Zero address not allowed!");
        require(_index < proposals.length, "Out of bound!");

        Proposal memory currentProposal = proposals[_index];

        title_ = currentProposal.title;
        desc_ = currentProposal.description;
        voteCount_ = currentProposal.voteCount;
        voters_ = currentProposal.voters;
        quorum_ = currentProposal.quorum;
        status_ = currentProposal.status;
    }

}