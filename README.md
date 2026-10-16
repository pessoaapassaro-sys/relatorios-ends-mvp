# Relatórios ENDs — Front-end do MVP

Interface provisória para uma plataforma de ensaios não destrutivos.

## Atualização do fluxo — 16/10/2026

Novo relatório: ensaio (IRIS, Phased Array, B-scan ou Líquido Penetrante) → tipo de equipamento → identificação → arquivos → conferência manual.

O formulário aceita até 12 anexos JPG, PNG, WebP ou PDF de até 15 MB cada. As imagens possuem prévia local e classificação por finalidade. Os arquivos não são enviados ao servidor e são descartados ao sair do formulário ou recarregar a página.

Phased Linha usa a estrutura de referência analisada (metal de base / corrosão), mas ainda não há modelo Excel mapeado. As outras combinações são opções para avaliação do catálogo.

Para testar: selecione Phased Array e Linha, informe uma TAG, anexe um croqui e avance à conferência. Digite nominal 5,1 e leitura 0,0: o resultado esperado é perda de 5,1 mm, 100% e a observação Linha furada. Um campo vazio deve aparecer como sem leitura. Após conferir as medidas, é possível baixar um rascunho JSON com os dados digitados e a lista de anexos. Esse arquivo não contém as imagens e não é o relatório Excel/PDF.

O motor automático ainda depende da integração de leitura de imagens, mapeamento do modelo, associação de pontos, armazenamento e geração de Excel/PDF. Não há chamada a serviço de IA nesta versão.

## Situação
- Front-end Next.js 16 (App Router) + TypeScript + CSS + React.
- Menu: Visão geral, Novo relatório, Relatórios, Biblioteca de modelos, Configurações.
- Formulário local de medições com prévia do menor valor e perda percentual por ponto.
- **Ainda não inclui login, persistência no Supabase, envio de arquivos ao servidor, leitura por IA, motor Excel ou exportação PDF.**
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

## Dados e armazenamento

A interface ainda não está conectada à autenticação ou ao armazenamento de arquivos.

## Marca
`Relatórios ENDs` é somente um nome técnico temporário, facilmente substituível quando a identidade comercial for escolhida.

