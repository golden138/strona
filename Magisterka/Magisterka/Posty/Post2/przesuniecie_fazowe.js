function waitForElement(id, callback) {
    const el = document.getElementById(id);
    if(el) {
        callback(el);
    } else {
        setTimeout(() => waitForElement(id, callback), 100);
    }
}

waitForElement("L_mp2", (slider) => {
	plotPhase();
});

function plotPhase() {
    const lambda_nm = parseFloat(document.getElementById('wavelength_mp2').value);
    const alpha = parseFloat(document.getElementById('alpha_mp2').value);
    const gamma_input = parseFloat(document.getElementById('gamma_mp2').value);
    const I0_kW = parseFloat(document.getElementById('I0_mp2').value);
    const L_mm = parseFloat(document.getElementById('L_mp2').value);

    // Konwersje jednostek
    const lambda = lambda_nm * 1e-9;
    const L = L_mm / 1000.0;
    const gamma = gamma_input * 1e-9;
    const I0 = I0_kW * 1000;

    // Stałe fizyczne
    const k = 2 * Math.PI / lambda;
    const zR = 0.01; // promień Rayleigha (1 cm)

    // Obliczenia
    const Leff = (1 - Math.exp(-alpha * L)) / alpha;
    const delta_n0 = gamma * I0;
    const delta_Phi0 = k * delta_n0 * Leff;

    // Generacja danych
    const zMin = -3 * zR;
    const zMax = 3 * zR;
    const points = 400;
    const zValues = [];
    const phiValues = [];

    for (let i = 0; i <= points; i++) {
        const z = zMin + i * (zMax - zMin) / points;
        const zNorm = z / zR;
        zValues.push(zNorm);
        const phi = delta_Phi0 / (1 + (zNorm * zNorm));
        phiValues.push(phi);
    }

    const trace = {
        x: zValues,
        y: phiValues,
        mode: 'lines',
        name: 'Delta phi(z/zR)',
        line: { width: 3, color: '#007bff' }
    };

            const layout = {
                title: {
                    text: 'Zależność przesunięcia fazowego Δphi od z/zR',
                    font: { size: 20 }
                },
                xaxis: { 
                    title: { 
                        text: 'Położenie z/zR', 
                        standoff: 20 
                    },
                    automargin: true,
                    showgrid: true,
                    zeroline: true,
                    titlefont: { size: 16 }
                },
                yaxis: { 
                    title: { 
                        text: 'Przesunięcie fazowe Δphi [rad]', 
                        standoff: 20 
                    },
                    automargin: true,
                    showgrid: true,
                    zeroline: true,
                    titlefont: { size: 16 }
                },
                margin: { t: 80, l: 80, r: 40, b: 80 },
                plot_bgcolor: '#fafafa',
                paper_bgcolor: '#ffffff'
            };

            Plotly.newPlot("plot_mp2", [trace], layout, { responsive: true });
        }
