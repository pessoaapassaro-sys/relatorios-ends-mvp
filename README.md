# Relatórios ENDs — Front-end do MVP

Interface visual provisória para uma plataforma de ensaios não destrutivos.

## Situação
- Front-end Next.js 16 (App Router) + TypeScript + CSS + React.
- Menu: Visão geral, Novo relatório, Relatórios, Biblioteca de modelos, Configurações.
- Formulário local de medições com prévia do menor valor e perda percentual por ponto.
- **Ainda não inclui login, persistência no Supabase, upload de arquivos, motor Excel ou exportação PDF.**
- **Não é um software apto a emitir laudos técnicos.** Nunca usar cálculos demonstrativos como laudo sem conferência técnica.

## Executar localmente

É necessário Node.js 22 ou superior.

```bash
npm ci
npm run dev
```

Acesse http://localhost:3000.

Para verificar e executar a versão de produção:

```bash
npm run build
npm start
```

## Verificação do pacote

Em 15/10/2026, o build de produção e a checagem TypeScript passaram com Node.js 24.14.0 e Next.js 16.4.1. As cinco telas foram abertas no navegador. No formulário demonstrativo, nominal de 10 mm e leituras `9,2; 8,0; 8,5` produziram mínimo de 8,00 mm e perda de 20,00%. Essa verificação não substitui validação técnica de laudos.

## Publicar
1. Use o repositório dedicado `pessoaapassaro-sys/relatorios-ends-mvp`, com `app/`, `components/` e configurações na raiz. Não envie arquivos `.env`, chaves ou credenciais.
2. No painel da Vercel, importe esse repositório com framework Next.js.
3. Após o primeiro deploy, valide telas em dispositivos móveis.
4. Em outra etapa, implemente Supabase Auth, seleção de empresa, RLS, modelos cadastrados e geração de relatórios. Não configure nenhuma `service_role` key no cliente.

## Supabase já provisionado
Projeto: `relatorios-ends-mvp` (ID `wbxfpwilkeaualrcalre`). O banco já tem oito tabelas com RLS e três buckets privados. Este front-end não acessa o banco até a fase de autenticação e onboarding.

## Marca
`Relatórios ENDs` é somente um nome técnico temporário, facilmente substituível quando a identidade comercial for escolhida.
