import { renderAuth, registerAccount, authenticateAccount } from './auth.js?v=registration-2';
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
    if (button.disabled) return;
    const buttonText = button.textContent;
    button.disabled = true; errorBox.hidden = true;
    button.textContent = view === 'register' ? 'Đang tạo tài khoản…' : 'Đang đăng nhập…';
    form.setAttribute('aria-busy', 'true');
    try {
      if (view === 'register') {
        await registerAccount(demoDb, values, pending);
        if (pending.aborted || signal.aborted) return;
        view = 'login'; render();
        const notice = document.createElement('p'); notice.setAttribute('role', 'status'); notice.className = 'auth-success'; notice.tabIndex = -1;
        notice.textContent = 'Đăng ký thành công! Bạn có thể đăng nhập bằng tài khoản vừa tạo. Dữ liệu chạy thử sẽ được đặt lại khi tải lại trang.';
        container.querySelector('.login-card').prepend(notice);
        container.querySelector('[name="username"]').value = values.username.trim();
        notice.focus(); notice.scrollIntoView({ block: 'center' });
      } else {
        const account = await authenticateAccount(demoDb, values.username, values.password);
        if (pending.aborted || signal.aborted) return;
        if (!account) throw Error('Thông tin đăng nhập không đúng hoặc tài khoản bị khóa.');
        setDemoUser(account.id); onLogin();
      }
    } catch (error) {
      if (!pending.aborted && !signal.aborted) {
        errorBox.textContent = error.message; errorBox.hidden = false; errorBox.tabIndex = -1;
        errorBox.focus(); errorBox.scrollIntoView({ block: 'center' });
      }
    } finally { if (form.isConnected && !pending.aborted) { button.disabled = false; button.textContent = buttonText; form.removeAttribute('aria-busy'); } }
  }, { signal });
  render(); return cleanup;
}
