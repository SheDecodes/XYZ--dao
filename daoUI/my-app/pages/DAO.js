import Head from 'next/head'
import Image from 'next/Image'
import styles from '../styles/Home.module.css'
import Link from 'next/link';
//
import { BigNumber, Contract, providers, utils } from "ethers";
import { formatEther } from "ethers/lib/utils";
import { useEffect, useRef, useState } from "react";
import Web3Modal from "web3modal";
//
import {
    XYZdao_ABI,
    XYZdao_ADDRESS,
    XYZtoken_ABI,
    XYZtoken_ADDRESS ,
  } from "../constants";

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [balanceOfXYZTokens, setBalanceOfXYZTokens] =useState(0);
  const [tokenAmount, setTokenAmount] = useState(0);
  const [isOwner, setIsOwner] = useState(false);
  const web3ModalRef = useRef();
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
  const mintXYZToken = async (amount) => {
    try {
      const signer = await getProviderOrSigner(true);
      const tokenContract = new Contract(
        XYZtoken_ADDRESS,
        XYZtoken_ABI,
        signer
      );
      const value = 0.00001 * amount;
      const tx = await tokenContract.mint(amount, {
        value: utils.parseEther(value.toString()),
      });
      setLoading(true);
      await tx.wait();
      setLoading(false);
      window.alert("Sucessfully minted XYZ Tokens");
      await getBalanceOfXYZTokens();
    } catch (err) {
      console.error(err);
    }
  };
  //
  const getOwner = async () => {
    try {
      const provider = await getProviderOrSigner();
      const tokenContract = new Contract(
        XYZtoken_ADDRESS,
        XYZtoken_ABI,
        provider
      );
      const _owner = await tokenContract.dev();
      const signer = await getProviderOrSigner(true);
      const address = await signer.getAddress();
      if (address.toLowerCase() === _owner.toLowerCase()) {
        setIsOwner(true);
      }
    } catch (err) {
      console.error(err.message);
    }
  };
  //
  const withdrawCoins = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const tokenContract = new Contract(
        XYZtoken_ADDRESS,
        XYZtoken_ABI,
        signer
      );

      const tx = await tokenContract.withdraw();
      setLoading(true);
      await tx.wait();
      setLoading(false);
      await getOwner();
    } catch (err) {
      console.error(err);
    }
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
    connectWallet();
    getBalanceOfXYZTokens();
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
const MintButton = () => {
    if (loading) {
      return (
        <div>
          <button className={styles.mintBtn}>Loading...</button>
        </div>
      );
    }
    else if (walletConnected && isOwner) {
      return (
        <div>
          <div>
          <div>
            <input
              type="number"
              placeholder="Amount of Tokens"
              onChange={(e) => setTokenAmount(BigNumber.from(e.target.value))}
              className={styles.inputTokenToBuy}
            />
          </div>
  
          <button className={styles.mintBtn}
            disabled={!(tokenAmount > 0)}
            onClick={() => mintXYZToken(tokenAmount)}>
            Mint Tokens
          </button>
        </div>
          <button className={styles.mintBtn} onClick={withdrawCoins}>
            Withdraw Coins
          </button>
        </div>
      );
    }
    else {
      if(walletConnected){
        return (
        <div>
          <div>
            <input
              type="number"
              placeholder="Amount of Tokens"
              onChange={(e) => setTokenAmount(BigNumber.from(e.target.value))}
              className={styles.inputTokenToBuy}
            />
          </div>
  
          <button className={styles.mintBtn}
            disabled={!(tokenAmount > 0)}
            onClick={() => mintXYZToken(tokenAmount)}>
            Mint Tokens
          </button>
        </div>
      );}}
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
        <section className={`${styles["options-outline"]}`}>
          <div className={`${styles["option"]} ${styles["float"]}`}>
            <img src={"/add proposal.svg"} className={styles.addProposal}/>
            <div className={`${styles["option-para"]}`}>
            &#9679; Add new DAO proposals.
              <br />
              &#9679; Bring-in your community to vote.
              <br />
              &#9679; Fundraise after approval.
            </div>
            <Link href="/Add"><button className={`${styles["btn-proposal"]} ${styles["option"]}`}>Add</button></Link>
          </div>
          {/** */}
          <div className={`${styles["option"]} ${styles["float"]}`}>
            <img src={"/onchainvoting.svg"} className={styles.addProposal}/>
              <div className={`${styles["option-para"]}`}>
                &#9679; Vote transparently on-chain. 
                <br />
                &#9679; Get incentivised for voting.
                <br />
                &#9679; Stake XYZ tokens to get higher rewards.
              </div>
              <Link href="/Vote"><button className={`${styles["btn-proposal"]} ${styles["option"]}`}>Vote</button></Link>
          </div>
          {/** */}
          <div className={`${styles["option"]} ${styles["float"]}`}>
          <img src={"/investmentpools.svg"} className={styles.addProposal}/>
              <div className={`${styles["option-para"]}`}>
                &#9679; Invest in community approved projects. 
                <br />
                &#9679; Clean and sleek claim dashboard.
                <br />
                &#9679; Stake for early seed round investment.
              </div>
              <Link href="/Invest"><button className={`${styles["btn-proposal"]} ${styles["option"]}`}>Invest</button></Link>
          </div>
        </section>
        <section className={styles.sectionYourHolding}>
            <div className={styles.headingContainer}>
                <hr className={styles.headingLine}/>
                <h1 className={styles.holdingHeading}>Your Holdings</h1>
                <hr className={styles.headingLine}/> 
            </div>
            <h1 className={styles.HoldingValue}>You Hold: <span className={styles.balanceNum}>{balanceOfXYZTokens}</span> XYZ tokens</h1>
            <h1 className={styles.tokenRate}>One XYZ token cost 0.00001 eth</h1>
            {MintButton()}
        </section>
        <section className={styles.contractInfo}>
        <div className={styles.headingContainer}>
                <hr className={styles.headingLine}/>
                <h1 className={styles.holdingHeading}>Contract Info</h1>
                <hr className={styles.headingLine}/> 
            </div>
          <div className={styles.contactAdd}>
            Contract Address: <br/> <span className={styles.contractColor}>0x57d4d07F305e76c551b1ff023aabF190074A4698</span>
          </div>
          <div className={styles.decimals}>
            Decimals: 18
          </div>
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
