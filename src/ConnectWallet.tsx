import React, { useState } from "react";

function ConnectWallet() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  // Function to handle wallet connection
  const connectWallet = async () => {
    if (typeof window.ethereum === "undefined") {
      alert("MetaMask is not installed. Please install MetaMask to continue.");
      return;
    }

    try {
      // Request wallet connection
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const account = accounts[0]; // Get the first account
      setWalletAddress(account); // Set the wallet address in state
      console.log("Connected wallet:", account);
    } catch (error) {
      console.error("Error connecting wallet:", error);
      alert("Failed to connect wallet. Please try again.");
    }
  };

  return (
    <div>
      <h1>Connect to MetaMask</h1>
      {!walletAddress ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <p>Connected Wallet: {walletAddress}</p>
      )}
    </div>
  );
}

export default ConnectWallet;
