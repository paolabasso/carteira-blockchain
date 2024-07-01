import { handler } from "../../../lambda/blockchainWallets/getBlockchainWalletsFunction"
import { APIGatewayProxyEvent, Context } from "aws-lambda"
import {  BlockchainWalletRepository } from "/opt/nodejs/blockchainWalletsLayer"

const resultSucess = {
    id: "12345",
    walletName: "test_wallet",
    walletAddress: "test_address",
    privateKey: "test_private_key",
    createdAt: "2024-06-05T14:48:00.000Z",
    updatedAt: "2024-06-05T14:48:00.000Z",
}
const resultSucessList = [resultSucess]

const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

jest.mock("/opt/nodejs/blockchainWalletsLayer", () => ({
    BlockchainWalletRepository: jest.fn().mockImplementation(() => {
        return {
            getAllBlockchainWallets: jest.fn(()=> resultSucessList),
            getBlockchainWalletById: jest.fn(()=> resultSucess)
        }
    }),
}))

describe("Return a blockchain wallet list", () => {
    let mockEvent: APIGatewayProxyEvent
    let mockContext: Context
    let blockchainWalletRepositoryMock: jest.Mocked<BlockchainWalletRepository>

    beforeEach(() => {
        mockEvent = {
            requestContext: {
                requestId: "testRequestId",
            },
            resource: "/wallets"
        } as any;

        mockContext = {
            awsRequestId: "testAwsRequestId",
        } as any

        blockchainWalletRepositoryMock = new BlockchainWalletRepository(null as any, '') as jest.Mocked<BlockchainWalletRepository>
    })

    it("Should return a list blockchain wallet", async () => {
        const response = await handler(mockEvent, mockContext)

        expect(response.statusCode).toBe(200)
        expect(response.body).toBe(JSON.stringify([{            
            id: "12345",
            walletName: "test_wallet",
            walletAddress: "test_address",
            privateKey: "test_private_key",
            createdAt: "2024-06-05T14:48:00.000Z",
            updatedAt: "2024-06-05T14:48:00.000Z"}]))
        
        expect(logSpy).toHaveBeenCalled();
    })
})

describe("Return a blockchain wallet data", () => {
    let mockEvent: APIGatewayProxyEvent
    let mockContext: Context
    let blockchainWalletRepositoryMock: jest.Mocked<BlockchainWalletRepository>

    beforeEach(() => {
        mockEvent = {
            requestContext: {
                requestId: "testRequestId",
            },
            pathParameters: { id: "1223" }
        } as any;

        mockContext = {
            awsRequestId: "testAwsRequestId",
        } as any

        blockchainWalletRepositoryMock = new BlockchainWalletRepository(null as any, '') as jest.Mocked<BlockchainWalletRepository>
    })

    it("Should return successfully a blockchain wallet", async () => {

        const response = await handler(mockEvent, mockContext)


        expect(response.statusCode).toBe(200)
        expect(response.body).toBe(JSON.stringify({            
            id: "12345",
            walletName: "test_wallet",
            walletAddress: "test_address",
            privateKey: "test_private_key",
            createdAt: "2024-06-05T14:48:00.000Z",
            updatedAt: "2024-06-05T14:48:00.000Z"}))
        
        expect(logSpy).toHaveBeenCalled();
    })
})