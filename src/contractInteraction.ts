import {  ethers } from "ethers";
import ElectionABI from "./ElectionABI.json"; // Save your ABI as ElectionABI.json

const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS || "";

const getContractWithSigner = async () => {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed.");
  }

  // Ensure an account is connected
  const accounts = await window.ethereum.request({ method: "eth_accounts" });
  if (!accounts || accounts.length === 0) {
    await window.ethereum.request({ method: "eth_requestAccounts" }); // Prompt user to connect
  }

  // Create provider and signer
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, ElectionABI, signer);
};

interface Candidate {
  name: string;
  votes: number;
}

// Get the list of candidates
export const getCandidates = async () => {
  const contract = await getContractWithSigner(); // Ensure the contract is instantiated with the awaited signer
  const count = await contract.getCandidatesCount();
  console.log("count", count);
  const candidates: Candidate[] = [];
  for (let i = 0; i < count; i++) {
    const candidate = await contract.candidates(i);
    console.log("candidate", candidate);
    candidates.push({
      name: candidate.name,
      votes: candidate.voteCount ?? 0,
    });
  }
  return candidates;
};

// Cast a vote for a candidate
export const voteForCandidate = async (candidateId: number) => {
  const contract = await getContractWithSigner();
  const tx = await contract.vote(candidateId);
  await tx.wait();
  return tx;
};
