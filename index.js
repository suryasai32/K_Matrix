function calculateYBus() {
  const nbus = parseInt(document.getElementById("nbus").value);
  const nline = parseInt(document.getElementById("nline").value);

  const lineParameters = [];
  for (let i = 1; i <= nline; i++) {
    const fromBus = parseInt(prompt(`Enter from bus for line ${i}:`));
    const toBus = parseInt(prompt(`Enter to bus for line ${i}:`));
    const impedanceReal = parseFloat(prompt(`Enter real part of impedance for line ${i}:`));
    const impedanceImaginary = parseFloat(prompt(`Enter imaginary part of impedance for line ${i}:`));
    const hlc = parseFloat(prompt(`Enter half line charging admittance for line ${i}:`));
    const a = parseFloat(prompt(`Enter off-nominal turns ratio for line ${i}:`));

    lineParameters.push({ fromBus, toBus, impedanceReal, impedanceImaginary, hlc, a });
  }

  const Y = calculateYBusMatrix(nbus, lineParameters);
  displayYBusMatrix(Y);
}

function calculateYBusMatrix(nbus, lineParameters) {
  const Y = new Array(nbus).fill(0).map(() => new Array(nbus).fill(0));

  lineParameters.forEach(({ fromBus, toBus, impedanceReal, impedanceImaginary, hlc, a }) => {
    const y = 1 / (impedanceReal + impedanceImaginary * 1i);
    const yAdjusted = y / a;

    Y[fromBus - 1][fromBus - 1] += yAdjusted + hlc + ((1 - a) / a) * yAdjusted;
    Y[toBus - 1][toBus - 1] += yAdjusted + hlc + (a - 1) * yAdjusted;
    Y[fromBus - 1][toBus - 1] -= yAdjusted;
    Y[toBus - 1][fromBus - 1] -= yAdjusted;
  });

  return Y;
}

function displayYBusMatrix(Y) {
  const resultContainer = document.getElementById("result-container");
  resultContainer.innerHTML = "<h3>Y-Bus Matrix:</h3>";

  const table = document.createElement("table");
  const tbody = document.createElement("tbody");

  Y.forEach((row, i) => {
    const tr = document.createElement("tr");

    row.forEach((value, j) => {
      const td = document.createElement("td");
      td.textContent = value.toPrecision(5);
      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  resultContainer.appendChild(table);
}
