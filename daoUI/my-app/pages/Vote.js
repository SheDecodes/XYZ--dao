import { BigNumber, Contract, providers, utils} from "ethers";
import { formatEther } from "ethers/lib/utils";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import Web3Modal from "web3modal";
import styles from "../styles/Home.module.css";
import Link from 'next/link';
import {
    XYZdao_ABI,
    XYZdao_ADDRESS,
    XYZtoken_ABI,
    XYZtoken_ADDRESS ,
  } from "../constants";

//
//
export default function Home() {
      //
    //
  const [treasuryBalance, setTreasuryBalance] = useState("0");
  const [numProposals, setNumProposals] = useState(0);
  const [TokenId, setTokenId] = useState("");
  const [loading, setLoading] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const web3ModalRef = useRef();
  const [balanceOfXYZTokens, setBalanceOfXYZTokens] =useState(0);
  const [proposals, setProposals] = useState([]);
  //
  //
  useEffect(() => {
    fetchAllProposals();
  });
  
  const fetchProposalById = async (id) => {
    try {
      const provider = await getProviderOrSigner();
      const daoContract = getDaoContractInstance(provider);
      const proposal = await daoContract.proposals(id);
         
      const parsedProposal = {
        proposalId: id,
        TokenId: proposal.TokenId.toString(),
        deadline: new Date(parseInt(proposal.deadline.toString()) * 1000),
        yayVotes: proposal.yayVotes.toString(),
        nayVotes: proposal.nayVotes.toString(),
        executed: proposal.executed,
      };
      
      return parsedProposal;
    } catch (error) {
      console.error(error);
    }
  };
  //
  const fetchAllProposals = async () => {
    try {
      const proposals = [];
      for (let i = 0; i <=numProposals; i++) {
        const proposal = await fetchProposalById(i);
        proposals.push(proposal);
      }
      setProposals(proposals);
      return proposals;
    } catch (error) {
      console.error(error);
    }
  };
  //
  const voteOnProposal = async (proposalId, _vote) => {
    try {
      const signer = await getProviderOrSigner(true);
      const daoContract = getDaoContractInstance(signer);

      let vote = _vote === "YAY" ? 0 : 1;
      const txn = await daoContract.voteOnProposal(proposalId, vote);
      setLoading(true);
      await txn.wait();
      setLoading(false);
      await fetchAllProposals();
    } catch (error) {
      console.error(error);
      window.alert(error.data.message);
    }
  };
  //
  const executeProposal = async (proposalId) => {
    try {
      const signer = await getProviderOrSigner(true);
      const daoContract = getDaoContractInstance(signer);
      const txn = await daoContract.executeProposal(proposalId);
      setLoading(true);
      await txn.wait();
      setLoading(false);
      await fetchAllProposals();
    } catch (error) {
      console.error(error);
      window.alert(error.data.message);
    }
  };
  //
  function renderViewProposalsTab() {
    if (loading) {
        return (
          <button className={styles.mintBtn}>
            Loading... Waiting for transaction...
          </button>
        );
      }else if (proposals.length === 0) {
      return (
        <div className={styles.NoTokenDes}>No proposals have been created {proposals}</div>
      );
    } else {
      return (
        <div>
          {proposals.map((p, index) => (
            <div key={index} className={styles.proposalCard}>
              <p>Proposal ID: {p.proposalId}</p>
              <p>TokenId to Invest in: {p.TokenId}</p>
              <p>Deadline: {p.deadline.toLocaleString()}</p>
              <p>Yay Votes: {p.yayVotes}</p>
              <p>Nay Votes: {p.nayVotes}</p>
              <p>Executed?: {p.executed.toString()}</p>
              {p.deadline.getTime() > Date.now() && !p.executed ? (
                <div className={styles.flex}>
                  <button
                    className={styles.button2}
                    onClick={() => voteOnProposal(p.proposalId, "YAY")}
                  >
                    Vote YAY
                  </button>
                  <button
                    className={styles.button2}
                    onClick={() => voteOnProposal(p.proposalId, "NAY")}
                  >
                    Vote NAY
                  </button>
                </div>
              ) : p.deadline.getTime() < Date.now() && !p.executed ? (
                <div className={styles.flex}>
                  <button
                    className={styles.button2}
                    onClick={() => executeProposal(p.proposalId)}
                  >
                    Execute Proposal{" "}
                    {p.yayVotes > p.nayVotes ? "(YAY)" : "(NAY)"}
                  </button>
                </div>
              ) : (
                <div className={styles.description}>Proposal Executed</div>
              )}
            </div>
          ))}
        </div>
      );
    }
  }

  //
  //
  const getDAOTreasuryBalance = async () => {
    try {
      const provider = await getProviderOrSigner();
      const balance = await provider.getBalance(
        XYZdao_ADDRESS
      );
      setTreasuryBalance(balance.toString());
    } catch (error) {
      console.error(error);
    }
  };
  //
  const getBalanceOfXYZTokens = async () => {
    try {
      const provider = await getProviderOrSigner();
      const tokenContract = new Contract(
        XYZtoken_ADDRESS,
        XYZtoken_ABI,
        provider
      );
      const signer = await getProviderOrSigner(true);
      const address = await signer.getAddress();
      const balance = await tokenContract.holders(address);
      setBalanceOfXYZTokens(balance.toNumber());
    } catch (err) {
      console.error(err);
      setBalanceOfXYZTokens(0);
    }
  };
  const getNumProposalsInDAO = async () => {
    try {
      const provider = await getProviderOrSigner();
      const contract = getDaoContractInstance(provider);
      const daoNumProposals = await contract.numProposals();
      setNumProposals(daoNumProposals.toNumber());
    } catch (error) {
      console.error(error);
    }
  };
  //
    const getDaoContractInstance = (providerOrSigner) => {
        return new Contract(
            XYZdao_ADDRESS,
            XYZdao_ABI,
          providerOrSigner
        );
      };
      //
      const getXYZtokenContractInstance = (providerOrSigner) => {
        return new Contract(
            XYZtoken_ADDRESS,
            XYZtoken_ABI,
          providerOrSigner
        );
      };
      //
      const connectWallet = async () => {
        try {
          await getProviderOrSigner();
          setWalletConnected(true);
        } catch (error) {
          console.error(error);
        }
      };
      //
      const getProviderOrSigner = async (needSigner = false) => {
        const provider = await web3ModalRef.current.connect();
        const web3Provider = new providers.Web3Provider(provider);
        const { chainId } = await web3Provider.getNetwork();
        if (chainId !== 80001) {
          window.alert("Change the network to Mumbai Polygon");
          throw new Error("Change network to Mumbai Polygon");
        }
    
        if (needSigner) {
          const signer = web3Provider.getSigner();
          return signer;
        }
        return web3Provider;
      };
        //
        useEffect(() => {
        if (!walletConnected) {
          web3ModalRef.current = new Web3Modal({
            network: "matic",
            providerOptions: {},
            disableInjectedProvider: false,
          });
          connectWallet().then(() => {
            getDAOTreasuryBalance();
            getNumProposalsInDAO();
            getBalanceOfXYZTokens();
            
          });
        }
    }, [walletConnected]);
        //
    const renderButton = () => {
        if (walletConnected) {
            return (
              <button className={`${styles["btn-wallet"]} ${styles["reColourBack"]} ${styles["ConnectWalletFont"]}`}>
            Wallet Connected</button>
            );}
            else {
            return (
              <button className={`${styles["btn-wallet"]} ${styles["reColourBack"]} ${styles["ConnectWalletFont"]}`} onClick={connectWallet}>
            Connect Wallet </button>
            );
          }
      };
      //
    return (
        <div>
          <Head>
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <title>DAO Based Economy</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta charset="UTF-8" />
    
        {/**<!--responsive--> */} 
        <meta
          name="viewport"
          content="width=device-width, initial-scale=0.86, maximum-scale=5.0, minimum-scale=0.86"
        />
    
        {/**<!-- description --> */} 
        <meta name="description" content="DAO" />
    
        {/**<!--tab icon--> */}
        <link rel="icon" type="img/x-icon" href="/DAOlogo.svg" />
        {/**<!-- APPLE ICON--> */}
        <link rel="apple-touch-icon" href="/DAOlogo.svg" />
          </Head>
    
          <main className={styles.main}>
            <div className={styles.wholeBody}>
          <nav className={`${styles["card"]} ${styles["verticalNav"]}`}>
            <img src={"/DAOlogo.svg"} className={styles.logo} />
            <div className={`${styles["vertical-nav-icons"]}`}>
            <Link href="/"><img src={"/home-icon.png"} className={`${styles["homeIcon"]} ${styles["resize"]}`}/></Link>
              <Link href="/DAO"><img src={"listing.png"}className={`${styles["list"]} ${styles["resize"]}`}/></Link>
              <Link href="/DAO"><img src={"/wallet.png"} className={`${styles["wallet"]} ${styles["resize"]}`} /></Link>
              <img src={"/faqs.png"} className={`${styles["faqs"]} ${styles["resize"]}`} />
            </div>
            <div className={`${styles["extra-space"]}`}></div>
          </nav>
          <div className={styles.rightContent}>
            <nav className={`${styles["card-borderlight"]} ${styles["horizontalNav"]}`}>
              <h2 className={`${styles["Logo-Name"]}`}>XYZ-DAO</h2>
              {/* <button className={`${styles["btn-wallet"]} ${styles["reColourBack"]} ${styles["ConnectWalletFont"]}`}>
                Connect Wallet
              </button> */}
              {renderButton()}
              {/* <div className={`${styles["extra-space-right"]}`}></div> */}
            </nav>
            {/** */}
            <section className={styles.SectionVote}>
            <div className={styles.headingContainer}>
                <hr className={styles.headingLine}/>
                <h1 className={`${styles["holdingHeading"]} ${styles["CreatePropHeading"]}`}>Vote On Proposals</h1>
                <hr className={styles.headingLine}/>
            </div>
            <div>
                <h1 className={styles.DaoTreasury}>Our DAO has Treadury Balance of <span className={styles.balanceTreasury}>{treasuryBalance}</span> ETH</h1>
                <h1 className={styles.CreatedPorp}><span className={styles.balanceNum}>{numProposals}</span> Proposals Already Created!</h1>
            </div>
            {renderViewProposalsTab()}
            </section>
            
          </div>
        </div>
          </main>
    
          <footer className={`${styles["footer"]} ${styles["card2"]}`}>
          <p className={styles.copyright}>&#169; XYZ-DAO 2022</p>
          <div className={`${styles["social-footer"]}`}>
            <img src={"/twitter.png"} className={`${styles["twitter-footer"]}`}  />
            <img src={"/telegram.png"} className={`${styles["telegram-footer"]}`} />
            <img src={"/github.png"} className={`${styles["github-footer"]}`} />
            <img src={"/discord.png"} className={`${styles["discord-footer"]}`}  />
          </div>
        </footer>
        </div>
      );
}
