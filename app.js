import { stats, T, LABELS } from './lib.js';
import { $, copy, toast } from './ui.js';

const ta = $('#text');
const history = [];
const KEY = 'lipi-draft';
const nf = new Intl.NumberFormat();
const mins = (m) => (m < 1 ? `${Math.max(0, Math.round(m * 60))} sec` : `${Math.round(m)} min`);

function update() {
  const s = stats(ta.value);
  $('#words').textContent = nf.format(s.words);
  $('#chars').textContent = nf.format(s.chars);
  $('#nospace').textContent = nf.format(s.charsNoSpaces);
  $('#sentences').textContent = nf.format(s.sentences);
  $('#paragraphs').textContent = nf.format(s.paragraphs);
  $('#lines').textContent = nf.format(s.lines);
  $('#read').textContent = mins(s.readMin);
  $('#speak').textContent = mins(s.speakMin);
  $('#undo').disabled = history.length === 0;
  try { localStorage.setItem(KEY, ta.value); } catch { /* private mode */ }
}

function apply(name) {
  const before = ta.value;
  if (!before) { toast('Paste some text first'); return; }
  const after = T[name](before);
  if (after === before) { toast('Nothing to change'); return; }
  history.push(before);
  if (history.length > 50) history.shift();
  ta.value = after;
  update();
  toast(LABELS[name]);
}

const tools = $('#tools');
for (const [k, label] of Object.entries(LABELS)) {
  const b = document.createElement('button');
  b.type = 'button';
  b.textContent = label;
  b.onclick = () => apply(k);
  tools.append(b);
}

$('#undo').onclick = () => { if (history.length) { ta.value = history.pop(); update(); } };
$('#copy').onclick = () => copy(ta.value, 'Text copied');
$('#clear').onclick = () => { if (ta.value) { history.push(ta.value); ta.value = ''; update(); ta.focus(); } };
ta.addEventListener('input', update);
try { ta.value = localStorage.getItem(KEY) || ''; } catch { /* ignore */ }
update();
