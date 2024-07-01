#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from 'aws-cdk-lib'
import { BlockchainWalletsAppStack } from '../lib/blockchainWalletsApp-stack'
import { BlockchainWalletApiStack } from '../lib/blockchainWalletApi-stack'
import { BlockchainWalletsAppLayersStack } from '../lib/blockchainWalletsAppLayers-stack';

const app = new cdk.App();

const env: cdk.Environment = {
    account: process.env.ACCOUNT,
    region: "us-east-1"
}

const tags = {
    cost: "Blockchain",
}

const blockchainWalletsAppLayersStack = new BlockchainWalletsAppLayersStack(app, "BlockchainWalletsAppLayers", {
    tags: tags,
    env: env
})

const blockchainWalletsAppStack = new BlockchainWalletsAppStack(app, "BlockchainWalletsApp", {
    tags: tags,
    env: env
})

blockchainWalletsAppStack.addDependency(blockchainWalletsAppLayersStack)

const blockchainWalletApiStack = new BlockchainWalletApiStack(app, "BlockchainWalletApi", {
    getBlockchainWalletsHandler: blockchainWalletsAppStack.getBlockchainWalletsHandler,
    createBlockchainWalletHandler: blockchainWalletsAppStack.createBlockchainWalletHandler,
    updateBlockchainWalletHandler: blockchainWalletsAppStack.updateBlockchainWalletHandler,
    deleteBlockchainWalletHandler: blockchainWalletsAppStack.deleteBlockchainWalletHandler,
    tags: tags,
    env: env
})

blockchainWalletApiStack.addDependency(blockchainWalletsAppStack)