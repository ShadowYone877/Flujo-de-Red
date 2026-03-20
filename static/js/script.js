async function iniciarAnimacion() {
    const msjInput = document.getElementById('mensaje');
    const texto = msjInput.value;
    
    // Validación inicial
    if (!texto) {
        alert("Por favor, escribe un mensaje para simular el envío.");
        return;
    }

    // Bloquear el botón para evitar múltiples clics durante la animación
    const btn = document.querySelector('button');
    btn.disabled = true;

    try {
        // 1. OBTENER DATOS DE FLASK
        // Enviamos el mensaje al servidor para que genere los headers de cada capa
        const response = await fetch('/procesar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mensaje: texto })
        });
        const capas = await response.json();

        // Limpiar estados previos de las capas (por si se corre la animación varias veces)
        document.querySelectorAll('.capa').forEach(div => {
            div.classList.remove('activa');
            div.style.backgroundColor = "";
            div.style.borderColor = "";
        });

        // --- FASE 1: ENCAPSULAMIENTO (EMISOR - Baja de 7 a 1) ---
        for (let i = 0; i < capas.length; i++) {
            const numeroCapa = 7 - i;
            const div = document.getElementById(`e-${numeroCapa}`);
            
            div.classList.add('activa');
            // Insertamos la info real de la capa i
            div.innerHTML = `<b>Capa ${numeroCapa} (${capas[i].nombre}):</b><br>${capas[i].info}`;
            
            await new Promise(r => setTimeout(r, 800));
            // Dejamos la última capa encendida para conectar con la red
            if (i < 6) div.classList.remove('activa');
        }

        // --- FASE 2: TRÁNSITO POR LA RED (INTERNET) ---
        const red = document.getElementById('red-anim');
        red.classList.add('red-viva');
        await new Promise(r => setTimeout(r, 1200));
        red.classList.remove('red-viva');
        // Apagamos la última capa del emisor al "salir" el dato
        document.getElementById('e-1').classList.remove('activa');

        // --- FASE 3: DESENCAPSULAMIENTO (RECEPTOR - Sube de 1 a 7) ---
        // Recorremos el array de capas a la inversa (de la última posición a la primera)
        for (let i = capas.length - 1; i >= 0; i--) {
            const numeroCapa = 7 - i; // Esto nos da 1, 2, 3... hasta 7
            const div = document.getElementById(`r-${numeroCapa}`);
            
            div.classList.add('activa');
            
            // Lógica especial para la capa final (Aplicación)
            if (i === 0) {
                div.innerHTML = `<b>MENSAJE RECIBIDO EN FB:</b><br>"${texto}"`;
                div.style.backgroundColor = "#d4edda"; // Verde éxito
                div.style.borderColor = "#28a745";
            } else {
                // Mostramos la info técnica que el servidor está "leyendo"
                div.innerHTML = `<b>Capa ${numeroCapa} (${capas[i].nombre}):</b><br>${capas[i].info}`;
                await new Promise(r => setTimeout(r, 800));
                div.classList.remove('activa');
            }
        }

    } catch (error) {
        console.error("Error en la simulación:", error);
        alert("Hubo un error al conectar con el servidor Flask.");
    } finally {
        // Reactivamos el botón al terminar
        btn.disabled = false;
    }
}