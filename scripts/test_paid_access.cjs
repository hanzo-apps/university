const { chromium } = require('playwright');
const path = require('path');

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1400, height: 900 },
    deviceScaleFactor: 2,
  });

  const page = await context.newPage();
  console.log('--- TEST 1: Unauthenticated user visiting /portal ---');
  await page.goto('http://localhost:3003/portal', { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    localStorage.clear();
  });
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  const authRequiredText = await page.textContent('body');
  if (authRequiredText.includes('AUTHENTICATION REQUIRED') && authRequiredText.includes('Sign in to access your Learning Workstation')) {
    console.log('✓ PASS: Unauthenticated user sees authentication gate');
  } else {
    console.error('✗ FAIL: Expected authentication gate');
  }
  await page.screenshot({ path: path.join(process.env.HOME, 'Desktop', 'test-1-unauth.png') });

  console.log('\n--- TEST 2: Authenticated user with ZERO paid courses ---');
  await page.evaluate(() => {
    localStorage.setItem('hanzo_portal_student_handle', 'teststudent');
    localStorage.setItem('hanzo_portal_student_name', 'Test Student');
    localStorage.setItem('hanzo_portal_student_email', 'test@hanzo.ai');
    localStorage.setItem('hanzo_portal_enrolled_courses', JSON.stringify([]));
    localStorage.removeItem('hanzo_portal_selected_course');
  });
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const zeroPaidContent = await page.textContent('body');
  const hasCourseLocked = zeroPaidContent.includes('COURSE ACCESS LOCKED') || zeroPaidContent.includes('Enrollment Required');
  const hasEnrollCTA = zeroPaidContent.includes('Enroll in ENG 100');
  const hasSandbox = zeroPaidContent.includes('alex@hanzo-sandbox') || zeroPaidContent.includes('teststudent@hanzo-sandbox');

  if (hasCourseLocked && hasEnrollCTA && !hasSandbox) {
    console.log('✓ PASS: User with 0 paid courses sees locked paywall, enrollment CTA, and sandbox is NOT accessible');
  } else {
    console.error(`✗ FAIL: hasCourseLocked=${hasCourseLocked}, hasEnrollCTA=${hasEnrollCTA}, hasSandbox=${hasSandbox}`);
  }
  await page.screenshot({ path: path.join(process.env.HOME, 'Desktop', 'test-2-zero-paid-locked.png') });

  console.log('\n--- TEST 3: User who only paid for agentic-coding ---');
  await page.evaluate(() => {
    localStorage.setItem('hanzo_portal_enrolled_courses', JSON.stringify(['agentic-coding']));
    localStorage.setItem('hanzo_portal_selected_course', 'agentic-coding');
  });
  await page.goto('http://localhost:3003/portal?course=agentic-coding', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const agenticContent = await page.textContent('body');
  const hasMicroVM = agenticContent.includes('teststudent@hanzo-sandbox') || agenticContent.includes('hanzo-sandbox');
  const hasAutograder = agenticContent.includes('STEP-BY-STEP CREDENTIAL PATHWAY') || agenticContent.includes('Run Current Lab');
  const isAgenticUnlocked = !agenticContent.includes('COURSE ACCESS LOCKED');

  if (hasMicroVM && isAgenticUnlocked) {
    console.log('✓ PASS: agentic-coding is UNLOCKED with full microVM terminal and coursework');
  } else {
    console.error(`✗ FAIL: hasMicroVM=${hasMicroVM}, isAgenticUnlocked=${isAgenticUnlocked}`);
  }
  await page.screenshot({ path: path.join(process.env.HOME, 'Desktop', 'test-3-agentic-unlocked.png') });

  console.log('\n--- TEST 4: Same user tries to access UNPAID course (reinforcement-learning) ---');
  await page.goto('http://localhost:3003/portal?course=reinforcement-learning', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const rlContent = await page.textContent('body');
  const isRlLocked = rlContent.includes('COURSE ACCESS LOCKED') && rlContent.includes('Enrollment Required to Access RL 101');
  const hasActiveEnrollmentLink = rlContent.includes('YOUR ACTIVELY ENROLLED COURSES') && rlContent.includes('Open ENG 100');
  const hasRlEnrollCTA = rlContent.includes('Enroll in RL 101');

  if (isRlLocked && hasActiveEnrollmentLink && hasRlEnrollCTA) {
    console.log('✓ PASS: reinforcement-learning is LOCKED with paywall and shows link to return to enrolled ENG 100');
  } else {
    console.error(`✗ FAIL: isRlLocked=${isRlLocked}, hasActiveEnrollmentLink=${hasActiveEnrollmentLink}, hasRlEnrollCTA=${hasRlEnrollCTA}`);
  }
  await page.screenshot({ path: path.join(process.env.HOME, 'Desktop', 'test-4-rl-locked-for-agentic-user.png') });

  console.log('\n--- TEST 5: Syllabus page CourseView enrollment buttons ---');
  await page.goto('http://localhost:3003/agentic-coding', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  const engViewContent = await page.textContent('body');
  const engShowsEnrolled = engViewContent.includes('Already Enrolled') || engViewContent.includes('ENROLLED STUDENT');

  await page.goto('http://localhost:3003/reinforcement-learning', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  const rlViewContent = await page.textContent('body');
  const rlShowsEnrollButton = rlViewContent.includes('Enroll in RL 101');

  if (engShowsEnrolled && rlShowsEnrollButton) {
    console.log('✓ PASS: /agentic-coding shows "Already Enrolled" and /reinforcement-learning shows "Enroll in RL 101"');
  } else {
    console.error(`✗ FAIL: engShowsEnrolled=${engShowsEnrolled}, rlShowsEnrollButton=${rlShowsEnrollButton}`);
  }

  console.log('\n--- TEST 6: User pays for reinforcement-learning (multi-course enrollment) ---');
  await page.evaluate(() => {
    localStorage.setItem('hanzo_portal_enrolled_courses', JSON.stringify(['agentic-coding', 'reinforcement-learning']));
  });
  await page.goto('http://localhost:3003/portal?course=reinforcement-learning', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const rlPaidContent = await page.textContent('body');
  const rlNowUnlocked = !rlPaidContent.includes('COURSE ACCESS LOCKED') && (rlPaidContent.includes('teststudent@hanzo-sandbox') || rlPaidContent.includes('hanzo-sandbox'));

  await page.goto('http://localhost:3003/portal?course=agentic-coding', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  const agenticStillPaid = await page.textContent('body');
  const agenticStillUnlocked = !agenticStillPaid.includes('COURSE ACCESS LOCKED');

  await page.goto('http://localhost:3003/portal?course=systems-engineering', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  const sysContent = await page.textContent('body');
  const sysLocked = sysContent.includes('COURSE ACCESS LOCKED') && sysContent.includes('SYS 103');

  if (rlNowUnlocked && agenticStillUnlocked && sysLocked) {
    console.log('✓ PASS: Both agentic-coding and reinforcement-learning are UNLOCKED, systems-engineering is LOCKED');
  } else {
    console.error(`✗ FAIL: rlNowUnlocked=${rlNowUnlocked}, agenticStillUnlocked=${agenticStillUnlocked}, sysLocked=${sysLocked}`);
  }
  await page.screenshot({ path: path.join(process.env.HOME, 'Desktop', 'test-6-multi-course-unlocked.png') });

  await browser.close();
  console.log('\nALL TESTS COMPLETE!');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
