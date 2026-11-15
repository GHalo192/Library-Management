import { demoUser } from '../accounts/demo-store.js';
import { createStore, requestBorrow, review, handover, confirmFine } from './model.js';
const store = createStore();
const labels = { pending:'Chờ duyệt', approved:'Đã duyệt', rejected:'Từ chối', issued:'Đã bàn giao', confirmed:'Đã xác nhận' };
export function mount({container, signal}, finesOnly = false) {
  if (signal?.aborted) return () => {};
  if (!['librarian','admin'].includes(demoUser()?.role)) { container.textContent='Bạn không có quyền xử lý nghiệp vụ thư viện.'; return () => {}; }
  const events = new AbortController(); signal?.addEventListener('abort', () => events.abort(), {once:true});
  const draw = () => {
    if (events.signal.aborted) return;
    container.innerHTML = `<h1>${finesOnly ? 'Khoản phạt' : 'Yêu cầu, duyệt và bàn giao'}</h1><p>Ngày bàn giao trong dữ liệu chạy thử: 01/11/2026.</p><p role="status"></p>
      ${finesOnly ? '' : `<section class="panel"><h2>Gửi yêu cầu</h2><form data-form="request" novalidate><label class="field">Mã độc giả<input class="input" name="reader" type="number" value="1"></label><label class="field">Thẻ mẫu<select class="select" name="card"><option value="valid">Có hiệu lực</option><option value="invalid">Khóa / hết hạn</option></select></label><fieldset><legend>Chọn tối đa 3 bản sách</legend>${store.copies.map(c=>`<label style="display:block"><input type="checkbox" name="copy" value="${c.id}"> ${c.title} — ${c.available?'Còn':'Đã cho mượn'}</label>`).join('')}</fieldset><button class="btn">Gửi yêu cầu</button></form></section>
      <section class="panel"><h2>Xử lý yêu cầu</h2><label>Hạn mượn (ngày) <input class="input" id="days" type="number" min="1" max="14" value="14"></label><label><input type="checkbox" id="valid-card" checked> Thẻ còn hiệu lực lúc giao</label><div class="table-wrap"><table><thead><tr><th>Yêu cầu / độc giả</th><th>Bản sách</th><th>Trạng thái</th><th>Thao tác</th></tr></thead><tbody>${store.requests.map(r=>`<tr><td>${r.id} / ${r.readerId}</td><td>${r.copyIds.join(', ')}</td><td>${labels[r.status]}</td><td>${r.status==='pending'?`<button class="btn" data-act="approve" data-id="${r.id}">Duyệt</button><button class="btn outline" data-act="reject" data-id="${r.id}">Từ chối</button>`:r.status==='approved'?`<button class="btn" data-act="handover" data-id="${r.id}">Bàn giao</button>`:'—'}</td></tr>`).join('')||'<tr><td colspan="4">Chưa có yêu cầu.</td></tr>'}</tbody></table></div></section>
      <section class="panel"><h2>Phiếu mượn</h2><ul>${store.loans.map(l=>`<li>Phiếu ${l.id}: độc giả ${l.readerId}, bản ${l.copyIds.join(', ')}; hạn ${l.due}</li>`).join('')||'<li>Chưa có phiếu; duyệt yêu cầu chưa tạo phiếu.</li>'}</ul><p>Còn khả dụng: <strong id="available">${store.copies.filter(c=>c.available).length}</strong></p></section>`}
      <section class="panel"><h2>Khoản phạt</h2>${store.fines.map(f=>`<p>${f.reason} — ${f.amount.toLocaleString('vi-VN')}đ — ${labels[f.status]} ${f.status==='pending'?`<button class="btn" data-act="confirm" data-id="${f.id}">Xác nhận phạt</button>`:''}</p>`).join('')}</section>`;
  };
  container.addEventListener('submit', e=>{e.preventDefault();if(!['librarian','admin'].includes(demoUser()?.role))return;const f=new FormData(e.target); try{requestBorrow(store,f.get('reader'),f.getAll('copy'),f.get('card')==='valid');draw();container.querySelector('[role="status"]').textContent='Đã gửi yêu cầu mẫu.';}catch(err){container.querySelector('[role="status"]').textContent=err.message;}}, {signal:events.signal});
  container.addEventListener('click', e=>{const b=e.target.closest('[data-act]');if(!b)return;if(!['librarian','admin'].includes(demoUser()?.role))return;try{const id=Number(b.dataset.id);if(b.dataset.act==='confirm')confirmFine(store,id);else if(b.dataset.act==='handover')handover(store,id,Number(container.querySelector('#days').value),container.querySelector('#valid-card').checked);else review(store,id,b.dataset.act==='approve');draw();container.querySelector('[role="status"]').textContent='Đã cập nhật trạng thái mẫu.';}catch(err){container.querySelector('[role="status"]').textContent=err.message;}},{signal:events.signal});
  draw(); return ()=>events.abort();
}

// Liên kết độc giả riêng trong bộ nhớ cho bản chạy thử; không thay hồ sơ backend.
const personalReaders = new Map([['user', 1]]);
let nextPersonalReader = 1000;
export function mountPersonal({container, signal}, finesOnly = false) {
 if(signal?.aborted)return ()=>{};
 const account=demoUser();
 if(account?.role!=='user'){container.textContent='Trang này dành cho User.';return ()=>{};}
 if(!personalReaders.has(account.id))personalReaders.set(account.id,nextPersonalReader++);
 const readerId=personalReaders.get(account.id);
 const events=new AbortController();signal?.addEventListener('abort',()=>events.abort(),{once:true});
 const draw=()=>{
  const requests=store.requests.filter(r=>r.readerId===readerId),loans=store.loans.filter(l=>l.readerId===readerId),fines=store.fines.filter(f=>f.readerId===readerId);
  container.innerHTML=`<h1>${finesOnly?'Khoản phạt của tôi':'Mượn sách của tôi'}</h1><p role="status"></p>${finesOnly?'':`
  <section class="panel"><h2>Gửi yêu cầu mượn</h2><form data-form="personal-request"><fieldset><legend>Chọn tối đa 3 bản sách</legend>${store.copies.map(c=>`<label style="display:block"><input type="checkbox" name="copy" value="${c.id}" ${c.available?'':'disabled'}> ${c.title} — ${c.available?'Còn':'Đã cho mượn'}</label>`).join('')}</fieldset><button class="btn">Gửi yêu cầu</button></form></section>
  <section class="panel"><h2>Yêu cầu của tôi</h2><ul>${requests.map(r=>`<li>Yêu cầu ${r.id}: bản ${r.copyIds.join(', ')} — ${labels[r.status]}</li>`).join('')||'<li>Bạn chưa có yêu cầu mượn.</li>'}</ul></section>
  <section class="panel"><h2>Sách đang mượn</h2><ul>${loans.map(l=>`<li>Phiếu ${l.id}: bản ${l.copyIds.join(', ')}; hạn ${l.due}</li>`).join('')||'<li>Bạn chưa có sách đang mượn.</li>'}</ul></section>`}
  <section class="panel"><h2>Khoản phạt của tôi</h2>${fines.map(f=>`<p>${f.reason} — ${f.amount.toLocaleString('vi-VN')}đ — ${labels[f.status]}</p>`).join('')||'<p>Bạn chưa có khoản phạt.</p>'}</section>`;
 };
 container.addEventListener('submit',e=>{
  if(!e.target.matches('[data-form="personal-request"]'))return;
  e.preventDefault();if(demoUser()?.id!==account.id||demoUser()?.role!=='user')return;
  try{requestBorrow(store,readerId,new FormData(e.target).getAll('copy'),true);draw();container.querySelector('[role="status"]').textContent='Đã gửi yêu cầu. Vui lòng chờ nhân viên thư viện duyệt.';}
  catch(error){container.querySelector('[role="status"]').textContent=error.message;}
 },{signal:events.signal});
 draw();return ()=>events.abort();
}
