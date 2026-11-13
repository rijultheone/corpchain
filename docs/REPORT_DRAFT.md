# CORPCHAIN: ON-CHAIN CORPORATE ACTIONS AND DIVIDEND DISTRIBUTION

## Abstract
Corporate actions such as dividend declarations and payments involve issuer instructions, shareholder entitlement records, reconciliation and payment processing. When these activities rely on fragmented systems and manual coordination, delays, operational errors and limited end-to-end traceability can arise. This project presents CorpChain, an educational decentralized application prototype that demonstrates tokenized share ownership and smart-contract-based dividend distribution on Ethereum. The prototype uses Solidity contracts: an ERC-20 share token with historical voting checkpoints, a mock ERC-20 dividend payment token, and a dividend manager that records a prior-block ownership snapshot, calculates pro-rata entitlements and enables eligible shareholders to claim once. The interaction layer is implemented using React, MetaMask and ethers.js. External corporate-action data is simulated through issuer-entered event descriptions and dividend amounts; no live oracle or external financial API is connected. The design separates share representation from dividend accounting and uses access control, input validation, SafeERC20 transfers and reentrancy protection. Automated tests are provided for declaration, entitlement calculations, successful claims, duplicate-claim prevention, ineligible claims, owner permissions and post-snapshot transfers. Deployment and test outcomes must be populated from the team's actual local and Sepolia runs before submission. The prototype demonstrates how deterministic corporate-action rules can be represented transparently on-chain while also highlighting limitations involving legal enforceability, privacy, issuer trust, compliance, oracle quality and production-scale integration.

## 1. Introduction
Corporate actions are events initiated by an issuer that affect securities or the rights and payments associated with them. Examples include cash dividends, coupon payments, redemptions and stock splits. Their processing can require issuer announcements, record-date determination, shareholder-position reconciliation, calculation of entitlements and payment execution. These stages may involve multiple institutions and data systems. A blockchain-based ledger can provide a shared transaction history, while smart contracts can encode deterministic rules for entitlement calculation and payment claims.

Blockchain is a distributed ledger in which transactions are grouped into blocks and validated according to the network's consensus rules. Ethereum supports programmable smart contracts executed by the Ethereum Virtual Machine. In this project, tokenized demo shares represent shareholder balances, and ERC20Votes checkpoints provide historical ownership information. A dividend manager uses a past-block snapshot to calculate entitlements and transfers a mock payment token to eligible holders who claim. The scope is a testnet-oriented academic prototype; it does not replace a regulated central securities depository, registrar, transfer agent, custodian or bank.

## 2. Objectives
- Design and implement a Solidity-based prototype for tokenized share ownership and dividend distribution.
- Record an ownership snapshot at dividend declaration and calculate historical pro-rata entitlements.
- Restrict share issuance and dividend declaration to the authorised issuer account.
- Enable shareholders to claim a dividend once, with transaction events for traceability.
- Build a React/MetaMask interaction layer and test the prototype locally before Sepolia deployment.

## 3. Problem Statement and Domain Linkage
**Problem statement:** Corporate actions such as dividends, coupon payments and redemptions can require manual coordination between issuers, registrars, depositories, custodians and payment providers. Fragmented records and reconciliation steps can introduce delays, operational errors and difficulty tracing the complete entitlement-to-payment process.

**FinTech linkage:** Capital-markets infrastructure, securities servicing and post-trade operations. The stakeholders include the issuer, shareholders and operational intermediaries.

**Blockchain linkage:** Ethereum provides a shared, tamper-evident transaction history. The smart contracts manage demo share issuance, historical ownership lookup, dividend funding, pro-rata calculation and claims. Events provide an auditable log.

**External data:** Simulated. The issuer enters the corporate-action description and dividend amount directly. The prototype does not consume Chainlink or a live API. This avoids representing mock data as a verified real-world announcement.

## 4. Literature Review

### 4.1 Zhitomirskiy, Schmid and Walther (2023)
“Tokenizing assets with dividend payouts—a legally compliant and flexible design,” *Digital Finance*, 5, 563–580. The paper examines tokenized assets with dividend payouts and proposes a flexible design that considers legal compliance. It is directly relevant because it treats dividend rights as a feature that must be designed alongside the tokenized asset. The present prototype is narrower: it demonstrates historical ownership and claims, but does not implement jurisdiction-specific compliance, investor eligibility checks or legal shareholder registration. DOI: https://doi.org/10.1007/s42521-023-00094-w.

### 4.2 Bauvars (2021)
“Applicability of Blockchain Technology in Securities Settlement,” *Complex Systems Informatics and Modeling Quarterly*, 28, 34–58. The study evaluates blockchain applicability to securities settlement and discusses potential improvements in reconciliation and cross-border settlement, while identifying implementation and coordination challenges. This informs CorpChain's choice to model ownership and payment records on a shared ledger. Its focus is broader securities settlement rather than dividend entitlement specifically. DOI: https://doi.org/10.7250/csimq.2021-28.03.

### 4.3 Tanchangya et al. (2025)
“Mapping Blockchain Applications in FinTech: A Systematic Review of Eleven Key Domains,” *Information*, 16(9), 769. The authors review 164 peer-reviewed studies and map blockchain applications across FinTech domains, including asset tokenization, capital markets, smart contracts and compliance. They also identify challenges such as regulatory ambiguity, interoperability and cybersecurity. This supports the domain relevance of CorpChain while reinforcing that automation alone does not resolve institutional and regulatory requirements. DOI: https://doi.org/10.3390/info16090769.

### Research gap
The reviewed work indicates that blockchain can support tokenized financial assets, securities workflows and automated contractual rules, but also highlights legal, operational and interoperability challenges. CorpChain addresses a focused educational implementation gap by demonstrating the end-to-end mechanics of historical ownership snapshots, pro-rata dividend calculations and individual claims in an accessible Ethereum DApp. It does not claim to solve the full legal or institutional infrastructure problem.

## 5. Existing Systems
1. **Traditional registrar/depository workflow:** issuer corporate-action instructions are processed through market infrastructure and intermediary records. Strength: established legal and operational processes. Limitation: coordination and reconciliation can span multiple systems.
2. **Centralised dividend-processing platforms:** a central operator maintains entitlement files and coordinates payment instructions. Strength: familiar controls and integration with existing payment rails. Limitation: participants depend on the operator's records and reporting process.
3. **Tokenized-asset smart-contract approaches:** asset tokens and smart contracts encode rights and payments. Strength: programmable, observable execution. Limitation: legal recognition, privacy, compliance, data quality and integration still require off-chain governance.

## 6. Proposed System
CorpChain contains three contracts. `ShareToken` is an ERC-20 token with ERC20Votes checkpoints; the issuer mints demo shares, and holders delegate to activate historical voting checkpoints. `MockDividendToken` is an issuer-mintable payment token used only for testing. `DividendManager` accepts a funded dividend amount and description, records the previous block as the snapshot, reads historical total supply, computes a scaled amount per share, and allows each eligible address to claim once. The React interface connects MetaMask, displays balances and dividend entitlement, and exposes issuer controls only to the deployment owner.

The issuer is responsible for entering correct event data and funding the payment contract. The system does not independently verify that a dividend was authorised by a real company or that an address is a legally registered shareholder.

## 7. Technologies Used
- Solidity 0.8.24
- OpenZeppelin Contracts 5.x (ERC20, ERC20Permit, ERC20Votes, Ownable, SafeERC20, ReentrancyGuard)
- Hardhat 2, Node.js and npm
- Ethereum Sepolia (target deployment); Hardhat local network for development
- MetaMask wallet
- React + Vite and ethers.js v6
- Simulated corporate-action data entered by the issuer

## 8. Architecture
Users interact with a React frontend. MetaMask signs transactions and ethers.js communicates with the Ethereum provider. The ShareToken, MockDividendToken and DividendManager contracts execute on Ethereum. The issuer supplies simulated event details manually; there is no oracle in the current version.

## 9. Features
- ERC-20 tokenized demo share issuance.
- Historical ownership checkpoints through ERC20Votes.
- Issuer-only dividend declaration after payment-token funding.
- Snapshot-based pro-rata entitlement calculation.
- Individual claim with duplicate-claim prevention.
- Events for dividend declaration and claims.
- SafeERC20 transfer and reentrancy guard on claim.

## 10. Implementation
The code is in the repository's `contracts/`, `scripts/`, `test/` and `frontend/` directories. The deployment script deploys all three contracts and writes their addresses to the frontend configuration. The declaration function stores `block.number - 1` as the snapshot block, ensuring the declaration transaction itself cannot change the snapshot. Historical voting balances are queried through `getPastVotes` and total supply through `getPastTotalSupply`.

**Key code excerpt:**
```solidity
uint256 snapshot = block.number - 1;
uint256 totalShares = shareToken.getPastTotalSupply(snapshot);
require(totalShares > 0, "no shares at snapshot");
uint256 perShare = (amount * 1e18) / totalShares;
```

### Deployment details — populate after deployment
- Network: [Hardhat local / Ethereum Sepolia]
- Chain ID: [actual value]
- ShareToken address: [actual address]
- MockDividendToken address: [actual address]
- DividendManager address: [actual address]
- Deployment transaction hashes: [actual hashes]
- Compiler: Solidity 0.8.24, optimizer enabled, 200 runs
- Repository: [GitHub URL]

## 11. Results and Test Cases
Do not mark these tests as passed until the team runs `npm test` and records the actual output. The automated test suite covers:
1. Dividend declaration records total supply and funded amount.
2. Entitlements are calculated pro-rata (100/250/150 shares against 5,000 cUSD gives 1,000/2,500/1,500 cUSD).
3. An eligible shareholder receives the claim amount.
4. A second claim by the same shareholder reverts.
5. An address with no snapshot shares cannot claim.
6. A non-owner cannot declare a dividend.
7. A transfer after the snapshot does not change historical entitlement.

### Gas analysis
Record gas from actual receipts or Hardhat test output. Suggested functions to measure: deployment of each contract, mint, delegate, declareDividend and claimDividend. Do not insert estimated gas figures as measured results.

## 12. Security Analysis and Limitations
The contracts use owner-based access control for issuance and dividend declaration, non-zero address and amount checks, SafeERC20 for payment transfers, and ReentrancyGuard for the claim path. A per-dividend/per-address mapping prevents duplicate claims. Historical voting checkpoints prevent transfers after the snapshot from changing entitlement. The prototype relies on issuer-supplied data and does not validate corporate authority, record-date rules, investor identity or legal ownership. It exposes wallet addresses and transaction activity publicly. It does not implement privacy-preserving eligibility proofs, KYC/AML, tax withholding, dispute handling, event amendments, redemptions, coupon schedules, stablecoin depegs or fiat settlement. It has not been independently audited and is not suitable for production or real funds.

## 13. Conclusion and Future Scope
CorpChain demonstrates a focused blockchain workflow for tokenized share balances and dividend distribution. The prototype separates share representation, payment tokens and dividend accounting, then uses historical checkpoints to calculate rights at a declared snapshot and allows eligible holders to claim transparently. The project demonstrates smart-contract automation and auditability while showing that real corporate actions require reliable source data, legal governance, compliance, privacy and integration with established market infrastructure.

Future work may add a trusted corporate-action oracle, role-based multi-signature issuer governance, allow-listed investor identities, corporate-action cancellation/amendment procedures, additional actions such as coupons and redemptions, a production-grade payment asset, formal verification and an independent security audit.

## References
[1] E. Zhitomirskiy, S. Schmid, and M. Walther, “Tokenizing assets with dividend payouts—a legally compliant and flexible design,” *Digital Finance*, vol. 5, pp. 563–580, 2023, doi: 10.1007/s42521-023-00094-w.
[2] J. Bauvars, “Applicability of Blockchain Technology in Securities Settlement,” *Complex Systems Informatics and Modeling Quarterly*, no. 28, pp. 34–58, 2021, doi: 10.7250/csimq.2021-28.03.
[3] T. Tanchangya, T. Sarker, J. Rahman, M. S. Islam, N. Islam, and K. O. Siddiqi, “Mapping Blockchain Applications in FinTech: A Systematic Review of Eleven Key Domains,” *Information*, vol. 16, no. 9, art. 769, 2025, doi: 10.3390/info16090769.
[4] OpenZeppelin, “OpenZeppelin Contracts Documentation,” https://docs.openzeppelin.com/contracts/.
[5] Ethereum Foundation, “Ethereum Documentation,” https://ethereum.org/developers/docs/.
[6] Hardhat, “Hardhat Documentation,” https://hardhat.org/docs.

## Appendix checklist
- Full source code: attach repository snapshot or code appendix.
- Team contributions: confirm actual contributions with all members.
- Geo-tagged photograph: collect at the batch presentation.
- Hedera certificates: attach both required parts for each member as instructed by the course template.
- Demo video: 3–5 minutes, using actual deployment and transaction screens.
- Conference paper: use the separate draft document and update with measured results.
