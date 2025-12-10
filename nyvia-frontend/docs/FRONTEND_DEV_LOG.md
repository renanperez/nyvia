# NYVIA LITE - HISTÓRICO DE DESENVOLVIMENTO FRONTEND

## DECISÕES ARQUITETURAIS

### Stack Frontend
- **Framework**: Next.js 16 (App Router)
- **React**: v19.2.1
- **Styling**: Tailwind CSS v4
- **TypeScript**: v5

### Paleta de Cores Nyvia
```css
--nyvia-primary: #495EE3      /* Azul principal */
--nyvia-purple: #9749E3       /* Roxo secundário */
--nyvia-white: #FFFFFF        /* Branco */
--nyvia-blue: #498FE3         /* Azul claro */
--nyvia-magenta: #CA49E3      /* Magenta */
--nyvia-lavender: #A394E3     /* Lavanda */
```

### Design System
- **Layout**: Inspirado no Claude.ai (sidebar + chat central + header minimalista)
- **Identidade**: Gradiente Nyvia (#495EE3 → #9749E3)
- **Tipografia**: System fonts (-apple-system, Segoe UI, Roboto)

---

## PASSO 1: COMPONENTES UI (Estilo Claude.ai)

### Estrutura Criada
```
nyvia-frontend/
├── app/
│   └── globals.css
└── components/
    ├── Header.tsx
    ├── Message.tsx
    ├── Sidebar.tsx
    └── ChatWindow.tsx
```

### 1.1 globals.css
**Propósito**: Variáveis CSS globais + estilização base
**Decisões**:
- Tailwind v4: `@import "tailwindcss"` (não mais `@tailwind base/components/utilities`)
- Custom scrollbar estilizada
- CSS variables para cores semânticas

### 1.2 Header.tsx
**Propósito**: Barra superior minimalista
**Features**:
- Logo Nyvia (gradiente circular com "N")
- Nome do workspace ativo
- Botão de logout
- Height fixo: 56px (h-14)

### 1.3 Message.tsx
**Propósito**: Bolhas de mensagem estilo Claude
**Features**:
- Layout horizontal (avatar + conteúdo)
- Avatar circular (usuário = cinza, assistant = gradiente Nyvia)
- Background alternado (user = branco, assistant = cinza-50)
- Max-width: 768px (3xl) centralizado

### 1.4 Sidebar.tsx
**Propósito**: Menu lateral dark com workspaces
**Features**:
- Background: #1A1A2E (dark)
- Botão "Nova Análise" com gradiente Nyvia
- Lista de workspaces com contador de conversas
- Hover states sutis (white/10)
- Footer com configurações

### 1.5 ChatWindow.tsx
**Propósito**: Área principal de conversação
**Features**:
- Textarea com botão de envio integrado
- Placeholder: "Descreva seu briefing de marketing..."
- Botão de envio com gradiente + ícone de seta
- Disclaimer: "Nyvia fornece inteligência estratégica, não copy pronto"

---

## PASSO 2: SISTEMA DE AUTENTICAÇÃO

### Estrutura Criada
```
nyvia-frontend/
├── app/
│   └── login/
│       └── page.tsx
├── contexts/
│   └── AuthContext.tsx
└── lib/
    └── api.ts
```

### 2.1 AuthContext.tsx
**Propósito**: Gerenciamento de estado global de autenticação
**Responsabilidades**:
- Armazenar `user`, `token`, `isLoading`
- Persistir token no `localStorage`
- Validar token ao carregar app (fetch `/auth/me`)
- Fornecer funções: `login()`, `register()`, `logout()`

**Fluxo de Inicialização**:
```
App inicia → useEffect lê localStorage → Se token existe → fetch /auth/me
→ Se válido: seta user → Se inválido: logout()
```

**Funções Principais**:
- `login(email, password)`: POST /auth/login → salva token
- `register(email, password, name)`: POST /auth/register → salva token
- `logout()`: limpa state + localStorage
- `fetchUser(token)`: GET /auth/me → valida sessão

### 2.2 api.ts
**Propósito**: Centralizador de requisições HTTP ao backend
**Responsabilidades**:
- Base URL: `http://localhost:3001`
- Injetar token JWT no header `Authorization: Bearer TOKEN`
- Tratamento de erros HTTP

**Métodos Implementados**:
- `getWorkspaces(token)`: GET /workspaces
- `createWorkspace(token, name, description?)`: POST /workspaces
- `sendMessage(token, workspaceId, message, conversationId?)`: POST /chat

**Padrão de Uso**:
```typescript
const token = useAuth().token
const workspaces = await api.getWorkspaces(token!)
```

### 2.3 login/page.tsx
**Propósito**: Interface de login/registro
**Features**:
- Toggle entre "Entrar" e "Criar Conta"
- Formulário responsivo com validação
- Loading states durante autenticação
- Exibição de erros do backend
- Redirect para `/` após sucesso
- Design: gradiente Nyvia de fundo + card branco centralizado

**Estados Gerenciados**:
- `isLogin`: toggle login/register
- `email`, `password`, `name`: inputs do form
- `error`: mensagens de erro
- `isLoading`: estado de carregamento

---

## FLUXO COMPLETO DE AUTENTICAÇÃO

```
1. Usuário acessa /login
2. Digita credenciais
3. Submit → AuthContext.login() ou register()
4. Backend valida → retorna { token, user }
5. AuthContext salva token no localStorage
6. Router redireciona para /
7. Todas as requisições subsequentes incluem token no header
8. Se token expirar/inválido → AuthContext.logout() → redirect /login
```

---

## PRÓXIMOS PASSOS (Passo 3)

### 3.1 Conectar Componentes à API
- [ ] Atualizar Header.tsx para usar `useAuth()` (exibir user.email)
- [ ] Atualizar Sidebar.tsx para buscar workspaces reais via `api.getWorkspaces()`
- [ ] Atualizar ChatWindow.tsx para enviar mensagens via `api.sendMessage()`
- [ ] Implementar Message.tsx com histórico real de conversas

### 3.2 Proteção de Rotas
- [ ] Criar middleware de autenticação
- [ ] Redirecionar usuários não autenticados para /login
- [ ] Implementar loading state global

### 3.3 Layout Principal
- [ ] Criar app/page.tsx com estrutura: `<Sidebar> + <Header> + <ChatWindow>`
- [ ] Wrappear app com `<AuthProvider>`
- [ ] Implementar gestão de workspace ativo

---

## CONVENÇÕES DE CÓDIGO

### Nomenclatura
- Componentes: PascalCase (Header.tsx)
- Hooks: camelCase com prefixo "use" (useAuth)
- Funções: camelCase (sendMessage)
- Constantes: UPPER_SNAKE_CASE (API_URL)

### Estrutura de Componentes
```typescript
'use client' // Se usar hooks
import { ... }

interface Props { ... }

export default function Component({ props }: Props) {
  // 1. Hooks
  // 2. Estados
  // 3. Funções
  // 4. useEffect
  // 5. Return JSX
}
```

### Estilização
- Preferir Tailwind classes inline
- Gradientes Nyvia via `style={{ background: 'linear-gradient(...)' }}`
- Classes customizadas em globals.css apenas para repetições

---

## TROUBLESHOOTING

### Tailwind v4 Warnings
- ❌ `@tailwind base/components/utilities` (v3)
- ✅ `@import "tailwindcss"` (v4)
- VSCode warning sobre `@tailwind`: adicionar `"css.lint.unknownAtRules": "ignore"` em settings.json

### CORS no Desenvolvimento
- Backend deve ter `cors()` habilitado
- Frontend usa `http://localhost:3001` (não HTTPS)

### Token Expiration
- Tokens JWT expiram em 7 dias (backend)
- AuthContext valida ao carregar app
- Logout automático se token inválido
