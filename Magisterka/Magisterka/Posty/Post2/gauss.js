function waitForElement(id, callback) {
    const el = document.getElementById(id);
    if(el) {
        callback(el);
    } else {
        setTimeout(() => waitForElement(id, callback), 100);
    }
}

waitForElement("zSlider", (slider) => {
    const zValue = document.getElementById("zValue");
    const lambdaInput = document.getElementById("lambdaInput");
    const w0Input = document.getElementById("w0Input");
    const E0Input = document.getElementById("E0Input");
    const updateBtn = document.getElementById("updateBtn");

    function drawPlot(zFactor) {
        zValue.textContent = zFactor.toFixed(1);

        const lam = parseFloat(lambdaInput.value) * 1e-9;  // nm → m
        const w0 = parseFloat(w0Input.value) * 1e-3;       // mm → m
        const E0 = parseFloat(E0Input.value);

        const zR = Math.PI * w0 * w0 / lam;

        function w(z) { return w0 * Math.sqrt(1 + (z / zR) ** 2); }

        const r = Array.from({ length: 400 }, (_, i) => -3 * w0 + (6 * w0 * i) / 399);
        const E = r.map(ri => E0 * (w0 / w(zFactor * zR)) * Math.exp(- (ri * ri) / (w(zFactor * zR) ** 2)));
        const r_mm = r.map(x => x * 1e3);

        const trace = {
            x: r_mm,
            y: E,
            type: "scatter",
            mode: "lines",
            line: { color: "blue" },
            name: "|E(r,z)|"
        };

        const layout = {
            title: `|E(r,z)| dla z = ${zFactor.toFixed(1)} · zR (zR = ${(zR*1e3).toFixed(3)} mm)`,
            xaxis: { title: "r [mm]" },
            yaxis: { title: "Amplituda" },
            margin: { t: 60 }
        };

        Plotly.newPlot("plot", [trace], layout, {responsive: true});
    }

    // Listener do slidera
    slider.addEventListener("input", () => {
        drawPlot(parseFloat(slider.value));
    });

    // Listener do przycisku update
    updateBtn.addEventListener("click", () => {
        drawPlot(parseFloat(slider.value));
        console.log("Wykres zaktualizowany po kliknięciu updateBtn");
    });

    // --- Rysujemy od razu przy starcie ---
    drawPlot(parseFloat(slider.value));

    console.log("Listener slidera i updateBtn aktywne, wykres narysowany");
});
