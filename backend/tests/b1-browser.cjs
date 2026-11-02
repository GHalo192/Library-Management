// Chạy trên PHP/DB thật. Không mock session, health hoặc API.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const path = require('node:path');
(async () => {
  const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_PATH ? { executablePath: process.env.BROWSER_PATH } : {}) });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    const errors = [];page.on('pageerror', e => errors.push(e.message));
    await page.goto(process.env.TEST_URL || 'http://127.0.0.1:18080');
    await page.locator('#login-form').waitFor();
    assert.equal(await page.locator('#app-sidebar').count(),0);
    await page.locator('[name="username"]').fill('admin');await page.locator('[name="password"]').fill('wrong');await page.getByRole('button',{name:'Đăng nhập →',exact:true}).click();
    await page.locator('.auth-error').filter({hasText:'không đúng'}).waitFor();
    assert.equal(await page.locator('#app-sidebar').count(),0);
    await page.locator('[name="password"]').fill('123456');await page.getByRole('button',{name:'Đăng nhập →',exact:true}).click();
    await page.getByText('Cơ sở dữ liệu: đã kết nối', { exact: true }).waitFor();
    const open = async (name, heading) => {await page.getByRole('link',{name,exact:true}).click();await page.locator('#app-content h1').filter({hasText:heading}).waitFor();};
    await open('Thử độc giả / thẻ','Độc giả');
    await page.locator('[name="accountId"]').fill('9');await page.locator('[name="name"]').fill('Độc giả B1');await page.getByRole('button',{name:'Lưu hồ sơ',exact:true}).click();await page.getByRole('cell',{name:'Độc giả B1',exact:true}).waitFor();
    await open('Thử mượn / bàn giao','Yêu cầu');
    await page.locator('[name="copy"][value="1"]').check();await page.getByRole('button',{name:'Gửi yêu cầu',exact:true}).click();await page.getByRole('button',{name:'Duyệt',exact:true}).click();
    assert.equal(await page.locator('#available').textContent(),'4');await page.getByRole('button',{name:'Bàn giao',exact:true}).click();assert.equal(await page.locator('#available').textContent(),'3');
    await open('Thử khoản phạt','Khoản phạt');await page.getByRole('button',{name:'Xác nhận phạt mẫu',exact:true}).click();
    await open('Thử tài khoản / nhân viên','TV4');

    await page.getByRole('button',{name:'+ Thêm tài khoản',exact:true}).click();
    const dialog = page.locator('dialog');await dialog.locator('[name="id"]').fill('b1student');await dialog.locator('[name="mssv"]').fill('SVB1');await dialog.locator('[name="name"]').fill('Sinh viên B1');await dialog.locator('[name="email"]').fill('b1@example.test');await dialog.locator('[name="phone"]').fill('0912345678');await dialog.locator('[name="password"]').fill('password123');await dialog.locator('[name="confirmPassword"]').fill('password123');await dialog.getByRole('button',{name:'Lưu tài khoản',exact:true}).click();await page.getByRole('cell',{name:'b1student',exact:true}).waitFor();
    await page.getByRole('button',{name:'Nhân viên',exact:true}).click();await page.getByRole('button',{name:'+ Thêm nhân viên',exact:true}).click();await page.getByRole('button',{name:'Đóng',exact:true}).click();await page.locator('dialog').waitFor({state:'detached'});assert.equal(await page.locator('dialog').count(),0);
    // Mount lại để xác nhận cleanup không để handler trùng.
    await open('Thử độc giả / thẻ','Độc giả');await open('Thử mượn / bàn giao','Yêu cầu');
    await page.locator('[name="copy"][value="2"]').check();await page.getByRole('button',{name:'Gửi yêu cầu',exact:true}).click();assert.equal(await page.getByRole('button',{name:'Duyệt',exact:true}).count(),1);
    for (const width of [1440,800,390]) {
      await page.setViewportSize({width,height:1000});
      if(width===390){await page.getByRole('button',{name:'Mở menu',exact:true}).click();await open('Thử tài khoản / nhân viên','TV4');}
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`Overflow ${width}`);
      await page.screenshot({path:path.join(__dirname,`../storage/b1-${width}.png`),fullPage:true});
    }
    await page.locator('.top-actions').getByRole('button',{name:'Đăng xuất',exact:true}).click();
    await page.locator('#login-form').waitFor();assert.equal(await page.locator('#app-sidebar').count(),0);
    await page.evaluate(()=>{location.hash='/week1/readers';});
    await page.waitForFunction(()=>location.hash==='#/login');
    assert.equal(await page.locator('#app-sidebar').count(),0);
    await page.reload();await page.locator('#login-form').waitFor();
    await page.screenshot({path:path.join(__dirname,'../storage/login-390.png'),fullPage:true});
    assert.deepEqual(errors,[]);
    console.log('PASS B1 browser: real PHP/DB connection, all week-one routes and interactions, cleanup, desktop/tablet/mobile, no JS errors. Module actions remain explicit in-memory demos.');
  } finally { await browser.close(); }
})().catch(e=>{console.error(e);process.exitCode=1;});
