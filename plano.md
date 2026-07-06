# Plano — Portfólio Gustavo Lima (Editor de Vídeo)

## 1. Objetivo

Site de portfólio one-page para Gustavo Bezerra de Lima, editor de vídeo, com foco em:
- Causar impacto visual imediato (dark mode + 3D + tipografia forte).
- Mostrar o Demo Reel logo de cara.
- Exibir os demais trabalhos em um carrossel fácil de atualizar (`videos.yaml`).
- Converter visitante em contato via e-mail / Instagram.

Referência de navegação: [landonorris.com](https://landonorris.com/) — scroll vertical entre seções, com o carrossel de vídeos tendo comportamento horizontal próprio dentro da sua seção.

Hospedagem: **GitHub Pages** → projeto 100% estático (HTML/CSS/JS puro), sem build step, tudo via CDN.

---

## 2. Stack

| Camada | Escolha | Motivo |
|---|---|---|
| Estrutura | HTML5 puro | GitHub Pages, sem build |
| Estilo | CSS puro (`css/style.css`) | Controle total do dark mode |
| Interação | JS puro (ES Modules) | Sem framework, leve |
| 3D | Three.js via CDN (`unpkg` ou `jsdelivr`) | Câmera 3D rotacionando na Hero |
| Dados dos vídeos | `videos.yaml` + `js-yaml` via CDN | Edição fácil, sem tocar em JS |
| Vídeos | Embeds do YouTube (facade + iframe sob demanda) | Todos os links já são do YouTube |
| Fontes | Google Fonts: **Sora** (títulos) + **Inter** (texto) | Impacto + legibilidade |

---

## 3. Estrutura de arquivos

```
gustavo-portfolio/
├── index.html
├── plano.md
├── data/
│   └── videos.yaml          ← ÚNICO arquivo que precisa editar para add vídeo
├── css/
│   └── style.css
├── js/
│   ├── main.js               ← boot geral, scroll/nav, menu mobile
│   ├── videos.js             ← carrega videos.yaml, monta hero reel + carrossel
│   └── scene3d.js             ← cena Three.js da câmera 3D
└── assets/
    └── favicon.svg
```

---

## 4. `data/videos.yaml` — o coração do carrossel

Regra fixa: **o primeiro item da lista é sempre o Demo Reel da Hero**. Todo item a partir do segundo entra automaticamente no carrossel de "Trabalhos", na ordem em que aparece no arquivo.

```yaml
videos:
  - title: "Demo Reel 2026"
    youtube_id: "yPnMpKNPJ_w"      # https://www.youtube.com/watch?v=yPnMpKNPJ_w
    description: "Showreel com os principais trabalhos"

  - title: "Nome do vídeo"
    youtube_id: "XXXXXXXXXXX"
    description: "Descrição curta (opcional)"

  # Para adicionar um novo trabalho, é só copiar o bloco acima
  # e colar o ID do vídeo do YouTube (a parte depois de v= na URL).
```

`videos.js` faz:
1. `fetch('data/videos.yaml')` → parse com `js-yaml`.
2. `videos[0]` → injeta no player da Hero (facade com thumbnail `https://img.youtube.com/vi/{id}/hqdefault.jpg`).
3. `videos.slice(1)` → gera os cards do carrossel dinamicamente (thumbnail + título).
4. Nenhum vídeo roda em autoplay ao carregar a página — **clique inicia a reprodução** (troca a thumbnail pelo `<iframe>` com `autoplay=1`), tanto na Hero quanto no carrossel. Isso também deixa a página mais leve (sem carregar N iframes do YouTube de uma vez).

---

## 5. Seções da página (scroll vertical, estilo Landon Norris)

### 5.1 Hero (100vh)
- Layout em duas colunas:
  - **Esquerda:** "Gustavo Lima" em destaque máximo (tipografia grande, gradiente claro sobre o azul escuro) + abaixo "Editor de Vídeo" como subtítulo. Scroll cue discreto no rodapé da hero.
  - **Direita:** player do Demo Reel (facade thumbnail do YouTube + botão de play; ao clicar, carrega o iframe e reproduz).
- Elemento 3D: um modelo de **câmera de cinema/vídeo** feito em Three.js (geometria procedural: corpo da câmera, lente cilíndrica, tripé), sem partículas nem elementos "flutuando soltos" — apenas a câmera com rotação suave (auto-rotate + leve parallax no mouse), posicionada como elemento de fundo/decoração atrás ou ao lado do texto do nome.
- Presente **apenas na Hero** (não se repete nas outras seções).

### 5.2 Trabalhos (carrossel)
- Título de seção: "Trabalhos".
- Carrossel horizontal (scroll/drag ou setas de navegação) alimentado 100% por `videos.yaml[1:]`.
- Cada card: thumbnail do YouTube + título + play on click (mesmo padrão da Hero).
- 5 a 10 vídeos inicialmente — layout pensado para crescer sem quebrar (overflow-x com scroll snap).

### 5.3 Sobre Mim
- Somente texto (sem foto), fundo levemente diferenciado da Hero para dar respiro.
- Texto revisado (ver seção 6).

### 5.4 Contato
- Chamada direta tipo "Vamos criar algo juntos?".
- Botões/ícones: **E-mail** (`gustavo.ncg@gmail.com`), **Instagram** (`@gumalego`), **YouTube** (`https://www.youtube.com/@GuMalego`).
- Sem WhatsApp (substituído por e-mail + Instagram, conforme definido).

### 5.5 Footer
- Link para o Linktree: `https://linktr.ee/gumalego`.
- Repetição discreta dos ícones sociais + copyright.

---

## 6. Texto "Sobre mim" (versão revisada)

> Sou Gustavo Bezerra de Lima, editor de vídeo de 29 anos e estudante de Análise e Desenvolvimento de Sistemas. Comecei minha trajetória no Grupo Alura, passando pelos times MusicDot e Alura Start, onde aprendi a unir narrativa, ritmo e técnica em cada corte.
>
> Hoje atuo como editor de vídeo na agência de publicidade NCW e também assino a edição do meu próprio canal no YouTube — unindo experiência de mercado publicitário com uma visão criativa independente.

(Pode ajustar tom/tamanho depois de ver no layout.)

---

## 7. Identidade visual (dark mode azul escuro)

| Uso | Cor | Hex |
|---|---|---|
| Fundo principal | Azul-marinho quase preto | `#020617` |
| Fundo seções alternadas | Azul-marinho um pouco mais claro | `#0b1120` |
| Texto principal | Branco levemente azulado | `#f1f5f9` |
| Texto secundário | Cinza-azulado | `#94a3b8` |
| Destaque 1 (nome, CTAs) | Ciano vibrante | `#38bdf8` |
| Destaque 2 (gradiente no nome) | Índigo vibrante | `#818cf8` |
| Hover / glow | Ciano com brilho (`box-shadow`) | `#22d3ee` |

Tipografia:
- Títulos/nome: **Sora** (peso 700–800), tamanhos grandes com leve gradiente de texto (`background-clip: text`).
- Corpo: **Inter**, tons de cinza-claro para leitura confortável no fundo escuro.

---

## 8. Comportamento 3D (Three.js)

- Cena simples e leve: 1 câmera de vídeo estilizada (geometrias primitivas: `BoxGeometry` para o corpo, `CylinderGeometry` para a lente, linhas finas para o tripé), sem texturas pesadas nem partículas.
- Luz: uma `DirectionalLight` + `AmbientLight` sutil para dar volume sem parecer "renderizado demais".
- Movimento: rotação automática lenta no eixo Y + leve resposta ao movimento do mouse (parallax sutil), pausando quando a Hero sai da viewport (`IntersectionObserver`) para não gastar performance à toa.
- Fundo transparente (`alpha: true`) para se misturar ao azul-marinho da Hero.

---

## 9. Responsividade

- Mobile é prioridade (público inclui marcas fechando contrato pelo celular).
- Hero em mobile: colunas empilham (nome/subtítulo em cima, player do Demo Reel abaixo), cena 3D reduzida ou simplificada para preservar performance.
- Carrossel em mobile: scroll horizontal por toque (`scroll-snap-type: x mandatory`), sem precisar de setas.
- Testar em breakpoints: ≥1200px, 768–1199px, <768px.

---

## 10. Deploy (GitHub Pages)

1. Repositório no GitHub (ex.: `gustavo-portfolio` ou `usuario.github.io`).
2. `index.html` na raiz.
3. Ativar GitHub Pages nas configurações do repo, branch `main`, pasta `/root`.
4. Caminhos relativos (`css/style.css`, `data/videos.yaml`, etc.) — sem `/` absoluto, para funcionar tanto em `usuario.github.io` quanto em `usuario.github.io/gustavo-portfolio`.

---

## 11. Ordem de implementação sugerida

1. Estrutura HTML base + seções + navegação com scroll suave.
2. CSS dark mode (paleta, tipografia, layout responsivo).
3. `videos.yaml` + `videos.js` (parse, hero reel, carrossel, click-to-play).
4. Cena 3D da câmera (`scene3d.js`).
5. Seção Sobre Mim + Contato + Footer com links reais.
6. Ajustes finos de responsividade e performance (lazy load de thumbnails, pausar 3D fora da viewport).
7. Deploy no GitHub Pages.

---

## 12. Informações de contato confirmadas

- Demo Reel: `https://www.youtube.com/watch?v=yPnMpKNPJ_w`
- E-mail: `gustavo.ncg@gmail.com`
- Instagram: `@gumalego`
- YouTube: `https://www.youtube.com/@GuMalego`
- Linktree (footer): `https://linktr.ee/gumalego`
