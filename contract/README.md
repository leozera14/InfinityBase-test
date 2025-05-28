# Smart Contract - Crowdfunding (Sway)

Agora que você já tem todos os pré-requisitos para rodar o projeto, vamos começar com a parte de gerar o Smart Contract que vai ser integrado ao Frontend.

Primeiramente, é importante que você já tenha uma Wallet criada na **Fuel Wallet**, pois através da private key da mesma que você irá conseguir fazer o deploy do Smart Contract na testnet e devnet e com isso obter a ABI pública para integrá-lo ao Frontend.

Mas não se preocupe, eu também deixei nesse arquivo os Addresses dos contratos que eu fiz deploy para que seja um processo mais rápido.

---

## Addresses dos deploys que eu gerei na Devnet e Testnet já no formato do `.env` do Frontend:

```
VITE_CONTRACT_ID_SEPOLIA=0x15494ae5037d0e50d70cc4610b5b87ef752465c6b4aabca8a0f43cb56e314f3a
VITE_CONTRACT_ID_BETA2=afde73f191958c4c717aa07b49f5536a4c2f318a04d1e2afc6550b1ff452b37e
```

---

## Processo para fazer o deploy você mesmo

Se quiser fazer o processo você mesmo, e também a fim de documentar todo o processo, siga os passos abaixo para executar o deploy:

### 1. Obtenha sua Private Key

- Crie sua Wallet na [Fuel Wallet](https://wallet.fuel.network/docs/how-to-use/) e guarde a **seed phrase** gerada.

- Com a seed phrase em mãos, importe sua wallet via terminal executando:

```bash
forc-wallet import
```

> Será solicitado que você digite sua seed phrase e defina uma senha para a wallet.

- Após importar, liste as contas adicionadas com:

```bash
forc-wallet accounts
```

> Será listado o(s) índice(s) das accounts, a primeira wallet geralmente estará no índice 0.

- Para obter sua private key, execute:

```bash
forc-wallet account - private-key
```

> Será solicitado que você digite a senha da wallet. Depois, a private key será mostrada no terminal. **Copie e guarde em local seguro!**

### 2. Build e Teste do Smart Contract

- No terminal, navegue até a pasta raiz do projeto e entre na pasta contract:

```bash
cd InfinityBaseTest/contract
```

- Execute o comando para buildar e testar o contrato:

```bash
forc build && forc test
```

Este comando irá compilar seu contrato e rodar os testes presentes no código que cobrem alguns Use Cases.

### 3. Deploy do Contrato nas redes

O comando `forc build` gera dentro da pasta `contract/out/debug/` a ABI do contrato em formato `.json` e outros arquivos importantes.

Agora, para fazer o deploy do contrato nas redes **testnet (Sepolia)** e **devnet (Beta-2 Test)**, execute os comandos abaixo substituindo `(sua private key)` pela sua chave privada obtida anteriormente:

```bash
forc deploy --testnet --private-key (sua private key)
forc deploy --devnet --private-key (sua private key)
```

### Observações importantes:

- A private key que você utilizar deve ser referente a uma Wallet com fundos disponíveis.
- Para redes como Testnet e Devnet, você pode solicitar fundos gratuitos abrindo sua Fuel Wallet conectada na respectiva network. Na aba de **Assets**, há um botão para requisitar fundos.
- Execute um comando de deploy por vez. Após cada deploy, será retornado um endereço de contrato. Esse endereço deverá ser configurado no arquivo `.env` do frontend para a integração funcionar corretamente.

Agora que seu foi feito o deploy de seu contrato ( ou está utilizando os Addresses que passei no começo ) e você tem a ABI e o endereço configurados, você já pode prosseguir para o README do frontend para rodar a aplicação que integra o Smart Contract.
