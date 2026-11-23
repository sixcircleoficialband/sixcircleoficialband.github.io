#!/usr/bin/env node
/* =====================================================================
   SIX CIRCLE — ACTUALIZACIÓN AUTOMÁTICA DE LA WEB  (sin dependencias)
   La ejecuta GitHub Actions una vez al día (.github/workflows/actualizar-web.yml).
   Revisa fuentes públicas y agrega SOLO lo que todavía no está en la web:
     - YouTube (RSS del canal)           -> SC.videos + noticia 'video:<ID>'
     - Deezer (API pública del artista)  -> SC.lanzamientos + noticia 'lanzamiento:<slug>'
     - Apple Music (iTunes lookup)       -> enlace de Apple, género y lanzamientos solo-Apple
   Nunca borra nada ni inventa datos: todo sale de esas fuentes.
   Uso:  node .github/scripts/actualizar-contenido.js [--dry-run]
   Requiere: Node 18+ y 'cwebp' (paquete webp) para las imágenes.
   ===================================================================== */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm'), os = require('os');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..', '..');
const DRY = process.argv.includes('--dry-run');
const F_BANDA = path.join(ROOT, 'data', 'banda.js');
const F_NOTICIAS = path.join(ROOT, 'data', 'noticias.js');
const YT_RSS = 'https://www.youtube.com/feeds/videos.xml?channel_id=UCzgr45fFxz0-6JntkGw4x8g';
const DEEZER = 'https://api.deezer.com/artist/400970221/albums?limit=100';
const APPLE = 'https://itunes.apple.com/lookup?id=6800437927&entity=album&limit=200';
const DIAS_TOLERANCIA = 3;   // misma versión en Deezer y Apple si las fechas difieren <= 3 días

const log = (...a) => console.log(...a);
const aviso = (m) => console.log('::warning::' + m);

/* ---------- utilidades ---------- */
const norm = (s) => String(s || '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const slugDe = (s) => norm(s).replace(/ /g, '-');
const dias = (a, b) => Math.abs(Date.parse(a + 'T00:00:00Z') - Date.parse(b + 'T00:00:00Z')) / 864e5;
const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const fechaCorta = (f) => { const [y, m, d] = f.split('-').map(Number); return d + ' ' + MESES[m - 1] + ' ' + y; };
function jsStr(s) {
  s = String(s).replace(/[\r\n\t]+/g, ' ').replace(/\\/g, '\\\\');
  if (s.includes("'") && !s.includes('"')) return '"' + s + '"';
  return "'" + s.replace(/'/g, "\\'") + "'";
}
const xmlTxt = (s) => String(s).replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'")
  .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n)).replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16))).replace(/&amp;/g, '&');
const soloFecha = (t) => /^\s*\d{1,2} de (enero|febrero|marzo|abril|mayo|junio|julio|agosto|sept?iembre|setiembre|octubre|noviembre|diciembre)( de)? \d{4}\s*$/i.test(t)
  || /^\s*\d{4}-\d{2}-\d{2}\s*$/.test(t) || /^\s*\d{1,2}[\/.-]\d{1,2}[\/.-]\d{2,4}\s*$/.test(t)
  || /^\s*(january|february|march|april|may|june|july|august|september|october|november|december) \d{1,2},? \d{4}\s*$/i.test(t);

async function traer(url, tipo) {
  let ultimo;
  for (let i = 1; i <= 3; i++) {
    try {
      const r = await fetch(url, { headers: { 'User-Agent': 'sixcircle-web-actualizador/1.0 (+https://sixcircleoficialband.github.io/)' }, signal: AbortSignal.timeout(25000) });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      if (tipo === 'json') return await r.json();
      if (tipo === 'bin') return Buffer.from(await r.arrayBuffer());
      return await r.text();
    } catch (e) { ultimo = e; await new Promise((ok) => setTimeout(ok, 2000 * i)); }
  }
  throw new Error(url + ': ' + ultimo.message);
}

function cargarSC(texto, nombre) {
  const ctx = { window: {} }; vm.createContext(ctx);
  vm.runInContext(texto, ctx, { filename: nombre });
  return ctx.window.SC;
}

/* ---------- edición de arrays respetando el formato del archivo ---------- */
// Divide "NOMBRE = [ ... ];" en bloques (uno por entrada, cada uno empieza en una línea "  { ").
function abrirArray(texto, nombre) {
  const lineas = texto.split('\n');
  const ini = lineas.findIndex((l) => l.startsWith(nombre + ' = ['));
  if (ini < 0) throw new Error('No encuentro "' + nombre + ' = [" ');
  let fin = ini + 1; while (fin < lineas.length && lineas[fin].trim() !== '];') fin++;
  if (fin >= lineas.length) throw new Error('No encuentro el cierre "];" de ' + nombre);
  const bloques = []; let actual = null;
  for (const l of lineas.slice(ini + 1, fin)) {
    if (/^\s*\{ /.test(l)) { actual = [l]; bloques.push(actual); }
    else if (actual) actual.push(l);
    else throw new Error('Formato inesperado dentro de ' + nombre + ': ' + l);
  }
  const lista = bloques.map((b) => { const t = b.join('\n').replace(/,\s*$/, ''); return { texto: t, fecha: (t.match(/fecha: '(\d{4}-\d{2}-\d{2})'/) || [])[1] || '' }; });
  return {
    lista,
    insertar(textoBloque, fecha) {   // el más nuevo primero
      let i = lista.findIndex((b) => b.fecha <= fecha); if (i < 0) i = lista.length;
      lista.splice(i, 0, { texto: textoBloque, fecha });
    },
    cerrar() { return lineas.slice(0, ini + 1).concat(lista.length ? [lista.map((b) => b.texto).join(',\n')] : [], lineas.slice(fin)).join('\n'); }
  };
}

/* ---------- formatos (EDITAR-WEB.txt, secciones 2-4) ---------- */
const ORDEN = [['spotify', 'Spotify', 'Escuchar en Spotify'], ['apple', 'Apple Music', 'Escuchar en Apple Music'], ['youtube', 'YouTube', 'Ver en YouTube'],
  ['deezer', 'Deezer', 'Escuchar en Deezer'], ['qobuz', 'Qobuz', 'Escuchar en Qobuz'], ['amazon', 'Amazon Music', 'Escuchar en Amazon Music']];
const unirY = (a) => a.length <= 1 ? a.join('') : a.slice(0, -1).join(', ') + ' y ' + a[a.length - 1];

function bloqueVideo(v) {
  return '  { id: ' + jsStr(v.id) + (v.destacado ? ', destacado: true' : '') + ', titulo: ' + jsStr(v.titulo) + ', fecha: ' + jsStr(v.fecha) + ' }';
}
function noticiaVideo(v) {
  return '  { fecha: ' + jsStr(v.fecha) + ", tipo: 'video', clave: " + jsStr('video:' + v.id) + ',\n' +
    '    titulo: ' + jsStr('Nuevo video: «' + v.titulo + '»') + ',\n' +
    "    texto: 'Ya está en el canal de YouTube de Six Circle.',\n" +
    '    imagen: ' + jsStr('assets/img/videos/' + v.id + '.webp') + ', enlace: ' + jsStr('https://www.youtube.com/watch?v=' + v.id) + ", enlaceTexto: 'Ver en YouTube' }";
}
function bloqueLanzamiento(l) {
  const enl = Object.keys(l.enlaces).map((k) => k + ': ' + jsStr(l.enlaces[k] || '')).join(', ');
  return '  { titulo: ' + jsStr(l.titulo) + ', tipo: ' + jsStr(l.tipo) + ', fecha: ' + jsStr(l.fecha) +
    (l.otrasFechas && l.otrasFechas.length ? ', otrasFechas: [' + l.otrasFechas.map(jsStr).join(', ') + ']' : '') + ', genero: ' + jsStr(l.genero || '') + ',\n' +
    '    portada: ' + jsStr(l.portada) + ',\n' +
    '    enlaces: { ' + enl + ' } }';
}
function noticiaLanzamiento(l, clave) {
  const e = l.enlaces || {}, con = ORDEN.filter(([k]) => e[k]);
  const tipo = String(l.tipo || 'Sencillo').toLowerCase();
  const prim = con[0];
  let texto = '«' + l.titulo + '» ya está en plataformas digitales (' + tipo + (l.genero ? ' · ' + l.genero.toLowerCase() : '') + ').';
  if (con.length) texto += ' Disponible en ' + unirY(con.map((c) => c[1])) + '.';
  if (l.otrasFechas && l.otrasFechas.length) texto += ' Versión anterior: ' + l.otrasFechas.map(fechaCorta).join(', ') + '.';
  return '  { fecha: ' + jsStr(l.fecha) + ", tipo: 'lanzamiento', clave: " + jsStr(clave) + ',\n' +
    '    titulo: ' + jsStr('Nuevo ' + tipo + ': «' + l.titulo + '»') + ',\n' +
    '    texto: ' + jsStr(texto) + ',\n' +
    '    imagen: ' + jsStr(l.portada || '') + ', enlace: ' + jsStr(prim ? e[prim[0]] : 'musica.html') + ', enlaceTexto: ' + jsStr(prim ? prim[2] : 'Ver en Música') + ' }';
}

/* ---------- fuentes ---------- */
async function fuenteYouTube() {
  const xml = await traer(YT_RSS, 'text');
  return xml.split('<entry>').slice(1).map((e) => ({
    id: (e.match(/<yt:videoId>([^<]+)</) || [])[1],
    titulo: xmlTxt((e.match(/<title>([^<]*)</) || [])[1] || '').trim(),
    fecha: ((e.match(/<published>([^<]+)</) || [])[1] || '').slice(0, 10)
  })).filter((v) => v.id && v.titulo && /^\d{4}-\d{2}-\d{2}$/.test(v.fecha));
}
async function fuenteDeezer() {
  const d = await traer(DEEZER, 'json');
  if (!d || !Array.isArray(d.data)) throw new Error('respuesta de Deezer sin datos');
  return d.data.filter((a) => ['single', 'ep', 'album'].includes(a.record_type) && a.release_date).map((a) => ({
    fuente: 'deezer', id: String(a.id), titulo: a.title.trim(), fecha: a.release_date, tipo: a.record_type,
    url: 'https://www.deezer.com/album/' + a.id, portadaUrl: a.cover_xl || a.cover_big
  }));
}
async function fuenteApple() {
  const d = await traer(APPLE, 'json');
  if (!d || !Array.isArray(d.results)) throw new Error('respuesta de iTunes sin datos');
  return d.results.filter((a) => a.wrapperType === 'collection' && String(a.artistId) === '6800437927' && a.releaseDate).map((a) => {
    const n = a.collectionName.trim(), tipo = / - Single$/.test(n) ? 'single' : / - EP$/.test(n) ? 'ep' : 'album';
    const g = norm(a.primaryGenreName);
    return {
      fuente: 'apple', id: String(a.collectionId), titulo: n.replace(/ - (Single|EP)$/, '').trim(), fecha: a.releaseDate.slice(0, 10), tipo,
      url: String(a.collectionViewUrl).replace(/\?.*$/, ''), genero: g.includes('metal') ? 'Metal' : g.includes('rock') ? 'Rock' : '',
      portadaUrl: a.artworkUrl100 ? a.artworkUrl100.replace(/\/\d+x\d+bb\./, '/1000x1000bb.') : ''
    };
  });
}

/* ---------- imágenes (cwebp) ---------- */
function aWebp(buf, destino, args) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'sc-')), ent = path.join(tmp, 'in.jpg'), sal = path.join(tmp, 'out.webp');
  fs.writeFileSync(ent, buf);
  execFileSync('cwebp', ['-quiet', '-q', '75', ...args, ent, '-o', sal]);
  const out = fs.readFileSync(sal); fs.rmSync(tmp, { recursive: true, force: true });
  if (out.length < 500) throw new Error('imagen vacía');
  return { destino, datos: out };
}
async function miniaturaVideo(id) {
  try { const b = await traer('https://i.ytimg.com/vi/' + id + '/maxresdefault.jpg', 'bin'); if (b.length > 5000) return aWebp(b, 'assets/img/videos/' + id + '.webp', ['-resize', '480', '270']); } catch (e) { /* no hay maxres */ }
  const b = await traer('https://i.ytimg.com/vi/' + id + '/hqdefault.jpg', 'bin');   // 480x360 con franjas: se recorta a 16:9
  return aWebp(b, 'assets/img/videos/' + id + '.webp', ['-crop', '0', '45', '480', '270']);
}
async function portada(url, slug) {
  const b = await traer(url, 'bin');
  return aWebp(b, 'assets/img/portadas/' + slug + '.webp', ['-resize', '360', '360']);
}

/* ---------- principal ---------- */
async function main() {
  const txtBanda = fs.readFileSync(F_BANDA, 'utf8'), txtNot = fs.readFileSync(F_NOTICIAS, 'utf8');
  const SC = cargarSC(txtBanda, 'banda.js'), N = cargarSC(txtNot, 'noticias.js').noticias;
  const claves = new Set(N.map((n) => n.clave));
  const arrV = abrirArray(txtBanda, 'SC.videos'), arrL = abrirArray(txtBanda, 'SC.lanzamientos'), arrN = abrirArray(txtNot, 'SC.noticias');
  if (arrV.lista.length !== SC.videos.length || arrL.lista.length !== SC.lanzamientos.length || arrN.lista.length !== N.length) throw new Error('No pude leer los bloques de los archivos (formato cambiado).');
  const cambios = [], imagenes = [], fuentesOk = [];

  const fuentes = {};
  for (const [nombre, fn] of [['YouTube', fuenteYouTube], ['Deezer', fuenteDeezer], ['Apple', fuenteApple]]) {
    try { fuentes[nombre] = await fn(); fuentesOk.push(nombre + ' (' + fuentes[nombre].length + ')'); }
    catch (e) { aviso('No se pudo leer ' + nombre + ': ' + e.message + ' — se omite esta vez.'); }
  }
  log('Fuentes leídas: ' + (fuentesOk.join(', ') || 'ninguna'));

  /* 1) VIDEOS */
  const idsWeb = new Set(SC.videos.map((v) => v.id));
  for (const v of (fuentes.YouTube || []).filter((v) => !idsWeb.has(v.id)).sort((a, b) => a.fecha.localeCompare(b.fecha))) {
    const real = !soloFecha(v.titulo);
    const vid = { id: v.id, destacado: real, titulo: v.titulo, fecha: v.fecha };
    if (!DRY && !fs.existsSync(path.join(ROOT, 'assets/img/videos', v.id + '.webp'))) imagenes.push(await miniaturaVideo(v.id));
    arrV.insertar(bloqueVideo(vid), vid.fecha);
    cambios.push('Video: ' + v.titulo + ' (' + v.id + ', ' + v.fecha + ')');
    if (real && !claves.has('video:' + v.id)) { arrN.insertar(noticiaVideo(vid), vid.fecha); claves.add('video:' + v.id); cambios.push('  + noticia video:' + v.id); }
  }

  /* 2) LANZAMIENTOS: versiones = álbumes de Deezer (+ su par de Apple) y álbumes solo de Apple */
  if (fuentes.Deezer || fuentes.Apple) {
    const dz = fuentes.Deezer || [], ap = (fuentes.Apple || []).slice(), usados = new Set();
    const parDe = (v) => { let mejor = null; for (const a of ap) if (!usados.has(a.id) && norm(a.titulo) === norm(v.titulo) && dias(a.fecha, v.fecha) <= DIAS_TOLERANCIA && (!mejor || dias(a.fecha, v.fecha) < dias(mejor.fecha, v.fecha))) mejor = a; if (mejor) usados.add(mejor.id); return mejor; };
    const versiones = dz.map((d) => ({ dz: d, ap: parDe(d) }));
    for (const a of ap) if (!usados.has(a.id)) versiones.push({ dz: null, ap: a });
    for (const v of versiones) {
      v.fecha = (v.dz || v.ap).fecha; v.titulo = (v.ap || v.dz).titulo; v.n = norm(v.titulo);
      v.tipo = (v.dz || v.ap).tipo; v.genero = v.ap ? v.ap.genero : '';
    }
    const idDe = (u, re) => ((String(u || '').match(re) || [])[1]) || '';
    const web = SC.lanzamientos.map((l, i) => ({ l, bloque: arrL.lista[i], n: norm(l.titulo), fechas: [l.fecha].concat(l.otrasFechas || []),
      dz: idDe(l.enlaces && l.enlaces.deezer, /album\/(\d+)/), ap: idDe(l.enlaces && l.enlaces.apple, /\/(\d+)(\?|$)/) }));
    const conocida = (w, v) => (v.dz && v.dz.id === w.dz) || (v.ap && v.ap.id === w.ap) || w.fechas.some((f) => dias(f, v.fecha) <= DIAS_TOLERANCIA);
    const tipoEs = (t, titulo) => t === 'ep' ? 'EP' : t === 'album' ? 'Álbum' : (/\b(live|en vivo)\b/i.test(titulo) ? 'Sencillo en vivo' : 'Sencillo');
    const nuevosPorTitulo = new Map(), relanzados = new Map();
    for (const v of versiones) {
      const w = web.find((x) => x.n === v.n);
      if (!w) { if (!nuevosPorTitulo.has(v.n)) nuevosPorTitulo.set(v.n, []); nuevosPorTitulo.get(v.n).push(v); continue; }
      if (conocida(w, v)) continue;
      if (v.fecha > w.l.fecha) { const r = relanzados.get(w.n); if (!r || v.fecha > r.v.fecha) relanzados.set(w.n, { w, v }); }
      // versión más vieja y desconocida: no se toca la historia
    }
    const agregarLanz = async (l, previo) => {
      const slug = slugDe(l.titulo); l.portada = 'assets/img/portadas/' + slug + '.webp';
      const src = l._v.dz ? l._v.dz.portadaUrl : l._v.ap.portadaUrl;
      if (!DRY) { if (!src) throw new Error('Sin portada para ' + l.titulo); imagenes.push(await portada(src, slug)); }
      delete l._v;
      if (previo) arrL.lista.splice(arrL.lista.indexOf(previo), 1);
      arrL.insertar(bloqueLanzamiento(l), l.fecha);
      let clave = 'lanzamiento:' + slug;
      if (claves.has(clave)) clave += '-' + l.fecha;      // relanzamiento de un título que ya tenía noticia
      if (!claves.has(clave)) { arrN.insertar(noticiaLanzamiento(l, clave), l.fecha); claves.add(clave); cambios.push('  + noticia ' + clave); }
    };
    for (const vs of nuevosPorTitulo.values()) {
      vs.sort((a, b) => b.fecha.localeCompare(a.fecha)); const v = vs[0];
      const l = { titulo: v.titulo, tipo: tipoEs(v.tipo, v.titulo), fecha: v.fecha, otrasFechas: [...new Set(vs.slice(1).map((x) => x.fecha))].filter((f) => f !== v.fecha),
        genero: v.genero, enlaces: { apple: v.ap ? v.ap.url : '', deezer: v.dz ? v.dz.url : '' }, _v: v };
      cambios.push('Lanzamiento nuevo: ' + l.titulo + ' (' + l.tipo + ', ' + l.fecha + ')');
      await agregarLanz(l, null);
    }
    for (const { w, v } of relanzados.values()) {
      const enlaces = Object.assign({}, w.l.enlaces); enlaces.apple = v.ap ? v.ap.url : ''; enlaces.deezer = v.dz ? v.dz.url : (enlaces.deezer || '');
      const otras = [...new Set(w.fechas)].filter((f) => f !== v.fecha).sort().reverse();
      const l = { titulo: v.titulo, tipo: tipoEs(v.tipo, v.titulo), fecha: v.fecha, otrasFechas: otras, genero: v.genero || w.l.genero || '', enlaces, _v: v };
      cambios.push('Relanzamiento: ' + l.titulo + ' (' + l.fecha + '; antes ' + otras.join(', ') + ')');
      await agregarLanz(l, w.bloque);
    }
    // Completar enlaces vacíos ('') de Apple/Deezer cuando la misma versión aparece después en esa plataforma
    for (const w of web) {
      const b = w.bloque; if (!arrL.lista.includes(b)) continue;   // ya reemplazado por un relanzamiento
      for (const [k, lista] of [['apple', ap], ['deezer', dz]]) {
        if (!(k in (w.l.enlaces || {})) || w.l.enlaces[k]) continue;
        const m = lista.find((x) => norm(x.titulo) === w.n && dias(x.fecha, w.l.fecha) <= DIAS_TOLERANCIA);
        if (m && b.texto.includes(k + ": ''")) { b.texto = b.texto.replace(k + ": ''", k + ': ' + jsStr(m.url)); cambios.push('Enlace ' + k + ' agregado a ' + w.l.titulo); }
      }
    }
  }

  if (!cambios.length) { log('Sin novedades: la web ya está al día.'); return; }
  log('Cambios:\n - ' + cambios.join('\n - '));
  const nuevoBanda = abrirArrayAplicar(txtBanda, arrL, arrV), nuevoNot = arrN.cerrar();

  /* Validación antes de escribir */
  const SC2 = cargarSC(nuevoBanda, 'banda.js (nuevo)'), N2 = cargarSC(nuevoNot, 'noticias.js (nuevo)').noticias;
  const dup = (a) => a.length !== new Set(a).size;
  if (dup(SC2.videos.map((v) => v.id))) throw new Error('Validación: IDs de video repetidos');
  if (dup(N2.map((n) => n.clave))) throw new Error('Validación: claves de noticia repetidas');
  if (dup(SC2.lanzamientos.map((l) => norm(l.titulo)))) throw new Error('Validación: lanzamientos repetidos');
  if (SC2.videos.length < SC.videos.length || SC2.lanzamientos.length < SC.lanzamientos.length || N2.length < N.length) throw new Error('Validación: se perderían datos');
  for (const x of [...SC2.videos, ...SC2.lanzamientos, ...N2]) if (!/^\d{4}-\d{2}-\d{2}$/.test(x.fecha)) throw new Error('Validación: fecha inválida en ' + JSON.stringify(x));

  if (DRY) { log('(--dry-run: no se escribió nada)'); return; }
  for (const im of imagenes) { fs.mkdirSync(path.dirname(path.join(ROOT, im.destino)), { recursive: true }); fs.writeFileSync(path.join(ROOT, im.destino), im.datos); }
  for (const x of [...SC2.lanzamientos.map((l) => l.portada), ...N2.map((n) => n.imagen)]) if (x && !/^https?:/.test(x) && !fs.existsSync(path.join(ROOT, x))) throw new Error('Validación: falta la imagen ' + x);
  fs.writeFileSync(F_BANDA, nuevoBanda); fs.writeFileSync(F_NOTICIAS, nuevoNot);
  if (process.env.RESUMEN_FILE) fs.writeFileSync(process.env.RESUMEN_FILE, cambios.filter((c) => !c.startsWith(' ')).join('\n') + '\n');
  log('Archivos actualizados.');
}
// banda.js tiene dos arrays: se aplica cada uno sobre el texto ya actualizado por el otro
function abrirArrayAplicar(txt, arrL, arrV) {
  const t1 = arrL.cerrar();                       // lanzamientos aplicados sobre el texto original
  const v2 = abrirArray(t1, 'SC.videos'); v2.lista.splice(0, v2.lista.length, ...arrV.lista);
  return v2.cerrar();
}

if (require.main === module) main().catch((e) => { console.error('ERROR: ' + e.message); process.exit(1); });
module.exports = { abrirArray, bloqueVideo, noticiaVideo, bloqueLanzamiento, noticiaLanzamiento, cargarSC, jsStr, soloFecha, slugDe };
