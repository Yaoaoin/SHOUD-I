const weights = {
  utility: 1.25,
  cost: -1.15,
  reward: 1.3,
  risk: -1.2,
  longTerm: 1.2,
  necessity: 1.35,
  energyFit: 0.85,
  regret: 1.0,
};

const encouragements = [
  "冲！这事值得你认真干，未来的你会点个赞。",
  "可以做，别磨叽了。你今天状态比自己想的强。",
  "批准执行 ✅ 你这是在给生活加分。",
  "去做吧，星夜都在给你打光。",
];

const roastNo = [
  "不建议！你这波像在给钱包和精力挖坑，别乱来啊！！！",
  "先别做，冷静点。现在冲上去大概率是给自己添堵。",
  "否决。你不是在追求快乐，你是在充值后悔。",
  "停！这决定味道不对，像深夜网购的前摇。",
];

const randomCases = {
  bath: {
    question: "要不要去洗澡？",
    options: ["现在就去洗，洗完神清气爽", "再等 20 分钟，但必须去", "不许摆烂，立刻起身去洗"],
  },
  food: {
    question: "今天吃什么？",
    options: ["牛肉面", "黄焖鸡", "寿司", "番茄鸡蛋面", "麻辣烫", "煎饺+豆浆", "沙拉+烤鸡", "盖浇饭"],
  },
  goout: {
    question: "要不要出门？",
    options: ["出门走走，至少 30 分钟", "不出门，在家做拉伸+晒窗边太阳", "短暂出门买杯喝的再回"],
  },
  buy: {
    question: "要不要买这个小东西？",
    options: ["先等 24 小时再看，还想买再下单", "可以买，但预算不能超", "不买，拿这笔钱给自己吃顿好的"],
  },
};

function rand(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function updateRangeValue(el) {
  el.parentElement.querySelector("em").textContent = el.value;
}

document.querySelectorAll('input[type="range"]').forEach((range) => {
  range.addEventListener("input", () => updateRangeValue(range));
});

const analyzeBtn = document.getElementById("analyzeBtn");
const resultEl = document.getElementById("result");

analyzeBtn.addEventListener("click", () => {
  const topic = document.getElementById("topic").value.trim() || "这件事";
  const scores = {};

  document.querySelectorAll('input[type="range"]').forEach((r) => {
    scores[r.dataset.key] = Number(r.value);
  });

  const weighted = Object.entries(weights).reduce(
    (sum, [key, weight]) => sum + (scores[key] || 0) * weight,
    0
  );

  const normalized = Math.round(((weighted + 20) / 90) * 100);
  const yes = normalized >= 54;

  const topPros = [
    `实用性 ${scores.utility}`,
    `快乐回报 ${scores.reward}`,
    `长期价值 ${scores.longTerm}`,
    `必要性 ${scores.necessity}`,
    `不做后悔 ${scores.regret}`,
  ]
    .sort((a, b) => Number(b.split(" ")[1]) - Number(a.split(" ")[1]))
    .slice(0, 2)
    .join("、");

  const topCons = [
    `成本压力 ${scores.cost}`,
    `风险 ${scores.risk}`,
  ]
    .sort((a, b) => Number(b.split(" ")[1]) - Number(a.split(" ")[1]))
    .slice(0, 1)
    .join("、");

  resultEl.classList.remove("hidden", "yes", "no");
  resultEl.classList.add(yes ? "yes" : "no");
  resultEl.innerHTML = `
    <h3>${yes ? "🌟 建议做" : "🛑 建议暂缓"}：${topic}</h3>
    <p><strong>决策分：</strong>${normalized}/100</p>
    <p><strong>关键加分项：</strong>${topPros}</p>
    <p><strong>关键减分项：</strong>${topCons}</p>
    <p>${yes ? rand(encouragements) : rand(roastNo)}</p>
  `;
});

const quickType = document.getElementById("quickType");
const customWrap = document.getElementById("customQuestionWrap");
const randomBtn = document.getElementById("randomBtn");
const randomResult = document.getElementById("randomResult");

quickType.addEventListener("change", () => {
  customWrap.classList.toggle("hidden", quickType.value !== "custom");
});

randomBtn.addEventListener("click", () => {
  const type = quickType.value;
  let question;
  let decision;

  if (type === "custom") {
    question = document.getElementById("customQuestion").value.trim() || "这个事";
    const yes = Math.random() > 0.45;
    decision = yes ? "做！" : "不做！";
    randomResult.classList.remove("yes", "no");
    randomResult.classList.add(yes ? "yes" : "no");
    randomResult.innerHTML = `<h3>🎲 ${question}</h3><p><strong>随机结论：</strong>${decision}</p><p>${yes ? rand(encouragements) : rand(roastNo)}</p>`;
  } else {
    const item = randomCases[type];
    question = item.question;
    decision = rand(item.options);
    const positive = !decision.includes("不") || decision.includes("不买");
    randomResult.classList.remove("yes", "no");
    randomResult.classList.add(positive ? "yes" : "no");
    randomResult.innerHTML = `<h3>🎲 ${question}</h3><p><strong>今晚就这么定：</strong>${decision}</p><p>${positive ? rand(encouragements) : rand(roastNo)}</p>`;
  }

  randomResult.classList.remove("hidden");
});
