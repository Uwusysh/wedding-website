// ===== Curtain intro =====
// Fabric-fold curtain (always works). If assets/curtain.mp4 exists, that video plays instead.
const curtain = document.getElementById('curtain');
const strips = document.getElementById('strips');
const cv = document.getElementById('cv');
document.body.classList.add('lock');

(function buildStrips() {
  const W = innerWidth, H = innerHeight, N = 12;
  const s = Math.max(W / 720, H / 1350), bw = 720 * s, bh = 1350 * s;
  const ox = (W - bw) / 2, oy = (H - bh) / 2, sw = W / 2 / N;
  for (let i = 0; i < N; i++) {            // i = distance from the outer edge (N-1 = centre)
    [['L', i * sw], ['R', W - (i + 1) * sw]].forEach(([side, x]) => {
      const el = document.createElement('i');
      el.className = side;
      const tx = i * sw * 0.84 + W * 0.1;
      el.style.cssText = `left:${x}px;width:${sw + 1}px;background-size:${bw}px ${bh}px;background-position:${ox - x}px ${oy}px;` +
        `--d:${((N - 1 - i) * 0.045).toFixed(3)}s;--tx:${side === 'L' ? -tx : tx}px`;
      strips.appendChild(el);
    });
  }
})();

let finished = false;
function finish() {
  if (finished) return;
  finished = true;
  document.body.classList.remove('lock');
  curtain.classList.add('gone');
  setTimeout(() => curtain.remove(), 700);
}
// Ganesha scene: idol appears as the curtains part, light pours in from the edges, floods, then reveals the page
const reveal = document.getElementById('reveal');
const idolImg = document.getElementById('idolimg');
const useImg = () => { idolImg.hidden = false; document.getElementById('idolsvg').style.display = 'none'; };
idolImg.addEventListener('load', useImg);
if (idolImg.complete && idolImg.naturalWidth) useImg();
function runReveal() {
  reveal.classList.add('lit');
  setTimeout(() => reveal.classList.add('flooded'), 1700);
  setTimeout(() => reveal.classList.add('out'), 2500);
  setTimeout(() => reveal.remove(), 3500);
}
let opening = false;
function openStrips() { if (opening) return; opening = true; curtain.classList.add('open'); petalShower(); runReveal(); setTimeout(finish, 2700); }
// A tap on the curtain counts as the gesture phones require for sound: music + curtains start together
curtain.addEventListener('pointerdown', () => { startSong(); openStrips(); });

let videoMode = false;
cv.addEventListener('canplay', () => {
  videoMode = true;
  curtain.classList.add('vid');
  cv.classList.add('on');
  cv.play().catch(() => { videoMode = false; cv.classList.remove('on'); });
  setTimeout(petalShower, 1500); runReveal();
  cv.addEventListener('ended', finish);
  setTimeout(finish, 9000);
}, { once: true });
setTimeout(() => { if (!videoMode) openStrips(); }, 2500);

// Scroll reveal
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), { root: document.getElementById('page'), threshold: 0.15 });
document.querySelectorAll('.r').forEach(el => io.observe(el));

// Countdown to the wedding: 25 Nov 2026, 9:00 PM IST
const target = new Date('2026-11-25T21:00:00+05:30').getTime();
const pad = n => String(n).padStart(2, '0');
function tick() {
  let s = Math.max(0, Math.floor((target - Date.now()) / 1000));
  const d = Math.floor(s / 86400); s %= 86400;
  const h = Math.floor(s / 3600); s %= 3600;
  const m = Math.floor(s / 60); s %= 60;
  document.getElementById('cd-d').textContent = pad(d);
  document.getElementById('cd-h').textContent = pad(h);
  document.getElementById('cd-m').textContent = pad(m);
  document.getElementById('cd-s').textContent = pad(s);
}
tick(); setInterval(tick, 1000);

// Share
const msg = 'You are warmly invited to the wedding of Kirti Tiwari & Divyank Mishra — 25 November 2026, Tiwari Niwas, Pratapgarh (UP). ' + location.href;
document.getElementById('wa').href = 'https://wa.me/?text=' + encodeURIComponent(msg);
const copy = document.getElementById('copy');
copy.addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(location.href); } catch (e) {}
  copy.textContent = 'Link Copied ✓';
  setTimeout(() => copy.textContent = 'Copy Link', 2000);
});

// Flower petals fall as the curtains open
function petalShower() {
  const box = document.createElement('div');
  box.id = 'petals';
  const cols = ['#ff9d1c', '#ffc23a', '#f4a52a', '#f06292', '#f8bbd0', '#e8445a'];
  for (let i = 0; i < 48; i++) {
    const p = document.createElement('i');
    const size = 9 + Math.random() * 13;
    const fall = 3.2 + Math.random() * 2.6;
    p.style.cssText = `left:${Math.random() * 100}%;width:${size}px;height:${size * 1.15}px;background:${cols[i % cols.length]};` +
      `animation-duration:${fall}s,${1.2 + Math.random() * 1.4}s;animation-delay:${Math.random() * 1.6}s,0s;filter:brightness(${0.9 + Math.random() * 0.25})`;
    box.appendChild(p);
  }
  document.body.appendChild(box);
  setTimeout(() => box.remove(), 8000);
}

// Two stepped flower lines down each side (a wave of "wind" runs down them via staggered delays)
function buildGarlands() {
  document.querySelectorAll('.gar').forEach(g => {
    g.innerHTML = '';
    const n = Math.floor(g.clientHeight / 22);
    const inner = g.classList.contains('gl2') || g.classList.contains('gr2');
    for (let k = 0; k < n; k++) {
      const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      const u = document.createElementNS('http://www.w3.org/2000/svg', 'use');
      u.setAttribute('href', inner ? (k % 2 ? '#jas' : '#rose') : '#mar');
      s.appendChild(u);
      s.style.top = k * 22 + 'px';
      s.style.animationDelay = (-k * 0.18) + 's';
      g.appendChild(s);
    }
  });
}
buildGarlands();
let rz;
addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(buildGarlands, 200); });

// ===== Music: starts as soon as the page opens (song file already begins at 0:57 of the original) =====
const song = document.getElementById('song');
const muteBtn = document.getElementById('mute');
song.volume = 0.85; song.load();
let started = false;
function startSong() {
  if (started) return;
  song.play().then(() => {
    started = true;
    ['pointerdown', 'touchstart', 'keydown', 'wheel', 'scroll'].forEach(e => removeEventListener(e, startSong, true));
  }).catch(() => {});
}
startSong();                                   // works where the browser allows autoplay
['pointerdown', 'touchstart', 'keydown', 'wheel', 'scroll'].forEach(e => addEventListener(e, startSong, { capture: true, passive: true }));
song.addEventListener('timeupdate', () => {    // gentle fade-out over the last 6 seconds
  const left = song.duration - song.currentTime;
  if (left < 6) song.volume = Math.max(0, 0.85 * left / 6);
});
muteBtn.addEventListener('click', () => {
  song.muted = !song.muted;
  muteBtn.classList.toggle('off', song.muted);
});
document.addEventListener('visibilitychange', () => { if (document.hidden) song.pause(); else if (started && !song.ended) song.play().catch(() => {}); });
