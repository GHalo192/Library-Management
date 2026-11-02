import { renderAuth, registerAccount, authenticateAccount } from './auth.js';
import { demoDb, setDemoUser } from './demo-store.js';

export function mountLogin({ container, signal, onLogin }) {
  let operation = new AbortController();
  let view = 'login';
  const cleanup = () => operation.abort();
  signal.addEventListener('abort', cleanup, { once: true });
  function render() {
    if (signal.aborted) return;
    operation.abort(); operation = new AbortController();
    container.innerHTML = renderAuth(view);
  }
  container.addEventListener('click', event => {
    const link = event.target.closest('[data-action="show-login"], [data-action="show-register"]');
    if (!link) return;
    event.preventDefault(); view = link.dataset.action === 'show-register' ? 'register' : 'login'; render();
  }, { signal });
  container.addEventListener('submit', async event => {
    const form = event.target;
    if (!['login-form', 'register-form'].includes(form.getAttribute('id'))) return;
    event.preventDefault();
    const values = Object.fromEntries(new FormData(form));
    const pending = operation.signal, button = form.querySelector('[type="submit"]'), errorBox = form.querySelector('.auth-error');
    button.disabled = true; errorBox.hidden = true;
    try {
      if (view === 'register') {
        await registerAccount(demoDb, values, pending);
        if (pending.aborted || signal.aborted) return;
        view = 'login'; render();
        const notice = document.createElement('p'); notice.setAttribute('role', 'status'); notice.textContent = 'Đã tạo tài khoản mẫu. Bạn có thể đăng nhập.';
        container.querySelector('.login-card').prepend(notice);
      } else {
        const account = await authenticateAccount(demoDb, values.username, values.password);
        if (pending.aborted || signal.aborted) return;
        if (!account) throw Error('Thông tin đăng nhập không đúng hoặc tài khoản bị khóa.');
        setDemoUser(account.id); onLogin();
      }
    } catch (error) {
      if (!pending.aborted && !signal.aborted) { errorBox.textContent = error.message; errorBox.hidden = false; }
    } finally { if (form.isConnected && !pending.aborted) button.disabled = false; }
  }, { signal });
  render(); return cleanup;
}
