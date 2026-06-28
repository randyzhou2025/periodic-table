const families = {
  alkali: { name: "碱金属", className: "cat-alkali" },
  alkaline: { name: "碱土金属", className: "cat-alkaline" },
  transition: { name: "过渡金属", className: "cat-transition" },
  lanthanide: { name: "镧系元素", className: "cat-lanthanide" },
  actinide: { name: "锕系元素", className: "cat-actinide" },
  post: { name: "其他金属", className: "cat-post" },
  metalloid: { name: "类金属", className: "cat-metalloid" },
  nonmetal: { name: "非金属", className: "cat-nonmetal" },
  halogen: { name: "卤素", className: "cat-halogen" },
  noble: { name: "稀有气体", className: "cat-noble" },
};

const elements = [
  { n: 1, symbol: "H", name: "氢", x: 1, y: 1, family: "nonmetal" },
  { n: 2, symbol: "He", name: "氦", x: 18, y: 1, family: "noble" },
  { n: 3, symbol: "Li", name: "锂", x: 1, y: 2, family: "alkali" },
  { n: 4, symbol: "Be", name: "铍", x: 2, y: 2, family: "alkaline" },
  { n: 5, symbol: "B", name: "硼", x: 13, y: 2, family: "metalloid" },
  { n: 6, symbol: "C", name: "碳", x: 14, y: 2, family: "nonmetal" },
  { n: 7, symbol: "N", name: "氮", x: 15, y: 2, family: "nonmetal" },
  { n: 8, symbol: "O", name: "氧", x: 16, y: 2, family: "nonmetal" },
  { n: 9, symbol: "F", name: "氟", x: 17, y: 2, family: "halogen" },
  { n: 10, symbol: "Ne", name: "氖", x: 18, y: 2, family: "noble" },
  { n: 11, symbol: "Na", name: "钠", x: 1, y: 3, family: "alkali" },
  { n: 12, symbol: "Mg", name: "镁", x: 2, y: 3, family: "alkaline" },
  { n: 13, symbol: "Al", name: "铝", x: 13, y: 3, family: "post" },
  { n: 14, symbol: "Si", name: "硅", x: 14, y: 3, family: "metalloid" },
  { n: 15, symbol: "P", name: "磷", x: 15, y: 3, family: "nonmetal" },
  { n: 16, symbol: "S", name: "硫", x: 16, y: 3, family: "nonmetal" },
  { n: 17, symbol: "Cl", name: "氯", x: 17, y: 3, family: "halogen" },
  { n: 18, symbol: "Ar", name: "氩", x: 18, y: 3, family: "noble" },
  { n: 19, symbol: "K", name: "钾", x: 1, y: 4, family: "alkali" },
  { n: 20, symbol: "Ca", name: "钙", x: 2, y: 4, family: "alkaline" },
  { n: 21, symbol: "Sc", name: "钪", x: 3, y: 4, family: "transition" },
  { n: 22, symbol: "Ti", name: "钛", x: 4, y: 4, family: "transition" },
  { n: 23, symbol: "V", name: "钒", x: 5, y: 4, family: "transition" },
  { n: 24, symbol: "Cr", name: "铬", x: 6, y: 4, family: "transition" },
  { n: 25, symbol: "Mn", name: "锰", x: 7, y: 4, family: "transition" },
  { n: 26, symbol: "Fe", name: "铁", x: 8, y: 4, family: "transition" },
  { n: 27, symbol: "Co", name: "钴", x: 9, y: 4, family: "transition" },
  { n: 28, symbol: "Ni", name: "镍", x: 10, y: 4, family: "transition" },
  { n: 29, symbol: "Cu", name: "铜", x: 11, y: 4, family: "transition" },
  { n: 30, symbol: "Zn", name: "锌", x: 12, y: 4, family: "transition" },
  { n: 31, symbol: "Ga", name: "镓", x: 13, y: 4, family: "post" },
  { n: 32, symbol: "Ge", name: "锗", x: 14, y: 4, family: "metalloid" },
  { n: 33, symbol: "As", name: "砷", x: 15, y: 4, family: "metalloid" },
  { n: 34, symbol: "Se", name: "硒", x: 16, y: 4, family: "nonmetal" },
  { n: 35, symbol: "Br", name: "溴", x: 17, y: 4, family: "halogen" },
  { n: 36, symbol: "Kr", name: "氪", x: 18, y: 4, family: "noble" },
  { n: 37, symbol: "Rb", name: "铷", x: 1, y: 5, family: "alkali" },
  { n: 38, symbol: "Sr", name: "锶", x: 2, y: 5, family: "alkaline" },
  { n: 39, symbol: "Y", name: "钇", x: 3, y: 5, family: "transition" },
  { n: 40, symbol: "Zr", name: "锆", x: 4, y: 5, family: "transition" },
  { n: 41, symbol: "Nb", name: "铌", x: 5, y: 5, family: "transition" },
  { n: 42, symbol: "Mo", name: "钼", x: 6, y: 5, family: "transition" },
  { n: 43, symbol: "Tc", name: "锝", x: 7, y: 5, family: "transition" },
  { n: 44, symbol: "Ru", name: "钌", x: 8, y: 5, family: "transition" },
  { n: 45, symbol: "Rh", name: "铑", x: 9, y: 5, family: "transition" },
  { n: 46, symbol: "Pd", name: "钯", x: 10, y: 5, family: "transition" },
  { n: 47, symbol: "Ag", name: "银", x: 11, y: 5, family: "transition" },
  { n: 48, symbol: "Cd", name: "镉", x: 12, y: 5, family: "transition" },
  { n: 49, symbol: "In", name: "铟", x: 13, y: 5, family: "post" },
  { n: 50, symbol: "Sn", name: "锡", x: 14, y: 5, family: "post" },
  { n: 51, symbol: "Sb", name: "锑", x: 15, y: 5, family: "metalloid" },
  { n: 52, symbol: "Te", name: "碲", x: 16, y: 5, family: "metalloid" },
  { n: 53, symbol: "I", name: "碘", x: 17, y: 5, family: "halogen" },
  { n: 54, symbol: "Xe", name: "氙", x: 18, y: 5, family: "noble" },
  { n: 55, symbol: "Cs", name: "铯", x: 1, y: 6, family: "alkali" },
  { n: 56, symbol: "Ba", name: "钡", x: 2, y: 6, family: "alkaline" },
  { n: 57, symbol: "La", name: "镧", x: 3, y: 8, family: "lanthanide" },
  { n: 72, symbol: "Hf", name: "铪", x: 4, y: 6, family: "transition" },
  { n: 73, symbol: "Ta", name: "钽", x: 5, y: 6, family: "transition" },
  { n: 74, symbol: "W", name: "钨", x: 6, y: 6, family: "transition" },
  { n: 75, symbol: "Re", name: "铼", x: 7, y: 6, family: "transition" },
  { n: 76, symbol: "Os", name: "锇", x: 8, y: 6, family: "transition" },
  { n: 77, symbol: "Ir", name: "铱", x: 9, y: 6, family: "transition" },
  { n: 78, symbol: "Pt", name: "铂", x: 10, y: 6, family: "transition" },
  { n: 79, symbol: "Au", name: "金", x: 11, y: 6, family: "transition" },
  { n: 80, symbol: "Hg", name: "汞", x: 12, y: 6, family: "transition" },
  { n: 81, symbol: "Tl", name: "铊", x: 13, y: 6, family: "post" },
  { n: 82, symbol: "Pb", name: "铅", x: 14, y: 6, family: "post" },
  { n: 83, symbol: "Bi", name: "铋", x: 15, y: 6, family: "post" },
  { n: 84, symbol: "Po", name: "钋", x: 16, y: 6, family: "metalloid" },
  { n: 85, symbol: "At", name: "砹", x: 17, y: 6, family: "halogen" },
  { n: 86, symbol: "Rn", name: "氡", x: 18, y: 6, family: "noble" },
  { n: 87, symbol: "Fr", name: "钫", x: 1, y: 7, family: "alkali" },
  { n: 88, symbol: "Ra", name: "镭", x: 2, y: 7, family: "alkaline" },
  { n: 89, symbol: "Ac", name: "锕", x: 3, y: 9, family: "actinide" },
  { n: 104, symbol: "Rf", name: "𬬻", x: 4, y: 7, family: "transition" },
  { n: 105, symbol: "Db", name: "𬭊", x: 5, y: 7, family: "transition" },
  { n: 106, symbol: "Sg", name: "𬭳", x: 6, y: 7, family: "transition" },
  { n: 107, symbol: "Bh", name: "𬭛", x: 7, y: 7, family: "transition" },
  { n: 108, symbol: "Hs", name: "𬭶", x: 8, y: 7, family: "transition" },
  { n: 109, symbol: "Mt", name: "鿏", x: 9, y: 7, family: "transition" },
  { n: 110, symbol: "Ds", name: "鐽", x: 10, y: 7, family: "transition" },
  { n: 111, symbol: "Rg", name: "錀", x: 11, y: 7, family: "transition" },
  { n: 112, symbol: "Cn", name: "鎶", x: 12, y: 7, family: "transition" },
  { n: 113, symbol: "Nh", name: "鉨", x: 13, y: 7, family: "post" },
  { n: 114, symbol: "Fl", name: "鈇", x: 14, y: 7, family: "post" },
  { n: 115, symbol: "Mc", name: "镆", x: 15, y: 7, family: "post" },
  { n: 116, symbol: "Lv", name: "鉝", x: 16, y: 7, family: "post" },
  { n: 117, symbol: "Ts", name: "鿬", x: 17, y: 7, family: "halogen" },
  { n: 118, symbol: "Og", name: "鿫", x: 18, y: 7, family: "noble" },
  { n: 58, symbol: "Ce", name: "铈", x: 4, y: 8, family: "lanthanide" },
  { n: 59, symbol: "Pr", name: "镨", x: 5, y: 8, family: "lanthanide" },
  { n: 60, symbol: "Nd", name: "钕", x: 6, y: 8, family: "lanthanide" },
  { n: 61, symbol: "Pm", name: "钷", x: 7, y: 8, family: "lanthanide" },
  { n: 62, symbol: "Sm", name: "钐", x: 8, y: 8, family: "lanthanide" },
  { n: 63, symbol: "Eu", name: "铕", x: 9, y: 8, family: "lanthanide" },
  { n: 64, symbol: "Gd", name: "钆", x: 10, y: 8, family: "lanthanide" },
  { n: 65, symbol: "Tb", name: "铽", x: 11, y: 8, family: "lanthanide" },
  { n: 66, symbol: "Dy", name: "镝", x: 12, y: 8, family: "lanthanide" },
  { n: 67, symbol: "Ho", name: "钬", x: 13, y: 8, family: "lanthanide" },
  { n: 68, symbol: "Er", name: "铒", x: 14, y: 8, family: "lanthanide" },
  { n: 69, symbol: "Tm", name: "铥", x: 15, y: 8, family: "lanthanide" },
  { n: 70, symbol: "Yb", name: "镱", x: 16, y: 8, family: "lanthanide" },
  { n: 71, symbol: "Lu", name: "镥", x: 17, y: 8, family: "lanthanide" },
  { n: 90, symbol: "Th", name: "钍", x: 4, y: 9, family: "actinide" },
  { n: 91, symbol: "Pa", name: "镤", x: 5, y: 9, family: "actinide" },
  { n: 92, symbol: "U", name: "铀", x: 6, y: 9, family: "actinide" },
  { n: 93, symbol: "Np", name: "镎", x: 7, y: 9, family: "actinide" },
  { n: 94, symbol: "Pu", name: "钚", x: 8, y: 9, family: "actinide" },
  { n: 95, symbol: "Am", name: "镅", x: 9, y: 9, family: "actinide" },
  { n: 96, symbol: "Cm", name: "锔", x: 10, y: 9, family: "actinide" },
  { n: 97, symbol: "Bk", name: "锫", x: 11, y: 9, family: "actinide" },
  { n: 98, symbol: "Cf", name: "锎", x: 12, y: 9, family: "actinide" },
  { n: 99, symbol: "Es", name: "锿", x: 13, y: 9, family: "actinide" },
  { n: 100, symbol: "Fm", name: "镄", x: 14, y: 9, family: "actinide" },
  { n: 101, symbol: "Md", name: "钔", x: 15, y: 9, family: "actinide" },
  { n: 102, symbol: "No", name: "锘", x: 16, y: 9, family: "actinide" },
  { n: 103, symbol: "Lr", name: "铹", x: 17, y: 9, family: "actinide" },
];

const notes = {
  1: ["氢最轻，和氧组成水。", "水、酸、燃烧和还原反应里经常出现。"],
  2: ["氦很稳定，常用于气球和低温环境。", "记住稀有气体通常不爱参加反应。"],
  3: ["锂是很轻的金属，常联想到电池。", "放在第一族，性质活泼。"],
  4: ["铍属于碱土金属，和镁、钙同列。", "初中少考，主要用来理解同族相似。"],
  5: ["硼像边界元素，常被归为类金属。", "知道它在金属和非金属之间即可。"],
  6: ["碳能成链，生命和燃料都离不开它。", "二氧化碳、碳酸盐、还原氧化铜常考。"],
  7: ["氮占空气大部分，但平时比较稳定。", "空气成分、氮肥和燃烧条件常见。"],
  8: ["氧支持燃烧，也支持呼吸。", "氧气制取、性质、氧化反应是重点。"],
  9: ["氟是最活泼的卤素之一。", "初中少深入，和氯放在同一族记。"],
  10: ["氖稳定，霓虹灯的名字就来自它。", "稀有气体稳定、可作保护气。"],
  11: ["钠很活泼，食盐里有钠元素。", "氯化钠、碳酸钠、氢氧化钠常考。"],
  12: ["镁燃烧会发出耀眼白光。", "镁条燃烧、金属活动性顺序常见。"],
  13: ["铝表面有致密氧化膜。", "铝制品耐腐蚀、金属材料常考。"],
  14: ["硅是砂石和芯片的重要元素。", "初中主要知道二氧化硅和硅酸盐。"],
  15: ["磷容易联想到燃烧和火柴。", "白磷燃烧实验、空气中氧气体积分数常见。"],
  16: ["硫是黄色固体，燃烧生成刺激性气体。", "二氧化硫、酸雨和燃烧现象常考。"],
  17: ["氯是典型卤素，常见于食盐和消毒。", "氯化物、氯离子检验常见。"],
  18: ["氩稳定，常用作保护气。", "记住稀有气体化学性质不活泼。"],
  19: ["钾和钠同族，都很活泼。", "金属活动性顺序里钾排在前面。"],
  20: ["钙常联想到骨骼、石灰石和鸡蛋壳。", "碳酸钙、氧化钙、氢氧化钙常考。"],
  26: ["铁是初中最常见的金属主角。", "生锈、铁与酸反应、金属活动性常考。"],
  29: ["铜导电好，颜色偏红。", "铜和氧气、氧化铜还原实验常见。"],
  30: ["锌常用于和酸反应制取氢气。", "实验室制氢、金属活动性顺序常考。"],
  35: ["溴是液态卤素，和氯、碘同族。", "用于理解卤素同族性质递变。"],
  47: ["银不只是贵金属，也能检验氯离子。", "硝酸银和氯离子生成白色沉淀。"],
  53: ["碘常和淀粉变蓝联系在一起。", "淀粉检验、碘盐和卤素性质常见。"],
  56: ["钡常用于硫酸根离子检验。", "硫酸钡白色沉淀是常见现象。"],
  79: ["金化学性质稳定，不容易被腐蚀。", "用于理解金属活动性靠后。"],
  80: ["汞是常温液态金属。", "知道有毒，实验安全中要避免接触。"],
};

const seriesPlaceholders = [
  { range: "57-71", symbols: "La-Lu", x: 3, y: 6, family: "lanthanide", label: "镧系元素 57 到 71" },
  { range: "89-103", symbols: "Ac-Lr", x: 3, y: 7, family: "actinide", label: "锕系元素 89 到 103" },
];

const examNumbers = new Set([1, 2, 6, 7, 8, 11, 12, 13, 14, 15, 16, 17, 19, 20, 26, 29, 30, 35, 47, 53, 56, 79, 80]);
const topTwenty = new Set(Array.from({ length: 20 }, (_, index) => index + 1));
const firstThirtySix = new Set(Array.from({ length: 36 }, (_, index) => index + 1));
const columnFocus = new Set([1, 2, 9, 10, 11, 12, 17, 18, 19, 20, 35, 36, 37, 38, 53, 54, 55, 56, 85, 86, 87, 88, 117, 118]);
const valenceFocus = new Set([1, 8, 11, 12, 13, 16, 17, 19, 20, 26, 29, 30, 47, 56, 80]);
const activityFocus = new Set([1, 11, 12, 13, 19, 20, 26, 29, 30, 47, 50, 78, 79, 80, 82]);
const massFocus = new Set([1, 6, 7, 8, 11, 12, 13, 14, 15, 16, 17, 19, 20, 25, 26, 29, 30, 35, 47, 53, 56, 82]);
const aliasFocus = new Set([1, 6, 8, 11, 12, 13, 16, 17, 20, 26, 29, 80]);
const precipitationFocus = new Set([6, 8, 12, 13, 16, 17, 19, 20, 25, 26, 29, 35, 47, 53, 56]);
const electronConfigFocus = new Set([24, 26, 29]);
const transitionFocus = new Set([24, 25, 26, 29, 30]);
const metalFamilies = new Set(["alkali", "alkaline", "transition", "lanthanide", "actinide", "post"]);
const nonmetalFamilies = new Set(["nonmetal", "halogen", "noble"]);
const radioactiveNumbers = new Set([43, 61, ...Array.from({ length: 35 }, (_, index) => index + 84)]);
const syntheticNumbers = new Set([43, 61, ...Array.from({ length: 26 }, (_, index) => index + 93)]);
const atomicMasses = {
  1: "1.008",
  2: "4.003",
  3: "6.94",
  4: "9.012",
  5: "10.81",
  6: "12.01",
  7: "14.01",
  8: "16.00",
  9: "19.00",
  10: "20.18",
  11: "22.99",
  12: "24.31",
  13: "26.98",
  14: "28.09",
  15: "30.97",
  16: "32.06",
  17: "35.45",
  18: "39.95",
  19: "39.10",
  20: "40.08",
  21: "44.96",
  22: "47.87",
  23: "50.94",
  24: "52.00",
  25: "54.94",
  26: "55.85",
  27: "58.93",
  28: "58.69",
  29: "63.55",
  30: "65.38",
  31: "69.72",
  32: "72.63",
  33: "74.92",
  34: "78.97",
  35: "79.90",
  36: "83.80",
  37: "85.47",
  38: "87.62",
  39: "88.91",
  40: "91.22",
  41: "92.91",
  42: "95.95",
  43: "[98]",
  44: "101.1",
  45: "102.9",
  46: "106.4",
  47: "107.9",
  48: "112.4",
  49: "114.8",
  50: "118.7",
  51: "121.8",
  52: "127.6",
  53: "126.9",
  54: "131.3",
  55: "132.9",
  56: "137.3",
  57: "138.9",
  58: "140.1",
  59: "140.9",
  60: "144.2",
  61: "[145]",
  62: "150.4",
  63: "152.0",
  64: "157.3",
  65: "158.9",
  66: "162.5",
  67: "164.9",
  68: "167.3",
  69: "168.9",
  70: "173.0",
  71: "175.0",
  72: "178.5",
  73: "180.9",
  74: "183.8",
  75: "186.2",
  76: "190.2",
  77: "192.2",
  78: "195.1",
  79: "197.0",
  80: "200.6",
  81: "204.4",
  82: "207.2",
  83: "209.0",
  84: "[209]",
  85: "[210]",
  86: "[222]",
  87: "[223]",
  88: "[226]",
  89: "[227]",
  90: "232.0",
  91: "231.0",
  92: "238.0",
  93: "[237]",
  94: "[244]",
  95: "[243]",
  96: "[247]",
  97: "[247]",
  98: "[251]",
  99: "[252]",
  100: "[257]",
  101: "[258]",
  102: "[259]",
  103: "[262]",
  104: "[267]",
  105: "[268]",
  106: "[269]",
  107: "[270]",
  108: "[270]",
  109: "[278]",
  110: "[281]",
  111: "[282]",
  112: "[285]",
  113: "[286]",
  114: "[289]",
  115: "[290]",
  116: "[293]",
  117: "[294]",
  118: "[294]",
};

const modes = {
  top20: {
    title: "前二十元素",
    hint: "用口诀先打底，再把每个元素放回周期表。",
    includes: (element) => topTwenty.has(element.n),
  },
  first36: {
    title: "前36号元素",
    hint: "前四周期先背到氪，掌握主族位置和常见过渡金属。",
    includes: (element) => firstThirtySix.has(element.n),
  },
  valenceFocus: {
    title: "常见化合价",
    hint: "先抓固定价，再重点标记 Fe、Cu、S、Cl 这些变价元素。",
    includes: (element) => valenceFocus.has(element.n),
  },
  activityFocus: {
    title: "金属活动性顺序",
    hint: "按 K-Ca-Na-Mg-Al-Zn-Fe-Sn-Pb-H-Cu-Hg-Ag-Pt-Au 记反应判断。",
    includes: (element) => activityFocus.has(element.n),
  },
  massFocus: {
    title: "常见相对原子质量",
    hint: "高频计算元素用近似值背，周期表小数不用全部死记。",
    includes: (element) => massFocus.has(element.n),
  },
  aliasFocus: {
    title: "常见物质俗名",
    hint: "生活名和化学式互相转换，优先记 Na、Ca、C、Fe、Cu、Hg 相关物质。",
    includes: (element) => aliasFocus.has(element.n),
  },
  precipitationFocus: {
    title: "沉淀与颜色",
    hint: "把 AgCl、BaSO4、Cu(OH)2、Fe(OH)3 和常见颜色题眼连起来。",
    includes: (element) => precipitationFocus.has(element.n),
  },
  mainGroupFocus: {
    title: "主族元素族群",
    hint: "先看 1、2、13-18 族，重点用代表元素理解同族递变。",
    includes: (element) => element.x <= 2 || element.x >= 13,
  },
  electronConfigFocus: {
    title: "电子排布易错点",
    hint: "Cr、Cu 基态特例和 Fe/Cu 阳离子排布是高中高频坑点。",
    includes: (element) => electronConfigFocus.has(element.n),
  },
  transitionFocus: {
    title: "过渡金属高频",
    hint: "聚焦 Cr、Mn、Fe、Cu、Zn 的变价、颜色、沉淀和氧化还原。",
    includes: (element) => transitionFocus.has(element.n),
  },
  columns: {
    title: "先记四列",
    hint: "第 1 族活泼，第 2 族常成二价，第 17 族卤素，第 18 族稳定。",
    includes: (element) => columnFocus.has(element.n),
  },
  metals: {
    title: "金属家族",
    hint: "周期表左侧和中部多是金属，常见特点是有光泽、能导电。",
    includes: (element) => metalFamilies.has(element.family),
  },
  nonmetals: {
    title: "非金属家族",
    hint: "右上角集中着非金属，氧、碳、氮、氯都是初中高频元素。",
    includes: (element) => nonmetalFamilies.has(element.family),
  },
  halogens: {
    title: "卤素反应",
    hint: "第 17 族从氟到砹，记住氯、溴、碘最有用。",
    includes: (element) => element.family === "halogen",
  },
  nobles: {
    title: "稀有气体",
    hint: "最右一列通常很稳定，常用作保护气或发光气体。",
    includes: (element) => element.family === "noble",
  },
  exam: {
    title: "考试高频",
    hint: "把实验、空气、水、金属活动性、沉淀检验相关元素先记牢。",
    includes: (element) => examNumbers.has(element.n),
  },
  tour: {
    title: "自动导览",
    hint: "跟着高亮元素走一遍，边看位置边读记忆钩子。",
    includes: (element) => topTwenty.has(element.n),
  },
};

const table = document.querySelector("#periodicTable");
const legend = document.querySelector("#legend");
const modeTitle = document.querySelector("#modeTitle");
const modeHint = document.querySelector("#modeHint");
const tourStep = document.querySelector("#tourStep");
const detailNumber = document.querySelector("#detailNumber");
const detailName = document.querySelector("#detailName");
const detailPronunciation = document.querySelector("#detailPronunciation");
const detailSymbol = document.querySelector("#detailSymbol");
const detailMass = document.querySelector("#detailMass");
const detailEnglish = document.querySelector("#detailEnglish");
const detailPriority = document.querySelector("#detailPriority");
const detailPosition = document.querySelector("#detailPosition");
const detailFamily = document.querySelector("#detailFamily");
const detailValence = document.querySelector("#detailValence");
const detailMemory = document.querySelector("#detailMemory");
const detailExam = document.querySelector("#detailExam");
const detailCommon = document.querySelector("#detailCommon");
const symbolMnemonicCard = document.querySelector("#symbolMnemonicCard");
const symbolMnemonicSymbol = document.querySelector("#symbolMnemonicSymbol");
const symbolMnemonicText = document.querySelector("#symbolMnemonicText");
const detailPanel = document.querySelector("#detailPanel");
const drawerClose = document.querySelector("#drawerClose");
const elementDrawer = document.querySelector("#elementDrawer");
const noteDrawer = document.querySelector("#noteDrawer");
const noteLabel = document.querySelector("#noteLabel");
const noteTitle = document.querySelector("#noteTitle");
const noteBody = document.querySelector("#noteBody");
const studyButtons = document.querySelectorAll(".study-button");
const studyStrip = document.querySelector(".study-strip");
const studyToggle = document.querySelector("#studyToggle");
const studyPanelButton = document.querySelector("#studyPanelButton");
const mnemonicButton = document.querySelector("#mnemonicButton");
const guideToggle = document.querySelector("#guideToggle");
const elementGuide = document.querySelector("#elementGuide");

let currentMode = null;
let selectedNumber = null;
let activeFamily = null;
let tourIndex = 0;
let tourTimer = null;
let drawerType = null;
let activeStudyNote = null;

const pronunciations = {
  1: "qīng",
  2: "hài",
  3: "lǐ",
  4: "pí",
  5: "péng",
  6: "tàn",
  7: "dàn",
  8: "yǎng",
  9: "fú",
  10: "nǎi",
  11: "nà",
  12: "měi",
  13: "lǚ",
  14: "guī",
  15: "lín",
  16: "liú",
  17: "lǜ",
  18: "yà",
  19: "jiǎ",
  20: "gài",
  21: "kàng",
  22: "tài",
  23: "fán",
  24: "gè",
  25: "měng",
  26: "tiě",
  27: "gǔ",
  28: "niè",
  29: "tóng",
  30: "xīn",
  31: "jiā",
  32: "zhě",
  33: "shēn",
  34: "xī",
  35: "xiù",
  36: "kè",
  37: "rú",
  38: "sī",
  39: "yǐ",
  40: "gào",
  41: "ní",
  42: "mù",
  43: "dé",
  44: "liǎo",
  45: "lǎo",
  46: "bǎ",
  47: "yín",
  48: "gé",
  49: "yīn",
  50: "xī",
  51: "tī",
  52: "dì",
  53: "diǎn",
  54: "xiān",
  55: "sè",
  56: "bèi",
  57: "lán",
  58: "shì",
  59: "pǔ",
  60: "nǚ",
  61: "pǒ",
  62: "shān",
  63: "yǒu",
  64: "gá",
  65: "tè",
  66: "dī",
  67: "huǒ",
  68: "ěr",
  69: "diū",
  70: "yì",
  71: "lǔ",
  72: "hā",
  73: "tǎn",
  74: "wū",
  75: "lái",
  76: "é",
  77: "yī",
  78: "bó",
  79: "jīn",
  80: "gǒng",
  81: "tā",
  82: "qiān",
  83: "bì",
  84: "pō",
  85: "ài",
  86: "dōng",
  87: "fāng",
  88: "léi",
  89: "ā",
  90: "tǔ",
  91: "pú",
  92: "yóu",
  93: "ná",
  94: "bù",
  95: "méi",
  96: "jú",
  97: "péi",
  98: "kāi",
  99: "āi",
  100: "fèi",
  101: "mén",
  102: "nuò",
  103: "láo",
  104: "lú",
  105: "dù",
  106: "xǐ",
  107: "bō",
  108: "hēi",
  109: "mài",
  110: "dá",
  111: "lún",
  112: "gē",
  113: "nǐ",
  114: "fū",
  115: "mò",
  116: "lì",
  117: "tián",
  118: "ào",
};

const speechNames = {
  104: "卢",
  105: "杜",
  106: "喜",
  107: "波",
  108: "黑",
  109: "麦",
  110: "达",
  111: "伦",
  112: "哥",
  113: "你",
  114: "夫",
  115: "莫",
  116: "立",
  117: "田",
  118: "奥",
};

const studyNotes = window.studyNotes || {};

const symbolMnemonics = {
  1: "下面的工旋转后90°就是H",
  2: "可以想象成打招呼的拼音“hai”",
  3: "拼音li",
  4: "你太皮了，我们还是BE吧",
  5: "蓬（硼）B生辉",
  6: "可以想象成Coke(可乐)是碳酸饮料",
  7: "拼音dan的n",
  8: "深呼吸嘴巴是O形的",
  9: "拼音Fu的声母部分F",
  10: "奶奶呢ne",
  11: "拼音na",
  12: "美丽的女孩Meigirl",
  13: "美女（铝），爱了爱了（Al）",
  14: "死鬼",
  15: "磷的味道很臭像P",
  16: "弯弯曲曲的流水",
  17: "绿（氯）色的材料（Cl）",
  18: "爱人（Ar）呀（氩）",
  19: "“甲”是甲乙丙丁中的老大king",
  20: "擦盖子",
};

const mnemonicGroups = [
  {
    title: "主表口诀",
    rows: [
      ["氢H、氦He、锂Li、铍Be、硼B", "青害李皮朋"],
      ["碳C、氮N、氧O、氟F、氖Ne", "探蛋养福奶"],
      ["钠Na、镁Mg、铝Al、硅Si、磷P", "那美女桂林"],
      ["硫S、氯Cl、氩Ar、钾K、钙Ca", "柳绿芽加盖"],
      ["钪Sc、钛Ti、钒V、铬Cr、锰Mn", "康泰翻个梦"],
      ["铁Fe、钴Co、镍Ni、铜Cu、锌Zn", "铁骨捏通信"],
      ["镓Ga、锗Ge、砷As、硒Se、溴Br", "夹着身西秀"],
      ["氪Kr、铷Rb、锶Sr、钇Y、锆Zr", "刻人肆意高"],
      ["铌Nb、钼Mo、锝Tc、钌Ru、铑Rh", "泥木的了老"],
      ["钯Pd、银Ag、镉Cd、铟In、锡Sn", "巴音隔音系"],
      ["锑Sb、碲Te、碘I、氙Xe、铯Cs", "替地点显色"],
      ["钡Ba、镧La、铪Hf、钽Ta、钨W", "被拦哈贪污"],
      ["铼Re、锇Os、铱Ir、铂Pt、金Au", "来恶意铂金"],
      ["汞Hg、铊Tl、铅Pb、铋Bi、钋Po", "拱他前必破"],
      ["砹At、氡Rn、钫Fr、镭Ra、锕Ac", "爱东方雷啊"],
      ["𬬻Rf、𬭊Db、𬭳Sg、𬭛Bh、𬭶Hs", "卢杜喜波黑"],
      ["鿏Mt、鐽Ds、錀Rg、鎶Cn、鉨Nh", "卖达仑哥你"],
      ["鈇Fl、镆Mc、鉝Lv、鿬Ts、鿫Og", "夫莫利甜奥"],
    ],
  },
  {
    title: "镧系元素",
    rows: [
      ["镧La、铈Ce、镨Pr、钕Nd、钷Pm", "蓝是普女泊"],
      ["钐Sm、铕Eu、钆Gd、铽Tb、镝Dy", "山有噶特低"],
      ["钬Ho、铒Er、铥Tm、镱Yb、镥Lu", "火耳丢一鲁"],
    ],
  },
  {
    title: "锕系元素",
    rows: [
      ["锕Ac、钍Th、镤Pa、铀U、镎Np", "阿土仆由拿"],
      ["钚Pu、镅Am、锔Cm、锫Bk、锎Cf", "不没居陪开"],
      ["锿Es、镄Fm、钔Md、锘No、铹Lr", "爱妃们诺劳"],
    ],
  },
];

function buildTable() {
  seriesPlaceholders.forEach((placeholder) => {
    const tile = document.createElement("div");
    const isRadioactiveSeries = placeholder.family === "actinide";
    tile.className = `series-placeholder ${families[placeholder.family].className}${isRadioactiveSeries ? " is-radioactive" : ""}`;
    tile.style.gridColumn = placeholder.x;
    tile.style.gridRow = placeholder.y;
    tile.style.animationDelay = `${(placeholder.x + placeholder.y) * 0.025}s`;
    tile.dataset.family = placeholder.family;
    tile.setAttribute("aria-label", placeholder.label);
    tile.innerHTML = `
      <strong>${placeholder.range}</strong>
      <span>${placeholder.symbols}</span>
    `;
    table.appendChild(tile);
  });

  elements.forEach((element) => {
    const button = document.createElement("button");
    button.type = "button";
    const isRadioactive = radioactiveNumbers.has(element.n);
    button.className = `element ${families[element.family].className}${isRadioactive ? " is-radioactive" : ""}`;
    button.style.gridColumn = element.x;
    button.style.gridRow = element.y;
    button.style.animationDelay = `${(element.x + element.y) * 0.025}s`;
    button.dataset.number = element.n;
    button.setAttribute("aria-label", `${element.name}，原子序数 ${element.n}`);
    const syntheticMark = syntheticNumbers.has(element.n) ? '<span class="synthetic-mark">*</span>' : "";
    button.innerHTML = `
      <span class="atomic-number">${element.n}</span>
      <span class="atomic-mass">${getAtomicMass(element)}</span>
      <strong class="symbol">${element.symbol}${syntheticMark}</strong>
      <span class="name">${element.name}<em>${getPronunciation(element)}</em></span>
    `;
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      stopTour();
      if (drawerType === "element" && detailPanel.classList.contains("is-open") && selectedNumber === element.n) {
        selectedNumber = null;
        closeDrawer();
        applyMode();
        return;
      }
      clearTableFilters();
      selectElement(element.n);
      showElementDrawer();
      speakPronunciation(element);
    });
    table.appendChild(button);
  });
}

function buildLegend() {
  Object.entries(families).forEach(([familyKey, family]) => {
    const item = document.createElement("button");
    item.type = "button";
    item.className = `legend-item ${family.className}`;
    item.dataset.family = familyKey;
    item.innerHTML = `<span class="legend-swatch"></span>${family.name}`;
    item.addEventListener("click", (event) => {
      event.stopPropagation();
      setFamilyFilter(familyKey);
    });
    legend.appendChild(item);
  });
}

function getElement(number) {
  return elements.find((element) => element.n === number);
}

function getAtomicMass(element) {
  return window.elementDetails?.[element.n]?.mass || atomicMasses[element.n];
}

function formatPositionText(position) {
  const oldGroupNames = {
    1: "ⅠA族",
    2: "ⅡA族",
    3: "ⅢB族",
    4: "ⅣB族",
    5: "ⅤB族",
    6: "ⅥB族",
    7: "ⅦB族",
    8: "Ⅷ族",
    9: "Ⅷ族",
    10: "Ⅷ族",
    11: "ⅠB族",
    12: "ⅡB族",
    13: "ⅢA族",
    14: "ⅣA族",
    15: "ⅤA族",
    16: "ⅥA族",
    17: "ⅦA族",
    18: "0族",
  };
  const normalizedPosition = position.replace(/｜/g, " | ");
  const seriesMatch = normalizedPosition.match(/^第(\d+)周期 \| 第(镧系|锕系)族$/);
  if (seriesMatch) {
    return `第${seriesMatch[1]}周期 | ⅢB 族（${seriesMatch[2]}）`;
  }
  return normalizedPosition.replace(/第(\d+)族/, (match, group) => `${match}（${oldGroupNames[group]}）`);
}

function selectElement(number) {
  selectedNumber = number;
  const element = getElement(number);
  const family = families[element.family];
  const detail = window.elementDetails?.[element.n];
  const [memory, exam] = getNotes(element);

  detailNumber.textContent = element.n;
  detailName.textContent = detail?.name || element.name;
  detailPronunciation.textContent = detail?.pinyin || getPronunciation(element);
  detailSymbol.textContent = element.symbol;
  detailMass.textContent = `相对原子质量：${getAtomicMass(element)}`;
  detailEnglish.textContent = detail?.english || "";
  detailPriority.textContent = detail ? `${detail.priorityLevel} ${detail.priorityText}` : "按位置和类别理解";
  detailPriority.dataset.level = detail?.priorityLevel || "";
  detailPosition.textContent = formatPositionText(detail?.position || getPositionText(element));
  detailFamily.textContent = detail?.classification || family.name;
  detailValence.textContent = detail?.valence || "初高中通常不要求细背";
  detailExam.textContent = detail?.study || exam;
  detailCommon.textContent = detail?.common || "点击其他重点元素可查看常见物质和现象。";
  detailMemory.textContent = detail?.hook || memory;
  const symbolMnemonic = symbolMnemonics[element.n];
  symbolMnemonicCard.hidden = !symbolMnemonic;
  if (symbolMnemonic) {
    symbolMnemonicSymbol.textContent = element.symbol;
    symbolMnemonicText.textContent = symbolMnemonic;
  }

  applyMode();
}

function getPronunciation(element) {
  return pronunciations[element.n] || element.name;
}

function speakPronunciation(element) {
  if (!("speechSynthesis" in window) || typeof SpeechSynthesisUtterance === "undefined") return;

  const text = speechNames[element.n] || element.name;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "zh-CN";
  utterance.rate = 0.82;
  window.speechSynthesis.speak(utterance);
}

function getPositionText(element) {
  if (element.family === "lanthanide") return `第 ${element.y === 6 ? 6 : 8} 行，镧系元素区`;
  if (element.family === "actinide") return `第 ${element.y === 7 ? 7 : 9} 行，锕系元素区`;
  return `第 ${element.y} 周期，第 ${element.x} 族`;
}

function getNotes(element) {
  if (notes[element.n]) return notes[element.n];
  const familyName = families[element.family].name;
  return [
    `${element.name}属于${familyName}，先记住它在周期表中的位置。`,
    `中考通常不单独深挖${element.name}，重点是用它理解周期和族的规律。`,
  ];
}

function setMode(mode) {
  currentMode = mode;
  activeFamily = null;
  document.querySelectorAll(".mode-button").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.mode === mode);
  });
  document.querySelectorAll(".legend-item").forEach((item) => item.classList.remove("is-active"));

  if (mode === "tour") {
    closeDrawer();
    startTour();
  } else {
    stopTour();
    modeTitle.textContent = modes[mode].title;
    modeHint.textContent = modes[mode].hint;
    if (tourStep) tourStep.textContent = mode === "top20" ? "" : "点击元素";
    applyMode();
    if (studyNotes[mode]) showNoteDrawer(studyNotes[mode], mode);
  }
}

function setFamilyFilter(familyKey) {
  stopTour();
  closeDrawer();
  clearStudyButtons();
  selectedNumber = null;
  activeFamily = familyKey;
  currentMode = null;
  document.querySelectorAll(".mode-button").forEach((button) => button.classList.remove("is-active"));
  document.querySelectorAll(".legend-item").forEach((item) => {
    item.classList.toggle("is-active", item.dataset.family === familyKey);
  });
  modeTitle.textContent = families[familyKey].name;
  modeHint.textContent = `已高亮所有${families[familyKey].name}，点击任意元素可查看记忆钩子。`;
  if (tourStep) tourStep.textContent = "家族高亮";
  applyMode();
}

function applyMode() {
  const mode = currentMode ? modes[currentMode] : null;
  const hasActiveFilter = Boolean(activeFamily || mode || selectedNumber);

  if (mode) {
    modeTitle.textContent = mode.title;
    modeHint.textContent = mode.hint;
  }

  document.querySelectorAll(".element").forEach((tile) => {
    const element = getElement(Number(tile.dataset.number));
    const highlighted = activeFamily
      ? element.family === activeFamily
      : mode
        ? mode.includes(element)
        : element.n === selectedNumber;
    tile.classList.toggle("is-highlight", hasActiveFilter && highlighted);
    tile.classList.toggle("is-dim", hasActiveFilter && !highlighted);
    tile.classList.toggle("is-selected", element.n === selectedNumber);
  });

  document.querySelectorAll(".series-placeholder").forEach((tile) => {
    const highlighted = activeFamily ? tile.dataset.family === activeFamily : false;
    tile.classList.toggle("is-highlight", highlighted);
    tile.classList.toggle("is-dim", hasActiveFilter && !highlighted);
  });
}

function startTour() {
  clearInterval(tourTimer);
  const route = elements.filter((element) => topTwenty.has(element.n)).sort((a, b) => a.n - b.n);
  modeTitle.textContent = modes.tour.title;
  modeHint.textContent = modes.tour.hint;

  const advance = () => {
    const element = route[tourIndex % route.length];
    if (tourStep) tourStep.textContent = "";
    selectElement(element.n);
    tourIndex += 1;
  };

  advance();
  tourTimer = setInterval(advance, 1800);
}

function stopTour() {
  if (tourTimer) {
    clearInterval(tourTimer);
    tourTimer = null;
  }
}

document.querySelectorAll(".mode-button").forEach((button) => {
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    setMode(button.dataset.mode);
  });
});

studyButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    openStudyNote(button.dataset.studyNote);
  });
});

function syncCompactHeader() {
  document.body.classList.toggle("is-compact-header", window.innerWidth > 620 && window.scrollY >= 24);
}

function setStudyPanelVisible(isVisible) {
  studyStrip.hidden = !isVisible;
  studyStrip.classList.remove("is-collapsed");
  studyPanelButton.classList.toggle("is-active", isVisible);
  studyPanelButton.setAttribute("aria-expanded", String(isVisible));
  studyToggle.setAttribute("aria-expanded", String(isVisible));
  studyToggle.querySelector("span").textContent = "隐藏";
}

function setElementGuideVisible(isVisible) {
  elementGuide.hidden = !isVisible;
  guideToggle.classList.toggle("is-active", isVisible);
  guideToggle.setAttribute("aria-expanded", String(isVisible));
}

studyToggle.addEventListener("click", (event) => {
  event.stopPropagation();
  setStudyPanelVisible(false);
});

studyPanelButton.addEventListener("click", (event) => {
  event.stopPropagation();
  setStudyPanelVisible(studyStrip.hidden);
});

guideToggle.addEventListener("click", (event) => {
  event.stopPropagation();
  setElementGuideVisible(elementGuide.hidden);
});

mnemonicButton.addEventListener("click", (event) => {
  event.stopPropagation();
  openMnemonicNote();
});

window.addEventListener("scroll", syncCompactHeader, { passive: true });
window.addEventListener("resize", syncCompactHeader);

function showElementDrawer() {
  drawerType = "element";
  mnemonicButton.classList.remove("is-active");
  clearStudyButtons();
  elementDrawer.hidden = false;
  noteDrawer.hidden = true;
  detailPanel.classList.add("is-open");
  detailPanel.setAttribute("aria-hidden", "false");
}

function openStudyNote(key) {
  const note = studyNotes[key];
  if (!note) return;

  stopTour();

  if (drawerType === "note" && activeStudyNote === key && detailPanel.classList.contains("is-open")) {
    closeDrawer();
    applyMode();
    return;
  }

  clearTableFilters();
  currentMode = note.highlightMode && modes[note.highlightMode] ? note.highlightMode : null;
  showNoteDrawer(note, key);
  applyMode();
}

function showNoteDrawer(note, key) {
  drawerType = "note";
  mnemonicButton.classList.remove("is-active");
  activateStudyButton(key);
  noteLabel.hidden = true;
  noteLabel.textContent = "";
  noteTitle.textContent = note.title;
  noteBody.innerHTML = renderStudyNote(note);
  elementDrawer.hidden = true;
  noteDrawer.hidden = false;
  detailPanel.classList.add("is-open");
  detailPanel.setAttribute("aria-hidden", "false");
}

function openMnemonicNote() {
  stopTour();

  if (drawerType === "mnemonic" && detailPanel.classList.contains("is-open")) {
    closeDrawer();
    return;
  }

  clearTableFilters();
  drawerType = "mnemonic";
  mnemonicButton.classList.add("is-active");
  noteLabel.hidden = true;
  noteLabel.textContent = "";
  noteTitle.textContent = "元素速记口诀";
  noteBody.innerHTML = renderMnemonicNote();
  elementDrawer.hidden = true;
  noteDrawer.hidden = false;
  detailPanel.classList.add("is-open");
  detailPanel.setAttribute("aria-hidden", "false");
  applyMode();
}

function renderMnemonicNote() {
  const groupsHtml = mnemonicGroups.map((group) => {
    const rowsHtml = group.rows.map(([elementsText, phrase]) => `
      <li class="mnemonic-row">
        <span class="mnemonic-elements">${escapeHtml(elementsText)}</span>
        <span class="mnemonic-phrase">${escapeHtml(phrase)}</span>
      </li>
    `).join("");
    return `
      <section class="mnemonic-section">
        <h3>${escapeHtml(group.title)}</h3>
        <ol>${rowsHtml}</ol>
      </section>
    `;
  }).join("");
  return `<div class="mnemonic-note">${groupsHtml}</div>`;
}

function renderStudyNote(note) {
  const meta = note.importance ? [`重要度：${note.importance}`] : [];
  const metaHtml = meta.length ? `<div class="note-meta">${meta.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}</div>` : "";
  const titleHtml = note.contentTitle && note.contentTitle !== note.title ? `<p class="note-subtitle">${escapeHtml(note.contentTitle)}</p>` : "";
  const sectionsHtml = note.sections.map((section) => {
    const lines = section.lines.map((line) => `<li>${escapeHtml(line)}</li>`).join("");
    return `
      <section class="note-section note-section-${section.type || "default"}">
        <h3>${escapeHtml(section.title)}</h3>
        <ul>${lines}</ul>
      </section>
    `;
  }).join("");
  return `${metaHtml}${titleHtml}<div class="note-sections">${sectionsHtml}</div>`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function closeDrawer({ clearStudyButtons: shouldClearStudyButtons = true } = {}) {
  drawerType = null;
  mnemonicButton.classList.remove("is-active");
  if (shouldClearStudyButtons) clearStudyButtons();
  detailPanel.classList.remove("is-open");
  detailPanel.setAttribute("aria-hidden", "true");
}

function activateStudyButton(key) {
  activeStudyNote = key;
  studyButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.studyNote === key);
  });
}

function clearStudyButtons() {
  activeStudyNote = null;
  studyButtons.forEach((button) => button.classList.remove("is-active"));
}

function clearLegendFilter() {
  activeFamily = null;
  document.querySelectorAll(".legend-item").forEach((item) => item.classList.remove("is-active"));
}

function clearTableFilters() {
  currentMode = null;
  selectedNumber = null;
  mnemonicButton.classList.remove("is-active");
  clearLegendFilter();
  clearStudyButtons();
}

drawerClose.addEventListener("click", (event) => {
  event.stopPropagation();
  closeDrawer();
});

detailPanel.addEventListener("click", (event) => {
  event.stopPropagation();
});

document.addEventListener("click", (event) => {
  if (!detailPanel.classList.contains("is-open")) return;
  if (event.target.closest(".element, .legend-item, .mode-button, .study-button, .study-toggle, .mnemonic-button, .detail-panel")) return;
  closeDrawer();
});

buildTable();
buildLegend();
syncCompactHeader();
applyMode();
