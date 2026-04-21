# Easy Doc — Landing Page

Landing page desenvolvida como teste técnico, reproduzida a partir de layout no Figma e entregue com fidelidade visual, responsividade completa e código organizado em módulos independentes.

## Como executar

Não há dependências ou build steps. Basta abrir o arquivo diretamente no navegador:

```
index.html        → landing page principal
login.html        → página de login
support.html      → página de suporte
```

> Recomendado: abrir via servidor local (ex.: Live Server no VS Code) para que a busca de CEP via ViaCEP funcione corretamente em todos os navegadores.

## Estrutura do projeto

```
/
├── index.html
├── login.html
├── support.html
└── assets/
    ├── css/
    │   └── style.css         # estilos globais, responsivo e páginas internas
    ├── js/
    │   ├── main.js           # navegação, animações, vídeos, carrossel e formulário
    │   ├── login.js          # validação e interação da página de login
    │   └── support.js        # accordion do FAQ
    └── images/               # assets exportados do Figma
```

## Funcionalidades implementadas

**Landing page**
- Menu responsivo com hambúrguer, fechamento por Esc e compensação de header fixo na navegação por âncoras
- Link de navegação ativo por seção via `IntersectionObserver`
- Animações de entrada (`data-reveal`) com `IntersectionObserver` e fallback para navegadores sem suporte
- Dois vídeos do YouTube incorporados com click-to-play e autoplay no iframe
- Carrossel automático de marcas (CSS keyframe + duplicação via JS, idempotente)

**Formulário de contato**
- Validação reativa campo a campo (dispara no `blur`, revalida no `input` após primeiro toque)
- Máscara de telefone com suporte a 8 e 9 dígitos: `(DD) NNNN-NNNN` e `(DD) NNNNN-NNNN`
- Máscara de CEP com busca automática via [ViaCEP](https://viacep.com.br), incluindo:
  - Debounce de 450ms para evitar requisições a cada tecla
  - `AbortController` para cancelar requisições em voo
  - Fallback offline com CEPs pré-cadastrados
  - Loader visual durante a consulta e bloqueio do submit
- Seleção dinâmica de cidades por estado (27 estados cobertos)
- Foco automático no primeiro campo inválido ao tentar submeter

**Página de login**
- Validação reativa de e-mail e senha
- Alternância de visibilidade da senha com atualização de `aria-label`
- Feedback visual de sucesso/erro após simulação de envio
- Reset completo do formulário após autenticação bem-sucedida

**Página de suporte**
- FAQ em accordion exclusivo: apenas um item aberto por vez
- Implementado com `<details>` nativo, acessível por teclado sem tratamento extra

## Decisões técnicas

Todos os scripts são encapsulados em IIFEs com `"use strict"`, sem dependências externas e sem poluição do escopo global. A configuração central (`STATE_DATA`, seletores, delays) fica no topo de cada módulo para facilitar ajustes pontuais.

A integração com o backend está preparada para substituição: os pontos de envio em `main.js` e `login.js` contêm comentários com exemplos de `fetch` prontos para uso.

O captcha da Cloudflare foi mantido apenas como elemento visual, conforme permitido no briefing.

## Acessibilidade

- `aria-expanded`, `aria-label` e `aria-hidden` nos elementos interativos
- `role="status"` com `aria-live="polite"` nos feedbacks de formulário
- `focus-visible` com outline customizado em todos os elementos focáveis
- SVG sprite inline com símbolos `aria-hidden` para não poluir a árvore de acessibilidade