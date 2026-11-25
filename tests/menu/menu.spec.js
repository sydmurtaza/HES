// @ts-check
const { test, expect } = require('@playwright/test');

const PAGES = [
  { url: '/index.html', label: 'Home' },
  { url: '/about.html', label: 'About Us' },
  { url: '/academics.html', label: 'Academics' },
  { url: '/campus-life.html', label: 'Campus Life' },
  { url: '/admission.html', label: 'Admission' },
  { url: '/contact.html', label: 'Contact' }
];

async function openMenu(page) {
  const btn = page.locator('.menu-toggle-btn');
  await expect(btn).toBeVisible();
  const vp = page.viewportSize();
  if (vp && vp.width <= 320) { await btn.evaluate((el) => el.click()); } else { await btn.click(); }
  await expect(page.locator('.mobile-drawer')).toHaveClass(/open/);
  await page.waitForTimeout(500);
}

test.describe('Mobile Bento Sheet Menu', () => {
  test('P1: Hamburger opens menu; photo, dome sheet, 6 tiles, Apply button, WhatsApp and email icons are visible', async ({ page }) => {
    await page.goto('/index.html', { waitUntil: 'domcontentloaded' });
    await openMenu(page);

    const drawer = page.locator('.mobile-drawer');
    const sheet = drawer.locator('.m-menu-sheet');
    const photo = drawer.locator('.m-menu-photo');
    const tiles = drawer.locator('.m-menu-tile');
    const cta = drawer.locator('.m-menu-cta');
    const wa = drawer.locator('.m-menu-wa');
    const email = drawer.locator('.m-menu-email');

    await expect(drawer).toBeVisible();
    await expect(sheet).toBeVisible();
    await expect(tiles).toHaveCount(6);
    await expect(cta).toBeVisible();
    await expect(wa).toBeVisible();
    await expect(email).toBeVisible();

    const vp = page.viewportSize();
    if (vp && vp.height > 420) {
      await expect(photo).toBeVisible();
      const radius = await sheet.evaluate((el) => getComputedStyle(el).borderTopLeftRadius);
      expect(radius).not.toBe('0px');
    }
  });

  test('P2: Current page tile is navy with aria-current="page" on each of the six pages', async ({ page }) => {
    for (const item of PAGES) {
      await page.goto(item.url, { waitUntil: 'domcontentloaded' });
      await openMenu(page);

      const currentTile = page.locator('.m-menu-tile[aria-current="page"]');
      await expect(currentTile).toHaveCount(1);
      await expect(currentTile).toContainText(item.label);

      const bg = await currentTile.evaluate((el) => getComputedStyle(el).backgroundColor);
      expect(bg).toBe('rgb(20, 33, 61)');
    }
  });

  test('P3: Close works via close button, photo tap, Escape and swipe-down; scroll position restored', async ({ page }) => {
    await page.goto('/academics.html', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => window.scrollTo(0, 420));
    await page.waitForTimeout(100);
    const startY = await page.evaluate(() => window.scrollY);
    expect(startY).toBeGreaterThan(200);

    // 1. Close button
    await openMenu(page);
    await page.locator('.m-menu-close').click();
    await expect(page.locator('.mobile-drawer')).not.toHaveClass(/open/);
    expect(await page.evaluate(() => window.scrollY)).toBe(startY);

    // 2. Escape
    await openMenu(page);
    await page.keyboard.press('Escape');
    await expect(page.locator('.mobile-drawer')).not.toHaveClass(/open/);
    expect(await page.evaluate(() => window.scrollY)).toBe(startY);

    // 3. Photo tap (if photo is visible)
    const vp = page.viewportSize();
    if (vp && vp.height > 420) {
      await openMenu(page);
      await page.locator('.m-menu-photo-wrap').click({ position: { x: 10, y: 80 } });
      await expect(page.locator('.mobile-drawer')).not.toHaveClass(/open/);
      expect(await page.evaluate(() => window.scrollY)).toBe(startY);
    }

    // 4. Swipe-down on sheet
    await openMenu(page);
    const sheetBox = await page.locator('.m-menu-sheet').boundingBox();
    expect(sheetBox).toBeTruthy();
    if (sheetBox) {
      const cx = sheetBox.x + sheetBox.width / 2;
      const sy = sheetBox.y + 30;
      await page.mouse.move(cx, sy);
      await page.mouse.down();
      await page.mouse.move(cx, sy + 130, { steps: 8 });
      await page.mouse.up();
      await page.waitForTimeout(350);
      await expect(page.locator('.mobile-drawer')).not.toHaveClass(/open/);
      expect(await page.evaluate(() => window.scrollY)).toBe(startY);
    }
  });

  test('P4: Focus moves into menu on open, is trapped, returns to hamburger on close, and background is inert', async ({ page }) => {
    await page.goto('/about.html', { waitUntil: 'domcontentloaded' });
    await openMenu(page);

    const activeInside = await page.evaluate(() => {
      const drawer = document.querySelector('.mobile-drawer');
      return drawer && drawer.contains(document.activeElement);
    });
    expect(activeInside).toBe(true);

    const bgInert = await page.evaluate(() => {
      const header = document.querySelector('body > header');
      const main = document.querySelector('body > main');
      const footer = document.querySelector('body > footer');
      return Boolean(
        header && header.hasAttribute('inert') &&
        main && main.hasAttribute('inert') &&
        footer && footer.hasAttribute('inert')
      );
    });
    expect(bgInert).toBe(true);

    // Tab several times and ensure focus stays inside .mobile-drawer
    for (let i = 0; i < 14; i++) {
      await page.keyboard.press('Tab');
      const stillInside = await page.evaluate(() => {
        const drawer = document.querySelector('.mobile-drawer');
        return drawer && drawer.contains(document.activeElement);
      });
      expect(stillInside).toBe(true);
    }

    // Shift+Tab from first element wraps to last
    await page.locator('.m-menu-close').focus();
    await page.keyboard.press('Shift+Tab');
    const wrappedInside = await page.evaluate(() => {
      const drawer = document.querySelector('.mobile-drawer');
      return drawer && drawer.contains(document.activeElement);
    });
    expect(wrappedInside).toBe(true);

    await page.locator('.m-menu-close').click();
    await expect(page.locator('.mobile-drawer')).not.toHaveClass(/open/);

    const focusBackOnBurger = await page.evaluate(() => {
      const btn = document.querySelector('.menu-toggle-btn');
      return document.activeElement === btn;
    });
    expect(focusBackOnBurger).toBe(true);
  });

  test('P5: Every tile and Apply button navigate correctly and menu closes', async ({ page }) => {
    await page.goto('/index.html', { waitUntil: 'domcontentloaded' });
    await openMenu(page);
    await Promise.all([
      page.waitForURL(/about\.html/, { waitUntil: 'domcontentloaded' }),
      page.locator('.m-menu-tile', { hasText: 'About Us' }).click()
    ]);
    await expect(page.locator('.mobile-drawer')).not.toHaveClass(/open/);

    await openMenu(page);
    await Promise.all([
      page.waitForURL(/admission\.html/, { waitUntil: 'domcontentloaded' }),
      page.locator('.m-menu-cta').click()
    ]);
    await expect(page.locator('.mobile-drawer')).not.toHaveClass(/open/);
  });

  test('P6: WhatsApp link points to wa.me with number from siteContent and email link uses mailto', async ({ page }) => {
    await page.goto('/index.html', { waitUntil: 'domcontentloaded' });
    await openMenu(page);

    const links = await page.evaluate(() => {
      const wa = document.querySelector('.m-menu-wa');
      const email = document.querySelector('.m-menu-email');
      return {
        waHref: wa ? wa.getAttribute('href') : null,
        emailHref: email ? email.getAttribute('href') : null,
        expectedWa: siteContent.info.contact.whatsappNumber.replace(/\D/g, ''),
        expectedEmail: siteContent.info.contact.email
      };
    });

    expect(links.waHref).toBe(`https://wa.me/${links.expectedWa}`);
    expect(links.emailHref).toBe(`mailto:${links.expectedEmail}`);
  });

  test('P7: No language switcher or Urdu text in the menu', async ({ page }) => {
    await page.goto('/index.html', { waitUntil: 'domcontentloaded' });
    await openMenu(page);

    const hasLangOrUrdu = await page.evaluate(() => {
      const drawer = document.querySelector('.mobile-drawer');
      if (!drawer) return true;
      const text = drawer.innerText || '';
      const urduRegex = /[\u0600-\u06FF]/;
      const langControls = drawer.querySelectorAll('.lang-toggle-btn, [data-ur], [data-lang]');
      return urduRegex.test(text) || langControls.length > 0;
    });
    expect(hasLangOrUrdu).toBe(false);
  });

  test('P8: Reduced motion: menu appears instantly and nothing animates', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/index.html', { waitUntil: 'domcontentloaded' });
    const vp = page.viewportSize();
    const toggleBtn = page.locator('.menu-toggle-btn');
    if (vp && vp.width <= 320) { await toggleBtn.evaluate((el) => el.click()); } else { await toggleBtn.click(); }

    const durations = await page.evaluate(() => {
      const drawer = document.querySelector('.mobile-drawer');
      const sheet = document.querySelector('.m-menu-sheet');
      const tile = document.querySelector('.m-menu-tile');
      return {
        drawerTrans: getComputedStyle(drawer).transitionDuration,
        sheetTrans: getComputedStyle(sheet).transitionDuration,
        tileTrans: getComputedStyle(tile).transitionDuration,
        tileOpacity: getComputedStyle(tile).opacity
      };
    });

    expect(durations.drawerTrans).toBe('0s');
    expect(durations.sheetTrans).toBe('0s');
    expect(durations.tileTrans).toBe('0s');
    expect(durations.tileOpacity).toBe('1');
  });

  test('P9: Resize from mobile to 1280px while open closes menu and restores scroll', async ({ page }) => {
    await page.goto('/academics.html', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => window.scrollTo(0, 300));
    await page.waitForTimeout(100);

    await openMenu(page);
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.waitForTimeout(200);

    await expect(page.locator('.mobile-drawer')).not.toHaveClass(/open/);
    const bodyFixed = await page.evaluate(() => getComputedStyle(document.body).position);
    expect(bodyFixed).not.toBe('fixed');
    expect(await page.evaluate(() => window.scrollY)).toBe(300);
  });

  test('N1: Image 404 shows Navy fallback and layout does not break', async ({ page }) => {
    await page.route('**/assets/images/building.jpg', (route) => route.abort());
    await page.goto('/index.html', { waitUntil: 'domcontentloaded' });
    await openMenu(page);

    const state = await page.evaluate(() => {
      const drawer = document.querySelector('.mobile-drawer');
      const wrap = document.querySelector('.m-menu-photo-wrap');
      const img = document.querySelector('.m-menu-photo');
      return {
        drawerBg: getComputedStyle(drawer).backgroundColor,
        wrapBg: getComputedStyle(wrap).backgroundColor,
        imgDisplay: getComputedStyle(img).display
      };
    });
    expect(state.wrapBg).toBe('rgb(20, 33, 61)');
    expect(state.imgDisplay).toBe('none');
  });

  test('N2: Missing WhatsApp or email in siteContent hides that icon button', async ({ page }) => {
    await page.goto('/index.html', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => {
      siteContent.info.whatsapp = '';
      siteContent.info.email = '';
    });
    await openMenu(page);

    await expect(page.locator('.m-menu-wa')).toBeHidden();
    await expect(page.locator('.m-menu-email')).toBeHidden();
    await expect(page.locator('.m-menu-cta')).toBeVisible();
  });

  test('N3 & N4: Short/narrow viewports have no horizontal scroll and close button stays reachable', async ({ page }) => {
    await page.goto('/index.html', { waitUntil: 'domcontentloaded' });
    await openMenu(page);

    const metrics = await page.evaluate(() => {
      const closeBtn = document.querySelector('.m-menu-close');
      const rect = closeBtn.getBoundingClientRect();
      return {
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
        closeVisible: rect.width >= 44 && rect.height >= 44 && rect.top >= 0 && rect.right <= window.innerWidth
      };
    });
    expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.innerWidth);
    expect(metrics.closeVisible).toBe(true);
  });

  test('N5: Double-tapping hamburger quickly never leaves half-open menu or locked page', async ({ page }) => {
    await page.goto('/index.html', { waitUntil: 'domcontentloaded' });
    const btn = page.locator('.menu-toggle-btn');
    await btn.evaluate((el) => {
      el.click();
      el.click();
    });
    await page.waitForTimeout(500);

    const isOpen = await page.locator('.mobile-drawer').evaluate((el) => el.classList.contains('open'));
    if (isOpen) {
      await page.locator('.m-menu-close').click();
      await page.waitForTimeout(300);
    }
    await expect(page.locator('.mobile-drawer')).not.toHaveClass(/open/);
    const overflow = await page.evaluate(() => document.body.classList.contains('drawer-open'));
    expect(overflow).toBe(false);
  });

  test('N6: Rapid swipe-down and photo tap together end in one consistent closed state', async ({ page }) => {
    const vp = page.viewportSize();
    test.skip(Boolean(vp && vp.height <= 420), 'Photo hidden below 420px height');

    await page.goto('/index.html', { waitUntil: 'domcontentloaded' });
    await openMenu(page);

    const sheetBox = await page.locator('.m-menu-sheet').boundingBox();
    if (sheetBox) {
      const cx = sheetBox.x + sheetBox.width / 2;
      const sy = sheetBox.y + 30;
      await page.mouse.move(cx, sy);
      await page.mouse.down();
      await page.mouse.move(cx, sy + 110, { steps: 4 });
      await page.mouse.up();
    }
    await page.locator('.m-menu-photo-wrap').click({ position: { x: 20, y: 120 }, force: true });
    await page.waitForTimeout(350);

    await expect(page.locator('.mobile-drawer')).not.toHaveClass(/open/);
    const bodyLocked = await page.evaluate(() => document.body.classList.contains('drawer-open'));
    expect(bodyLocked).toBe(false);
  });

  test('N7: Tapping tile linking to current page closes the menu cleanly', async ({ page }) => {
    await page.goto('/about.html', { waitUntil: 'domcontentloaded' });
    await openMenu(page);
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
      page.locator('.m-menu-tile[data-page="about.html"]').click()
    ]);
    await expect(page.locator('.mobile-drawer')).not.toHaveClass(/open/);
  });

  test('N8 & N9: No console errors or warnings, and page layout intact when menu is closed', async ({ page }) => {
    const issues = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error' || msg.type() === 'warning') {
        issues.push(`${msg.type()}: ${msg.text()}`);
      }
    });
    page.on('pageerror', (err) => issues.push(`pageerror: ${err.message}`));

    await page.goto('/academics.html', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(300);

    const closedMetrics = await page.evaluate(() => ({
      navVisible: getComputedStyle(document.querySelector('.navbar')).display !== 'none',
      heroVisible: getComputedStyle(document.querySelector('#academics-hero')).display !== 'none',
      footerVisible: getComputedStyle(document.querySelector('footer')).display !== 'none',
      drawerOpen: document.querySelector('.mobile-drawer').classList.contains('open'),
      overflow: document.documentElement.scrollWidth <= window.innerWidth
    }));

    expect(closedMetrics.navVisible).toBe(true);
    expect(closedMetrics.heroVisible).toBe(true);
    expect(closedMetrics.footerVisible).toBe(true);
    expect(closedMetrics.drawerOpen).toBe(false);
    expect(closedMetrics.overflow).toBe(true);

    await openMenu(page);
    await page.locator('.m-menu-close').click();
    await page.waitForTimeout(300);

    expect(issues).toEqual([]);
  });
});
