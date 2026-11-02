// Phiên giao diện B1 chỉ trong bộ nhớ; không thay session hoặc quyền API máy chủ.
let data = { accounts: ['student', 'librarian', 'staff', 'admin'].map(role => ({
  id: role, name: role, email: `${role}@example.test`,
  mssv: role === 'student' ? 'SV001' : null, role, status: 'Hoạt động',
})) };
let currentId = null;
export const demoDb = { read: () => structuredClone(data), write: value => { data = structuredClone(value); } };
export function demoUser() { return data.accounts.find(a => a.id === currentId && a.status === 'Hoạt động') || null; }
export function setDemoUser(id) { currentId = id; }
export function clearDemoUser() { currentId = null; }
