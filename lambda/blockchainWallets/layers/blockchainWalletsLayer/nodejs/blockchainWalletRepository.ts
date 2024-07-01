import { DocumentClient } from "aws-sdk/clients/dynamodb"
import { v4 as uuid } from "uuid"

export interface BlockchainWallet {
    id: string,
    walletName: string,
    walletAddress: string,
    privateKey: string,
    createdAt: string,
    updatedAt: string,
}

export class BlockchainWalletRepository {
    private dbClient: DocumentClient
    private blockchainWalletsDb: string

    constructor(dbClient: DocumentClient, blockchainWalletsDb: string) {
        this.dbClient = dbClient
        this.blockchainWalletsDb = blockchainWalletsDb
    }

    async getAllBlockchainWallets(): Promise<BlockchainWallet[]> {
        const result = await this.dbClient.scan({
            TableName: this.blockchainWalletsDb
        }).promise()
        return result.Items as BlockchainWallet[]
    }

    async getBlockchainWalletById(blockchainWalletId: string): Promise<BlockchainWallet> {
        const result = await this.dbClient.get({
            TableName: this.blockchainWalletsDb,
            Key: {
                id: blockchainWalletId
            }
        }).promise()
        if (result.Item) {
            return result.Item as BlockchainWallet
        }
        throw new Error('Blockchain wallet not found')
    }

    async createBlockchainWallet(blockchainWallet: BlockchainWallet): Promise<BlockchainWallet> {
        blockchainWallet.id = uuid()
        blockchainWallet.createdAt = new Date().toISOString()
        await this.dbClient.put({
            TableName: this.blockchainWalletsDb,
            Item: blockchainWallet
        }).promise()
        return blockchainWallet
    }

    async deleteBlockchainWallet(blockchainWalletId: string): Promise<BlockchainWallet> {
        const result = await this.dbClient.delete({
            TableName: this.blockchainWalletsDb,
            Key: {
                id: blockchainWalletId
            },
            ReturnValues: 'ALL_OLD'
        }).promise()
        if (result.Attributes) {
            return result.Attributes as BlockchainWallet
        }
        throw new Error('Blockchain wallet not found')
    }

    async updateBlockchainWallet(blockchainWalletId: string, blockchainWallet: BlockchainWallet): Promise<BlockchainWallet> {
        const result = await this.dbClient.update({
            TableName: this.blockchainWalletsDb,
            Key: {
                id: blockchainWalletId
            },
            ConditionExpression: 'attribute_exists(id)',
            ReturnValues: "UPDATED_NEW",
            UpdateExpression: "set walletName = :n, walletAddress = :a, privateKey = :p, updatedAt = :u",
            ExpressionAttributeValues: {
                ":n": blockchainWallet.walletName,
                ":a": blockchainWallet.walletAddress,
                ":p": blockchainWallet.privateKey,
                ":u": new Date().toISOString()
            }
        }).promise()
        result.Attributes!.id = blockchainWalletId
        return result.Attributes as BlockchainWallet
    }

}