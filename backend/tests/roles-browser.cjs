const {chromium}=require('playwright');const assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({headless:true,executablePath:process.env.BROWSER_PATH});try{
 for(const role of ['user','librarian','admin']){
 const page=await browser.newPage();await page.goto(process.env.TEST_URL||'http://127.0.0.1:8080');
 await page.locator('[name="username"]').fill(role);await page.locator('[name="password"]').fill('123456');await page.getByRole('button',{name:'Đăng nhập →',exact:true}).click();
 await page.getByRole('heading',{name:'Chào mừng đến UniLib',exact:true}).waitFor();
 await page.getByRole('link',{name:role==='admin'?'Tài khoản / nhân viên':'Tài khoản của tôi',exact:true}).click();
 await page.locator('#app-content h1').waitFor();
 if(role==='admin'){
 await page.getByRole('button',{name:'+ Thêm tài khoản',exact:true}).click();
 assert.deepEqual(await page.locator('dialog select[name="role"] option').evaluateAll(es=>es.map(e=>({value:e.value,text:e.textContent}))),[{value:'user',text:'User'},{value:'librarian',text:'Nhân viên thư viện'},{value:'admin',text:'Admin'}]);
 }else{assert.equal(await page.getByRole('button',{name:'+ Thêm tài khoản',exact:true}).count(),0);await page.locator('#password-form').waitFor();}
 await page.close();
 }
 console.log('PASS roles browser: three logins, admin role options, non-admin account management hidden');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1});
