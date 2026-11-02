let data = { accounts: ['user', 'librarian', 'admin'].map(role => ({
  id: role, name: ({user:"User",librarian:"Nhân viên thư viện",admin:"Admin"})[role], email: `${role}@example.test`,
  mssv: role === 'user' ? 'SV001' : null, role, status: 'Hoạt động',
})) };
let currentId = null;
export const demoDb = { read: () => structuredClone(data), write: value => { data = structuredClone(value); } };
export function demoUser() { return data.accounts.find(a => a.id === currentId && a.status === 'Hoạt động') || null; }
export function setDemoUser(id) { currentId = id; }
export function clearDemoUser() { currentId = null; }
