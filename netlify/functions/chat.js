exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const API_KEY = process.env.OPENROUTER_API_KEY;
  if (!API_KEY) {
    return { statusCode: 500, body: JSON.stringify({ error: { message: 'API key no configurada.' } }) };
  }

  try {
    const body = JSON.parse(event.body);
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'HTTP-Referer': 'https://neworke.netlify.app',
        'X-Title': 'Nework IA'
      },
      body: JSON.stringify(body)
    });
    const text = await response.text();
    return {
      statusCode: response.status,
      headers: { 'Content-Type': 'text/event-stream', 'Access-Control-Allow-Origin': '*' },
      body: text
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: { message: err.message } }) };
  }
};
