// TV2 — tuần 1: dữ liệu thử trong bộ nhớ; không thay API/DB tuần 2.
export function createStore() {
  return { readers: [{ id: 1, accountId: 3, name: 'Nguyễn An', phone: '0912345678', address: 'Hà Nội', card: { code: 'THE001', issued: '2026-10-01', expires: '2026-12-31', status: 'active' } }], nextId: 2 };
}
const required = (value) => String(value ?? '').trim();
export function saveReader(store, input) {
  const id = Number(input.id || 0), accountId = Number(input.accountId), name = required(input.name);
  if (!Number.isSafeInteger(accountId) || accountId < 1 || !name || name.length > 150) throw Error('Nhập mã tài khoản hợp lệ và họ tên (tối đa 150 ký tự).');
  const phone = required(input.phone), address = required(input.address);
  if (phone && !/^(0\d{9}|\+84\d{9})$/.test(phone)) throw Error('Số điện thoại không hợp lệ.');
  if (address.length > 255) throw Error('Địa chỉ tối đa 255 ký tự.');
  if (store.readers.some(r => r.accountId === accountId && r.id !== id)) throw Error('Tài khoản đã có hồ sơ độc giả.');
  const existing = store.readers.find(r => r.id === id);
  if (id && !existing) throw Error('Không tìm thấy độc giả.');
  if (existing) Object.assign(existing, { accountId, name, phone, address });
  else store.readers.push({ id: store.nextId++, accountId, name, phone, address, card: null });
}
function validDate(value) { return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value; }
export function saveCard(store, id, input) {
  const reader = store.readers.find(r => r.id === Number(id));
  if (!reader) throw Error('Không tìm thấy độc giả.');
  const code = required(input.code), issued = required(input.issued), expires = required(input.expires);
  if (!/^[A-Za-z0-9_-]{1,32}$/.test(code)) throw Error('Mã thẻ bắt buộc, tối đa 32 ký tự chữ/số/gạch.');
  if (!validDate(issued) || !validDate(expires) || expires < issued) throw Error('Ngày hết hạn phải từ ngày cấp trở đi.');
  if (reader.card && expires < reader.card.expires) throw Error('Gia hạn không được rút ngắn hạn thẻ.');
  if (!['active', 'locked'].includes(input.status)) throw Error('Trạng thái thẻ không hợp lệ.');
  if (store.readers.some(r => r.id !== reader.id && r.card?.code.toLowerCase() === code.toLowerCase())) throw Error('Mã thẻ đã tồn tại.');
  reader.card = { code, issued, expires, status: input.status };
}
export function cardState(card, today) {
  if (!card) return 'Chưa cấp thẻ';
  if (card.status === 'locked') return 'Đã khóa';
  if (today < card.issued) return 'Chưa hiệu lực';
  return today > card.expires ? 'Hết hạn' : 'Có hiệu lực';
}
