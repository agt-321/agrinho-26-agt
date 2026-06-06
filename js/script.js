const body = document.body;
const missionForm = document.querySelector("#missionForm");
const missionOutput = document.querySelector("#missionOutput");
const scenarioOptions = document.querySelectorAll(".scenario-option");
const soilStage = document.querySelector("#soilStage");
const statusChip = document.querySelector("#statusChip");
const lifeReadout = document.querySelector("#lifeReadout");
const waterReadout = document.querySelector("#waterReadout");
const poreReadout = document.querySelector("#poreReadout");
const practiceButtons = document.querySelectorAll(".practice-button");
const plotButtons = document.querySelectorAll(".plot");
const plotTitle = document.querySelector("#plotTitle");
const plotText = document.querySelector("#plotText");
const plotAction = document.querySelector("#plotAction");
const quizForm = document.querySelector("#quizForm");
const quizOutput = document.querySelector("#quizOutput");
const themeToggle = document.querySelector("#themeToggle");
const increaseFont = document.querySelector("#increaseFont");
const decreaseFont = document.querySelector("#decreaseFont");

let quizScore = 0;
let fontSize = localStorage.getItem("raizLabFontSize") || "normal";

const scenarioData = {
  erosion: {
    chip: "Alerta de erosão",
    mission: "Instalar cobertura viva, curvas de nível e barreiras vegetais para reduzir a velocidade da água.",
    life: "63%",
    water: "48%",
    pores: "52%"
  },
  compaction: {
    chip: "Solo compactado",
    mission: "Criar rota fixa para máquinas, evitar tráfego em solo úmido e recuperar poros com raízes profundas.",
    life: "58%",
    water: "41%",
    pores: "26%"
  },
  chemical: {
    chip: "Microbiologia em risco",
    mission: "Reduzir excesso de insumos, monitorar nutrientes e usar matéria orgânica para reequilibrar a vida do solo.",
    life: "37%",
    water: "55%",
    pores: "49%"
  },
  bare: {
    chip: "Solo descoberto",
    mission: "Manter palhada, plantar adubação verde e proteger a superfície contra sol forte, vento e chuva direta.",
    life: "44%",
    water: "34%",
    pores: "46%"
  }
};

const practiceData = {
  green: {
    label: "Primeira resposta",
    title: "Cobertura viva",
    text: "Palhada e plantas de cobertura protegem a superfície, alimentam microrganismos e deixam a chuva infiltrar melhor.",
    fertility: 86,
    protection: 92,
    cost: 74
  },
  rotation: {
    label: "Planejamento de safra",
    title: "Rodízio de culturas",
    text: "Alternar espécies quebra ciclos de pragas, equilibra nutrientes e aumenta a diversidade de raízes no perfil do solo.",
    fertility: 88,
    protection: 79,
    cost: 70
  },
  traffic: {
    label: "Engenharia do campo",
    title: "Rota de máquinas",
    text: "Definir caminhos de tráfego preserva os poros, evita compactação e mantém ar e água circulando perto das raízes.",
    fertility: 68,
    protection: 84,
    cost: 82
  },
  iot: {
    label: "Olho digital",
    title: "Sentinelas IoT",
    text: "Sensores, drones e IA cruzam dados de umidade, clima e vigor das plantas para corrigir problemas antes da perda de produtividade.",
    fertility: 76,
    protection: 80,
    cost: 88
  }
};

const plotData = {
  A: {
    title: "Talhão A",
    text: "Área com boa cobertura, umidade estável e sinais de raízes finas no horizonte superficial.",
    action: "Manter rotação e registrar evolução semanal."
  },
  B: {
    title: "Talhão B",
    text: "Sensor indica água escorrendo rápido demais após chuva forte.",
    action: "Implantar faixas vegetadas e proteger a superfície."
  },
  C: {
    title: "Talhão C",
    text: "Camada compactada limita poros e deixa raízes concentradas no topo.",
    action: "Reduzir tráfego, evitar solo úmido e usar plantas descompactadoras."
  },
  D: {
    title: "Talhão D",
    text: "Baixa atividade biológica após uso intenso de produtos químicos.",
    action: "Reforçar matéria orgânica e monitorar nutrientes com precisão."
  },
  E: {
    title: "Talhão E",
    text: "Boa infiltração, mas pouca diversidade de culturas na última safra.",
    action: "Planejar rotação com famílias botânicas diferentes."
  },
  F: {
    title: "Talhão F",
    text: "Solo descoberto e muito quente durante parte do dia.",
    action: "Entrar com cobertura vegetal e palhada antes do próximo ciclo."
  }
};

// Atualiza o núcleo visual e os dados quando o usuário escolhe um risco.
function updateScenario(scenarioKey) {
  const scenario = scenarioData[scenarioKey];

  soilStage.dataset.scenario = scenarioKey;
  statusChip.textContent = scenario.chip;
  missionOutput.textContent = scenario.mission;
  lifeReadout.textContent = scenario.life;
  waterReadout.textContent = scenario.water;
  poreReadout.textContent = scenario.pores;

  scenarioOptions.forEach((option) => {
    const input = option.querySelector("input");
    option.classList.toggle("active", input.value === scenarioKey);
  });
}

// Troca a receita de manejo e mantém os medidores sincronizados.
function selectPractice(practiceKey) {
  const practice = practiceData[practiceKey];

  document.querySelector("#practiceLabel").textContent = practice.label;
  document.querySelector("#practiceTitle").textContent = practice.title;
  document.querySelector("#practiceText").textContent = practice.text;
  document.querySelector("#fertilityMeter").value = practice.fertility;
  document.querySelector("#protectionMeter").value = practice.protection;
  document.querySelector("#costMeter").value = practice.cost;

  practiceButtons.forEach((button) => {
    const isActive = button.dataset.practice === practiceKey;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });
}

// Lê o talhão selecionado e apresenta uma ação técnica para o usuário.
function selectPlot(plotKey) {
  const plot = plotData[plotKey];

  plotTitle.textContent = plot.title;
  plotText.textContent = plot.text;
  plotAction.textContent = plot.action;

  plotButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.plot === plotKey);
  });
}

function applyFontSize() {
  body.classList.remove("font-small", "font-large");

  if (fontSize !== "normal") {
    body.classList.add(`font-${fontSize}`);
  }

  localStorage.setItem("raizLabFontSize", fontSize);
}

function toggleTheme() {
  body.classList.toggle("dark-mode");
  const isDark = body.classList.contains("dark-mode");
  themeToggle.textContent = isDark ? "Dia" : "Noite";
  localStorage.setItem("raizLabTheme", isDark ? "dark" : "light");
}

missionForm.addEventListener("change", (event) => {
  if (event.target.name === "scenario") {
    updateScenario(event.target.value);
  }
});

practiceButtons.forEach((button) => {
  button.addEventListener("click", () => selectPractice(button.dataset.practice));
});

plotButtons.forEach((button) => {
  button.addEventListener("click", () => selectPlot(button.dataset.plot));
});

increaseFont.addEventListener("click", () => {
  fontSize = fontSize === "small" ? "normal" : "large";
  applyFontSize();
});

decreaseFont.addEventListener("click", () => {
  fontSize = fontSize === "large" ? "normal" : "small";
  applyFontSize();
});

themeToggle.addEventListener("click", toggleTheme);

quizForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const selected = quizForm.querySelector("input[name='quiz']:checked");

  if (!selected) {
    quizOutput.textContent = "Escolha um comando para liberar a análise.";
    return;
  }

  quizScore += Number(selected.value);
  quizOutput.textContent = selected.value === "1"
    ? `Pontuação: ${quizScore}. Comando correto: cobertura e rotação reduzem a perda da camada fértil.`
    : `Pontuação: ${quizScore}. Esse comando aumenta o estresse do solo.`;
});

if (localStorage.getItem("raizLabTheme") === "dark") {
  body.classList.add("dark-mode");
  themeToggle.textContent = "Dia";
}

applyFontSize();
updateScenario("erosion");
selectPlot("A");
