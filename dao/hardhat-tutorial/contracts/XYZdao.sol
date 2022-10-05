// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// Interfaces 
interface IXYZtoken {
    function holders(address) external view returns (uint256);
}
// contract 
contract XYZdao is Ownable {
    // 
    struct Proposal {
    uint256 TokenId;
    uint256 deadline;
    uint256 yayVotes;
    uint256 nayVotes;
    bool executed;
    bool created;
    mapping(address => bool) voters;}
// 
mapping(uint256 => bool) public ProposalResult;
//
mapping(uint256 => Proposal) public proposals;
uint256 public numProposals;
//
IXYZtoken XYZtoken;
// 
constructor(address _XYZtoken) payable {
    XYZtoken = IXYZtoken(_XYZtoken);
}
//
modifier XYZHolderOnly() {
    require(XYZtoken.holders(msg.sender) > 0, "NOT_A_DAO_MEMBER");
    _;
}
//
function createProposal(uint256 _TokenId)
    external
    XYZHolderOnly
    returns (uint256)
{
    Proposal storage proposal = proposals[numProposals];
    proposal.TokenId = _TokenId;
    proposal.deadline = block.timestamp + 5 minutes;
    numProposals++;
    proposal.created=true;
    return numProposals - 1;
}
// 
modifier activeProposalOnly(uint256 proposalIndex) {
    require(
        proposals[proposalIndex].created == true,
        "Proposal Do NOT Exist"
    );
    require(
        proposals[proposalIndex].deadline > block.timestamp,
        "DEADLINE_EXCEEDED"
    );
    _;
}
// 
enum Vote {
    YAY, 
    NAY 
}
// 
function voteOnProposal(uint256 proposalIndex, Vote vote)
    external
    XYZHolderOnly
    activeProposalOnly(proposalIndex)
{
    Proposal storage proposal = proposals[proposalIndex];
    uint256 numVotes = 0;
    // Calculate if already voted or not.
        if (proposal.voters[msg.sender] == false) {
            numVotes++;
            proposal.voters[msg.sender] = true;
        }
    require(numVotes > 0, "ALREADY_VOTED");

    if (vote == Vote.YAY) {
        proposal.yayVotes += 1;
    } else {
        proposal.nayVotes += 1;
    }
}
// 
modifier inactiveProposalOnly(uint256 proposalIndex) {
    require(
        proposals[proposalIndex].deadline <= block.timestamp,
        "DEADLINE_NOT_EXCEEDED"
    );
    require(
        proposals[proposalIndex].executed == false,
        "PROPOSAL_ALREADY_EXECUTED"
    );
    _;
}
// 
function executeProposal(uint256 proposalIndex)
    external
    XYZHolderOnly
    inactiveProposalOnly(proposalIndex)
{
    Proposal storage proposal = proposals[proposalIndex];

    // If the proposal has more YAY votes than NAY votes
    if (proposal.yayVotes > proposal.nayVotes) {
        ProposalResult[proposalIndex]=true;
    }
    proposal.executed = true;
}
// 
function withdrawEther() external onlyOwner {
    payable(owner()).transfer(address(this).balance);
}
// 
receive() external payable {}

fallback() external payable {}

}