

const nightToggle = document.getElementById('nightToggle');
nightToggle.addEventListener('change', () => {
  document.body.classList.toggle('night-mode', nightToggle.checked);
});

const voltsInput = document.getElementById('volts');
const ampsInput = document.getElementById('amps');
const resultPara = document.getElementById('result');

document.getElementById('calcBtn').addEventListener('click', () => {
  const v = parseFloat(voltsInput.value);
  const a = parseFloat(ampsInput.value);
  if (isNaN(v) || isNaN(a)) {
    resultPara.textContent = 'Please enter valid numbers!';
    return;
  }
  const watts = v * a;
  resultPara.textContent = `Power: ${watts.toFixed(2)} W`;
});
// Reverse: Calculate Amps
document.getElementById('revBtn').addEventListener('click', () => {
  const w = parseFloat(document.getElementById('rev-watts').value);
  const v2 = parseFloat(document.getElementById('rev-volts').value);
  const out = document.getElementById('rev-result');
  if (isNaN(w) || isNaN(v2) || v2 === 0) {
    out.textContent = 'Enter valid numbers (volts ≠ 0).';
    return;
  }
  const amps = w / v2;
  out.textContent = `Amps: ${amps.toFixed(2)} A`;
});

// Three-Phase Power Calculator
document.getElementById('tpBtn').addEventListener('click', () => {
  const V = parseFloat(document.getElementById('tp-volts').value);
  const I = parseFloat(document.getElementById('tp-amps').value);
  const PF = parseFloat(document.getElementById('tp-pf').value);
  const out3 = document.getElementById('tp-result');
  if (isNaN(V) || isNaN(I) || isNaN(PF) || PF < 0 || PF > 1) {
    out3.textContent = 'Enter valid numbers and PF between 0 and 1.';
    return;
  }
  const P = Math.sqrt(3) * V * I * PF;
  out3.textContent = `Power: ${P.toFixed(2)} W`;
});

// Unit Conversion Calculator
document.getElementById('convBtn').addEventListener('click', () => {
  const val = parseFloat(document.getElementById('conv-value').value);
  const from = document.getElementById('conv-from').value;
  const to   = document.getElementById('conv-to').value;
  const out  = document.getElementById('conv-result');

  if (isNaN(val)) {
    out.textContent = 'Enter a valid number!';
    return;
  }

  // Convert any unit to watts
  let watts;
  if (from === 'W')  watts = val;
  else if (from === 'kW') watts = val * 1000;
  else if (from === 'HP') watts = val * 745.7;

  // Convert watts to target unit
  let result;
  if (to === 'W')  result = watts;
  else if (to === 'kW') result = watts / 1000;
  else if (to === 'HP') result = watts / 745.7;

  out.textContent = `${result.toFixed(4)} ${to}`;
});