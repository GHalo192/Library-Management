// TV3: hợp đồng route tuần 1; TV1 đăng ký khi tích hợp.
import { mount as mountDemo } from '../loans/demo-ui.js';
export const routes = [{ path: '/fines', title: 'Phạt (mẫu tuần 1)', roles: ['librarian', 'admin'], mount: context => mountDemo(context, true) }];
