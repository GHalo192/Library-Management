// Các màn hình này chỉ dùng dữ liệu thử trong bộ nhớ, không cấp quyền backend.
import { routes as readers } from '../readers/routes.js';
import { routes as loans } from '../loans/routes.js';
import { routes as fines } from '../fines/routes.js';
import { routes as accounts } from '../accounts/routes.js';
const preview = (route, path, title) => ({ path, title, icon: '◈', mount: route.mount });
export const routes = [
  preview(readers[0], '/week1/readers', 'Thử độc giả / thẻ'),
  preview(loans[0], '/week1/loans', 'Thử mượn / bàn giao'),
  preview(fines[0], '/week1/fines', 'Thử khoản phạt'),
  preview(accounts[0], '/week1/accounts', 'Thử tài khoản / nhân viên'),
];
