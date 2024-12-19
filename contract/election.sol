// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Election {
    // Struct to represent a candidate
    struct Candidate {
        string name;
        uint256 voteCount;
    }

    // Array of candidates
    Candidate[] public candidates;

    // Mapping to track if an address has voted
    mapping(address => bool) public hasVoted;

    // Owner of the contract
    address public owner;

    // Election state
    bool public electionEnded;

    // Events
    event CandidateRegistered(string name);
    event VoteCasted(address voter, uint256 candidateId);
    event ElectionEnded(uint256 winnerId, string winnerName);

    // Constructor to set the contract owner
    constructor() {
        owner = msg.sender;
    }

    // Modifier to restrict access to the owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    // Modifier to check if the election is ongoing
    modifier electionOngoing() {
        require(!electionEnded, "Election has already ended");
        _;
    }

    // Register a new candidate (owner only)
    function registerCandidate(string memory _name) public onlyOwner electionOngoing {
        candidates.push(Candidate({name: _name, voteCount: 0}));
        emit CandidateRegistered(_name);
    }

    // Vote for a candidate
    function vote(uint256 _candidateId) public electionOngoing {
        require(!hasVoted[msg.sender], "You have already voted");
        require(_candidateId < candidates.length, "Invalid candidate ID");

        // Mark the sender as voted
        hasVoted[msg.sender] = true;

        // Increment the vote count for the chosen candidate
        candidates[_candidateId].voteCount++;

        emit VoteCasted(msg.sender, _candidateId);
    }

    // End the election and determine the winner (owner only)
    function endElection() public onlyOwner electionOngoing {
        electionEnded = true;

        // Find the candidate with the highest vote count
        uint256 winnerId;
        uint256 maxVotes = 0;
        for (uint256 i = 0; i < candidates.length; i++) {
            if (candidates[i].voteCount > maxVotes) {
                maxVotes = candidates[i].voteCount;
                winnerId = i;
            }
        }

        emit ElectionEnded(winnerId, candidates[winnerId].name);
    }

    // Get the total number of candidates
    function getCandidatesCount() public view returns (uint256) {
        return candidates.length;
    }
}
