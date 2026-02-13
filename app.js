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

const positiveFeedback = [
  "综合评分较高，建议执行。",
  "该事项具备明显收益，建议尽快推进。",
  "从当前指标看，执行该决定更有利。",
  "结论偏正向，可进入实施阶段。",
];

const positiveAdvice = ["好选择，稳步推进就行。", "可以做，但记得按预算和节奏来。", "这波可以上，边做边复盘。"];

const negativeFeedback = [
  "综合风险与成本偏高，建议暂缓。",
  "当前条件下不建议立即执行，可先观察。",
  "该决策的负担大于收益，建议延后处理。",
  "建议先优化条件，再重新评估该事项。",
];

const negativeAdvice = ["先别冲动，先等等。", "先缓一缓，等条件更好再做。", "先降风险再行动。"];

const randomCases = {
  bath: {
    question: "是否现在去做？",
    options: [
      "现在执行",
      "立即执行，不再拖延",
      "10 分钟后开始",
      "20 分钟后执行",
      "30 分钟后执行",
      "1 小时后执行",
      "今晚稍晚一点再做",
      "明天再执行",
    ],
  },
  food: {
    question: "今晚吃什么？",
    options: [
      "牛肉面",
      "黄焖鸡米饭",
      "寿司拼盘",
      "番茄鸡蛋面",
      "麻辣烫",
      "煎饺与豆浆",
      "沙拉与烤鸡",
      "香菇滑鸡盖饭",
      "烤鱼配米饭",
      "韩式石锅拌饭",
      "猪脚饭",
      "酸辣粉",
      "肠粉加鸡蛋",
      "西红柿牛腩饭",
      "三明治加热汤",
      "轻食卷饼",
      "火锅",
      "煲仔饭",
      "酸菜鱼",
      "新疆大盘鸡拌面",
      "烤肉拌饭",
      "虾仁炒饭",
      "肉酱意面",
      "日式咖喱蛋包饭",
    ],
  },
  breakfast: {
    question: "明早吃什么？",
    options: ["豆浆油条", "鸡蛋三明治", "包子配小米粥", "燕麦水果碗", "煎蛋吐司", "肠粉", "馄饨", "手抓饼", "豆腐脑配烧饼", "紫米饭团", "牛奶麦片", "小笼包"],
  },
  lunch: {
    question: "中午吃什么？",
    options: ["卤肉饭", "咖喱鸡饭", "兰州拉面", "烧鸭饭", "麻婆豆腐套餐", "意面", "鸡腿汉堡套餐", "木桶饭", "番茄肥牛饭", "照烧鸡排饭", "重庆小面", "烤肉饭"],
  },
  snack: {
    question: "要不要加个小吃？",
    options: ["水果酸奶杯", "烤红薯", "关东煮", "鸡蛋仔", "不加餐，喝水就好", "坚果拼盘", "无糖酸奶", "海苔饭团", "香蕉燕麦杯", "全麦面包片", "低糖蛋白棒"],
  },
  drink: {
    question: "今天喝点什么？",
    options: ["冰美式", "拿铁", "无糖乌龙茶", "柠檬气泡水", "热可可", "鲜榨橙汁", "少糖奶茶", "温开水"],
  },
  goout: {
    question: "是否出门？",
    options: ["出门散步 30 分钟", "留在室内并做拉伸", "短时外出后返回"],
  },
  buy: {
    question: "要不要买东西？",
    options: ["等待 24 小时后再决定", "可购买，但控制预算", "本次不购买"],
  },
};

function rand(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randWithoutRepeat(arr, previous) {
  if (!Array.isArray(arr) || arr.length === 0) return "";
  if (arr.length === 1) return arr[0];
  const candidates = arr.filter((item) => item !== previous);
  return rand(candidates.length ? candidates : arr);
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
  const topic = document.getElementById("topic").value.trim() || "当前事项";
  const scores = {};

  document.querySelectorAll('input[type="range"]').forEach((r) => {
    scores[r.dataset.key] = Number(r.value);
  });

  const weighted = Object.entries(weights).reduce((sum, [key, weight]) => sum + (scores[key] || 0) * weight, 0);

  const normalized = Math.round(((weighted + 20) / 90) * 100);
  const yes = normalized >= 54;

  const topPros = [
    `价值收益 ${scores.utility}`,
    `成功可能性 ${scores.reward}`,
    `长期价值 ${scores.longTerm}`,
    `当前必要性 ${scores.necessity}`,
    `错过代价 ${scores.regret}`,
  ]
    .sort((a, b) => Number(b.split(" ")[1]) - Number(a.split(" ")[1]))
    .slice(0, 2)
    .join("、");

  const topCons = [`投入成本 ${scores.cost}`, `翻车风险 ${scores.risk}`]
    .sort((a, b) => Number(b.split(" ")[1]) - Number(a.split(" ")[1]))
    .slice(0, 1)
    .join("、");

  resultEl.classList.remove("hidden", "yes", "no");
  resultEl.classList.add(yes ? "yes" : "no");
  resultEl.innerHTML = `
    <h3>${yes ? "建议执行" : "建议暂缓"}：${topic}</h3>
    <p><strong>决策评分：</strong>${normalized}/100</p>
    <p><strong>主要支持因素：</strong>${topPros}</p>
    <p><strong>主要限制因素：</strong>${topCons}</p>
    <p>${yes ? rand(positiveFeedback) : rand(negativeFeedback)}</p>
    <p><strong>一句提醒：</strong>${yes ? rand(positiveAdvice) : rand(negativeAdvice)}</p>
  `;
});

const quickType = document.getElementById("quickType");
const customWrap = document.getElementById("customQuestionWrap");
const randomBtn = document.getElementById("randomBtn");
const randomResult = document.getElementById("randomResult");
const lastQuickDecision = {};
let lastCustomDecision = "";

quickType.addEventListener("change", () => {
  customWrap.classList.toggle("hidden", quickType.value !== "custom");
});

randomBtn.addEventListener("click", () => {
  const type = quickType.value;
  let question;
  let decision;

  if (type === "custom") {
    question = document.getElementById("customQuestion").value.trim() || "该事项";
    decision = randWithoutRepeat(["建议执行", "建议暂缓"], lastCustomDecision);
    lastCustomDecision = decision;
    const yes = decision === "建议执行";
    randomResult.classList.remove("yes", "no");
    randomResult.classList.add(yes ? "yes" : "no");
    randomResult.innerHTML = `<h3>${question}</h3><p><strong>随机结果：</strong>${decision}</p><p>${
      yes ? rand(positiveFeedback) : rand(negativeFeedback)
    }</p><p><strong>一句提醒：</strong>${yes ? rand(positiveAdvice) : rand(negativeAdvice)}</p>`;
  } else {
    const item = randomCases[type];
    question = item.question;
    decision = randWithoutRepeat(item.options, lastQuickDecision[type]);
    lastQuickDecision[type] = decision;
    const positive = !decision.includes("不") || decision.includes("不再拖延");
    randomResult.classList.remove("yes", "no");
    randomResult.classList.add(positive ? "yes" : "no");
    randomResult.innerHTML = `<h3>${question}</h3><p><strong>建议结果：</strong>${decision}</p><p>${
      positive ? rand(positiveFeedback) : rand(negativeFeedback)
    }</p><p><strong>一句提醒：</strong>${positive ? rand(positiveAdvice) : rand(negativeAdvice)}</p>`;
  }

  randomResult.classList.remove("hidden");
});
