# CatalogoOra

CatalogoOra e uma plataforma web de catalogo de produtos feita com Next.js, React, Tailwind CSS, Prisma e SQLite. Ela inclui vitrine publica, busca, filtros, detalhes de produtos, login administrativo, CRUD de produtos, upload de imagens e edicao do banner principal.

## Stack

- Next.js + React
- Tailwind CSS
- API integrada com Route Handlers
- Prisma ORM
- SQLite
- Autenticacao admin com cookie HTTP-only e JWT
- Upload local persistente em `/data/uploads` no Docker
- Docker e Docker Compose

## Rodando com Docker

```bash
docker compose up --build
```

Acesse:

- Site publico: `http://localhost:3007`
- Admin: `http://localhost:3007/admin`

Credenciais iniciais:

- Email: `admin@catalogoora.com`
- Senha: `CatalogoOra@2026`

O Compose cria um volume persistente em `/data`, onde ficam o banco `catalogoora.db` e as imagens em `/data/uploads`.

## Rodando localmente

Use Node.js 20 LTS ou 22 LTS. O Docker ja usa Node 20.

```bash
cp .env.example .env
npm install
npx prisma migrate dev
npm run db:seed
npm run dev
```

Depois acesse `http://localhost:3007`.

## Comandos uteis

```bash
npm run dev          # servidor de desenvolvimento
npm run build        # build de producao
npm run start        # executa o build
npm run lint         # valida padroes Next/React
npm run db:migrate   # cria/aplica migrations em desenvolvimento
npm run db:deploy    # aplica migrations em producao
npm run db:seed      # cria admin, banner e produtos iniciais
npm run db:studio    # abre Prisma Studio
```

## Variaveis de ambiente

Veja `.env.example`.

Principais variaveis:

- `DATABASE_URL`: caminho do banco SQLite
- `PORT`: porta da aplicacao, padrao do projeto `3007`
- `UPLOAD_DIR`: diretorio onde as imagens enviadas serao salvas
- `JWT_SECRET`: segredo usado para assinar a sessao admin
- `AUTH_SECURE_COOKIES`: use `true` quando publicar atras de HTTPS
- `ADMIN_NAME`: nome do admin inicial
- `ADMIN_EMAIL`: email do admin inicial
- `ADMIN_PASSWORD`: senha do admin inicial
- `NEXT_PUBLIC_WHATSAPP_NUMBER`: numero usado nos botoes de contato

## Funcionalidades

- Banner principal com imagem, titulo, subtitulo, texto e link editaveis
- Listagem publica de produtos ativos
- Busca por nome, descricao ou categoria
- Filtro por categoria
- Ordenacao por recentes, nome e preco
- Pagina de detalhe do produto
- Login administrativo protegido
- Dashboard com contadores e produtos recentes
- Cadastro, edicao, exclusao e ativacao/desativacao de produtos
- Upload de imagens JPG, PNG ou WebP com limite de 5MB
- Tratamento de erros e mensagens de sucesso

## Observacoes de seguranca

- Troque `JWT_SECRET` antes de usar em producao.
- Troque a senha inicial do admin no `.env` ou no `docker-compose.yml`.
- O upload aceita apenas JPG, PNG e WebP ate 5MB.
- Rotas administrativas da API validam a sessao antes de modificar dados.

## Coolify e uploads

Para que as fotos dos produtos aparecam apos deploy/redeploy, configure storage persistente em:

```text
/data
```

E use:

```env
DATABASE_URL=file:/data/catalogoora.db
UPLOAD_DIR=/data/uploads
PORT=3007
```

As imagens sao servidas pela rota `/api/uploads/[arquivo]`, entao nao dependem de arquivos dinamicos dentro da pasta `public`.
