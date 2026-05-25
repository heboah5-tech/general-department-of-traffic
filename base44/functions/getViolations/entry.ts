import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { civilId, type } = await req.json();

    if (!civilId) {
      return Response.json({ error: 'civilId is required' }, { status: 400 });
    }

    const enquiryType = type === "الشركات" ? "2" : "1";

    const response = await fetch(
      `https://www.moi.gov.kw/MOI_Services/TrafficInquiry/TrafficInquiry.aspx?CivilID=${civilId}&EnquiryType=${enquiryType}`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json, text/plain, */*',
        }
      }
    );

    let data;
    try {
      data = await response.json();
    } catch {
      const text = await response.text();
      data = { error: text };
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});