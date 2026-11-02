export async function mount({ container, signal }) {
  const response = await fetch(new URL('./home.html', import.meta.url), { signal });
  if (!response.ok) throw new Error('Không tải được trang chủ.');
  const html = await response.text();
  if (!signal.aborted) container.innerHTML = html;
}
