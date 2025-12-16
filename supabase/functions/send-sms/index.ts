import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  // 1. Handle CORS (so your frontend can call this)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    } })
  }

  try {
    // 2. Get the phone number and message from the request body
    const { phone, message } = await req.json()

    // 3. Get your Secrets (we will set these in the next step)
    const API_KEY = Deno.env.get('TEXTBEE_API_KEY')
    const DEVICE_ID = Deno.env.get('TEXTBEE_DEVICE_ID')

    if (!phone || !message) {
      throw new Error("Missing phone or message")
    }

    // 4. Send Request to TextBee API
    const res = await fetch(`https://api.textbee.dev/api/v1/gateway/devices/${DEVICE_ID}/sendSMS`, {
      method: 'POST',
      headers: {
        'x-api-key': API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recipients: [phone],
        message: message,
      }),
    })

    const data = await res.text()

    return new Response(data, {
      headers: { "Content-Type": "application/json", 'Access-Control-Allow-Origin': '*' }
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { "Content-Type": "application/json", 'Access-Control-Allow-Origin': '*' }
    })
  }
})
