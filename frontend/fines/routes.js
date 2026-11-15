import { mount as mountDemo } from '../loans/demo-ui.js';
export const routes = [{ path: '/fines', title: 'Phạt', roles: ['librarian', 'admin'], mount: context => mountDemo(context, true) }];
