// TV1: router hash; mount nhận signal và có thể trả cleanup đồng bộ/bất đồng bộ.
import { mountLayout, updateMenu, setPageTitle } from './shared/layout.js';
import { refreshSession, canAccess } from './shared/session.js';
import { showState, toast } from './shared/ui.js';
import { mount as mountHome } from './shared/home.js';
import { routes as bookRoutes } from './books/routes.js';
import { routes as ebookRoutes } from './ebooks/routes.js';
import { routes as weekOneRoutes } from './week1/routes.js';
import { mountLogin } from './accounts/login.js';
import { demoUser, clearDemoUser } from './accounts/demo-store.js';
const routes = [{ path: '/', title: 'Tổng quan', icon: '◫', mount: mountHome }, ...bookRoutes, ...ebookRoutes, ...weekOneRoutes];
const root = document.getElementById('app');
let activeController, cleanup, shellMounted = false;
async function navigate() {
  activeController?.abort(); cleanup?.(); cleanup = null;
  const controller = new AbortController(); activeController = controller;
  if (!demoUser()) {
    shellMounted = false;
    root.className = 'login-page';
    document.title = 'Đăng nhập | UniLib';
    history.replaceState(null, '', '#/login');
    cleanup = mountLogin({ container: root, signal: controller.signal, onLogin: () => {
      history.replaceState(null, '', '#/'); navigate();
    } });
    return;
  }
  if (!shellMounted) {
    root.className = '';
    mountLayout(root); shellMounted = true;
    const logout = document.createElement('button');
    logout.className = 'btn outline'; logout.textContent = 'Đăng xuất';
    logout.addEventListener('click', () => { clearDemoUser(); navigate(); });
    root.querySelector('.top-actions').prepend(logout);
  }
  document.getElementById('session-label').textContent = demoUser().name + ' (mẫu)';
  const container = document.getElementById('app-content');
  let path = location.hash.slice(1) || '/';
  if (path === '/login') { path = '/'; history.replaceState(null, '', '#/'); }
  let params = {}, selected;
  for (const route of routes) {
    const expected = route.path.split('/'), actual = path.split('/');
    if (expected.length !== actual.length) continue;
    const values = {};
    if (expected.every((part, i) => { if (part.startsWith(':')) { try { values[part.slice(1)] = decodeURIComponent(actual[i]); } catch { return false; } return actual[i] !== ''; } return part === actual[i]; })) { selected = route; params = values; break; }
  }
  updateMenu(routes, canAccess, path);
  setPageTitle(selected?.title || 'Không tìm thấy trang');
  if (!selected) return showState(container, 'Trang không tồn tại. Chọn Tổng quan để quay lại.');
  if (!canAccess(selected.roles)) return showState(container, 'Vui lòng đăng nhập bằng tài khoản có quyền truy cập.', 'status-error');
  showState(container, 'Đang tải…');
  try {
    const dispose = await selected.mount({ container, params, signal: controller.signal });
    if (controller.signal.aborted) { if (typeof dispose === 'function') dispose(); }
    else cleanup = typeof dispose === 'function' ? dispose : null;
  } catch (error) { if (!controller.signal.aborted) showState(container, error.message, 'status-error'); }
}
window.addEventListener('hashchange', navigate);
window.addEventListener('demo-logout', navigate);
window.addEventListener('session-expired', () => { clearDemoUser(); toast('Phiên đã hết hạn. Vui lòng đăng nhập lại.'); navigate(); });
// Hiển thị đăng nhập ngay; lấy phiên nền không được chặn màn hình khi API chưa sẵn sàng.
navigate();
refreshSession().catch(() => {});
