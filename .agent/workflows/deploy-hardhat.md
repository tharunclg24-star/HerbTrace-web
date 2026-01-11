---
description: how to deploy the HerbTrace smart contract locally
---
1. compile the contract
// turbo
npx hardhat compile

2. start the local hardhat node (run in a separate terminal)
npx hardhat node

3. deploy the contract to localhost
// turbo
npx hardhat run scripts/deploy.js --network localhost

4. update .env.local with the new contract address
// Use the address from the previous step
