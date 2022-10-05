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
  const [numProposals, setNumProposals] = useState("0");
  const [TokenId, setTokenId] = useState(0);
  const [loading, setLoading] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const web3ModalRef = useRef();
  const [balanceOfXYZTokens, setBalanceOfXYZTokens] =useState(0);
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
  const getNumProposalsInDAO = async () => {
    try {
      const provider = await getProviderOrSigner();
      const contract = getDaoContractInstance(provider);
      const daoNumProposals = await contract.numProposals();
      setNumProposals(daoNumProposals.toString());
    } catch (error) {
      console.error(error);
    }
  };
  //
  const createProposal = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const daoContract = getDaoContractInstance(signer);
      const txn = await daoContract.createProposal(TokenId);
      setLoading(true);
      await txn.wait();
      await getNumProposalsInDAO();
      setLoading(false);
    } catch (error) {
      console.error(error);
      window.alert(error.data);
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
  //
  //
  function renderCreateProposalTab() {
    if (loading) {
      return (
        <button className={styles.mintBtn}>
          Loading... Waiting for transaction...
        </button>
      );
    } else if (balanceOfXYZTokens === 0) {
      return (
        <div>
        <div className={styles.NoTokenDes}>
          You do not own any XYZ Token<br />
          <b>You cannot create or vote on proposals</b>
        </div>
        <br/>
        <Link href="/DAO">
        <button className={styles.mintBtn}>
          Get XYZ token
        </button>
        </Link>
        </div>
        
        
      );
    } else {
      return (
        <div className={styles.CreatePropInputcontainer}>
          <label className={styles.CreatePropLabel}>Token ID to get Community Opinion on:</label>
          <br/>
          <input
            placeholder="0"
            type="number"
            onChange={(e) => setTokenId(e.target.value)}
            className={styles.inputTokenToBuy}
          />
          <br/>
          <button className={styles.mintBtn} onClick={createProposal}>
            Create
          </button>
        </div>
      );
    }
  }
  //
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
            <section className={styles.sectionCreateProposal}>
            <div className={styles.headingContainer}>
                <hr className={styles.headingLine}/>
                <h1 className={`${styles["holdingHeading"]} ${styles["CreatePropHeading"]}`}>Create Your Proposal</h1>
                <hr className={styles.headingLine}/>
            </div>
            <div>
                <h1 className={styles.DaoTreasury}>Our DAO has Treadury Balance of <span className={styles.balanceTreasury}>{treasuryBalance}</span> ETH</h1>
                <h1 className={styles.CreatedPorp}><span className={styles.balanceNum}>{numProposals}</span> Proposals Already Created!</h1>
            </div>
            {renderCreateProposalTab()}
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