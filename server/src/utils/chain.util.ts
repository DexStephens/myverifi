import {
  Abi,
  encodeFunctionData,
  parseEther,
  Address,
  createPublicClient,
  http,
} from "viem";
import { generatePrivateKey } from "viem/accounts";
import {
  LocalAccountSigner,
  type SmartAccountSigner,
  sepolia,
  SendUserOperationResult,
} from "@alchemy/aa-core";
import { createModularAccountAlchemyClient } from "@alchemy/aa-alchemy";
import { WalletModel } from "../models/wallet.model";
import { credentialFactoryAbi, institutionCredentialAbi } from "./abi.util";
import {
  CREDENTIAL_CONTRACT_METHODS,
  DEFAULT_JSON_URI,
} from "../config/constants.config";

export class ChainUtils {
  static #getConfig() {
    const GAS_POLICY_ID = process.env.GAS_POLICY_ID;
    const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;
    const ENTRY_POINT = process.env.ENTRY_POINT;
    const ACCOUNT_FACTORY = process.env.ACCOUNT_FACTORY;
    return {
      GAS_POLICY_ID,
      ALCHEMY_API_KEY,
      ENTRY_POINT,
      ACCOUNT_FACTORY,
    };
  }

  static getPublicClient() {
    return createPublicClient({
      chain: sepolia,
      transport: http(),
    });
  }

  static async createWalletAccount() {
    const privateKey = generatePrivateKey();

    const client = await this.#createAccountClient(privateKey);

    const { publicKey, address } = client.account;

    const wallet = await WalletModel.create({
      privateKey,
      address,
      publicKey,
    });

    return wallet;
  }

  static async createCredentialFactory(privateKey: Address, name: string) {
    const client = await this.#createAccountClient(privateKey);

    await this.#callContract(
      credentialFactoryAbi as Abi,
      process.env.SEPOLIA_CREDENTIAL_FACTORY_ADDRESS as Address,
      CREDENTIAL_CONTRACT_METHODS.DEPLOY_INSTITUTION_CONTRACT,
      [name, DEFAULT_JSON_URI],
      privateKey
    );

    const publicClient = this.getPublicClient();

    const data = await publicClient.readContract({
      address: process.env.SEPOLIA_CREDENTIAL_FACTORY_ADDRESS as Address,
      abi: credentialFactoryAbi,
      functionName: CREDENTIAL_CONTRACT_METHODS.GET_INSTITUTION_CONTRACT,
      args: [client.account.address],
    });

    return data as string;
  }

  static async createCredentialType(
    privateKey: Address,
    contractAddress: Address,
    title: string,
    cid: string
  ) {
    await this.#callContract(
      institutionCredentialAbi as Abi,
      contractAddress,
      CREDENTIAL_CONTRACT_METHODS.CREATE_CREDENTIAL_TYPE,
      [title, cid],
      privateKey
    );
  }

  static async issueCredential(
    privateKey: Address,
    contractAddress: Address,
    recipient: Address,
    tokenId: bigint
  ) {
    await this.#callContract(
      institutionCredentialAbi as Abi,
      contractAddress,
      CREDENTIAL_CONTRACT_METHODS.ISSUE_CREDENTIAL,
      [recipient, tokenId],
      privateKey
    );
  }

  static async #callContract(
    abi: Abi,
    contractAddress: Address,
    functionName: string,
    args: any[],
    privateKey: Address
  ) {
    const data = encodeFunctionData({
      abi,
      functionName,
      args,
    });

    const smartAccountClient = await this.#createAccountClient(privateKey);

    const amountToSend: bigint = parseEther("0");

    const result: SendUserOperationResult =
      await smartAccountClient.sendUserOperation({
        uo: {
          target: contractAddress,
          data,
          value: amountToSend,
        },
        account: undefined,
      });

    console.log(
      "\nWaiting for the user operation to be included in a mined transaction..."
    );

    const txHash = await smartAccountClient.waitForUserOperationTransaction(
      result
    );

    return txHash;
  }

  static async #createAccountClient(privateKey: Address) {
    const config = this.#getConfig();
    const chain = sepolia;
    const signer: SmartAccountSigner =
      LocalAccountSigner.privateKeyToAccountSigner(privateKey);

    const smartAccountClient = await createModularAccountAlchemyClient({
      apiKey: config.ALCHEMY_API_KEY,
      chain,
      signer,
      gasManagerConfig: {
        policyId: config.GAS_POLICY_ID,
      },
    });

    return smartAccountClient;
  }
}
