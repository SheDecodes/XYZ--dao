import Head from 'next/head'
import Image from 'next/Image'
import styles from '../styles/Home.module.css'
import Link from 'next/link';
//
import { Contract, providers } from "ethers";
import { formatEther } from "ethers/lib/utils";
import { useEffect, useRef, useState } from "react";
import Web3Modal from "web3modal";
//

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);
  const web3ModalRef = useRef();
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
        <section className={`${styles["home"]} ${styles["card2"]}`}>
          <div className={`${styles["home-left"]}`}>
            <h1 className={`${styles["home-head"]}`}>
              DAO-based ecosystem to fundraise and invest
            </h1>
            <p className={`${styles["home-desc"]}`}>
              Introducing the most curated list of blockchain-based projects for
              the community to vote, decide, and invest.
            </p>
            <div className={`${styles["btn-align"]}`}>
              <Link href="/DAO">
                <button className={`${styles["btn-wallet"]} ${styles["reColourBack"]} ${styles["ConnectWalletFont"]} ${styles["resize-btn"]}`}>
                  Launch dApp
                </button></Link>
            </div>
          </div>
          <div>
            <img src={"/bitcoin.svg"} className={styles.bitcoin} />
            </div>
        </section>
        <section>
          <h1 className={styles.supported}>Supported Chain :</h1>
          <div className={styles.chain}>
            <img src={"/chains.svg"} className={`${styles["all-logo"]}`} />
          </div>
        </section>
        <section>
          <div className={`${styles["card-about"]}`}>
            <h1 className={`${styles["card-head"]}`}>Main Features</h1>
            <p className={`${styles["card-para"]}`}>
              Deploy proposals, Vote, Launch or invest using this DAO-based
              investment platform
            </p>
          </div>
          <div className={`${styles["card-outline"]}`}>
            <div className={`${styles["card-feature"]} ${styles["card2"]}`}>
              <img src={"/vote.png"} className={`${styles["img-vote"]}`} />
              <h2 className={styles.vote}>Create proposals</h2>
              <p className={`${styles["vote-des"]}`}>
              Deploy DAO proposals for fundraising pool requests
              </p>
            </div>
            <div className={`${styles["card-feature"]} ${styles["card2"]}`}>
              <img src={"/vote.png"} className={`${styles["img-vote"]}`} />
              <h2 className={styles.vote}>Vote on-chain</h2>
              <p className={`${styles["vote-des"]}`}>
                Use your XYZ tokens to vote on ongoing proposals
              </p>
            </div>
            <div className={`${styles["card-feature"]} ${styles["card2"]}`}>
              <img src={"/launchinvest.png"} className={`${styles["img-launch"]}`} />
              <h2 className={styles.launch}>Launch/Invest</h2>
              <p className={`${styles["launch-des"]}`}>
                Launch a project or invest transparently on trustless system
              </p>
            </div>
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
