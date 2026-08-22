export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Samo POST zahtjevi su dozvoljeni' });
  }

  try {
    let promptText = "";

    // Provjeri da li je poslato kao JSON ili kao običan tekst
    if (typeof req.body === 'string') {
      try {
        const parsed = JSON.parse(req.body);
        promptText = parsed.prompt || req.body;
      } catch (e) {
        promptText = req.body;
      }
    } else if (req.body && req.body.prompt) {
      promptText = req.body.prompt;
    } else {
      promptText = JSON.stringify(req.body);
    }

    const supabaseResponse = await fetch('https://lvvidixbdtdjfwxxxqzr.supabase.co/functions/v1/MPOBILLNI_ASISTNET', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer sb_publishable_DMELD0DRGcKD9u12lowjgw_sPBaLqhT'
      },
      body: JSON.stringify({ prompt: promptText })
    });

    const data = await supabaseResponse.json();
    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
