<!DOCTYPE html>
<html lang="hr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Supabase Edge Function - Dva Textboxa</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: 40px auto; padding: 20px; }
        .box-group { margin-bottom: 15px; }
        label { display: block; margin-bottom: 5px; font-weight: bold; }
        textarea { width: 100%; height: 90px; padding: 10px; box-sizing: border-box; resize: vertical; }
        button { padding: 10px 20px; background-color: #0070f3; color: white; border: none; cursor: pointer; border-radius: 4px; }
        button:hover { background-color: #0051a2; }
    </style>
</head>
<body>

    <h2>AI Asistent - Dva Textboxa</h2>
    
    <!-- Prvi tekst box: Unos pitanja -->
    <div class="box-group">
        <label for="inputPrompt">Unesi pitanje:</label>
        <textarea id="inputPrompt" placeholder="Npr. Napiši mi kratku poruku..."></textarea>
    </div>
    
    <button onclick="posaljiUpit()">Pošalji zahtjev</button>

    <!-- Drugi tekst box: Prikaz odgovora -->
    <div class="box-group" style="margin-top: 20px;">
        <label for="outputResponse">Odgovor:</label>
        <textarea id="outputResponse" placeholder="Ovdje će se pojaviti odgovor..." readonly></textarea>
    </div>

    <script>
        async function posaljiUpit() {
            console.log("-> 1. Kliknuto dugme 'Pošalji zahtjev'");
            
            const promptText = document.getElementById('inputPrompt').value;
            const responseBox = document.getElementById('outputResponse');
            
            console.log("-> 2. Uneseni tekst (prompt):", promptText);

            if (!promptText.trim()) {
                console.warn("-> Upozorenje: Polje za tekst je prazno!");
                alert("Molimo unesite tekst u polje za pitanje!");
                return;
            }

            responseBox.value = "Slanje zahtjeva i čekanje na odgovor...";

            // Tvoja tačna Supabase Edge funkcija
            const FUNCTION_URL = 'https://lvvidixbdtdjfwxxxqzr.supabase.co/functions/v1/MPOBILLNI_ASISTNET';
            
            // Tvoj Supabase anon ključ
            const SUPABASE_ANON_KEY = 'sb_publishable_DMELD0DRGcKD9u12lowjgw_sPBaLqhT';

            try {
                console.log("-> 3. Šaljem Fetch POST zahtjev prema URL-u:", FUNCTION_URL);
                
                const response = await fetch(FUNCTION_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
                    },
                    body: JSON.stringify({ prompt: promptText })
                });

                console.log("-> 4. Primljen HTTP status odgovora:", response.status);

                const data = await response.json();
                console.log("-> 5. Parsirani JSON podaci sa servera:", data);

                if (!response.ok) {
                    throw new Error(data.error || "Greška prilikom komunikacije sa serverom.");
                }

                // Parsiranje odgovora zavisno od strukture koju funkcija vraća
                if (data.choices && data.choices[0] && data.choices[0].message) {
                    responseBox.value = data.choices[0].message.message;
                    console.log("-> 6. Uspješno postavljen odgovor (struktura choices).");
                } else if (data.message) {
                    responseBox.value = data.message;
                    console.log("-> 6. Uspješno postavljen odgovor (struktura message).");
                } else {
                    console.log("-> 6. Nepoznata struktura, ispisujem cijeli objekt u box.");
                    responseBox.value = JSON.stringify(data, null, 2);
                }

            } catch (error) {
                console.error("-> X. Uhvaćena greška (Catch):", error);
                responseBox.value = "Greška: " + error.message;
            }
        }
    </script>

</body>
</html>
