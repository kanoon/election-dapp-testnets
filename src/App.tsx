import React, { useState, useEffect } from "react";
import { getCandidates, voteForCandidate } from "./contractInteraction";

function App() {
  const [candidates, setCandidates] = useState<
    { name: string; votes: number }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  // Function to connect the wallet
  const connectWallet = async () => {
    if (typeof window.ethereum === "undefined") {
      alert("MetaMask is not installed. Please install MetaMask to continue.");
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const account = accounts[0];
      setWalletAddress(account);
      console.log("Connected wallet:", account);
    } catch (error) {
      console.error("Error connecting wallet:", error);
      alert("Failed to connect wallet. Please try again.");
    }
  };
  const fetchCandidates = async () => {
    if (!walletAddress) return; // Fetch only when wallet is connected
    setLoading(true);
    const candidatesList = await getCandidates();
    setCandidates(candidatesList);
    setLoading(false);
  };
  useEffect(() => {
    // const fetchCandidates = async () => {
    //   if (!walletAddress) return; // Fetch only when wallet is connected
    //   setLoading(true);
    //   const candidatesList = await getCandidates();
    //   setCandidates(candidatesList);
    //   setLoading(false);
    // };
    fetchCandidates();
  }, [walletAddress]); // Refetch when the walletAddress changes

  const handleVote = async (candidateId: number) => {
    if (!walletAddress) {
      alert("Please connect your wallet before voting.");
      return;
    }

    try {
      await voteForCandidate(candidateId);
      alert("Vote successful!");
      fetchCandidates();
    } catch (error: any) {
      // Extract the reason for the error
      const errorMessage = error?.reason || "An error occurred while voting.";
      console.error("Error voting:", error);
      alert(errorMessage); // Show the error message to the user
    }
  };

  return (
    <div>
      <h1>Election DApp</h1>

      {/* Wallet Connection */}
      {!walletAddress ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <p>Connected Wallet: {walletAddress}</p>
      )}

      {/* Candidates */}
      {loading && walletAddress ? (
        <p>Loading candidates...</p>
      ) : (
        <ul>
          {candidates.map((candidate, index) => (
            <li key={index}>
              <strong>{candidate.name}</strong> - Votes: {candidate.votes}
              <button onClick={() => handleVote(index)}>Vote</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
