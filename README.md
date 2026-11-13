# CorpChain — Corporate Actions & Dividend Distribution

**Course:** CS2614 Fundamentals of Blockchain · RV University  
**Project type:** Academic prototype with a simple simulated dashboard

CorpChain demonstrates how a company can declare a dividend and calculate each shareholder's payment from their shareholding at a record-date snapshot.

## Run the dashboard

Requirements: Node.js 20+ and npm.

```bash
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173`). No wallet, MetaMask, RPC endpoint, API key, database or blockchain deployment is needed for the dashboard demonstration.

## Demonstration steps

1. The dashboard opens with three sample shareholders: Alice (100 shares), Bob (250 shares) and Carol (150 shares).
2. In **Declare dividend**, enter a corporate action description and dividend per share. The total distribution is calculated automatically.
3. Select **Declare dividend**. The register displays each shareholder's dividend entitlement based on their percentage ownership.
4. Select **Mark all distributions as paid** to complete the simulated payment step. The shareholder register and activity log update.

Example: ₹10 per share gives Alice ₹1,000, Bob ₹2,500 and Carol ₹1,500. Total distribution: ₹5,000.

## Project structure

```text
CorpChain/
├── contracts/
│   ├── ShareToken.sol
│   ├── MockDividendToken.sol
│   └── DividendManager.sol
├── test/
│   └── CorpChain.test.js
├── scripts/
│   └── deploy.js
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── main.js
│       └── style.css
├── docs/
│   ├── REPORT_DRAFT.md
│   └── architecture.mmd
├── report/
│   ├── CorpChain_Report_Draft.docx
│   ├── CorpChain_Presentation_Draft.pptx
│   └── CorpChain_IEEE_Paper_Draft.docx
├── package.json
└── hardhat.config.js
```

## Blockchain component

The Solidity contracts and Hardhat tests are retained as the project's blockchain implementation. The dashboard is deliberately separate and uses in-memory sample data; it does not call the contracts or send blockchain transactions. For the academic demonstration, present the dashboard as a simulation of the proposed workflow and the Solidity files as the smart-contract implementation.

To compile and test the contracts from the project root:

```bash
npm install
npm run compile
npm test
```

## Scope and limitations

- Sample shareholder data is hard-coded in `frontend/src/main.js`.
- Dividend declaration and payment status exist only in browser memory and reset on page refresh.
- No real securities, investor accounts, payments, external corporate-action feeds or blockchain transactions are connected.
- The smart contracts are an academic prototype and have not been independently audited.

## Team

- Tushar H (0166)
- Punith Gowda M (0118)
- Greeshma KR (0054)
- Rijul (0128)

## Before submission

Replace draft placeholders with actual team details and evidence. Do not report unperformed tests, deployments, transaction hashes or contract addresses as completed.
