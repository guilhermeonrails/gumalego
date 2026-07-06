// Lê data/videos.yaml, injeta o Demo Reel na Hero e monta o carrossel de Trabalhos.
// videos[0] -> Demo Reel (Hero) | videos[1..] -> carrossel

function createFacade(video) {
  const facade = document.createElement('div');
  facade.className = 'video-facade';
  facade.style.backgroundImage = `url(https://img.youtube.com/vi/${video.youtube_id}/hqdefault.jpg)`;

  const playBtn = document.createElement('button');
  playBtn.className = 'play-btn';
  playBtn.setAttribute('aria-label', `Reproduzir ${video.title}`);
  playBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
  facade.appendChild(playBtn);

  facade.addEventListener('click', () => {
    const iframe = document.createElement('iframe');
    iframe.className = 'video-iframe';
    iframe.src = `https://www.youtube.com/embed/${video.youtube_id}?autoplay=1&rel=0`;
    iframe.title = video.title;
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    facade.replaceWith(iframe);
  }, { once: true });

  return facade;
}

function renderHeroReel(video) {
  const player = document.getElementById('hero-reel-player');
  if (!player || !video) return;
  player.appendChild(createFacade(video));
}

function renderCarousel(videos) {
  const track = document.getElementById('carouselTrack');
  const dotsWrap = document.getElementById('carouselDots');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  if (!track || videos.length === 0) return;

  videos.forEach((video) => {
    const card = document.createElement('div');
    card.className = 'carousel-card';

    const media = document.createElement('div');
    media.className = 'carousel-card-media';
    media.appendChild(createFacade(video));

    const title = document.createElement('p');
    title.className = 'carousel-card-title';
    title.textContent = video.title;

    card.appendChild(media);
    card.appendChild(title);
    track.appendChild(card);

    if (dotsWrap) {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot';
      dot.setAttribute('aria-label', `Ir para ${video.title}`);
      dotsWrap.appendChild(dot);
    }
  });

  const dots = dotsWrap ? Array.from(dotsWrap.children) : [];
  let index = 0;

  function goTo(newIndex) {
    index = (newIndex + videos.length) % videos.length;
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
    const videos = data?.videos || [];

    if (videos.length === 0) return;

    renderHeroReel(videos[0]);
    renderCarousel(videos.slice(1));
  } catch (error) {
    console.error('Não foi possível carregar data/videos.yaml', error);
  }
}

init();
