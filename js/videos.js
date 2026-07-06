// Lê data/videos.yaml, injeta o Demo Reel na Hero e monta o carrossel de Trabalhos.
// videos[0] -> Demo Reel (Hero) | videos[1..] -> carrossel
// Cada item do YAML é só o link do YouTube (URL completa ou ID puro).

function extractYoutubeId(entry) {
  const value = String(entry).trim();
  const patterns = [
    /youtube\.com\/watch\?v=([\w-]+)/,
    /youtu\.be\/([\w-]+)/,
    /youtube\.com\/shorts\/([\w-]+)/,
    /youtube\.com\/embed\/([\w-]+)/,
  ];

  for (const pattern of patterns) {
    const match = value.match(pattern);
    if (match) return match[1];
  }

  return value; // já é um ID puro
}

function createFacade(youtubeId, label) {
  const facade = document.createElement('div');
  facade.className = 'video-facade';
  facade.style.backgroundImage = `url(https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg)`;

  const playBtn = document.createElement('button');
  playBtn.className = 'play-btn';
  playBtn.setAttribute('aria-label', `Reproduzir ${label}`);
  playBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
  facade.appendChild(playBtn);

  facade.addEventListener('click', () => {
    const iframe = document.createElement('iframe');
    iframe.className = 'video-iframe';
    iframe.src = `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`;
    iframe.title = label;
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    facade.replaceWith(iframe);
  }, { once: true });

  return facade;
}

function renderHeroReel(youtubeId) {
  const player = document.getElementById('hero-reel-player');
  if (!player || !youtubeId) return;
  player.appendChild(createFacade(youtubeId, 'Demo Reel'));
}

function renderCarousel(youtubeIds) {
  const track = document.getElementById('carouselTrack');
  const dotsWrap = document.getElementById('carouselDots');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  if (!track || youtubeIds.length === 0) return;

  youtubeIds.forEach((youtubeId, i) => {
    const label = `vídeo ${i + 1}`;
    const card = document.createElement('div');
    card.className = 'carousel-card';

    const media = document.createElement('div');
    media.className = 'carousel-card-media';
    media.appendChild(createFacade(youtubeId, label));

    card.appendChild(media);
    track.appendChild(card);

    if (dotsWrap) {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot';
      dot.setAttribute('aria-label', `Ir para ${label}`);
      dotsWrap.appendChild(dot);
    }
  });

  const dots = dotsWrap ? Array.from(dotsWrap.children) : [];
  let index = 0;

  function goTo(newIndex) {
    index = (newIndex + youtubeIds.length) % youtubeIds.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
  }

  prevBtn?.addEventListener('click', () => goTo(index - 1));
  nextBtn?.addEventListener('click', () => goTo(index + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

  goTo(0);
}

async function init() {
  try {
    const response = await fetch('data/videos.yaml');
    const text = await response.text();
    const data = window.jsyaml.load(text);
    const entries = data?.videos || [];

    if (entries.length === 0) return;

    const youtubeIds = entries.map(extractYoutubeId);

    renderHeroReel(youtubeIds[0]);
    renderCarousel(youtubeIds.slice(1));
  } catch (error) {
    console.error('Não foi possível carregar data/videos.yaml', error);
  }
}

init();
