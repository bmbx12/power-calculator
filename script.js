// Night mode toggle
const nightToggle = document.getElementById('nightToggle');
nightToggle.addEventListener('change', () => {
  document.body.classList.toggle('night-mode', nightToggle.checked);
});

// Resistance (Ω/km) for common AWG sizes
const awgResistances = {
  14: 8.285,
  12: 5.211,
  10: 3.277,
  8: 2.061,
  6: 1.296
};

// AWG conductor cross-sectional area in square inches
const awgAreas = {
  14: 0.0133,
  12: 0.0201,
  10: 0.0324,
  8:  0.0513,
  6:  0.0810
};

// Core elements
const calcType = document.getElementById('calcType');
const calcForm = document.getElementById('calculatorForm');

// Registry of calculator definitions
const calculators = {
  three: {
    form: `
      <h2>Three-Phase Power</h2>
      <label>Line Voltage (V): <input id="tp-volts" type="number" /></label>
      <label>Amps (A): <input id="tp-amps" type="number" /></label>
      <label>Conductor (AWG):
        <select id="vd3-gauge">
          <option value="14">14 AWG</option>
          <option value="12">12 AWG</option>
          <option value="10">10 AWG</option>
          <option value="8">8 AWG</option>
          <option value="6">6 AWG</option>
        </select>
      </label>
      <label>Power Factor (0-1): <input id="vd3-pf" type="number" step="0.01" min="0" max="1" /></label>
      <button id="tpBtn">Calculate Power</button>
      <p id="tp-result"></p>
    `,
    init: () => {
      document.getElementById('tpBtn').addEventListener('click', () => {
        const V = parseFloat(document.getElementById('tp-volts').value);
        const I = parseFloat(document.getElementById('tp-amps').value);
        const gauge = parseInt(document.getElementById('vd3-gauge').value, 10);
        const PF = parseFloat(document.getElementById('vd3-pf').value);
        const out = document.getElementById('tp-result');
        if (isNaN(V) || isNaN(I) || isNaN(PF) || PF < 0 || PF > 1) {
          out.textContent = 'Enter valid numbers and PF between 0 and 1.';
          return;
        }
        out.textContent = `Power: ${(Math.sqrt(3) * V * I * PF).toFixed(2)} W`;
      });
    }
  },
  convert: {
    form: `
      <h2>Unit Conversion</h2>
      <label>Value: <input id="conv-value" type="number" /></label>
      <label>From:
        <select id="conv-from">
          <option value="W">Watts (W)</option>
          <option value="kW">Kilowatts (kW)</option>
          <option value="HP">Horsepower (HP)</option>
        </select>
      </label>
      <label>To:
        <select id="conv-to">
          <option value="W">Watts (W)</option>
          <option value="kW">Kilowatts (kW)</option>
          <option value="HP">Horsepower (HP)</option>
        </select>
      </label>
      <button id="convBtn">Convert</button>
      <p id="conv-result"></p>
    `,
    init: () => {
      document.getElementById('convBtn').addEventListener('click', () => {
        const val = parseFloat(document.getElementById('conv-value').value);
        const from = document.getElementById('conv-from').value;
        const to = document.getElementById('conv-to').value;
        const out = document.getElementById('conv-result');
        if (isNaN(val)) {
          out.textContent = 'Enter a valid number!';
          return;
        }
        let watts = from === 'W' ? val : from === 'kW' ? val * 1000 : val * 745.7;
        let result = to === 'W' ? watts : to === 'kW' ? watts / 1000 : watts / 745.7;
        out.textContent = `${result.toFixed(4)} ${to}`;
      });
    }
  },
  vdrop1: {
    form: `
      <h2>Voltage Drop (Single-Phase)</h2>
      <label>Amps (A): <input id="vd1-amps" type="number" /></label>
      <label>Length (m): <input id="vd1-length" type="number" /></label>
      <label>Conductor (AWG):
        <select id="vd1-gauge">
          <option value="14">14 AWG</option>
          <option value="12">12 AWG</option>
          <option value="10">10 AWG</option>
          <option value="8">8 AWG</option>
          <option value="6">6 AWG</option>
        </select>
      </label>
      <button id="vd1Btn">Calculate V Drop</button>
      <p id="vd1-result"></p>
    `,
    init: () => {
      document.getElementById('vd1Btn').addEventListener('click', () => {
        const I = parseFloat(document.getElementById('vd1-amps').value);
        const L = parseFloat(document.getElementById('vd1-length').value);
        const gauge = parseInt(document.getElementById('vd1-gauge').value, 10);
        const R = awgResistances[gauge];
        const out = document.getElementById('vd1-result');
        if (isNaN(I) || isNaN(L)) {
          out.textContent = 'Enter valid numbers!';
          return;
        }
        const vd = 2 * I * R * (L/1000);
        out.textContent = `V Drop: ${vd.toFixed(2)} V`;
      });
    }
  },
  vdrop3: {
    form: `
      <h2>Voltage Drop (Three-Phase)</h2>
      <label>Amps (A): <input id="vd3-amps" type="number" /></label>
      <label>Length (m): <input id="vd3-length" type="number" /></label>
      <label>Conductor (AWG):
        <select id="vd3-gauge">
          <option value="14">14 AWG</option>
          <option value="12">12 AWG</option>
          <option value="10">10 AWG</option>
          <option value="8">8 AWG</option>
          <option value="6">6 AWG</option>
        </select>
      </label>
      <label>PF (0-1): <input id="vd3-pf" type="number" step="0.01" min="0" max="1" /></label>
      <button id="vd3Btn">Calculate V Drop</button>
      <p id="vd3-result"></p>
    `,
    init: () => {
      document.getElementById('vd3Btn').addEventListener('click', () => {
        const I = parseFloat(document.getElementById('vd3-amps').value);
        const L = parseFloat(document.getElementById('vd3-length').value);
        const gauge = parseInt(document.getElementById('vd3-gauge').value, 10);
        const R = awgResistances[gauge];
        const PF = parseFloat(document.getElementById('vd3-pf').value);
        const out = document.getElementById('vd3-result');
        if (isNaN(I) || isNaN(L) || isNaN(PF)) {
          out.textContent = 'Enter valid numbers!';
          return;
        }
        const vd = Math.sqrt(3) * I * R * (L/1000) * PF;
        out.textContent = `V Drop: ${vd.toFixed(2)} V`;
      });
    }
  },
  conductor: {
    form: `
      <h2>Conductor Ampacity & Derating</h2>
      <label>Load Amps (A): <input id="cond-amps" type="number" /></label>
      <label># Conductors: <input id="cond-count" type="number" /></label>
      <label>Ambient Temp (°C): <input id="cond-temp" type="number" /></label>
      <button id="condBtn">Calculate Ampacity</button>
      <p id="cond-result"></p>
    `,
    init: () => {
      document.getElementById('condBtn').addEventListener('click', () => {
        const I = parseFloat(document.getElementById('cond-amps').value);
        const N = parseFloat(document.getElementById('cond-count').value);
        const T = parseFloat(document.getElementById('cond-temp').value);
        const out = document.getElementById('cond-result');
        if (isNaN(I) || isNaN(N) || isNaN(T) || N < 1) {
          out.textContent = 'Enter valid numbers!';
          return;
        }
        const derateCount = N > 1 ? 1 - 0.1 * (N - 1) : 1;
        const derateTemp = T > 30 ? 0.95 : 1;
        const required = I / (derateCount * derateTemp);
        out.textContent = `Required Ampacity: ${required.toFixed(2)} A`;
      });
    }
  },
  fuse: {
    form: `
      <h2>Fuse/Breaker Sizing</h2>
      <label>Continuous Load (A): <input id="fuse-amps" type="number" /></label>
      <button id="fuseBtn">Calculate Breaker</button>
      <p id="fuse-result"></p>
    `,
    init: () => {
      document.getElementById('fuseBtn').addEventListener('click', () => {
        const I = parseFloat(document.getElementById('fuse-amps').value);
        const out = document.getElementById('fuse-result');
        if (isNaN(I)) {
          out.textContent = 'Enter valid amps!';
          return;
        }
        out.textContent = `Breaker Rating: ${(I * 1.25).toFixed(2)} A`;
      });
    }
  },
  motor: {
    form: `
      <h2>Motor Starting Current</h2>
      <label>HP: <input id="motor-hp" type="number" /></label>
      <label>Voltage (V): <input id="motor-v" type="number" /></label>
      <label>Service Factor: <input id="motor-sf" type="number" step="0.1" min="1" /></label>
      <button id="motorBtn">Calculate Inrush</button>
      <p id="motor-result"></p>
    `,
    init: () => {
      document.getElementById('motorBtn').addEventListener('click', () => {
        const HP = parseFloat(document.getElementById('motor-hp').value);
        const V = parseFloat(document.getElementById('motor-v').value);
        const SF = parseFloat(document.getElementById('motor-sf').value);
        const out = document.getElementById('motor-result');
        if (isNaN(HP) || isNaN(V) || isNaN(SF)) {
          out.textContent = 'Enter valid numbers!';
          return;
        }
        const I = (HP * 746 / V) * SF * 6;
        out.textContent = `Inrush Current: ${I.toFixed(2)} A`;
      });
    }
  },
  pfcorr: {
    form: `
      <h2>Power Factor Correction</h2>
      <label>Load kW: <input id="pf-kw" type="number" /></label>
      <label>Existing PF: <input id="pf-existing" type="number" step="0.01" min="0" max="1" /></label>
      <label>Desired PF: <input id="pf-desired" type="number" step="0.01" min="0" max="1" /></label>
      <button id="pfBtn">Calculate kVAR</button>
      <p id="pf-result"></p>
    `,
    init: () => {
      document.getElementById('pfBtn').addEventListener('click', () => {
        const kW = parseFloat(document.getElementById('pf-kw').value);
        const PF1 = parseFloat(document.getElementById('pf-existing').value);
        const PF2 = parseFloat(document.getElementById('pf-desired').value);
        const out = document.getElementById('pf-result');
        if (isNaN(kW) || isNaN(PF1) || isNaN(PF2) || PF2 <= PF1) {
          out.textContent = 'Enter valid kW and PFs!';
          return;
        }
        const kVAR = kW * (Math.tan(Math.acos(PF1)) - Math.tan(Math.acos(PF2)));
        out.textContent = `Required kVAR: ${kVAR.toFixed(2)}`;
      });
    }
  },
  lighting: {
    form: `
      <h2>Lighting Load Calculator</h2>
      <label>Type:
        <select id="light-type">
          <option value="3">Residential (3 VA/ft²)</option>
          <option value="5">Commercial (5 VA/ft²)</option>
        </select>
      </label>
      <label>Area (ft²): <input id="light-area" type="number" /></label>
      <button id="lightBtn">Calculate VA</button>
      <p id="light-result"></p>
    `,
    init: () => {
      document.getElementById('lightBtn').addEventListener('click', () => {
        const A = parseFloat(document.getElementById('light-area').value);
        const VAft = parseFloat(document.getElementById('light-type').value);
        const out = document.getElementById('light-result');
        if (isNaN(A) || isNaN(VAft)) {
          out.textContent = 'Enter valid numbers!';
          return;
        }
        out.textContent = `Lighting Load: ${(A * VAft).toFixed(2)} VA`;
      });
    }
  },
  conduit: {
    form: `
      <h2>Conduit Fill %</h2>
      <label>Conduit Size:
        <select id="cond-size">
          <option value="0.729">1/2″ (0.729″ ID)</option>
          <option value="0.922">3/4″ (0.922″ ID)</option>
          <option value="1.157">1″ (1.157″ ID)</option>
          <option value="1.357">1-1/4″ (1.357″ ID)</option>
        </select>
      </label>
      <label>Conductor Gauge:
        <select id="cond-gauge">
          <option value="14">14 AWG</option>
          <option value="12">12 AWG</option>
          <option value="10">10 AWG</option>
          <option value="8">8 AWG</option>
          <option value="6">6 AWG</option>
        </select>
      </label>
      <label># Conductors:
        <input id="cond-count" type="number" min="1" placeholder="e.g. 3" />
      </label>
      <button id="conduitBtn">Calculate %</button>
      <p id="conduit-result"></p>
    `,
    init: () => {
      document.getElementById('conduitBtn').addEventListener('click', () => {
        const ID = parseFloat(document.getElementById('cond-size').value);
        const gauge = parseInt(document.getElementById('cond-gauge').value, 10);
        const N = parseInt(document.getElementById('cond-count').value, 10);
        const outEl = document.getElementById('conduit-result');
        if (isNaN(ID) || isNaN(gauge) || isNaN(N) || N < 1) {
          outEl.textContent = 'Select conduit size, conductor gauge, and enter valid count.';
          return;
        }
        const A = awgAreas[gauge] || 0;
        const totalArea = A * N;
        const areaConduit = Math.PI * (ID / 2) ** 2;
        const fill = (totalArea / areaConduit) * 100;
        outEl.textContent = `Fill: ${fill.toFixed(2)}%`;
        outEl.style.color = fill > 40 ? 'red' : '';
      });
    }
  },
  ohms: {
    form: `
      <h2>Ohm’s Law Solver</h2>
      <label>V: <input id="ohm-v" type="number" /></label>
      <label>I: <input id="ohm-i" type="number" /></label>
      <label>R: <input id="ohm-r" type="number" /></label>
      <label>P: <input id="ohm-p" type="number" /></label>
      <button id="ohmBtn">Solve</button>
      <p id="ohm-result"></p>
    `,
    init: () => {
      document.getElementById('ohmBtn').addEventListener('click', () => {
        const v = parseFloat(document.getElementById('ohm-v').value);
        const i = parseFloat(document.getElementById('ohm-i').value);
        const r = parseFloat(document.getElementById('ohm-r').value);
        const p = parseFloat(document.getElementById('ohm-p').value);
        const out = document.getElementById('ohm-result');

        // Collect filled inputs
        const inputs = { v, i, r, p };
        const filled = Object.entries(inputs)
          .filter(([_, val]) => !isNaN(val))
          .map(([key]) => key);

        if (filled.length !== 2) {
          out.textContent = 'Enter exactly two values!';
          return;
        }

        // Compute the missing values
        const computed = {};
        if (filled.includes('v') && filled.includes('i')) {
          computed.r = v / i;
          computed.p = v * i;
        } else if (filled.includes('v') && filled.includes('r')) {
          computed.i = v / r;
          computed.p = v * computed.i;
        } else if (filled.includes('v') && filled.includes('p')) {
          computed.i = p / v;
          computed.r = v / computed.i;
        } else if (filled.includes('i') && filled.includes('r')) {
          computed.v = i * r;
          computed.p = computed.v * i;
        } else if (filled.includes('i') && filled.includes('p')) {
          computed.v = p / i;
          computed.r = computed.v / i;
        } else if (filled.includes('r') && filled.includes('p')) {
          computed.i = Math.sqrt(p / r);
          computed.v = computed.i * r;
        }

        // Display results for both computed values
        const parts = [];
        for (const [key, val] of Object.entries(computed)) {
          const unit = key === 'v' ? 'V' : key === 'i' ? 'A' : key === 'r' ? 'Ω' : 'W';
          parts.push(`${key.toUpperCase()}: ${val.toFixed(2)} ${unit}`);
        }
        out.textContent = parts.join(', ');
      });
    }
  }
};

// Render the selected calculator
function renderCalculator(type) {
  calcForm.innerHTML = calculators[type].form;
  calculators[type].init();
}

// Handle dropdown changes
calcType.addEventListener('change', () => {
  renderCalculator(calcType.value);
});

// Initial render
renderCalculator(calcType.value);