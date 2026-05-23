import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { password } = body;

    const correctPassword = Deno.env.get("DASHBOARD_PASSWORD");
    
    if (!correctPassword) {
      return Response.json({ error: "Password not configured" }, { status: 500 });
    }

    if (password === correctPassword) {
      return Response.json({ success: true });
    } else {
      return Response.json({ success: false, error: "Incorrect password" }, { status: 401 });
    }
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});