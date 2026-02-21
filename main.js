// Renderizado inicial de tarjetas (Requisito 3 del PDF)
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
                        <button class="btn btn-dark w-100" onclick="verDetalle(${lugar.id})">Ver Detalles</button>
                    </div>
                </div>
            </div>
        `;
    });
}

// Función de cálculo (Requisito 4 y Rúbrica del PDF)
function calcularStats(pronostico) {
    let minS = pronostico[0].min;
    let maxS = pronostico[0].max;
    let sumaTemps = 0; // Requisito 164 del PDF
    
    // Conteo por tipo de clima (Requisito de la Rúbrica)
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
    
    // Lógica condicional (Requisito 4.4 del PDF)
    let resumen = conteoClima["Soleado"] >= 4 
        ? "Semana mayormente despejada, ideal para salir." 
        : "Semana con clima variable, se recomienda precaución.";

    return { minS, maxS, promedio, resumen, conteoClima };
}

// Función para mostrar detalle (Requisito 4.1 y 4.2 del PDF)
function verDetalle(idLugar) {
    const lugar = lugares.find(l => l.id === idLugar); // Uso de find (Requisito 4.1)
    const stats = calcularStats(lugar.pronosticoSemanal);

    document.getElementById("home").classList.add("d-none");
    const detalleSection = document.getElementById("detalle");
    detalleSection.classList.remove("d-none");

    detalleSection.innerHTML = `
        <div class="container p-4">
            <button class="btn btn-outline-secondary mb-4" onclick="location.reload()">← Volver</button>
            <div class="row g-4">
                <div class="col-md-5">
                    <div class="card p-4 shadow-sm border-0 bg-dark text-white text-center">
                        <h2 class="fw-bold">${lugar.nombre}</h2>
                        <p class="display-1 my-3">${lugar.tempActual}°C</p>
                        <p class="h4">${lugar.estadoActual}</p>
                    </div>
                </div>
                <div class="col-md-7">
                    <div class="card p-4 shadow-sm border-0 h-100">
                        <h4 class="mb-4 border-bottom pb-2">Estadísticas Semanales</h4>
                        <div class="row text-center mb-4">
                            <div class="col-4">
                                <small class="text-muted d-block">Mínima</small>
                                <span class="h5">${stats.minS}°C</span>
                            </div>
                            <div class="col-4 border-start border-end">
                                <small class="text-muted d-block">Máxima</small>
                                <span class="h5">${stats.maxS}°C</span>
                            </div>
                            <div class="col-4">
                                <small class="text-muted d-block">Promedio</small>
                                <span class="h5">${stats.promedio}°C</span>
                            </div>
                        </div>
                        <div class="bg-light p-3 rounded mb-3">
                            <h6>Tipos de clima encontrados:</h6>
                            <p class="mb-0">☀️ Soleados: ${stats.conteoClima["Soleado"]} | ☁️ Nublados: ${stats.conteoClima["Nublado"]} | 🌧️ Lluviosos: ${stats.conteoClima["Lluvioso"]}</p>
                        </div>
                        <div class="alert alert-info mb-0">${stats.resumen}</div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

renderizarHome();
