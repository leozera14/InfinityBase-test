# Frontend - Integração com Smart Contract Crowdfunding

Agora que você já executou os processos referentes ao **contract**, vamos rodar o **Frontend**.

---

## 🚀 Como rodar o Frontend

### 1. Acesse o diretório do frontend

No terminal, navegue até a pasta raiz do projeto e entre na pasta `frontend`:

```bash
cd InfinityBaseTest/frontend
```

### 2. Instale as dependências

Ainda no terminal, dentro da pasta `frontend`, instale as dependências usando um dos comandos:

```bash
# Usando npm
npm i

# Usando yarn
yarn
```

### 3. Configuração do arquivo `.env`

Na raiz da pasta `frontend`, crie um arquivo chamado `.env`.

Existe um arquivo `.env.example` que mostra a estrutura que seu `.env` deve seguir.

No `.env`, cole os endereços de contrato que você obteve no deploy do Smart Contract (do README da pasta contract) ou os seus próprios deploys:

```
VITE_CONTRACT_ID_SEPOLIA=(seu endereço de contrato gerado para a Sepolia) # ex: 0x5c4bd077820ec86897467f99330aaeb6b4dc4db984fc1055ad3eaf990fc5d17c
VITE_CONTRACT_ID_BETA2=(seu endereço de contrato gerado para a Devnet)   # ex: b9988c0e788c456c3a13c598a00413bdc12aa5672db3607e9869cca16abd392e
```

### 4. Rodar a aplicação

Com o `.env` configurado, ainda no terminal dentro da pasta `frontend`, rode o comando:

```
# Usando npm
npm run dev

# Usando yarn
yarn dev
```

### 5. Como funciona o build e integração

Além de rodar a aplicação, o comando `yarn dev` executa um script que:

- Compila e transpila a ABI do contrato gerada no diretório:

```
/contract/out/debug/
```

- Com isso, o hook presente em:

```
/frontend/src/hooks/
```

faz a instância do Contract via `CONTRACT_ID` que você configurou no `.env`, baseado na network que está conectado e utilizando a ABI transpilada para TypeScript.

Isso possibilita o uso das funções criadas no Smart Contract diretamente pelo frontend.

### 6. Acesse a aplicação no navegador

A aplicação ficará disponível em:

[http://localhost:3000](http://localhost:3000)

> Caso voce altere a porta configurada no arquivo vite.config.ts, a utilize aqui no lugar da :3000 a qual é a por padrão configurada no projeto.

## 🛠 Tecnologias usadas no Frontend

- **Vite** — ferramenta para criação inicial do projeto e boilerplate.
- **React**
- **TypeScript**
- **Tailwind CSS** — para configuração e execução global de estilos.
- **Pacotes da Fuel Network** — para lidar com eventos, estados e valores da Fuel Network extension no browser (`fuels`, `@fuels/connectors`, `@fuels/react`).
- **ethers** — para manipulação de valores da blockchain e wallet (exemplo: balance em BigInt).
