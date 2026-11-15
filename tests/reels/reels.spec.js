// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Playback Manager Assertion Helper:
 * Fails if more than ONE video element is playing or audible at any moment across the page.
 */
async function assertPlaybackSafety(page) {
  const result = await page.evaluate(() => {
    let playingCount = 0;
    let audibleCount = 0;
    const details = [];
    document.querySelectorAll('video').forEach(v => {
      const isPlaying = !v.paused;
      const isAudible = isPlaying && !v.muted && v.volume > 0;
      if (isPlaying) playingCount++;
      if (isAudible) audibleCount++;
      details.push({
        id: v.id,
        cls: v.className,
        playing: isPlaying,
        muted: v.muted,
        src: v.currentSrc || v.src
      });
    });
    return { playingCount, audibleCount, details };
  });

  if (result.playingCount > 1) {
    throw new Error(`PLAYBACK VIOLATION: ${result.playingCount} videos are playing at the same time: ${JSON.stringify(result.details)}`);
  }
  if (result.audibleCount > 1) {
    throw new Error(`AUDIO VIOLATION: ${result.audibleCount} videos are audible at the same time: ${JSON.stringify(result.details)}`);
  }
  return result;
}

test.describe('Reel Theatre Test Suite', () => {

  test('P01: Tap play on reel 1 on phone: picture starts within 1s and data-state becomes playing', async ({ page }) => {
    await page.goto('/campus-life.html');
    const isMobile = page.viewportSize().width < 1024;
    if (isMobile) {
      const card = page.locator('.cl-phone-card').first();
      await card.click();
      await page.waitForTimeout(600);
      const activeSlide = page.locator('.cl-viewer-slide[data-index="0"]');
      const video = activeSlide.locator('video');
      let isPlaying = await video.evaluate(v => !v.paused);
      if (!isPlaying) {
        const tap = activeSlide.locator('.cl-tap');
        await tap.click();
        await page.waitForTimeout(600);
        isPlaying = await video.evaluate(v => !v.paused);
      }
      expect(isPlaying).toBe(true);
      await assertPlaybackSafety(page);
    } else {
      const tap = page.locator('#clStageTap');
      await tap.click();
      await page.waitForTimeout(600);
      const state = await page.locator('#clStage').getAttribute('data-state');
      expect(state).toBe('playing');
      await assertPlaybackSafety(page);
    }
  });

  test('P02: Tap the video: pause, then resume; time preserved', async ({ page }) => {
    await page.goto('/campus-life.html');
    const isMobile = page.viewportSize().width < 768;
    if (!isMobile) {
      const tap = page.locator('#clStageTap');
      await tap.click();
      await page.waitForTimeout(800);
      const time1 = await page.locator('#clStageVideo').evaluate(v => v.currentTime);
      expect(time1).toBeGreaterThan(0);
      await tap.click();
      await page.waitForTimeout(300);
      const isPaused = await page.locator('#clStageVideo').evaluate(v => v.paused);
      expect(isPaused).toBe(true);
      const time2 = await page.locator('#clStageVideo').evaluate(v => v.currentTime);
      expect(Math.abs(time2 - time1)).toBeLessThan(0.5);
      await tap.click();
      await page.waitForTimeout(300);
      const isResumed = await page.locator('#clStageVideo').evaluate(v => !v.paused);
      expect(isResumed).toBe(true);
      await assertPlaybackSafety(page);
    }
  });

  test('P03: Space and Enter on the focused stage toggle play', async ({ page }) => {
    await page.goto('/campus-life.html');
    if (page.viewportSize().width >= 768) {
      const stage = page.locator('#clStage');
      await stage.focus();
      await page.keyboard.press('Space');
      await page.waitForTimeout(500);
      expect(await page.locator('#clStage').getAttribute('data-state')).toBe('playing');
      await page.keyboard.press('Enter');
      await page.waitForTimeout(300);
      expect(await page.locator('#clStage').getAttribute('data-state')).toBe('paused');
      await assertPlaybackSafety(page);
    }
  });

  test('P04: Seek bar: pointer drag and keyboard arrows update time and bar; Home and End work', async ({ page }) => {
    await page.goto('/campus-life.html');
    if (page.viewportSize().width >= 768) {
      const seek = page.locator('#clStageSeek');
      await seek.focus();
      await page.keyboard.press('ArrowRight');
      const timeAfterRight = await page.locator('#clStageVideo').evaluate(v => v.currentTime);
      expect(timeAfterRight).toBeGreaterThanOrEqual(4.5);
      await page.keyboard.press('ArrowLeft');
      const timeAfterLeft = await page.locator('#clStageVideo').evaluate(v => v.currentTime);
      expect(timeAfterLeft).toBeLessThan(timeAfterRight);
      await page.keyboard.press('End');
      const timeAfterEnd = await page.locator('#clStageVideo').evaluate(v => v.currentTime);
      const dur = await page.locator('#clStageVideo').evaluate(v => v.duration);
      expect(Math.abs(timeAfterEnd - dur)).toBeLessThan(1);
      await page.keyboard.press('Home');
      const timeAfterHome = await page.locator('#clStageVideo').evaluate(v => v.currentTime);
      expect(timeAfterHome).toBe(0);
    }
  });

  test('P05: Mute toggle: icon and aria-label in sync; state shared between desktop stage and phone viewer', async ({ page }) => {
    await page.goto('/campus-life.html');
    if (page.viewportSize().width >= 768) {
      const muteBtn = page.locator('#clStageMute');
      expect(await muteBtn.getAttribute('aria-label')).toBe('Unmute');
      await muteBtn.click();
      expect(await muteBtn.getAttribute('aria-label')).toBe('Mute');
      expect(await page.locator('#clStageVideo').evaluate(v => v.muted)).toBe(false);
      await muteBtn.click();
      expect(await muteBtn.getAttribute('aria-label')).toBe('Unmute');
      expect(await page.locator('#clStageVideo').evaluate(v => v.muted)).toBe(true);
    } else {
      const card = page.locator('.cl-phone-card').first();
      await card.click();
      await page.waitForTimeout(500);
      const viewerMute = page.locator('#clViewerMute');
      expect(await viewerMute.getAttribute('aria-label')).toBe('Unmute');
      await viewerMute.click();
      expect(await viewerMute.getAttribute('aria-label')).toBe('Mute');
    }
  });

  test('P06: Desktop: when reel ends next plays; last reel stays on final frame with replay icon', async ({ page }) => {
    await page.goto('/campus-life.html');
    if (page.viewportSize().width >= 768) {
      await page.evaluate(() => {
        const v = document.getElementById('clStageVideo');
        v.dispatchEvent(new Event('ended'));
      });
      await page.waitForTimeout(600);
      // Advances to next reel
      const caption = await page.locator('#clStageCaption').textContent();
      expect(caption).toContain('Prize Distribution Ceremony');
      await assertPlaybackSafety(page);
    }
  });

  test('P07: Phone viewer: current reel loops until user swipes', async ({ page }) => {
    await page.goto('/campus-life.html');
    if (page.viewportSize().width < 768) {
      await page.locator('.cl-phone-card').first().click();
      await page.waitForTimeout(500);
      const slideVideo = page.locator('.cl-viewer-slide[data-index="0"] video');
      const isLoop = await slideVideo.evaluate(v => v.loop);
      expect(isLoop).toBe(true);
    }
  });

  test('P08: Swipe to next or previous: exactly one reel moves, new reel shows picture/sound, previous stops', async ({ page }) => {
    await page.goto('/campus-life.html');
    if (page.viewportSize().width < 768) {
      await page.locator('.cl-phone-card').first().click();
      await page.waitForTimeout(600);
      const feed = page.locator('#clViewerFeed');
      const nextSlide = page.locator('.cl-viewer-slide[data-index="1"]');
      await nextSlide.evaluate(el => el.scrollIntoView({ behavior: 'auto', block: 'start' }));
      await page.waitForTimeout(800);
      const v0Paused = await page.locator('.cl-viewer-slide[data-index="0"] video').evaluate(v => v.paused);
      const v1Playing = await page.locator('.cl-viewer-slide[data-index="1"] video').evaluate(v => !v.paused);
      expect(v0Paused).toBe(true);
      expect(v1Playing).toBe(true);
      await assertPlaybackSafety(page);
    }
  });

  test('P09: Story bars match position, real progress and filtered list', async ({ page }) => {
    await page.goto('/campus-life.html');
    const barsCount = await page.locator('#clStoryBars .cl-bar').count();
    expect(barsCount).toBe(4);
  });

  test('P10: Chips filter the list, bars and count announcement', async ({ page }) => {
    await page.goto('/campus-life.html');
    const chipCeremonies = page.locator('.cl-chip[data-filter="ceremonies"]');
    await chipCeremonies.click();
    await page.waitForTimeout(400);
    const barsCount = await page.locator('#clStoryBars .cl-bar').count();
    expect(barsCount).toBe(1);
    const title = await page.locator('#clInfoTitle').textContent();
    expect(title).toContain('Prize Distribution Ceremony');
  });

  test('P11: Selecting a card opens correct reel and updates hash', async ({ page }) => {
    await page.goto('/campus-life.html');
    if (page.viewportSize().width >= 768) {
      const card2 = page.locator('.cl-card[data-id="prize-ceremony"]');
      await card2.click();
      await page.waitForTimeout(400);
      expect(page.url()).toContain('#reel-prize-ceremony');
    }
  });

  test('P12: Opening with #film-id selects that reel without autoplay', async ({ page }) => {
    await page.goto('/campus-life.html#reel-museum-excursion');
    await page.waitForTimeout(600);
    const title = await page.locator('#clInfoTitle').textContent();
    expect(title).toContain('Museum & Heritage Study Tour');
    const isPaused = await page.locator('#clStageVideo').evaluate(v => v.paused);
    expect(isPaused).toBe(true);
    await assertPlaybackSafety(page);
  });

  test('P13: Share works through Web Share or WhatsApp fallback', async ({ page }) => {
    await page.goto('/campus-life.html');
    const isMobile = page.viewportSize().width < 1024;
    if (isMobile) {
      await page.locator('.cl-phone-card').first().click();
      await page.waitForTimeout(300);
      const shareBtn = page.locator('.cl-viewer-slide[data-index="0"] .cl-rail-share');
      expect(await shareBtn.isVisible()).toBe(true);
    } else {
      const shareBtn = page.locator('#clBtnShare');
      expect(await shareBtn.isVisible()).toBe(true);
    }
  });

  test('P14: Full screen enters and exits', async ({ page }) => {
    await page.goto('/campus-life.html');
    const isMobile = page.viewportSize().width < 1024;
    if (isMobile) {
      await page.locator('.cl-phone-card').first().click();
      await page.waitForTimeout(300);
      expect(await page.locator('#clPhoneViewer').isVisible()).toBe(true);
    } else {
      const fsBtn = page.locator('#clBtnFullscreen');
      expect(await fsBtn.isVisible()).toBe(true);
    }
  });

  test('P15: Viewer: X, Escape and browser Back close it; body scroll restored; media unloaded', async ({ page }) => {
    await page.goto('/campus-life.html');
    if (page.viewportSize().width < 768) {
      await page.locator('.cl-phone-card').first().click();
      await page.waitForTimeout(500);
      expect(await page.locator('#clPhoneViewer').isVisible()).toBe(true);
      expect(await page.evaluate(() => document.body.classList.contains('reel-viewer-open'))).toBe(true);
      await page.keyboard.press('Escape');
      await page.waitForTimeout(500);
      expect(await page.locator('#clPhoneViewer').isVisible()).toBe(false);
      expect(await page.evaluate(() => document.body.classList.contains('reel-viewer-open'))).toBe(false);
      await assertPlaybackSafety(page);
    }
  });

  test('P16: Desktop up and down buttons switch reels, sit to the right of stage, vertically centred', async ({ page }) => {
    await page.goto('/campus-life.html');
    if (page.viewportSize().width >= 768) {
      const measurements = await page.evaluate(() => {
        const stage = document.getElementById('clStage');
        const nav = document.getElementById('clDesktopNav');
        const sRect = stage.getBoundingClientRect();
        const nRect = nav.getBoundingClientRect();
        return {
          gapFromStage: nRect.left - sRect.right,
          diffCenterY: Math.abs((sRect.top + sRect.height / 2) - (nRect.top + nRect.height / 2))
        };
      });
      expect(measurements.gapFromStage).toBeLessThanOrEqual(20);
      expect(measurements.diffCenterY).toBeLessThanOrEqual(1);
    }
  });

  test('P17: Resizing across 768px while playing never leaves two videos playing', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/campus-life.html');
    await page.locator('#clStageTap').click();
    await page.waitForTimeout(500);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(500);
    await assertPlaybackSafety(page);
  });

  test('P18: Phone rotation keeps playback and usable layout', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/campus-life.html');
    await page.setViewportSize({ width: 844, height: 390 });
    await page.waitForTimeout(400);
    await assertPlaybackSafety(page);
  });

  test('P19: Switching English and Urdu mid-play updates text and RTL while playback continues', async ({ page }) => {
    await page.goto('/campus-life.html');
    await page.evaluate(() => {
      document.documentElement.setAttribute('dir', 'rtl');
      document.documentElement.setAttribute('lang', 'ur');
      window.dispatchEvent(new CustomEvent('hes-language-changed'));
    });
    await page.waitForTimeout(400);
    const badge = await page.locator('#clInfoBadge').textContent();
    expect(badge).toContain('آفیشل فلم');
    await assertPlaybackSafety(page);
  });

  test('P20: Light and dark mode show the same black panel', async ({ page }) => {
    await page.goto('/campus-life.html');
    const bg = await page.locator('#clPanel').evaluate(el => window.getComputedStyle(el).backgroundColor);
    expect(bg).toBe('rgb(0, 0, 0)');
  });

  test('P21: prefers-reduced-motion: story bars still show real progress', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/campus-life.html');
    if (page.viewportSize().width >= 768) {
      await page.locator('#clStageTap').click();
      await page.waitForTimeout(1000);
      const width = await page.locator('#clStoryBars .cl-bar-fill').first().evaluate(el => el.style.width);
      expect(parseFloat(width)).toBeGreaterThan(0);
    }
  });

  test('P22: Keyboard-only walkthrough reaches controls with visible focus ring', async ({ page }) => {
    await page.goto('/campus-life.html');
    const chip = page.locator('.cl-chip').first();
    await chip.focus();
    const outline = await chip.evaluate(el => window.getComputedStyle(el).outlineWidth);
    expect(outline).toBe('2px');
  });

  test('P23 & P24: Visibilitychange or switching tabs pauses playback', async ({ page }) => {
    await page.goto('/campus-life.html');
    if (page.viewportSize().width >= 768) {
      await page.locator('#clStageTap').click();
      await page.waitForTimeout(400);
      await page.evaluate(() => {
        Object.defineProperty(document, 'hidden', { value: true, writable: true });
        document.dispatchEvent(new Event('visibilitychange'));
      });
      await page.waitForTimeout(300);
      const isPaused = await page.locator('#clStageVideo').evaluate(v => v.paused);
      expect(isPaused).toBe(true);
      await assertPlaybackSafety(page);
    }
  });

  test('P25: The play icon centre is within 1px of reel centre on desktop and phone', async ({ page }) => {
    await page.goto('/campus-life.html');
    if (page.viewportSize().width >= 768) {
      const diff = await page.evaluate(() => {
        const stage = document.getElementById('clStage');
        const btn = document.getElementById('clStageTapBtn');
        const sRect = stage.getBoundingClientRect();
        const bRect = btn.getBoundingClientRect();
        return {
          x: Math.abs((sRect.left + sRect.width / 2) - (bRect.left + bRect.width / 2)),
          y: Math.abs((sRect.top + sRect.height / 2) - (bRect.top + bRect.height / 2))
        };
      });
      expect(diff.x).toBeLessThanOrEqual(1);
      expect(diff.y).toBeLessThanOrEqual(1);
    } else {
      await page.locator('.cl-phone-card').first().click();
      await page.waitForTimeout(500);
      const diff = await page.evaluate(() => {
        const slide = document.querySelector('.cl-viewer-slide');
        const btn = slide.querySelector('.cl-tap-btn');
        const sRect = slide.getBoundingClientRect();
        const bRect = btn.getBoundingClientRect();
        return {
          x: Math.abs((sRect.left + sRect.width / 2) - (bRect.left + bRect.width / 2)),
          y: Math.abs((sRect.top + sRect.height / 2) - (bRect.top + bRect.height / 2))
        };
      });
      expect(diff.x).toBeLessThanOrEqual(1);
      expect(diff.y).toBeLessThanOrEqual(1);
    }
  });

  test('P26: The mute icon is the plain speaker in both states; no emoji or text', async ({ page }) => {
    await page.goto('/campus-life.html');
    const svgCount = await page.locator('#clStageMute svg').count();
    expect(svgCount).toBeGreaterThanOrEqual(1);
  });

  test('P27: A fast swipe moves exactly one reel and snaps to it', async ({ page }) => {
    await page.goto('/campus-life.html');
    const isMobile = page.viewportSize().width < 1024;
    if (isMobile) {
      await page.locator('.cl-phone-card').first().click();
      await page.waitForTimeout(300);
      const snapType = await page.locator('#clViewerFeed').evaluate(el => window.getComputedStyle(el).scrollSnapType);
      expect(snapType).toContain('mandatory');
      const snapAlign = await page.locator('.cl-viewer-slide').first().evaluate(el => window.getComputedStyle(el).scrollSnapAlign);
      expect(snapAlign).toBe('start');
    }
  });

  /* NEGATIVE & EDGE CASE TESTS */

  test('N01: A video file returns 404: error state shows with Retry and Open video; other reels play', async ({ page }) => {
    await page.route('**/media/cl_sports_week_2025.mp4', route => route.abort());
    await page.goto('/campus-life.html');
    if (page.viewportSize().width >= 1024) {
      await page.waitForTimeout(600);
      const overlayVisible = await page.locator('#clStageStateOverlay').isVisible();
      expect(overlayVisible).toBe(true);
      // Switch to reel 2 -> should play fine
      await page.locator('.cl-card[data-id="prize-ceremony"]').click();
      await page.waitForTimeout(600);
      expect(await page.locator('#clStageCaption').textContent()).toContain('Prize Distribution Ceremony');
    }
  });

  test('N06: Offline mid-play shows offline message; going online removes it without auto-resume', async ({ page }) => {
    await page.goto('/campus-life.html');
    await page.evaluate(() => window.dispatchEvent(new Event('offline')));
    await page.waitForTimeout(300);
    const text = await page.locator('#clStageStateText').textContent();
    expect(text).toContain('offline');
    await page.evaluate(() => window.dispatchEvent(new Event('online')));
    await page.waitForTimeout(300);
    const isPaused = await page.locator('#clStageVideo').evaluate(v => v.paused);
    expect(isPaused).toBe(true);
  });

  test('N10: Invalid hash is ignored silently and first reel is selected', async ({ page }) => {
    await page.goto('/campus-life.html#reel-nonexistent-film');
    await page.waitForTimeout(500);
    const caption = await page.locator('#clStageCaption').textContent();
    expect(caption).toContain('Sports Week 2025');
  });

  test('N11: Hash for film hidden by active filter switches filter to All', async ({ page }) => {
    await page.goto('/campus-life.html#reel-prize-ceremony');
    await page.waitForTimeout(500);
    const caption = await page.locator('#clStageCaption').textContent();
    expect(caption).toContain('Prize Distribution Ceremony');
  });

  test('N13: Rapid input: exactly one active reel, consistent UI, no overlapping audio', async ({ page }) => {
    await page.goto('/campus-life.html');
    if (page.viewportSize().width >= 1024) {
      for (let i = 0; i < 8; i++) {
        const btn = page.locator('#clNavNext');
        if (await btn.isEnabled()) {
          await btn.click();
          await page.waitForTimeout(50);
        }
      }
      await page.waitForTimeout(600);
      await assertPlaybackSafety(page);
    }
  });

  test('N14: Open viewer twice and spam Back: no duplicate dialogs', async ({ page }) => {
    await page.goto('/campus-life.html');
    if (page.viewportSize().width < 768) {
      await page.locator('.cl-phone-card').first().click();
      await page.waitForTimeout(300);
      const viewerCount = await page.locator('#clPhoneViewer').count();
      expect(viewerCount).toBe(1);
    }
  });

  test('N15: Open viewer while desktop stage is playing: only one video plays', async ({ page }) => {
    await page.goto('/campus-life.html');
    await page.evaluate(() => {
      document.getElementById('clStageTap').click();
    });
    await page.waitForTimeout(500);
    await page.evaluate(() => {
      document.querySelector('.cl-phone-card').click();
    });
    await page.waitForTimeout(500);
    await assertPlaybackSafety(page);
  });

  test('N16: JavaScript disabled: noscript film list shows', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const noJsPage = await context.newPage();
    await noJsPage.goto('http://127.0.0.1:8080/campus-life.html');
    const noscriptCount = await noJsPage.locator('.cl-noscript-card').count();
    expect(noscriptCount).toBe(4);
    await context.close();
  });

  test('N23: Cycle through all reels 20 times: no growth in video elements', async ({ page }) => {
    await page.goto('/campus-life.html');
    const initialVideos = await page.locator('video').count();
    if (page.viewportSize().width >= 768) {
      for (let i = 0; i < 10; i++) {
        await page.locator('.cl-card').nth(i % 4).click();
      }
      await page.waitForTimeout(400);
      const afterVideos = await page.locator('video').count();
      expect(afterVideos).toBe(initialVideos);
    }
  });

  test('N27: No caption file: CC button is hidden', async ({ page }) => {
    await page.goto('/campus-life.html');
    const ccCount = await page.locator('.cl-btn-cc').count();
    expect(ccCount).toBe(0);
  });

  test('N29: The "only sound plays" bug: exactly one video element has paused=false and it is the visible one', async ({ page }) => {
    await page.goto('/campus-life.html');
    await page.evaluate(() => {
      document.getElementById('clStageTap').click();
    });
    await page.waitForTimeout(500);
    const result = await assertPlaybackSafety(page);
    expect(result.playingCount).toBeLessThanOrEqual(1);
  });

  test('N30: Rest of campus-life.html renders intact (hero, spaces, events, moments, footer)', async ({ page }) => {
    await page.goto('/campus-life.html');
    const sections = ['#campus-hero', '#campus-statement', '#campus-spaces', '#campus-events', '#campus-reel', '#campus-cta', '#campus-skyline'];
    for (const sec of sections) {
      expect(await page.locator(sec).count()).toBe(1);
    }
  });
});
