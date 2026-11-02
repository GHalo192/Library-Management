import { renderAuth, registerAccount, authenticateAccount, changePassword } from './auth.js';
import { renderAccounts, initAccounts } from './accounts.js';
import { renderEmployees, initEmployees } from './employees.js';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// Adapter bộ nhớ chỉ cho tuần 1; không dùng session hoặc dữ liệu prototype.
let data={ accounts:['student','librarian','staff','admin'].map((role,i)=>({id:role,name:role,email:`${role}@example.test`,mssv:role==='student'?'SV001':null,role,status:'Hoạt động'})) };
const db={read:()=>structuredClone(data),write:value=>{data=structuredClone(value);}};
export function mount({container, signal}) {
  if (signal?.aborted) return () => {};
  const events=new AbortController();
  let operation = new AbortController();
  const cleanup=()=>{events.abort();operation.abort();container.querySelectorAll('dialog').forEach(d=>d.remove());};
  signal?.addEventListener('abort',cleanup,{once:true});
  let view='login', current=null;
  const toast=message=>{if(!events.signal.aborted)container.querySelector('[role="status"]').textContent=message;};
  const render=()=>{
    if(events.signal.aborted)return;
    operation.abort();operation=new AbortController();
    if(current){current=db.read().accounts.find(a=>a.id===current.id&&a.status==='Hoạt động')||null;if(!current)view='login';}
    if(['accounts','employees'].includes(view)&&current?.role!=='admin')view=current?'password':'login';
    container.innerHTML=`<h1>TV4 — tài khoản tuần 1</h1><p>Dữ liệu mẫu trong bộ nhớ, không có xác thực máy chủ. Tải lại trang để đặt lại. Mật khẩu mẫu: 123456.</p><p role="status"></p><nav>${current?`<span>Đang thử: ${esc(current.id)}</span> <button class="btn outline" data-view="password">Đổi mật khẩu</button>${current.role==='admin'?'<button class="btn outline" data-view="accounts">Tài khoản</button><button class="btn outline" data-view="employees">Nhân viên</button>':''}<button class="btn outline" data-view="logout">Đăng xuất</button>`:'<button class="btn outline" data-view="login">Đăng nhập</button><button class="btn outline" data-view="register">Đăng ký</button>'}</nav><section id="account-view">${view==='accounts'?renderAccounts(db.read()):view==='employees'?renderEmployees(db.read()):view==='password'?`<form id="password-form" novalidate><h2>Đổi mật khẩu</h2><label class="field">Mật khẩu hiện tại<input class="input" type="password" name="current"></label><label class="field">Mật khẩu mới<input class="input" type="password" name="password"></label><label class="field">Nhập lại mật khẩu mới<input class="input" type="password" name="confirmation"></label><button class="btn">Lưu mật khẩu</button></form>`:renderAuth(view)}</section>`;
  };
  const modal=(title,content)=>{
    const dialog=document.createElement('dialog');dialog.className='modal modal-backdrop';
    dialog.innerHTML=`<h2>${title}</h2>${content}<button class="btn outline" type="button" data-close>Đóng</button>`;
    container.append(dialog);dialog.querySelector('[data-close]').addEventListener('click',()=>dialog.close(),{signal:events.signal});
    dialog.addEventListener('close',()=>{operation.abort();operation=new AbortController();dialog.remove();},{once:true});dialog.showModal();
  };
  initAccounts({db,modal,render,toast,container,signal:events.signal,getOperationSignal:()=>operation.signal});
  initEmployees({db,modal,render,toast,container,signal:events.signal});
  container.addEventListener('click',e=>{
    const target=e.target.closest('[data-view], [data-action="show-login"], [data-action="show-register"]');if(!target)return;e.preventDefault();
    view=target.dataset.view||(target.dataset.action==='show-login'?'login':'register');
    if(view==='logout'){current=null;view='login';}render();
  },{signal:events.signal});
  container.addEventListener('submit',async e=>{
    if(!['login-form','register-form','password-form'].includes(e.target.getAttribute('id')))return;
    e.preventDefault();const form=e.target, values=Object.fromEntries(new FormData(form)), button=form.querySelector('button[type="submit"],button');button.disabled=true;
    const operationSignal=operation.signal;
    try{
      if(form.id==='register-form'){await registerAccount(db,values,operationSignal);if(operationSignal.aborted)return;view='login';render();toast('Đã tạo tài khoản mẫu; hồ sơ độc giả sẽ liên kết qua TV2.');}
      else if(form.id==='login-form'){const account=await authenticateAccount(db,values.username,values.password);if(operationSignal.aborted)return;if(!account)throw Error('Thông tin đăng nhập không đúng hoặc tài khoản bị khóa.');current=account;view=current.role==='admin'?'accounts':'password';render();}
      else{await changePassword(db,current.id,values.current,values.password,values.confirmation,operationSignal);if(operationSignal.aborted)return;render();toast('Đã đổi mật khẩu mẫu.');}
    }catch(error){if(!operationSignal.aborted)toast(error.message);}finally{if(form.isConnected&&!operationSignal.aborted)button.disabled=false;}
  },{signal:events.signal});
  render();return cleanup;
}
