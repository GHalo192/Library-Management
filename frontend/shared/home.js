import { demoUser } from '../accounts/demo-store.js';
export function mount({container,signal}) {
 if(signal.aborted)return;
 const content={
 user:['Không gian độc giả','Gửi yêu cầu mượn, theo dõi sách và khoản phạt của bạn.',[['/loans','Mượn sách của tôi'],['/fines','Khoản phạt của tôi'],['/accounts','Đổi mật khẩu']]],
 librarian:['Bàn làm việc nhân viên thư viện','Quản lý hồ sơ, thẻ độc giả; duyệt yêu cầu, bàn giao sách và xác nhận khoản phạt.',[['/readers','Quản lý độc giả / thẻ'],['/loans','Duyệt và bàn giao'],['/fines','Xử lý khoản phạt']]],
 admin:['Trung tâm quản trị','Quản lý tài khoản, vai trò và nhân viên; theo dõi các nghiệp vụ thư viện.',[['/accounts','Quản lý tài khoản / nhân viên'],['/readers','Quản lý độc giả'],['/loans','Theo dõi mượn / bàn giao'],['/fines','Quản lý khoản phạt']]],
 }[demoUser()?.role];
 if(!content)return;
 container.innerHTML=`<div class="hero"><div><div class="eyebrow">${content[0]}</div><h2>Chào mừng đến UniLib</h2><p>${content[1]}</p></div><div class="big" aria-hidden="true">📚</div></div><section class="panel"><div class="panel-head"><h3>Công việc của bạn</h3></div><nav>${content[2].map(([path,label])=>`<a class="btn outline" href="#${path}">${label}</a>`).join('')}</nav></section>`;
}
