const TOTAL_GAMES = 12;
const TARGET_WINS = 7;
const WIN_PROB = 0.5;

const winsInput = document.getElementById("wins");
const lossesInput = document.getElementById("losses");
const chanceOutput = document.getElementById("chance");

const chart = new Chart(document.getElementById("chart"), {
  data: {
    labels: [],
    datasets: [
      { type: "bar", data: [], barThickness: 3, order: 2 },
      { type: "line", data: [], showLine: false, pointRadius: 6, pointHoverRadius: 8, order: 1 }
    ]
  },
  options: {
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true } }
  }
});

function choose(n, k) {
  let result = 1;
  for (let i = 1; i <= k; i++) {
    result = result * (n - k + i) / i;
  }
  return result;
}

function updateChart(wins, remaining) {
  const labels = [], data = [];
  for (let k = 0; k <= remaining; k++) {
    labels.push(wins + k);
    data.push(choose(remaining, k) * Math.pow(WIN_PROB, k) * Math.pow(1 - WIN_PROB, remaining - k) * 100);
  }
  const colors = labels.map(w => w >= TARGET_WINS ? "#2e8b57" : "#888");
  chart.data.labels = labels;
  for (const ds of chart.data.datasets) {
    ds.data = data;
    ds.backgroundColor = colors;
    ds.borderColor = colors;
  }
  chart.update();
}

function update() {
  const wins = Number(winsInput.value) || 0;
  const losses = Number(lossesInput.value) || 0;
  const remaining = TOTAL_GAMES - wins - losses;
  const needed = TARGET_WINS - wins;

  if (remaining < 0) {
    chanceOutput.textContent = "Too many games";
    return;
  }

  updateChart(wins, remaining);

  if (needed <= 0) {
    chanceOutput.textContent = "100%";
    return;
  }
  if (needed > remaining) {
    chanceOutput.textContent = "0%";
    return;
  }

  let chance = 0;
  for (let k = needed; k <= remaining; k++) {
    chance += choose(remaining, k) * Math.pow(WIN_PROB, k) * Math.pow(1 - WIN_PROB, remaining - k);
  }
  chanceOutput.textContent = (chance * 100).toFixed(1) + "%";
}

winsInput.addEventListener("input", update);
lossesInput.addEventListener("input", update);
update();

[winsInput, lossesInput].forEach(input => {
  input.addEventListener("focus", () => setTimeout(() => input.select(), 0));
  input.addEventListener("mouseup", e => e.preventDefault());
});
