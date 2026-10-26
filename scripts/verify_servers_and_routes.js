const fetch = globalThis.fetch || require('node-fetch');

async function verifyServers() {
  console.log('==============================================');
  console.log('VERIFYING FRONTEND, BACKEND & VITE PROXY');
  console.log('==============================================');

  // 1. Backend direct
  try {
    const beRes = await fetch('http://localhost:5000/api/health');
    const beData = await beRes.json();
    console.log('[PASS] Backend direct GET http://localhost:5000/api/health ->', beRes.status, beData.data);
  } catch (err) {
    console.error('[FAIL] Backend direct connection error:', err.message);
  }

  // 2. Frontend root HTML
  try {
    const feRes = await fetch('http://localhost:5173/');
    const html = await feRes.text();
    const hasRoot = html.includes('id="root"');
    const hasScript = html.includes('/src/main.jsx');
    const hasFonts = html.includes('Saans.woff2');
    console.log('[PASS] Frontend root GET http://localhost:5173/ ->', feRes.status);
    console.log('       - Contains <div id="root">: ', hasRoot);
    console.log('       - Contains /src/main.jsx:   ', hasScript);
    console.log('       - Preloads Saans font:      ', hasFonts);
  } catch (err) {
    console.error('[FAIL] Frontend connection error:', err.message);
  }

  // 3. Vite proxy to Backend (/api)
  try {
    const proxyRes = await fetch('http://localhost:5173/api/health');
    const proxyData = await proxyRes.json();
    console.log('[PASS] Vite proxy GET http://localhost:5173/api/health ->', proxyRes.status, proxyData.data);
  } catch (err) {
    console.error('[FAIL] Vite proxy error:', err.message);
  }

  // 4. Test public static assets served by frontend
  const assetsToTest = [
    '/fonts/Saans.woff2',
    '/fonts/Saans-Mono.woff2',
    '/favicon.svg',
    '/favicon.ico',
    '/print.svg',
    '/robots.txt',
    '/sitemap.xml',
    '/blueprint.cdn.prismic.io/blueprint/aOx7i55xUNkB13e__JavaScript.svg',
    '/images.prismic.io/blueprint/aP_OD7pReVYa3ua1_PushPress.jpg'
  ];

  console.log('\n--- Checking Public Assets on Vite Dev Server (port 5173) ---');
  for (const asset of assetsToTest) {
    try {
      const res = await fetch(`http://localhost:5173${asset}`);
      const contentType = res.headers.get('content-type');
      if (res.status === 200) {
        console.log(`[PASS] Asset ${asset} -> 200 OK (${contentType})`);
      } else {
        console.log(`[FAIL] Asset ${asset} -> ${res.status}`);
      }
    } catch (e) {
      console.log(`[FAIL] Asset ${asset} -> ${e.message}`);
    }
  }

  // 5. Test frontend SPA fallback on deep routes
  const routesToTest = [
    '/jobs',
    '/jobs/senior-frontend-engineer',
    '/companies',
    '/talent-match',
    '/scheduler',
    '/signin',
    '/signup',
    '/profile/candidate',
    '/dashboard/recruiter',
    '/admin',
    '/settings',
    '/about',
    '/services-overview',
    '/approach',
    '/case-studies',
    '/contact',
    '/privacy',
    '/terms'
  ];

  console.log('\n--- Checking SPA Client-Side Routes on Vite Dev Server ---');
  let routeFailures = 0;
  for (const route of routesToTest) {
    try {
      const res = await fetch(`http://localhost:5173${route}`);
      const text = await res.text();
      const servesIndex = text.includes('id="root"');
      if (res.status === 200 && servesIndex) {
        console.log(`[PASS] Route ${route.padEnd(32)} -> 200 OK (SPA Shell Served)`);
      } else {
        console.log(`[FAIL] Route ${route} -> Status ${res.status}`);
        routeFailures++;
      }
    } catch (e) {
      console.log(`[FAIL] Route ${route} -> ${e.message}`);
      routeFailures++;
    }
  }

  console.log(`\nSPA Routes check complete: ${routesToTest.length - routeFailures}/${routesToTest.length} passed.`);
}

verifyServers();
