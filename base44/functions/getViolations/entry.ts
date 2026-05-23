import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { civilId, type } = body;

    if (!civilId) {
      return Response.json({ error: 'civilId is required' }, { status: 400 });
    }

    const enquiryType = type === 'الشركات' ? 2 : 1;
    const timestamp = Date.now();
    const url = `https://www.moi.gov.kw/mfservices/traffic-violation/${civilId}/${enquiryType}?_=${timestamp}`;

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0',
        'Referer': 'https://www.moi.gov.kw/',
      }
    });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (_e) {
      data = { errorMsg: text || 'No violations found' };
    }
    return Response.json(data);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});