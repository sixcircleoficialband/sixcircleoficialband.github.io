/* Six Circle — lógica de la web. Para cambiar contenido NO edites este
   archivo: edita data/banda.js (ver EDITAR-WEB.txt). */
(function () {
  'use strict';
  var SC = window.SC || {}, B = SC.banda || {}, E = SC.enlaces || {}, L = SC.lanzamientos || [], V = SC.videos || [];
  var $ = function (s, r) { return (r || document).querySelector(s); };
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  var MES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  function fecha(f) { var p = String(f || '').split('-'); return p.length === 3 ? (+p[2]) + ' ' + MES[+p[1] - 1] + ' ' + p[0] : esc(f); }
  function pendiente(v) { return !v || /^\s*PENDIENTE/i.test(String(v)); }
  var pagina = document.body.getAttribute('data-pagina'), main = $('#contenido');

  /* íconos simples (SVG propio) */
  var I = {
    spotify: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11"/><path d="M6 9.2c4-1.2 8.6-.8 12 1.1M6.8 12.4c3.3-.9 6.8-.6 9.6 1M7.6 15.4c2.6-.6 5.2-.4 7.3.8" fill="none" stroke="#08080a" stroke-width="1.8" stroke-linecap="round"/></svg>',
    appleMusic: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 3v12.5a3 3 0 1 1-2-2.8V7.2l-8 1.8v8.5a3 3 0 1 1-2-2.8V5.3z"/></svg>',
    youtubeMusic: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11"/><circle cx="12" cy="12" r="6.2" fill="none" stroke="#08080a" stroke-width="1.6"/><path d="M10.2 9.2v5.6l4.6-2.8z" fill="#08080a"/></svg>',
    amazonMusic: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 15.5c5 3.3 12.4 3.6 18 0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M18.2 13.6l3.2 1.6-1.4 3.3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M15 4v7.2a2 2 0 1 1-1.5-1.9V6.4l-4 1v5.3a2 2 0 1 1-1.5-1.9V6.1z"/></svg>',
    deezer: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="15" width="4" height="4"/><rect x="7" y="11" width="4" height="8"/><rect x="12" y="7" width="4" height="12"/><rect x="17" y="3" width="4" height="16"/></svg>',
    qobuz: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="8" fill="none" stroke="currentColor" stroke-width="2.4"/><circle cx="11" cy="11" r="2.4"/><path d="M15.5 15.5l5 5" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg>',
    youtube: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill-rule="evenodd" d="M2.5 7.2c.2-1.6 1.3-2.6 2.9-2.8C7.4 4.2 9.7 4 12 4s4.6.2 6.6.4c1.6.2 2.7 1.2 2.9 2.8.2 1.6.3 3.2.3 4.8s-.1 3.2-.3 4.8c-.2 1.6-1.3 2.6-2.9 2.8-2 .2-4.3.4-6.6.4s-4.6-.2-6.6-.4c-1.6-.2-2.7-1.2-2.9-2.8C2.3 15.2 2.2 13.6 2.2 12s.1-3.2.3-4.8zM10 8.6v6.8l5.8-3.4z"/></svg>',
    tiktok: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 2h3.2c.3 2.4 1.8 4 4.3 4.3v3.3c-1.6 0-3-.5-4.3-1.3V15a6.5 6.5 0 1 1-6.5-6.5c.3 0 .7 0 1 .1v3.4a3.2 3.2 0 1 0 2.3 3.1z"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.4" cy="6.6" r="1.3"/></svg>',
    facebook: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11"/><path d="M13.2 21v-7h2.4l.4-2.8h-2.8V9.5c0-.8.3-1.4 1.4-1.4H16V5.6c-.3 0-1.1-.1-2-.1-2 0-3.4 1.2-3.4 3.5v2.2H8.2V14h2.4v7z" fill="#08080a"/></svg>',
    correo: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5h18v14H3z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M3 6l9 7 9-7" fill="none" stroke="currentColor" stroke-width="2"/></svg>'
  };
  var NOMBRES = { spotify: 'Spotify', appleMusic: 'Apple Music', youtubeMusic: 'YouTube Music', amazonMusic: 'Amazon Music', deezer: 'Deezer', qobuz: 'Qobuz', youtube: 'YouTube', tiktok: 'TikTok', instagram: 'Instagram', facebook: 'Facebook' };
  var MUSICA = ['spotify', 'appleMusic', 'youtubeMusic', 'amazonMusic', 'deezer', 'qobuz'], REDES = ['youtube', 'tiktok', 'instagram', 'facebook'];
  function ext(u) { return ' href="' + esc(u) + '" target="_blank" rel="noopener"'; }
  function plat(k, clase) { return E[k] ? '<a class="' + (clase || 'plat') + '"' + ext(E[k]) + ' data-plat="' + k + '">' + I[k] + '<span>' + NOMBRES[k] + '</span></a>' : ''; }

  /* cabecera y pie */
  var MENU = [['index', 'index.html', 'Inicio'], ['musica', 'musica.html', 'Música'], ['videos', 'videos.html', 'Videos'], ['banda', 'banda.html', 'La banda']];
  $('#cabecera').innerHTML = '<div class="envoltura barra"><a class="marca" href="index.html"><img src="assets/img/logo-256.webp" alt="" width="40" height="40">' + esc(B.nombre) + '</a>' +
    '<button class="boton-menu" type="button" aria-expanded="false" aria-controls="menu" aria-label="Abrir menú">☰</button><nav class="menu" id="menu" aria-label="Principal">' +
    MENU.map(function (m) { return '<a href="' + m[1] + '"' + (m[0] === pagina ? ' class="activo" aria-current="page"' : '') + '>' + m[2] + '</a>'; }).join('') + '</nav></div>';
  var bm = $('.boton-menu'), nav = $('#menu');
  bm.addEventListener('click', function () { var a = nav.classList.toggle('abierto'); bm.setAttribute('aria-expanded', a); bm.textContent = a ? '✕' : '☰'; bm.setAttribute('aria-label', a ? 'Cerrar menú' : 'Abrir menú'); });
  $('#pie').innerHTML = '<div class="envoltura pie"><div>© ' + new Date().getFullYear() + ' ' + esc(B.nombre) + ' · ' + esc(B.pais) + '<br><a class="ghatu" href="https://ghatugames.github.io" target="_blank" rel="noopener">Web hecha por <b>Ghatu Games</b></a><br><span class="visitas" id="visitas" aria-live="polite"><span>Visitas</span><b>0</b></span></div>' +
    '<div class="redes" aria-label="Redes y plataformas">' + REDES.concat(MUSICA).filter(function (k) { return E[k]; }).map(function (k) { return '<a' + ext(E[k]) + ' aria-label="' + NOMBRES[k] + '" title="' + NOMBRES[k] + '">' + I[k] + '</a>'; }).join('') + '</div></div>';

  /* Contador de visitas visible (abacus.jasoncameron.dev: gratis, sin cuenta, sin cookies).
     Cuenta UNA visita por sesión del navegador (sessionStorage); en las demás páginas solo lee el total.
     Si el servicio no responde, el contador queda oculto (su espacio ya está reservado: no mueve nada). */
  (function () {
    var el = $('#visitas'); if (!el || !window.fetch || !window.JSON) return;
    var API = 'https://abacus.jasoncameron.dev/', CLAVE = 'sixcircleoficialband/visitas';
    var ss = null; try { ss = window.sessionStorage; ss.setItem('sc_prueba', '1'); ss.removeItem('sc_prueba'); } catch (e) { ss = null; }
    var leer = pagina === '404' || (ss && ss.getItem('sc_visita') === '1');
    var ctl = window.AbortController ? new AbortController() : null;
    var t = setTimeout(function () { if (ctl) ctl.abort(); }, 8000);
    fetch(API + (leer ? 'get/' : 'hit/') + CLAVE, { cache: 'no-store', credentials: 'omit', referrerPolicy: 'no-referrer', signal: ctl ? ctl.signal : undefined })
      .then(function (r) { if (!r.ok) throw new Error('http ' + r.status); return r.json(); })
      .then(function (d) {
        clearTimeout(t);
        var n = Math.floor(Number(d && d.value));
        if (!(n >= 0)) return;
        if (ss && !leer) ss.setItem('sc_visita', '1');
        el.querySelector('b').textContent = String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        el.setAttribute('title', 'Visitas a la web');
        el.classList.add('listo');
      })
      .catch(function () { clearTimeout(t); });
  })();

  /* piezas */
  function disco(l) {
    var en = l.enlaces || {}, mini = [['spotify', 'Spotify', 'spotify'], ['apple', 'Apple Music', 'appleMusic'], ['youtube', 'Video en YouTube', 'youtube'], ['amazon', 'Amazon Music', 'amazonMusic'], ['deezer', 'Deezer', 'deezer'], ['qobuz', 'Qobuz', 'qobuz']]
      .filter(function (m) { return en[m[0]]; }).map(function (m) { return '<a' + ext(en[m[0]]) + ' aria-label="' + esc(l.titulo) + ' en ' + m[1] + '" title="' + m[1] + '">' + I[m[2]] + '</a>'; }).join('');
    var vivo = /vivo/i.test(l.tipo);
    return '<article class="disco" data-genero="' + esc(l.genero) + '" data-vivo="' + vivo + '"><div class="tapa"><img src="' + esc(l.portada) + '" alt="Portada de ' + esc(l.titulo) + '" loading="lazy" width="360" height="360">' + (vivo ? '<span class="vivo">En vivo</span>' : '') + '</div>' +
      '<div class="info"><h3>' + esc(l.titulo) + '</h3><div class="meta">' + esc(l.tipo) + (l.genero ? ' · ' + esc(l.genero) : '') + ' · ' + fecha(l.fecha) + '</div>' +
      (l.otrasFechas && l.otrasFechas.length ? '<div class="meta">Versión anterior: ' + l.otrasFechas.map(fecha).join(', ') + '</div>' : '') + '<div class="mini">' + mini + '</div></div></article>';
  }
  function miniatura(v) { return 'assets/img/videos/' + v.id + '.webp'; }
  function video(v) {
    return '<article class="video"><div class="marco" data-yt="' + esc(v.id) + '"><button type="button" class="cargar" aria-label="Reproducir: ' + esc(v.titulo) + '"><img src="' + miniatura(v) + '" alt="" loading="lazy" width="480" height="270" onerror="this.onerror=null;this.src=\'https://i.ytimg.com/vi/' + esc(v.id) + '/hqdefault.jpg\'"><span class="play" aria-hidden="true">▶</span></button></div>' +
      '<div class="info"><h3>' + esc(v.titulo) + '</h3><div class="meta">' + fecha(v.fecha) + ' · <a' + ext('https://www.youtube.com/watch?v=' + v.id) + '>Ver en YouTube</a></div></div></article>';
  }
  function spotify() {
    if (!SC.spotifyArtista) return '';
    return '<div class="spotify" data-sp="' + esc(SC.spotifyArtista) + '"><button type="button" class="cargar" aria-label="Cargar el reproductor de Spotify"><img src="assets/img/logo-256.webp" alt="" width="110" height="110"><span class="verde">' + I.spotify.replace('#08080a', '#1ed760') + ' Escuchar en Spotify</span><small style="color:var(--suave);letter-spacing:.05em;text-transform:none;font-weight:600">Toca para cargar el reproductor</small></button></div>' +
      '<p class="nota">El reproductor de Spotify solo se carga cuando lo tocas.</p>';
  }
  function titulo(t, sub, mas) { return '<div class="titulo-seccion"><div><h2>' + t + '</h2>' + (sub ? '<p>' + sub + '</p>' : '') + '</div>' + (mas || '') + '</div>'; }
  function cabeza(t, p) { return '<section class="cabeza-pagina"><div class="envoltura"><span class="etiqueta">' + esc(B.nombre) + '</span><h1>' + t + '</h1><p>' + p + '</p></div></section>'; }
  var destacados = V.filter(function (v) { return v.destacado; }); if (!destacados.length) destacados = V;

  var P = {};
  P.index = function () {
    var u = L[0];
    return '<section class="heroe"><div class="fondo" role="img" aria-label="Ilustración decorativa de un escenario con humo y luces rojas (no es una foto de la banda)"></div><div class="envoltura"><div>' +
      '<span class="etiqueta">' + esc((B.generos || []).join(' · ')) + ' · ' + esc(B.pais) + '</span><h1>' + esc(B.nombre) + '<span>Banda oficial</span></h1><p class="lead">' + esc(B.lema) + '</p>' +
      '<div class="acciones">' + (E.spotify ? '<a class="btn"' + ext(E.spotify) + '>▶ Escuchar ahora</a>' : '') + '<a class="btn plata" href="videos.html">Ver videos</a><a class="btn borde" href="musica.html">Discografía</a></div></div>' +
      '<img class="logo" src="assets/img/logo-512.webp" alt="Logo de Six Circle: seis anillos entrelazados bajo el nombre de la banda" width="512" height="512"></div></section>' +
      (u ? '<section class="seccion"><div class="envoltura">' + titulo('Último lanzamiento') + '<div class="destacado"><img src="' + esc(u.portada) + '" alt="Portada de ' + esc(u.titulo) + '" width="360" height="360"><div><div class="fecha">' + esc(u.tipo) + ' · ' + fecha(u.fecha) + '</div><h2 style="font-size:clamp(34px,6vw,60px);margin:.15em 0 .3em">' + esc(u.titulo) + '</h2><p style="color:var(--suave)">Disponible en todas las plataformas digitales.</p><div class="plataformas">' + MUSICA.map(function (k) { return plat(k); }).join('') + '</div></div></div></div></section>' : '') +
      '<section class="seccion"><div class="envoltura"><div class="dos-col"><div>' + titulo('Escúchanos', 'Sus canciones más escuchadas en Spotify.') + spotify() + '</div><div>' + titulo('Síguenos') + '<div class="rejilla-plat">' + REDES.map(function (k) { return plat(k); }).join('') + '</div>' +
      '<div class="caja" style="margin-top:16px"><h3>Lanzamientos recientes</h3><ul class="datos">' + L.slice(1, 6).map(function (l) { return '<li><b>' + esc(l.titulo) + '</b><span>' + fecha(l.fecha) + '</span></li>'; }).join('') + '</ul><a class="btn borde" style="margin-top:12px;width:100%" href="musica.html">Ver toda la música</a></div></div></div></div></section>' +
      '<section class="seccion"><div class="envoltura">' + titulo('Videos', 'Lo último en nuestro canal de YouTube.', '<a class="btn borde" href="videos.html">Ver todos</a>') + '<div class="videos">' + destacados.slice(0, 3).map(video).join('') + '</div></div></section>';
  };
  P.musica = function () {
    return cabeza('Música', esc(L.length) + ' lanzamientos en plataformas digitales. Toca un ícono para escucharlo en tu plataforma favorita.') +
      '<section class="seccion" style="padding-top:20px"><div class="envoltura"><div class="plataformas" style="margin-bottom:26px">' + MUSICA.map(function (k) { return plat(k); }).join('') + '</div>' +
      '<div class="filtros" role="group" aria-label="Filtrar"><button type="button" class="activo" data-f="">Todos</button><button type="button" data-f="Metal">Metal</button><button type="button" data-f="Rock">Rock</button><button type="button" data-f="vivo">En vivo</button></div>' +
      '<div class="discos" id="discos">' + L.map(disco).join('') + '</div><p class="vacio" id="sin" hidden>No hay lanzamientos con ese filtro.</p></div></section>' +
      '<section class="seccion"><div class="envoltura">' + titulo('Escuchar en Spotify') + spotify() + '</div></section>';
  };
  P.videos = function () {
    return cabeza('Videos', 'Videoclips, letras subtituladas y presentaciones en vivo.' + (E.youtube ? ' <a' + ext(E.youtube) + '>Suscríbete al canal</a>.' : '')) +
      '<section class="seccion" style="padding-top:20px"><div class="envoltura"><div class="videos">' + V.map(video).join('') + '</div><p class="nota" style="margin-top:16px">Los videos se cargan solo al tocarlos (modo de privacidad mejorada de YouTube).</p></div></section>';
  };
  P.banda = function () {
    var bio = (B.bio || []).filter(function (p) { return !pendiente(p); });
    var ints = (B.integrantes || []).filter(function (m) { return !pendiente(m.nombre); });
    var datos = [['Origen', [B.ciudad, B.pais].filter(Boolean).join(', ')], ['Desde', B.desde], ['Género', (B.generos || []).join(' / ')], ['Lanzamientos', L.length ? L.length + ' sencillos' : '']].filter(function (d) { return d[1] && !pendiente(d[1]); });
    var contacto = [B.correo ? '<a class="plat" href="mailto:' + esc(B.correo) + '">' + I.correo + '<span>' + esc(B.correo) + '</span></a>' : '', B.whatsapp ? '<a class="plat"' + ext('https://wa.me/' + B.whatsapp) + '><span>WhatsApp</span></a>' : ''].join('');
    return cabeza('La banda', esc(B.nombre) + ': ' + esc((B.generos || []).join(' y ').toLowerCase()) + ' desde ' + esc(B.pais) + '.') +
      '<section class="seccion" style="padding-top:20px"><div class="envoltura"><div class="dos-col"><div>' + titulo('Historia') +
      (bio.length ? bio.map(function (p) { return '<p style="font-size:17px">' + esc(p) + '</p>'; }).join('') : '<div class="caja pronto" data-pendiente="bio"><p style="margin:0">Muy pronto: la historia de ' + esc(B.nombre) + '.</p></div>') + '</div>' +
      '<div>' + titulo('Ficha') + '<div class="caja"><ul class="datos">' + datos.map(function (d) { return '<li><span>' + d[0] + '</span><b>' + esc(d[1]) + '</b></li>'; }).join('') +
      (B.creditos || []).map(function (c) { return '<li><span>' + esc(c.rol) + '</span><b style="text-align:right">' + esc(c.nombre) + '</b></li>'; }).join('') + '</ul>' +
      ((B.creditos || []).length ? '<p class="nota">Créditos según ' + esc(B.creditos.map(function (c) { return c.fuente; }).join('; ')) + '.</p>' : '') + '</div></div></div></div></section>' +
      '<section class="seccion"><div class="envoltura">' + titulo('Integrantes') + (ints.length ? '<div class="integrantes">' + ints.map(function (m) {
        return '<div class="integrante"><div class="foto">' + (m.foto ? '<img src="' + esc(m.foto) + '" alt="' + esc(m.nombre) + '" loading="lazy">' : '<span aria-hidden="true">' + esc(m.nombre.charAt(0)) + '</span>') + '</div><h3>' + esc(m.nombre) + '</h3><p>' + esc(m.rol) + '</p></div>';
      }).join('') + '</div>' : '<div class="caja pronto" data-pendiente="integrantes"><p style="margin:0">Muy pronto presentaremos a los integrantes.</p></div>') + '</div></section>' +
      '<section class="seccion"><div class="envoltura">' + titulo('Contacto y redes', 'Prensa, shows y colaboraciones.') + '<div class="rejilla-plat">' + contacto + REDES.map(function (k) { return plat(k); }).join('') + '</div>' +
      (contacto ? '' : '<p class="nota">Para contrataciones escríbenos por mensaje directo en nuestras redes.</p>') + '</div></section>';
  };
  P['404'] = function () { return '<div class="envoltura" style="text-align:center;padding:60px 18px"><img src="assets/img/logo-256.webp" alt="" width="160" height="160" style="width:160px;margin:0 auto 18px;border-radius:50%"><h1>404</h1><p style="color:var(--suave)">Esta página se perdió en el sexto círculo.</p><a class="btn" href="index.html">Volver al inicio</a></div>'; };
  main.insertAdjacentHTML('beforeend', (P[pagina] || P['404'])());

  /* interacciones */
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('.cargar'); if (!b) return;
    var box = b.parentNode, yt = box.getAttribute('data-yt'), sp = box.getAttribute('data-sp');
    if (yt) box.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + encodeURIComponent(yt) + '?autoplay=1&rel=0" title="Video de YouTube" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
    else if (sp) box.innerHTML = '<iframe src="https://open.spotify.com/embed/artist/' + encodeURIComponent(sp) + '?theme=0" title="Reproductor de Spotify: ' + esc(B.nombre) + '" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>';
  });
  if (pagina === 'musica') {
    main.querySelectorAll('.filtros button').forEach(function (b) {
      b.addEventListener('click', function () {
        var f = b.getAttribute('data-f'), n = 0;
        main.querySelectorAll('.filtros button').forEach(function (x) { x.classList.toggle('activo', x === b); });
        main.querySelectorAll('.disco').forEach(function (d) { var ok = !f || (f === 'vivo' ? d.getAttribute('data-vivo') === 'true' : d.getAttribute('data-genero') === f); d.hidden = !ok; if (ok) n++; });
        $('#sin').hidden = n > 0;
      });
    });
  }
})();
