const contenedor = document.getElementById("contenedor-lugares");

function renderizarHome() {
    if (!contenedor) return;
    contenedor.innerHTML = "";
    lugares.forEach(lugar => {
        contenedor.innerHTML += `
            <div class="col-md-4 mb-4">
                <div class="card h-100 shadow-sm border-0">
                    <div class="card-body text-center">
                        <h5 class="card-title fw-bold">${lugar.nombre}</h5>
                        <p class="card-text display-6 my-3">${lugar.tempActual}°C</p>
                        <p class="badge bg-primary rounded-pill mb-3">${lugar.estadoActual}</p>
                        <br>
                        <button class="btn btn-dark w-100" onclick="verDetalle(${lugar.id})">Ver Pronóstico</button>
                    </div>
                </div>
            </div>
        `;
    });
}

function calcularStats(pronostico) {
    let minS = pronostico[0].min;
    let maxS = pronostico[0].max;
    let sumaTemps = 0; 
    let conteoClima = { "Soleado": 0, "Nublado": 0, "Lluvioso": 0 };

    for (let dia of pronostico) {
        if (dia.min < minS) minS = dia.min;
        if (dia.max > maxS) maxS = dia.max;
        sumaTemps += (dia.min + dia.max) / 2;
        if (conteoClima[dia.estado] !== undefined) {
            conteoClima[dia.estado]++;
        }
    }

    const promedio = (sumaTemps / pronostico.length).toFixed(1);
    let resumen = conteoClima["Soleado"] >= 4 ? "Semana mayormente soleada." : "Clima variable.";

    return { minS, maxS, promedio, resumen, conteoClima };
}

function verDetalle(idLugar) {
    const lugar = lugares.find(l => l.id === idLugar);
    const stats = calcularStats(lugar.pronosticoSemanal);

    document.getElementById("home").classList.add("d-none");
    const detalleSection = document.getElementById("detalle");
    detalleSection.classList.remove("d-none");

    detalleSection.innerHTML = `
        <div class="container p-4">
            <button class="btn btn-outline-secondary mb-4" onclick="location.reload()">← Volver</button>
            <div class="card p-4 shadow-sm border-0 bg-light">
                <h2 class="fw-bold">${lugar.nombre}</h2>
                <hr>
                <div class="row text-center mb-4">
                    <div class="col-4"><strong>Mínima</strong><br>${stats.minS}°C</div>
                    <div class="col-4"><strong>Máxima</strong><br>${stats.maxS}°C</div>
                    <div class="col-4"><strong>Promedio</strong><br>${stats.promedio}°C</div>
                </div>
                <div class="p-3 bg-white rounded shadow-sm">
                    <h6>Conteo Semanal:</h6>
                    <p class="mb-0">☀️ Soleados: ${stats.conteoClima["Soleado"]} | ☁️ Nublados: ${stats.conteoClima["Nublado"]} | 🌧️ Lluviosos: ${stats.conteoClima["Lluvioso"]}</p>
                </div>
                <div class="alert alert-info mt-3">${stats.resumen}</div>
            </div>
        </div>
    `;
}

renderizarHome();
