// TV3 tuần 1: mô phỏng trạng thái trong bộ nhớ, backend tuần 3 mới quyết định giao dịch thật.
export function createStore() { return { copies: [1,2,3,4].map(id => ({ id, title: `Bản sách ${id}`, available: true })), requests: [], loans: [], fines: [{ id: 1, amount: 12000, status: 'pending', reason: 'Mẫu 2 cuốn × 3 ngày × 2.000đ; chưa phải bộ tính tuần 2' }], nextRequest: 1 }; }
export function requestBorrow(store, reader, copies, cardValid = true) {
  const readerId = Number(reader), ids = [...new Set(copies.map(Number))];
  if (!Number.isSafeInteger(readerId) || readerId < 1) throw Error('Nhập mã độc giả hợp lệ.');
  if (!cardValid) throw Error('Thẻ mẫu không có hiệu lực.');
  if (!ids.length || ids.length > 3) throw Error('Chọn từ 1 đến 3 bản sách mỗi yêu cầu.');
  if (ids.some(id => !store.copies.some(c => c.id === id && c.available))) throw Error('Có bản sách không khả dụng.');
  if (store.loans.filter(l => l.readerId === readerId).reduce((n,l) => n+l.copyIds.length,0) + ids.length > 7) throw Error('Vượt hạn mức 7 cuốn đang mượn.');
  store.requests.push({ id: store.nextRequest++, readerId, copyIds: ids, status: 'pending' });
}
export function review(store, id, approved) {
  const request = store.requests.find(r => r.id === Number(id));
  if (!request || request.status !== 'pending') throw Error('Yêu cầu không còn chờ duyệt.');
  request.status = approved ? 'approved' : 'rejected'; // Không tạo phiếu hoặc đổi tồn ở bước duyệt.
}
export function handover(store, id, days, cardValid = true) {
  const request = store.requests.find(r => r.id === Number(id));
  if (!request || request.status !== 'approved') throw Error('Chỉ bàn giao yêu cầu đã duyệt, chưa giao.');
  if (!cardValid) throw Error('Thẻ không còn hiệu lực tại lúc bàn giao.');
  if (!Number.isInteger(days) || days < 1 || days > 14) throw Error('Hạn mượn từ 1 đến 14 ngày.');
  if (store.loans.filter(l => l.readerId === request.readerId).reduce((n,l) => n+l.copyIds.length,0)+request.copyIds.length > 7) throw Error('Vượt hạn mức 7 cuốn lúc bàn giao.');
  const copies = request.copyIds.map(id => store.copies.find(c => c.id === id));
  if (copies.some(c => !c?.available)) throw Error('Bản sách đã được bàn giao cho yêu cầu khác.');
  const due = new Date('2026-11-01T00:00:00Z'); due.setUTCDate(due.getUTCDate()+days);
  copies.forEach(c => { c.available = false; }); request.status = 'issued';
  store.loans.push({ id: request.id, readerId: request.readerId, copyIds: [...request.copyIds], issued: '2026-11-01', due: due.toISOString().slice(0,10) });
}
export function confirmFine(store, id) {
  const fine = store.fines.find(f => f.id === Number(id));
  if (!fine || fine.status !== 'pending') throw Error('Khoản phạt không còn chờ xác nhận.');
  fine.status = 'confirmed';
}
