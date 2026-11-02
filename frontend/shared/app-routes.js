import { routes as readers } from '../readers/routes.js';
import { routes as loans } from '../loans/routes.js';
import { routes as fines } from '../fines/routes.js';
import { routes as accounts } from '../accounts/routes.js';
import { mountPersonal } from '../loans/demo-ui.js';
export function routesFor(role) {
 const operator = ['librarian', 'admin'];
 return [
 {path:'/readers',title:'Độc giả / thẻ',roles:operator,mount:readers[0].mount},
 {path:'/loans',title:role==='user'?'Mượn sách của tôi':'Mượn / bàn giao',roles:['user',...operator],mount:role==='user'?mountPersonal:loans[0].mount},
 {path:'/fines',title:role==='user'?'Khoản phạt của tôi':'Khoản phạt',roles:['user',...operator],mount:role==='user'?context=>mountPersonal(context,true):fines[0].mount},
 {path:'/accounts',title:role==='admin'?'Tài khoản / nhân viên':'Tài khoản của tôi',roles:['user',...operator],mount:accounts[0].mount},
 ];
}
