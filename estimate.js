const AIRCRAFT_PRICE = { mavic: 25000, avata: 35000, custom: 50000 };
const EDIT_PRICE = { none: 0, '30s': 5000, '1m': 10000, '2m': 15000, '3m': 25000 };
const GROUND_PRICE = { none: 0, fixed: 10000, 'manned-self': 15000, 'manned-crew': 30000 };
const PHOTO_PRICE = { basic: 15000, extended: 25000 };
const PHOTO_HOURS = { basic: 1, extended: 2 };
const TRAVEL_PRICE = { free: 0, near: 3000, far: 8000 };
const TRAVEL_NAME = { near: '近隣エリア', far: '遠方エリア' };
const HOUR_PRICE = 5000;
const PHOTO_ADDON = 5000;
const FOURK_ADDON = 5000;
const ASSISTANT_PRICE = 10000;

const yen = (n) => '¥' + n.toLocaleString('ja-JP');
const checkedValue = (name) => document.querySelector(`input[name="${name}"]:checked`).value;
const labelOf = (name) =>
  document.querySelector(`input[name="${name}"]:checked`).closest('.est-option').querySelector('.est-label').textContent;
const escapeHtml = (s) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function updateOptionStyles() {
  document.querySelectorAll('.est-option').forEach((opt) => {
    opt.classList.toggle('checked', opt.querySelector('input').checked);
  });
}

function toggleStepsForMode(mode) {
  document.querySelectorAll('.est-step[data-mode]').forEach((step) => {
    step.hidden = step.dataset.mode !== mode;
  });
  let n = 1;
  document.querySelectorAll('.est-step:not(.est-intro)').forEach((step) => {
    if (!step.hidden) step.querySelector('.est-step-num').textContent = n++;
  });
}

function calculate() {
  updateOptionStyles();
  const plantype = checkedValue('plantype');
  toggleStepsForMode(plantype);

  const items = [];
  const inquiryReasons = [];
  let total = 0;
  const add = (label, price) => {
    items.push([label, price]);
    total += price;
  };

  let includedHours = 2;
  if (plantype === 'video') {
    const aircraft = checkedValue('aircraft');
    add(labelOf('aircraft'), AIRCRAFT_PRICE[aircraft]);
    if (document.querySelector('input[name="deliverable"]').checked) add('写真追加', PHOTO_ADDON);
    if (checkedValue('resolution') === '4k') add('4K撮影', FOURK_ADDON);
  } else {
    const qty = checkedValue('photoqty');
    add(qty === 'basic' ? '写真撮影プラン(2〜3枚納品)' : '写真撮影プラン(10枚以内納品)', PHOTO_PRICE[qty]);
    includedHours = PHOTO_HOURS[qty];
  }

  document.getElementById('hoursHelp').textContent = `${includedHours}時間までは基本料金に含まれます。超過分のみ入力してください。`;
  document.getElementById('hoursUnit').textContent = `時間(${includedHours}時間超過分) ×${yen(HOUR_PRICE)}`;
  const extraHours = Math.max(0, parseInt(document.getElementById('extraHours').value || '0', 10) || 0);
  if (extraHours > 0) add(`拘束時間超過(${extraHours}時間)`, extraHours * HOUR_PRICE);

  const travel = checkedValue('travel');
  if (travel === 'other') {
    inquiryReasons.push('撮影場所が遠方(要問合せエリア)のため、出張費は個別にお見積りします。');
  } else if (TRAVEL_PRICE[travel] > 0) {
    add(`出張費(${TRAVEL_NAME[travel]})`, TRAVEL_PRICE[travel]);
  }

  let nightChecked = false;
  document.querySelectorAll('input[name="flightcond"]:checked').forEach((cb) => {
    add(cb.closest('.est-option').querySelector('.est-label').textContent, parseInt(cb.dataset.price, 10));
    if (cb.value === 'night') nightChecked = true;
  });

  if (nightChecked || checkedValue('site') === 'open') {
    add('補助者手配', ASSISTANT_PRICE);
  } else {
    items.push(['補助者', 0]);
  }

  if (plantype === 'video') {
    const edit = checkedValue('edit');
    if (edit === 'over3m') {
      inquiryReasons.push('編集3分超が選択されています。この場合は自動見積もり対象外のため、お問い合わせください。');
    } else if (EDIT_PRICE[edit] > 0) {
      add(labelOf('edit'), EDIT_PRICE[edit]);
    }
    const ground = checkedValue('ground');
    if (GROUND_PRICE[ground] > 0) add(labelOf('ground'), GROUND_PRICE[ground]);
  }

  document.getElementById('breakdown').innerHTML = items
    .map(([label, price]) => `<li><span>${escapeHtml(label)}</span><span>${yen(price)}</span></li>`)
    .join('');

  let html = `
    <div class="est-total-row">
      <span class="est-total-label">概算合計</span>
      <span class="est-total-amount">${yen(total)}<small> 〜</small></span>
    </div>`;
  inquiryReasons.forEach((reason) => {
    html += `<div class="est-inquiry">${escapeHtml(reason)}</div>`;
  });
  document.getElementById('totalBlock').innerHTML = html;
}

document.querySelectorAll('.est-wrap input').forEach((el) => el.addEventListener('change', calculate));
document.getElementById('extraHours').addEventListener('input', calculate);
calculate();
