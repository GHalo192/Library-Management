import { createStore, saveReader, saveCard, cardState } from './model.js';
const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const store = createStore();
export function mount({ container, signal }) {
  const events = new AbortController();
  signal?.addEventListener('abort', () => events.abort(), { once: true });
  let query = '', selected = null, message = '';
  function render() {
    if (signal?.aborted) return;
    const reader = store.readers.find(r => r.id === selected);
    const rows = store.readers.filter(r => `${r.name} ${r.accountId}`.toLowerCase().includes(query.toLowerCase()));
    const field = (label, name, value = '', type = 'text') => `<label class="field">${label}<input class="input" type="${type}" name="${name}" value="${esc(value)}"></label>`;
    container.innerHTML = `<h1>Độc giả và thẻ thư viện</h1><p>Tuần 1 • Dữ liệu thử trong bộ nhớ, tải lại trang để đặt lại. Hạn thẻ nhập rõ cho từng mẫu, chưa mặc định chính sách.</p><p role="status">${esc(message)}</p>
      <form data-form="search"><label>Tìm độc giả <input class="input" name="q" value="${esc(query)}"></label><button class="btn">Tìm</button></form>
      <div class="table-wrap"><table><thead><tr><th>Mã tài khoản</th><th>Họ tên</th><th>Thẻ</th><th>Trạng thái tại 01/11/2026 (mẫu)</th><th>Thao tác</th></tr></thead><tbody>${rows.map(r => `<tr><td>${r.accountId}</td><td>${esc(r.name)}</td><td>${esc(r.card?.code || '—')}</td><td>${cardState(r.card, '2026-11-01')}</td><td><button class="btn" data-edit="${r.id}">Hồ sơ / thẻ</button></td></tr>`).join('') || '<tr><td colspan="5">Không có độc giả phù hợp.</td></tr>'}</tbody></table></div>
      <section class="panel"><h2>${reader ? 'Sửa hồ sơ' : 'Thêm hồ sơ'}</h2><form data-form="reader" novalidate><input type="hidden" name="id" value="${reader?.id || ''}">${field('Mã tài khoản có sẵn', 'accountId', reader?.accountId, 'number')}${field('Họ tên', 'name', reader?.name)}${field('Điện thoại', 'phone', reader?.phone)}${field('Địa chỉ', 'address', reader?.address)}<button class="btn">Lưu hồ sơ</button><button type="button" class="btn outline" data-new>Hồ sơ mới</button></form></section>
      ${reader ? `<section class="panel"><h2>Cấp / gia hạn / khóa thẻ</h2><form data-form="card" novalidate>${field('Mã thẻ', 'code', reader.card?.code)}${field('Ngày cấp', 'issued', reader.card?.issued, 'date')}${field('Ngày hết hạn (chọn theo dữ liệu thử)', 'expires', reader.card?.expires, 'date')}<label class="field">Trạng thái<select class="select" name="status"><option value="active">Hoạt động</option><option value="locked" ${reader.card?.status === 'locked' ? 'selected' : ''}>Khóa</option></select></label><button class="btn">Lưu thẻ</button></form></section>` : ''}`;
  }
  container.addEventListener('click', e => { const edit = e.target.closest('[data-edit]'); if (edit) { selected = Number(edit.dataset.edit); message = ''; render(); } if (e.target.closest('[data-new]')) { selected = null; render(); } }, { signal: events.signal });
  container.addEventListener('submit', e => {
    e.preventDefault(); const values = Object.fromEntries(new FormData(e.target));
    try { if (e.target.dataset.form === 'search') query = values.q; else if (e.target.dataset.form === 'reader') { saveReader(store, values); message = 'Đã lưu hồ sơ mẫu.'; } else { saveCard(store, selected, values); message = 'Đã lưu thẻ mẫu.'; } render(); }
    catch (error) { container.querySelector('[role="status"]').textContent = error.message; }
  }, { signal: events.signal });
  render(); return () => events.abort();
}
