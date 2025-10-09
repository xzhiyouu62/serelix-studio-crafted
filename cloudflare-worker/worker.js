export default {
  async fetch(request, env) {
    // Get origin for CORS
    const origin = request.headers.get('Origin');
    
    if (request.method === 'OPTIONS') {
      return handleOptions(origin);
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    try {
      const data = await request.json();
      const { name, email, subject, message } = data;

      if (!name || !email || !subject || !message) {
        return jsonResponse({ error: 'All fields are required' }, 400, origin);
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return jsonResponse({ error: 'Invalid email format' }, 400, origin);
      }

      if (name.length > 100 || email.length > 100 || 
          subject.length > 200 || message.length > 2000) {
        return jsonResponse({ error: 'Input too long' }, 400, origin);
      }

      const clientIP = request.headers.get('CF-Connecting-IP');
      const rateLimitKey = `ratelimit_${clientIP}`;
      
      const cleanName = sanitize(name);
      const cleanEmail = sanitize(email);
      const cleanSubject = sanitize(subject);
      const cleanMessage = sanitize(message);

      const discordMessage = {
        content: 'New Contact Form Submission',
        embeds: [{
          title: 'New Contact Message!!!!',
          color: 0x3498db,
          fields: [
            { name: 'Name', value: cleanName, inline: true },
            { name: 'Email', value: cleanEmail, inline: true },
            { name: 'Subject', value: cleanSubject, inline: false },
            { name: 'Message', value: cleanMessage, inline: false }
          ],
          footer: {
            text: `From IP: ${clientIP}`
          },
          timestamp: new Date().toISOString()
        }]
      };

      const webhookUrl = env.DISCORD_WEBHOOK_URL;
      
      if (!webhookUrl) {
        console.error('DISCORD_WEBHOOK_URL not configured');
        return jsonResponse({ error: 'Server configuration error' }, 500, origin);
      }

      const discordResponse = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(discordMessage)
      });

      if (!discordResponse.ok) {
        throw new Error('Failed to send to Discord');
      }

      return jsonResponse({ 
        success: true, 
        message: 'Message sent successfully' 
      }, 200, origin);

    } catch (error) {
      console.error('Error:', error);
      return jsonResponse({ 
        error: 'Failed to send message',
        details: error.message 
      }, 500, origin);
    }
  }
};

function handleOptions(origin) {
  const allowedOrigins = [
    'https://serelix.xyz',
    'https://www.serelix.xyz',
    'http://localhost:8080',
    'http://127.0.0.1:8080'
  ];
  
  const headers = {
    'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : 'https://serelix.xyz',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };

  return new Response(null, { headers });
}

function jsonResponse(data, status = 200, origin = '') {
  const allowedOrigins = [
    'https://serelix.xyz',
    'https://www.serelix.xyz',
    'http://localhost:8080',
    'http://127.0.0.1:8080'
  ];
  
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : 'https://serelix.xyz',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}

function sanitize(input) {
  return input
    .replace(/[<>]/g, '')
    .trim()
    .substring(0, 2000);
}
