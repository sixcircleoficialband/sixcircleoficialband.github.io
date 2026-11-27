/* =====================================================================
   SIX CIRCLE — DATOS DE LA WEB
   Este es el ÚNICO archivo que hay que editar para cambiar textos,
   integrantes, lanzamientos, videos y enlaces. Guía: EDITAR-WEB.txt
   Regla de oro: respeta las comillas '...' y las comas entre bloques.
   ===================================================================== */
var SC = window.SC = window.SC || {};

/* 1) DATOS GENERALES ------------------------------------------------- */
SC.banda = {
  nombre: 'Six Circle',
  pais: 'Bolivia',
  generos: ['Rock', 'Metal'],
  lema: 'Rock y metal desde Bolivia.',
  // ⚠️ PENDIENTE: escribe aquí la biografía real de la banda (párrafos).
  //    Mientras empiece con 'PENDIENTE', la web muestra un aviso en lugar del texto.
  bio: [
    'PENDIENTE: biografía de la banda (cómo y cuándo nació, ciudad, influencias, logros).'
  ],
  // ⚠️ PENDIENTE: ciudad de origen (ej.: 'La Paz'). Vacío = no se muestra.
  ciudad: '',
  // ⚠️ PENDIENTE: año de formación (ej.: '2024'). Vacío = no se muestra.
  desde: '',
  // Créditos verificados en las plataformas (Qobuz):
  creditos: [
    { rol: 'Composición', nombre: 'Cristhian Condori Torrez', fuente: 'Qobuz (Concrete Resonance y Awakening (Live))' }
  ],
  // ⚠️ PENDIENTE: integrantes. Copia el bloque { ... } por cada integrante.
  //    foto: '' (sin foto) o 'assets/img/integrantes/nombre.webp'
  integrantes: [
    { nombre: 'PENDIENTE', rol: 'Voz', foto: '' },
    { nombre: 'PENDIENTE', rol: 'Guitarra', foto: '' },
    { nombre: 'PENDIENTE', rol: 'Bajo', foto: '' },
    { nombre: 'PENDIENTE', rol: 'Batería', foto: '' }
  ],
  // ⚠️ PENDIENTE: contacto para prensa y shows. Vacío = no se muestra.
  correo: '',
  whatsapp: ''   // ej.: '59170000000' (con código de país, sin + ni espacios)
};

/* 2) REDES Y PLATAFORMAS (vacío '' = no se muestra) ------------------ */
SC.enlaces = {
  spotify:      'https://open.spotify.com/intl-es/artist/23iBH7nrnQqxBkPd5LfuVx',
  appleMusic:   'https://music.apple.com/bo/artist/six-circle/6800437927',
  youtubeMusic: 'https://music.youtube.com/channel/UCHnNG-Qy_8qVfxVExjCCtbA',
  amazonMusic:  'https://music.amazon.es/albums/B0H9FMPSGJ',   // enlace al sencillo «Golden Sun»
  deezer:       'https://www.deezer.com/artist/400970221',
  qobuz:        'https://www.qobuz.com/es-es/interpreter/six-circle/34184553',
  youtube:      'https://youtube.com/@sixcircleoficial',
  tiktok:       'https://www.tiktok.com/@sixcircle6',
  instagram:    'https://www.instagram.com/sixcircleo',
  facebook:     'https://www.facebook.com/share/1Ekg5WTc2j/'
};
// Reproductor de Spotify (ID del artista: lo que va después de /artist/ en el enlace)
SC.spotifyArtista = '23iBH7nrnQqxBkPd5LfuVx';

/* 3) LANZAMIENTOS (el más nuevo primero) ------------------------------
   Para agregar uno: copia un bloque { ... }, pégalo ARRIBA de todo y
   cambia los datos. portada: imagen cuadrada en assets/img/portadas/
   enlaces: pon los que tengas (spotify, apple, youtube, deezer, amazon, qobuz)
   otrasFechas: fechas de versiones anteriores con el mismo nombre (opcional)
   --------------------------------------------------------------------- */
SC.lanzamientos = [
  { titulo: 'Chains of Echoes', tipo: 'Sencillo', fecha: '2026-11-13', otrasFechas: ['2026-09-10'], genero: 'Metal',
    portada: 'assets/img/portadas/chains-of-echoes.webp',
    enlaces: { apple: 'https://music.apple.com/us/album/chains-of-echoes-single/6832672687', deezer: 'https://www.deezer.com/album/1142586301' } },
  { titulo: 'Angel Dust', tipo: 'Sencillo', fecha: '2026-11-12', otrasFechas: ['2026-10-03'], genero: 'Metal',
    portada: 'assets/img/portadas/angel-dust.webp',
    enlaces: { youtube: 'https://www.youtube.com/watch?v=oKa3rYaigjA', apple: 'https://music.apple.com/us/album/angel-dust-single/6831836225', deezer: 'https://www.deezer.com/album/1140792101' } },
  { titulo: 'Roll The Dice', tipo: 'Sencillo', fecha: '2026-11-11', otrasFechas: ['2026-07-20'], genero: 'Metal',
    portada: 'assets/img/portadas/roll-the-dice.webp',
    enlaces: { apple: 'https://music.apple.com/us/album/roll-the-dice-single/6832673406', deezer: 'https://www.deezer.com/album/1142587271' } },
  { titulo: 'Lucky Coin', tipo: 'Sencillo', fecha: '2026-11-10', otrasFechas: ['2026-09-03'], genero: 'Metal',
    portada: 'assets/img/portadas/lucky-coin.webp',
    enlaces: { apple: 'https://music.apple.com/us/album/lucky-coin-single/6831768943', deezer: 'https://www.deezer.com/album/1140642091' } },
  { titulo: 'Gravity', tipo: 'Sencillo', fecha: '2026-11-10', otrasFechas: ['2026-08-29'], genero: 'Metal',
    portada: 'assets/img/portadas/gravity.webp',
    enlaces: { youtube: 'https://www.youtube.com/watch?v=dzUwEmTFl9A', apple: 'https://music.apple.com/us/album/gravity-single/6832673157', deezer: 'https://www.deezer.com/album/1142587531' } },
  { titulo: 'Concrete Resonance', tipo: 'Sencillo', fecha: '2026-11-08', otrasFechas: ['2026-08-10'], genero: 'Metal',
    portada: 'assets/img/portadas/concrete-resonance.webp',
    enlaces: { qobuz: 'https://www.qobuz.com/es-es/album/concrete-resonance-six-circle/uttcaibrw122w', apple: 'https://music.apple.com/us/album/concrete-resonance-single/6831629237', deezer: 'https://www.deezer.com/album/1140352441' } },
  { titulo: 'Pocket Full of Keys', tipo: 'Sencillo', fecha: '2026-11-07', genero: 'Rock',
    portada: 'assets/img/portadas/pocket-full-of-keys.webp',
    enlaces: { apple: 'https://music.apple.com/us/album/pocket-full-of-keys-single/6829301739', deezer: 'https://www.deezer.com/album/1135707781' } },
  { titulo: 'Fading tonight', tipo: 'Sencillo', fecha: '2026-11-06', genero: 'Metal',
    portada: 'assets/img/portadas/fading-tonight.webp',
    enlaces: { apple: 'https://music.apple.com/us/album/fading-tonight-single/6829950907', deezer: 'https://www.deezer.com/album/1137162121' } },
  { titulo: 'Broken Glass', tipo: 'Sencillo', fecha: '2026-11-05', genero: 'Metal',
    portada: 'assets/img/portadas/broken-glass.webp',
    enlaces: { apple: 'https://music.apple.com/us/album/broken-glass-single/6829248983', deezer: 'https://www.deezer.com/album/1135598501' } },
  { titulo: 'Same Song', tipo: 'Sencillo', fecha: '2026-11-04', otrasFechas: ['2026-07-12'], genero: '',
    portada: 'assets/img/portadas/same-song.webp',
    enlaces: { youtube: 'https://www.youtube.com/watch?v=O2C93whjTD8', apple: '', deezer: 'https://www.deezer.com/album/1140325881' } },
  { titulo: 'Cure My Tragedy (Live)', tipo: 'Sencillo en vivo', fecha: '2026-11-02', genero: 'Metal',
    portada: 'assets/img/portadas/cure-my-tragedy-live.webp',
    enlaces: { apple: 'https://music.apple.com/us/album/cure-my-tragedy-live-single/6828563637', deezer: 'https://www.deezer.com/album/1134094461' } },
  { titulo: 'Paper Cup Fortune', tipo: 'Sencillo', fecha: '2026-11-02', otrasFechas: ['2026-07-10'], genero: 'Metal',
    portada: 'assets/img/portadas/paper-cup-fortune.webp',
    enlaces: { youtube: 'https://www.youtube.com/watch?v=itPUYO8Qar8', apple: 'https://music.apple.com/us/album/paper-cup-fortune-single/6828954663', deezer: 'https://www.deezer.com/album/1134880691' } },
  { titulo: 'Awakening (Live)', tipo: 'Sencillo en vivo', fecha: '2026-10-29', genero: 'Metal',
    portada: 'assets/img/portadas/awakening-live.webp',
    enlaces: { qobuz: 'https://www.qobuz.com/es-es/album/awakening-six-circle/bipgg22l3q1hd', apple: 'https://music.apple.com/us/album/awakening-live-single/6827704734', deezer: 'https://www.deezer.com/album/1132152901' } },
  { titulo: 'Rise Again (Live)', tipo: 'Sencillo en vivo', fecha: '2026-10-21', genero: 'Metal',
    portada: 'assets/img/portadas/rise-again-live.webp',
    enlaces: { youtube: 'https://www.youtube.com/watch?v=yBS3GvFe_kk', apple: 'https://music.apple.com/us/album/rise-again-live-single/6822431429', deezer: 'https://www.deezer.com/album/1120657392' } },
  { titulo: 'Dragged by a Chain', tipo: 'Sencillo', fecha: '2026-10-10', otrasFechas: ['2026-08-06'], genero: 'Metal',
    portada: 'assets/img/portadas/dragged-by-a-chain.webp',
    enlaces: { youtube: 'https://www.youtube.com/watch?v=3kpxmtNprOU', apple: 'https://music.apple.com/us/album/dragged-by-a-chain-single/6820590071', deezer: 'https://www.deezer.com/album/1116963842' } },
  { titulo: 'LIGHT THE FUSE', tipo: 'Sencillo', fecha: '2026-10-04', genero: 'Metal',
    portada: 'assets/img/portadas/light-the-fuse.webp',
    enlaces: { apple: 'https://music.apple.com/us/album/light-the-fuse-single/6818235373', deezer: 'https://www.deezer.com/album/1111268792' } },
  { titulo: 'Dice On The Table', tipo: 'Sencillo', fecha: '2026-10-02', genero: 'Metal',
    portada: 'assets/img/portadas/dice-on-the-table.webp',
    enlaces: { apple: 'https://music.apple.com/us/album/dice-on-the-table-single/6817548167', deezer: 'https://www.deezer.com/album/1109820332' } },
  { titulo: 'Hollow', tipo: 'Sencillo', fecha: '2026-09-30', genero: 'Metal',
    portada: 'assets/img/portadas/hollow.webp',
    enlaces: { apple: 'https://music.apple.com/us/album/hollow-single/6817521843', deezer: 'https://www.deezer.com/album/1109757422' } },
  { titulo: 'Paper Crown', tipo: 'Sencillo', fecha: '2026-09-25', genero: 'Rock',
    portada: 'assets/img/portadas/paper-crown.webp',
    enlaces: { apple: 'https://music.apple.com/us/album/paper-crown-single/6815009241', deezer: 'https://www.deezer.com/album/1102395312' } },
  { titulo: 'Cold Tonight', tipo: 'Sencillo', fecha: '2026-09-22', genero: 'Rock',
    portada: 'assets/img/portadas/cold-tonight.webp',
    enlaces: { apple: 'https://music.apple.com/us/album/cold-tonight-single/6814845963', deezer: 'https://www.deezer.com/album/1102311022' } },
  { titulo: 'Paper Airplane Map', tipo: 'Sencillo', fecha: '2026-09-01', genero: 'Rock',
    portada: 'assets/img/portadas/paper-airplane-map.webp',
    enlaces: { apple: 'https://music.apple.com/us/album/paper-airplane-map-single/6805504559', deezer: 'https://www.deezer.com/album/1063522321' } },
  { titulo: 'Rise Again', tipo: 'Sencillo', fecha: '2026-08-26', genero: 'Rock',
    portada: 'assets/img/portadas/rise-again.webp',
    enlaces: { apple: 'https://music.apple.com/us/album/rise-again-single/6805574948', deezer: 'https://www.deezer.com/album/1063688811' } },
  { titulo: 'Cure My Tragedy', tipo: 'Sencillo', fecha: '2026-08-12', genero: 'Rock',
    portada: 'assets/img/portadas/cure-my-tragedy.webp',
    enlaces: { youtube: 'https://www.youtube.com/watch?v=ZoM25X4KyQQ', apple: 'https://music.apple.com/us/album/cure-my-tragedy-single/6800438083', deezer: 'https://www.deezer.com/album/1051819022' } },
  { titulo: 'Golden Sun', tipo: 'Sencillo', fecha: '2026-07-24', genero: '',
    portada: 'assets/img/portadas/golden-sun.webp',
    enlaces: { youtube: 'https://www.youtube.com/watch?v=N1l0gToUTE0', amazon: 'https://music.amazon.es/albums/B0H9FMPSGJ', apple: '', deezer: 'https://www.deezer.com/album/1032375292' } },
  { titulo: 'Unraveling', tipo: 'Sencillo', fecha: '2026-07-15', genero: '',
    portada: 'assets/img/portadas/unraveling.webp',
    enlaces: { apple: '', deezer: 'https://www.deezer.com/album/1025037141' } },
  { titulo: 'Lemon In My Pocket', tipo: 'Sencillo', fecha: '2026-07-04', genero: '',
    portada: 'assets/img/portadas/lemon-in-my-pocket.webp',
    enlaces: { apple: '', deezer: 'https://www.deezer.com/album/1019175031' } }
];

/* 4) VIDEOS DE YOUTUBE (el más nuevo primero) -------------------------
   id: lo que va después de "v=" en el enlace de YouTube.
   La miniatura se toma de assets/img/videos/<id>.webp si existe;
   si no existe, se usa la de YouTube automáticamente.
   destacado: true -> aparece en la página de Inicio.
   --------------------------------------------------------------------- */
SC.videos = [
  { id: 'N-UJxQ_vu6A', destacado: true, titulo: 'Six Circle - Gravity', fecha: '2026-11-26' },
  { id: 'tHHVorFs5Jo', destacado: true, titulo: 'Six Circle - Concrete Resonance  (Sub)', fecha: '2026-11-26' },
  { id: 'ZoM25X4KyQQ', destacado: true, titulo: 'Six Circle - Cure My Tragedy (sub español/ingles)', fecha: '2026-10-29' },
  { id: 'N1l0gToUTE0', destacado: true, titulo: 'Six Circle - Golden Sun (sub español/ingles)', fecha: '2026-10-28' },
  { id: 'GSkDFf8QdmY', titulo: '25 de octubre de 2026', fecha: '2026-10-25' },
  { id: 'yBS3GvFe_kk', destacado: true, titulo: 'Rise Again Live (Sub Esp)', fecha: '2026-10-21' },
  { id: '3kpxmtNprOU', destacado: true, titulo: 'Dragged by a Chain sub esp', fecha: '2026-10-19' },
  { id: 'itPUYO8Qar8', destacado: true, titulo: 'Six Circle - Paper Cup Fortune Sub Esp', fecha: '2026-10-11' },
  { id: 'kWa12KDWsts', titulo: '10 de octubre de 2026', fecha: '2026-10-10' },
  { id: 'oKa3rYaigjA', destacado: true, titulo: 'Six Circle - Angel Dust', fecha: '2026-10-04' },
  { id: 'O2C93whjTD8', destacado: true, titulo: 'Six Circle Same Song (Sub esp)', fecha: '2026-09-30' },
  { id: 'dzUwEmTFl9A', destacado: true, titulo: 'SIX CIRCLE - GRAVITY ( Sub Esp)', fecha: '2026-09-30' },
  { id: '0gs2HJPTvko', titulo: '28 de septiembre de 2026', fecha: '2026-09-29' },
  { id: '9Z_MbDaW1_Y', titulo: '28 de septiembre de 2026', fecha: '2026-09-29' },
  { id: 'Qi1OnBF4RjQ', titulo: '28 de septiembre de 2026', fecha: '2026-09-28' },
  { id: 'h7kjoPbEetQ', titulo: '28 de septiembre de 2026', fecha: '2026-09-28' },
  { id: 'rExiQvrgfdo', titulo: '28 de septiembre de 2026', fecha: '2026-09-28' }
];
