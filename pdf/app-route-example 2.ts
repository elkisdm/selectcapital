import { NextRequest } from 'next/server';
import { chromium } from 'playwright-core';
import Handlebars from 'handlebars';
import proposalTemplate from './proposal-template';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const compileTemplate = Handlebars.compile(proposalTemplate);

export async function POST(request: NextRequest) {
  const payload = await request.json();
  const html = compileTemplate(payload);

  const browser = await chromium.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
    await page.setContent(html, { waitUntil: 'networkidle' });
    const pdf = await page.pdf({
      printBackground: true,
      format: 'A4',
      margin: {
        top: '0.6in',
        bottom: '0.6in',
        left: '0.6in',
        right: '0.6in',
      },
    });

    return new Response(pdf, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="propuesta-select-capital.pdf"',
      },
    });
  } finally {
    await browser.close();
  }
}
