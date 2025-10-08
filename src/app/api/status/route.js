// Status endpoint for appen. 
// Alle routes går under app/api/<routeNavn>/route.js
// http://localhost:3000/api/status for å se reponse 
export async function GET() {
    return new Response(JSON.stringify({ ok: true, ts: Date.now() }), {
      headers: { "content-type": "application/json" },
      status: 200,
    });
  }
  