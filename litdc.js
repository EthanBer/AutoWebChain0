import { LitNodeClient, encryptString, decryptToString } from "@lit-protocol/lit-node-client";
import { LitNetwork, LIT_RPC } from "@lit-protocol/constants";
import * as ethers from "ethers";
import 'dotenv/config'
import {
  createSiweMessage,
  generateAuthSig,
  LitAbility,
  LitAccessControlConditionResource,
} from "@lit-protocol/auth-helpers";

const ethersWallet = new ethers.Wallet(
  "lallalallalalal", // Replace with your private key
  new ethers.providers.JsonRpcProvider(LIT_RPC.CHRONICLE_YELLOWSTONE)
); const chain = 'ethereum';
const accessControlConditions = [
   {
     contractAddress: '',
     standardContractType: '',
     chain,
     method: 'eth_getBalance',
     parameters: [':userAddress', 'latest'],
     returnValueTest: {
       comparator: '>=',
       value: '0',
     },
   },
 ];
 const message = 'Hello world';
 const client = new LitNodeClient({
   litNetwork: "datil-dev"
 });
 
 await client.connect();
 // Step 1: Generate the authSig using the wallet
const authSig = await generateAuthSig({
    ethersWallet,
    chain
 });
 
 // Step 2: Create the session signatures (sessionSigs)
 const sessionSigs = await client.getSessionSigs({
    authSig,
    accessControlConditions,
    chain
 });
 
 const { ciphertext, dataToEncryptHash } = await encryptString(
   {
     accessControlConditions,
     sessionSigs, // your session
     chain,
     dataToEncrypt: message,
   },
   client
 );

 console.log("cipher text:", ciphertext, "hash:", dataToEncryptHash);
 const code = `(async () => {
    const resp = await Lit.Actions.decryptAndCombine({
      accessControlConditions,
      ciphertext,
      dataToEncryptHash,
      authSig: null,
      chain: 'ethereum',
    });
  
    Lit.Actions.setResponse({ response: resp });
  })();`
  
  const res = await client.executeJs({
      code,
      sessionSigs: {}, // your session
      jsParams: {
          accessControlConditions,
          ciphertext,
          dataToEncryptHash
      }
  });
  
  console.log("decrypted content sent from lit action:", res);