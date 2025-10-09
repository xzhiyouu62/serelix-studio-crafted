export default {
  async fetch(request, env) {
    // Get origin for CORS
    const origin = request.headers.get('Origin');
    
    if (request.method === 'OPTIONS') {
      return handleOptions(origin);
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { 
        status: 405,
        headers: {
          'Access-Control-Allow-Origin': origin || '*',
        }
      });
    }

    try {
      console.log('Received request from origin:', origin);
      
      const data = await request.json();
      console.log('Received data:', JSON.stringify(data));
      
      const { name, email, subject, message, latitude, longitude, locationType, locationError } = data;

      if (!name || !email || !subject || !message) {
        console.error('Missing required fields');
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

      // 準備地理位置資訊
      let locationField = { name: '📍 Location', value: 'Not available', inline: false };
      
      if (latitude && longitude) {
        const googleMapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
        const locationTypeEmoji = locationType === 'gps' ? '🎯' : locationType === 'ip' ? '🌐' : '📍';
        const locationTypeText = locationType === 'gps' ? 'GPS (Precise Location)' : 
                                 locationType === 'ip' ? 'IP-based (Estimated Location)' : 
                                 'Unknown';
        locationField.value = `${locationTypeEmoji} **Type:** ${locationTypeText}\n` +
                             `**Latitude:** ${latitude.toFixed(6)}\n` +
                             `**Longitude:** ${longitude.toFixed(6)}\n` +
                             `[📌 View on Google Maps](${googleMapsLink})`;
      } else if (locationError) {
        locationField.value = `❌ Unable to get location: ${locationError}`;
      }
      
      // 額外加入 IP 地址資訊
      let ipField = { name: '🌐 IP Address', value: clientIP || 'Unknown', inline: true };

      const discordMessage = {
        content: 'New Contact Form Submission',
        embeds: [{
          title: 'New Contact Message!!!!',
          color: 0x3498db,
          fields: [
            { name: 'Name', value: cleanName, inline: true },
            { name: 'Email', value: cleanEmail, inline: true },
            { name: 'Subject', value: cleanSubject, inline: false },
            { name: 'Message', value: cleanMessage, inline: false },
            locationField,
            ipField
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

      console.log('Sending to Discord webhook...');
      const discordResponse = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(discordMessage)
      });

      console.log('Discord response status:', discordResponse.status);
      
      if (!discordResponse.ok) {
        const discordError = await discordResponse.text();
        console.error('Discord error:', discordError);
        throw new Error(`Discord API error: ${discordResponse.status} - ${discordError}`);
      }

      console.log('Message sent successfully');
      return jsonResponse({ 
        success: true, 
        message: 'Message sent successfully' 
      }, 200, origin);

    } catch (error) {
      console.error('Error:', error);
      console.error('Error stack:', error.stack);
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
    'http://127.0.0.1:8080',
    'http://localhost:5173',
    'http://127.0.0.1:5173'
  ];
  
  const headers = {
    'Access-Control-Allow-Origin': origin || '*',
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
    'http://127.0.0.1:8080',
    'http://localhost:5173',
    'http://127.0.0.1:5173'
  ];
  
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': origin || '*',
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
