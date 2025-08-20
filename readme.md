# Sistema de Clientes - CRUD

Este projeto é um **CRUD** simples de gerenciamento de clientes, com funcionalidades de **listar, filtrar, editar e excluir clientes**.

## Funcionalidades

- Filtros por:
  - Código
  - Nome
  - Cidade
  - CEP
- Limpar filtros
- Editar clientes
- Excluir clientes da lista

### 1. Configuração do Banco de Dados

```bash
# Acesse o MySQL e crie o banco
mysql -u root -p
CREATE DATABASE customer_management;
exit
```

### 2. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL="mysql://root:sua_senha@localhost:3306/customer_management"
PORT=3001
```

### 3. Migrações do Prisma

```bash
# Gere o cliente Prisma
npx prisma generate

# Crie as tabelas no banco
npx prisma db push

# (Opcional) Abra o Prisma Studio para visualizar os dados
npx prisma studio
```

### 4. Executando a Aplicação

```bash
# Backend (na pasta server)
cd server
npm run dev

# Frontend (na pasta client)
cd client
npm run dev
```

### 5. Acessando

- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend API: [http://localhost:3001](http://localhost:3001)
- Prisma Studio: [http://localhost:5555](http://localhost:5555)

---

<sub>Projeto desenvolvido para fins de processo seletivo.reservados.</sub>
