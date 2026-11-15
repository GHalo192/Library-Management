const { chromium } = require('playwright');
const assert = require('node:assert/strict');
(async () => {
 const browser = await chromium.launch({headless:true, executablePath:process.env.BROWSER_PATH});
 try {
  for (const width of [1440,390]) {
   const page = await browser.newPage({viewport:{width,height:844}});
   const errors=[];page.on('pageerror', e=>errors.push(e.message));
   await page.goto(process.env.TEST_URL || 'http://127.0.0.1:8080');
   await page.getByRole('link',{name:'Đăng ký',exact:true}).click();
   await page.getByRole('button',{name:'Tạo tài khoản',exact:true}).click();
   await page.getByRole('alert').filter({hasText:'đầy đủ'}).waitFor();
   assert.equal(await page.getByRole('alert').evaluate(el=>el===document.activeElement && el.getBoundingClientRect().top>=0 && el.getBoundingClientRect().bottom<=innerHeight),true);
   const values={username:'newstudent',mssv:'NEW123',name:'Sinh viên mới',email:'new@example.test',phone:'0912345678',password:'password123',confirmPassword:'wrong'};
   for(const [key,value] of Object.entries(values)) await page.locator(`[name="${key}"]`).fill(value);
   await page.getByRole('button',{name:'Tạo tài khoản',exact:true}).click();
   await page.getByRole('alert').filter({hasText:'không khớp'}).waitFor();
   await page.locator('[name="confirmPassword"]').fill('password123');
   await page.getByRole('button',{name:'Tạo tài khoản',exact:true}).click();
   await page.getByRole('status').filter({hasText:'Đăng ký thành công'}).waitFor();
   assert.equal(await page.getByRole('status').evaluate(el=>el===document.activeElement && el.getBoundingClientRect().top>=0 && el.getBoundingClientRect().bottom<=innerHeight),true);
   assert.equal(await page.locator('[name="username"]').inputValue(),'newstudent');
   await page.locator('[name="password"]').fill('password123');
   await page.getByRole('button',{name:'Đăng nhập →',exact:true}).click();
   await page.getByRole('heading',{name:'Chào mừng đến UniLib',exact:true}).waitFor();
   assert.deepEqual(errors,[]);await page.close();
  }
  const stalled = await browser.newPage();
  await stalled.goto(process.env.TEST_URL || 'http://127.0.0.1:8080');
  await stalled.getByRole('link',{name:'Đăng ký',exact:true}).click();
  for (const [key,value] of Object.entries({username:'timeoutuser',mssv:'TIME123',name:'Test Timeout',email:'timeout@example.test',phone:'0987654321',password:'password123',confirmPassword:'password123'})) await stalled.locator('[name="'+key+'"]').fill(value);
  await stalled.evaluate(()=>{window.originalDigest=crypto.subtle.digest.bind(crypto.subtle);crypto.subtle.digest=()=>new Promise(resolve=>{window.resolveDigest=resolve;});});
  await stalled.getByRole('button',{name:'Tạo tài khoản',exact:true}).click();
  await stalled.getByRole('button',{name:'Đang tạo tài khoản…',exact:true}).waitFor();
  await stalled.getByRole('alert').filter({hasText:'Xử lý mật khẩu quá lâu'}).waitFor({timeout:15000});
  assert.equal(await stalled.getByRole('button',{name:'Tạo tài khoản',exact:true}).isEnabled(),true);
  await stalled.evaluate(()=>{window.resolveDigest(new ArrayBuffer(32));crypto.subtle.digest=window.originalDigest;});
  await stalled.getByRole('button',{name:'Tạo tài khoản',exact:true}).click();
  await stalled.getByRole('status').filter({hasText:'Đăng ký thành công'}).waitFor();
  await stalled.close();
  console.log('PASS registration: timeout feedback and retry, missing fields, password mismatch, visible feedback, success and new-account login on desktop/mobile');
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
