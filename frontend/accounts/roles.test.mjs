import assert from 'node:assert/strict';
import { demoDb } from './demo-store.js';
import { registerAccount } from './auth.js';
import { saveAccount, renderAccounts } from './accounts.js';
assert.deepEqual(demoDb.read().accounts.map(a=>a.role), ['user','librarian','admin']);
let data={accounts:[]};const db={read:()=>structuredClone(data),write:v=>{data=structuredClone(v);}};
const input={username:'roleuser',mssv:'ROLE123',name:'Test Role',email:'role@example.test',phone:'0912345678',password:'password123',confirmPassword:'password123',role:'admin'};
await registerAccount(db,input);
assert.equal(data.accounts[0].role,'user');
for(const role of ['user','librarian','admin']) {
 await saveAccount(db,{...data.accounts[0],role,password:'',confirmPassword:''},'roleuser');
 assert.equal(data.accounts[0].role,role);
}
for(const role of ['student','staff','unknown']) await assert.rejects(saveAccount(db,{...data.accounts[0],role,password:'',confirmPassword:''},'roleuser'));
const html=renderAccounts(demoDb.read());
for(const label of ['User','Nhân viên thư viện','Admin']) assert.ok(html.includes(label));
console.log('PASS three roles: demo types, registration cannot choose admin, admin edits accept only three roles');
