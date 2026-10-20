// 建立六個安全主題資料。
const quizTopics = [ // 六個主題會同時出現在測驗畫面中。
  { id: "handwashing", title: "洗手", slogan: "濕、搓、沖、捧、擦", description: "用正確步驟把雙手洗乾淨。", color: "#BDE0FE" }, // 建立洗手主題。
  { id: "earthquake", title: "地震", slogan: "趴、掩、穩", description: "地震時記得趴、掩、穩。", color: "#FFD6A5" }, // 建立地震主題。
  { id: "dengue", title: "防登革熱", slogan: "巡、倒、清、刷", description: "清除積水，避免病媒蚊孳生。", color: "#FFF1B6" }, // 建立防登革熱主題。
  { id: "burn", title: "燙傷", slogan: "沖、脫、泡、蓋、送", description: "燙傷時記得沖、脫、泡、蓋、送。", color: "#BDE0FE" }, // 建立燙傷主題。
  { id: "crossing", title: "過馬路", slogan: "停、看、聽", description: "過馬路時要停、看、聽。", color: "#D8C4F1" }, // 建立過馬路主題。
  { id: "firstAid", title: "急救", slogan: "叫、叫、AED", description: "緊急時要叫、叫、AED。", color: "#F7C8E0" } // 建立急救主題。
]; // 完成六個主題資料。

// 建立六張完整、不可拆分的口訣選項。
const optionDefinitions = [ // 每一張卡片都是完整的一組口訣。
  { id: "handwashing", text: "濕、搓、沖、捧、擦", ownerIndex: 0, color: "#BDE0FE" }, // 建立洗手選項。
  { id: "earthquake", text: "趴、掩、穩", ownerIndex: 1, color: "#FFD6A5" }, // 建立地震選項。
  { id: "dengue", text: "巡、倒、清、刷", ownerIndex: 2, color: "#FFF1B6" }, // 建立防登革熱選項。
  { id: "burn", text: "沖、脫、泡、蓋、送", ownerIndex: 3, color: "#BDE0FE" }, // 建立燙傷選項。
  { id: "crossing", text: "停、看、聽", ownerIndex: 4, color: "#D8C4F1" }, // 建立過馬路選項。
  { id: "firstAid", text: "叫、叫、AED", ownerIndex: 5, color: "#F7C8E0" } // 建立急救選項。
]; // 完成六張完整選項。

// 儲存題目資料。
let topics = []; // 儲存六個主題卡片。

// 儲存選項資料。
let optionCards = []; // 儲存六張完整口訣卡片。

// 儲存目前拖曳中的卡片。
let draggingCard = null; // 記錄正在拖曳的選項。

// 儲存拖曳水平偏移。
let dragOffsetX = 0; // 保存指標與卡片左側的距離。

// 儲存拖曳垂直偏移。
let dragOffsetY = 0; // 保存指標與卡片上方的距離。

// 儲存畫布物件。
let canvas; // 保存 p5.js 畫布。

// 儲存響應式版面資料。
let layout = {}; // 保存測驗與成績畫面的版面。

// 記錄是否已經交卷。
let submitted = false; // 交卷後不可再修改答案。

// 記錄是否顯示成績頁。
let resultShown = false; // 交卷後顯示獨立成績頁。

// 儲存答對數量。
let correctCount = 0; // 儲存答對幾組口訣。

// 儲存分數百分比。
let scorePercent = 0; // 儲存最後分數。

// 儲存煙火物件。
let fireworks = []; // 保存所有煙火粒子。

// 儲存最後一次產生煙火的時間。
let lastFireworkTime = 0; // 控制煙火產生間隔。

// 記錄是否啟用煙火。
let fireworksEnabled = false; // 分數超過百分之六十時啟用煙火。

// 初始化 p5.js 畫布。
function setup() { // 執行 p5.js 初始化。
  canvas = createCanvas(windowWidth, windowHeight); // 建立全螢幕畫布。
  canvas.elt.style.touchAction = "none"; // 防止觸控時頁面滾動。
  textFont("sans-serif"); // 設定一般無襯線字體。
  initializeQuiz(); // 初始化測驗資料。
  calculateLayout(); // 計算測驗版面。
  resizeCanvasToContent(); // 依照內容調整畫布高度。
} // 結束 setup 函式。

// 初始化測驗資料。
function initializeQuiz() { // 建立六個主題與六個選項。
  topics = quizTopics.map((topic) => ({ // 複製六個主題。
    ...topic, // 複製主題內容。
    placedCard: null // 設定尚未放置選項。
  })); // 完成主題資料。

  optionCards = optionDefinitions.map((option) => ({ // 複製六個選項。
    ...option, // 複製選項內容。
    x: 0, // 設定卡片水平位置。
    y: 0, // 設定卡片垂直位置。
    w: 0, // 設定卡片寬度。
    h: 0, // 設定卡片高度。
    location: -1, // -1 表示尚未放入題目。
    wrong: false, // 設定尚未答錯。
    isDragging: false // 設定尚未拖曳。
  })); // 完成選項資料。

  shuffleArray(optionCards); // 將選項隨機排列。
  submitted = false; // 重設交卷狀態。
  resultShown = false; // 重設成績顯示狀態。
  correctCount = 0; // 重設答對數量。
  scorePercent = 0; // 重設分數。
  fireworks = []; // 清除煙火。
  fireworksEnabled = false; // 關閉煙火。
  draggingCard = null; // 清除拖曳狀態。
} // 結束 initializeQuiz 函式。

// 將陣列隨機排序。
function shuffleArray(array) { // 接收需要隨機排序的陣列。
  for (let i = array.length - 1; i > 0; i--) { // 從陣列最後一項開始處理。
    const randomIndex = floor(random(i + 1)); // 產生隨機索引。
    [array[i], array[randomIndex]] = [array[randomIndex], array[i]]; // 交換陣列內容。
  } // 結束隨機排序。
} // 結束 shuffleArray 函式。

// 計算測驗版面。
function calculateLayout() { // 根據畫布寬度配置測驗內容。
  const margin = constrain(width * 0.025, 10, 28); // 設定畫布邊界。
  const smallScreen = width < 650; // 判斷是否為窄螢幕。
  const mediumScreen = width >= 650 && width < 900; // 判斷是否為中等螢幕。
  const columns = smallScreen ? 1 : mediumScreen ? 2 : 3; // 設定題目欄數。
  const gap = smallScreen ? 12 : 16; // 設定題目間距。
  const titleSize = constrain(width * 0.026, 18, 30); // 設定標題大小。
  const bodySize = constrain(width * 0.014, 11, 16); // 設定內文大小。
  const cardWidth = (width - margin * 2 - gap * (columns - 1)) / columns; // 計算題目卡寬度。
  const cardHeight = smallScreen ? 270 : mediumScreen ? 242 : 220; // 計算題目卡高度。
  const illustrationHeight = smallScreen ? 86 : mediumScreen ? 74 : 68; // 計算插圖高度。
  const dropHeight = smallScreen ? 48 : mediumScreen ? 44 : 40; // 計算投放區高度。

  layout = { // 建立測驗版面資料。
    margin: margin, // 儲存邊界。
    smallScreen: smallScreen, // 儲存窄螢幕狀態。
    mediumScreen: mediumScreen, // 儲存中螢幕狀態。
    columns: columns, // 儲存題目欄數。
    gap: gap, // 儲存題目間距。
    titleSize: titleSize, // 儲存標題大小。
    bodySize: bodySize, // 儲存文字大小。
    cardWidth: cardWidth, // 儲存題目卡寬度。
    cardHeight: cardHeight, // 儲存題目卡高度。
    illustrationHeight: illustrationHeight, // 儲存插圖高度。
    dropHeight: dropHeight, // 儲存投放區高度。
    firstY: 92, // 設定第一列題目位置。
    poolY: 0, // 預留選項區位置。
    buttonY: 0, // 預留按鈕位置。
    bottom: 0 // 預留畫布底部。
  }; // 完成測驗版面資料。

  let currentY = layout.firstY; // 設定目前列的垂直位置。
  let rowHeight = 0; // 儲存目前列高度。

  for (let i = 0; i < topics.length; i++) { // 逐一配置六張題目卡。
    const column = i % columns; // 計算目前欄數。

    if (column === 0) { // 判斷是否開始新的一列。
      rowHeight = 0; // 重設目前列高度。
    } // 結束新列判斷。

    const topic = topics[i]; // 取得目前主題。
    topic.x = margin + column * (cardWidth + gap); // 設定題目卡水平位置。
    topic.y = currentY; // 設定題目卡垂直位置。
    topic.w = cardWidth; // 設定題目卡寬度。
    topic.h = cardHeight; // 設定題目卡高度。
    topic.dropX = topic.x + 9; // 設定投放區水平位置。
    topic.dropY = topic.y + cardHeight - dropHeight - 9; // 設定投放區垂直位置。
    topic.dropW = topic.w - 18; // 設定投放區寬度。
    topic.dropH = dropHeight; // 設定投放區高度。
    rowHeight = max(rowHeight, cardHeight); // 更新目前列高度。

    if (column === columns - 1 || i === topics.length - 1) { // 判斷是否完成目前列。
      currentY += rowHeight + gap; // 移動至下一列。
    } // 結束換列判斷。
  } // 完成題目卡片配置。

  layout.poolY = currentY + 8; // 設定選項區垂直位置。
  layout.buttonY = layout.poolY + 190; // 設定按鈕位置。
  layout.bottom = layout.buttonY + 80; // 設定內容底部。
  positionOptionCards(); // 配置選項卡片。
} // 結束 calculateLayout 函式。

// 設定選項卡片位置。
function positionOptionCards() { // 將尚未放置的卡片排列在下方。
  const columns = layout.smallScreen ? 1 : 2; // 設定選項欄數。
  const gap = layout.smallScreen ? 8 : 10; // 設定選項間距。
  const cardWidth = (width - layout.margin * 2 - gap * (columns - 1)) / columns; // 計算選項寬度。
  const cardHeight = layout.smallScreen ? 52 : 54; // 設定選項高度。

  for (let i = 0; i < optionCards.length; i++) { // 逐一配置選項卡片。
    const card = optionCards[i]; // 取得目前選項。
    card.w = cardWidth; // 設定卡片寬度。
    card.h = cardHeight; // 設定卡片高度。

    if (card.location === -1 && !card.isDragging) { // 只排列尚未放置的卡片。
      const row = floor(i / columns); // 計算卡片列數。
      const column = i % columns; // 計算卡片欄數。
      card.x = layout.margin + column * (cardWidth + gap); // 設定卡片水平位置。
      card.y = layout.poolY + 42 + row * (cardHeight + gap); // 設定卡片垂直位置。
    } // 結束未放置判斷。
  } // 完成選項位置配置。
} // 結束 positionOptionCards 函式。

// 依內容調整測驗畫布高度。
function resizeCanvasToContent() { // 確保手機長版內容不重疊。
  const rows = ceil(optionCards.length / (layout.smallScreen ? 1 : 2)); // 計算選項列數。
  layout.buttonY = layout.poolY + 42 + rows * (layout.smallScreen ? 60 : 64) + 20; // 重新計算按鈕位置。
  layout.bottom = layout.buttonY + 80; // 更新內容底部位置。
  resizeCanvas(windowWidth, max(windowHeight, layout.bottom)); // 調整畫布高度。
} // 結束 resizeCanvasToContent 函式。

// 取得成績頁所需的最小高度。
function getResultScreenHeight() { // 計算成績畫面高度。
  return layout.smallScreen ? 760 : 650; // 手機使用較高的成績頁。
} // 結束 getResultScreenHeight 函式。

// p5.js 每一幀繪製畫面。
function draw() { // 開始繪製畫面。
  if (resultShown) { // 判斷是否已經顯示成績。
    drawResultScreen(); // 繪製獨立成績畫面。
    return; // 不再繪製測驗畫面。
  } // 結束成績判斷。

  drawBackground(); // 繪製測驗背景。
  drawHeader(); // 繪製測驗標題。
  drawTopicCards(); // 繪製六個題目。
  drawOptionPool(); // 繪製六個完整選項。
  drawButtons(); // 繪製交卷按鈕。

  if (fireworksEnabled) { // 判斷是否需要煙火。
    updateFireworks(); // 更新煙火。
    drawFireworks(); // 繪製煙火。
  } // 結束煙火判斷。
} // 結束 draw 函式。

// 繪製測驗背景。
function drawBackground() { // 繪製測驗頁背景。
  background("#F3FAF8"); // 設定背景顏色。
  noStroke(); // 關閉裝飾外框。
  fill("#D7F3DC"); // 設定左側裝飾色。
  circle(width * 0.04, 112, 70); // 繪製左側裝飾。
  fill("#CDE7F0"); // 設定右側裝飾色。
  circle(width * 0.97, 360, 90); // 繪製右側裝飾。
  fill("#FFF0B8"); // 設定底部裝飾色。
  circle(width * 0.05, height - 70, 80); // 繪製底部裝飾。
} // 結束 drawBackground 函式。

// 繪製測驗標題。
function drawHeader() { // 繪製標題與說明。
  textAlign(CENTER, CENTER); // 設定文字置中。
  fill("#176B87"); // 設定標題顏色。
  textStyle(BOLD); // 設定粗體。
  textSize(layout.titleSize); // 設定標題大小。
  text("生活安全口訣配對測驗", width / 2, 25); // 顯示標題。
  textStyle(NORMAL); // 恢復一般字體。
  fill("#315C5D"); // 設定說明文字顏色。
  textSize(layout.bodySize); // 設定說明文字大小。
  text("請將六句完整口訣拖曳到正確主題。", width / 2, 54); // 顯示操作說明。
} // 結束 drawHeader 函式。

// 繪製六個題目卡片。
function drawTopicCards() { // 開始繪製六張主題卡。
  for (let i = 0; i < topics.length; i++) { // 逐一繪製主題。
    drawTopicCard(topics[i], i); // 繪製單一主題。
  } // 結束主題迴圈。
} // 結束 drawTopicCards 函式。

// 繪製單一題目卡片。
function drawTopicCard(topic, index) { // 繪製主題、插圖與投放區。
  const placedCard = topic.placedCard; // 取得目前題目中的卡片。
  const wrong = placedCard && placedCard.ownerIndex !== index; // 判斷是否配對錯誤。

  noStroke(); // 關閉陰影外框。
  fill(0, 0, 0, 22); // 設定陰影顏色。
  rect(topic.x + 3, topic.y + 4, topic.w, topic.h, 14); // 繪製卡片陰影。

  fill("#FFFFFF"); // 設定題目卡片背景。
  stroke(wrong ? "#D9534F" : "#A3C9C9"); // 設定題目卡片外框。
  strokeWeight(2); // 設定題目卡片外框粗細。
  rect(topic.x, topic.y, topic.w, topic.h, 14); // 繪製題目卡片。

  noStroke(); // 關閉文字外框。
  fill("#176B87"); // 設定標題顏色。
  textAlign(LEFT, CENTER); // 設定文字靠左。
  textStyle(BOLD); // 設定粗體。
  textSize(layout.smallScreen ? 15 : 16); // 設定標題大小。
  text(`${index + 1}. ${topic.title}`, topic.x + 9, topic.y + 19); // 顯示題號與主題。

  textStyle(NORMAL); // 恢復一般字體。
  fill("#607D7D"); // 設定說明顏色。
  textSize(layout.smallScreen ? 9 : 10); // 設定說明大小。
  text(topic.description, topic.x + 9, topic.y + 39); // 顯示主題說明。

  drawTopicIllustration(topic.id, topic.x + 9, topic.y + 50, topic.w - 18, layout.illustrationHeight); // 繪製主題插圖。
  drawDropZone(topic, index, placedCard, wrong); // 繪製投放區。
} // 結束 drawTopicCard 函式。

// 繪製主題插圖。
function drawTopicIllustration(id, x, y, w, h) { // 依主題繪製可愛插圖。
  fill("#F5FBFA"); // 設定插圖背景。
  stroke("#B7D9D9"); // 設定插圖外框。
  strokeWeight(1.5); // 設定插圖外框粗細。
  rect(x, y, w, h, 9); // 繪製插圖區域。

  const time = millis() * 0.003; // 建立動畫時間。

  if (id === "handwashing") { // 判斷洗手主題。
    drawHandwashingIllustration(x, y, w, h, time); // 繪製洗手插圖。
  } // 結束洗手判斷。

  if (id === "earthquake") { // 判斷地震主題。
    drawEarthquakeIllustration(x, y, w, h, time); // 繪製地震插圖。
  } // 結束地震判斷。

  if (id === "dengue") { // 判斷防登革熱主題。
    drawDengueIllustration(x, y, w, h, time); // 繪製防登革熱插圖。
  } // 結束防登革熱判斷。

  if (id === "burn") { // 判斷燙傷主題。
    drawBurnIllustration(x, y, w, h, time); // 繪製燙傷插圖。
  } // 結束燙傷判斷。

  if (id === "crossing") { // 判斷過馬路主題。
    drawCrossingIllustration(x, y, w, h, time); // 繪製過馬路插圖。
  } // 結束過馬路判斷。

  if (id === "firstAid") { // 判斷急救主題。
    drawFirstAidIllustration(x, y, w, h, time); // 繪製急救插圖。
  } // 結束急救判斷。
} // 結束 drawTopicIllustration 函式。

// 繪製洗手插圖。
function drawHandwashingIllustration(x, y, w, h, time) { // 顯示角色、洗手台、泡泡與水滴。
  noStroke(); // 關閉外框。
  fill("#C8F0F4"); // 設定水波顏色。
  ellipse(x + w * 0.5, y + h * 0.8, w * 0.76, h * 0.2); // 繪製水波。
  fill("#A9DEF9"); // 設定水槽顏色。
  rect(x + w * 0.18, y + h * 0.69, w * 0.64, h * 0.13, 6); // 繪製水槽。

  stroke("#176B87"); // 設定水龍頭顏色。
  strokeWeight(3); // 設定水龍頭粗細。
  line(x + w * 0.5, y + h * 0.2, x + w * 0.5, y + h * 0.46); // 繪製水龍頭直線。
  arc(x + w * 0.57, y + h * 0.46, w * 0.15, h * 0.2, 0, HALF_PI); // 繪製水龍頭彎曲處。

  noStroke(); // 關閉角色外框。
  fill("#FFD6A5"); // 設定臉部顏色。
  circle(x + w * 0.3, y + h * 0.45, min(w, h) * 0.26); // 繪製圓臉角色。
  fill("#6C9BCF"); // 設定衣服顏色。
  ellipse(x + w * 0.3, y + h * 0.7, w * 0.18, h * 0.2); // 繪製角色身體。

  fill("#263238"); // 設定眼睛顏色。
  circle(x + w * 0.26, y + h * 0.43, 3); // 繪製左眼。
  circle(x + w * 0.34, y + h * 0.43, 3); // 繪製右眼。

  stroke("#A85D5D"); // 設定嘴巴顏色。
  strokeWeight(1.5); // 設定嘴巴粗細。
  arc(x + w * 0.3, y + h * 0.47, 8, 5, 0, PI); // 繪製微笑嘴巴。

  noStroke(); // 關閉手部外框。
  fill("#FFD6A5"); // 設定手部顏色。
  const handMove = sin(time) * 3; // 建立手部動畫。
  ellipse(x + w * 0.43, y + h * 0.61 + handMove, w * 0.14, h * 0.09); // 繪製左手。
  ellipse(x + w * 0.55, y + h * 0.61 - handMove, w * 0.14, h * 0.09); // 繪製右手。

  fill("#4EA8DE"); // 設定水滴顏色。
  circle(x + w * 0.48, y + h * 0.38 + sin(time * 2) * 2, 5); // 繪製水滴。
  circle(x + w * 0.55, y + h * 0.42 + sin(time * 2 + 1) * 2, 5); // 繪製水滴。

  noFill(); // 設定泡泡內部透明。
  stroke("#75C9D8"); // 設定泡泡外框顏色。
  strokeWeight(1.5); // 設定泡泡粗細。
  circle(x + w * 0.72, y + h * 0.27 + sin(time) * 3, 12); // 繪製泡泡。
  circle(x + w * 0.82, y + h * 0.4 + sin(time + 2) * 3, 8); // 繪製泡泡。
} // 結束洗手插圖函式。

// 繪製地震插圖。
function drawEarthquakeIllustration(x, y, w, h, time) { // 顯示桌下角色、晃動線與盾牌。
  const shake = sin(time * 5) * 2; // 建立地震晃動效果。

  noStroke(); // 關閉桌子外框。
  fill("#B08968"); // 設定桌子顏色。
  rect(x + w * 0.17 + shake, y + h * 0.34, w * 0.66, h * 0.12, 5); // 繪製桌面。
  rect(x + w * 0.25 + shake, y + h * 0.46, 6, h * 0.32); // 繪製左桌腳。
  rect(x + w * 0.71 + shake, y + h * 0.46, 6, h * 0.32); // 繪製右桌腳。

  fill("#FFD6A5"); // 設定角色臉部顏色。
  circle(x + w * 0.5 + shake, y + h * 0.6, 20); // 繪製角色頭部。
  fill("#6C9BCF"); // 設定角色身體顏色。
  ellipse(x + w * 0.5 + shake, y + h * 0.74, w * 0.25, h * 0.16); // 繪製角色身體。

  fill("#263238"); // 設定眼睛顏色。
  circle(x + w * 0.46 + shake, y + h * 0.59, 2); // 繪製左眼。
  circle(x + w * 0.54 + shake, y + h * 0.59, 2); // 繪製右眼。

  stroke("#D97735"); // 設定晃動線顏色。
  strokeWeight(2); // 設定晃動線粗細。
  line(x + w * 0.1, y + h * 0.3, x + w * 0.15, y + h * 0.25); // 繪製左晃動線。
  line(x + w * 0.85, y + h * 0.3, x + w * 0.9, y + h * 0.25); // 繪製右晃動線。

  fill("#FFF3B0"); // 設定盾牌顏色。
  stroke("#F4A261"); // 設定盾牌外框。
  strokeWeight(1.5); // 設定盾牌粗細。
  beginShape(); // 開始繪製盾牌。
  vertex(x + w * 0.8, y + h * 0.55); // 設定盾牌左上點。
  vertex(x + w * 0.91, y + h * 0.55); // 設定盾牌右上點。
  vertex(x + w * 0.89, y + h * 0.75); // 設定盾牌右下點。
  vertex(x + w * 0.855, y + h * 0.8); // 設定盾牌底部。
  vertex(x + w * 0.82, y + h * 0.75); // 設定盾牌左下點。
  endShape(CLOSE); // 完成盾牌。
} // 結束地震插圖函式。

// 繪製防登革熱插圖。
function drawDengueIllustration(x, y, w, h, time) { // 顯示水桶、刷子、放大鏡與禁止蚊子符號。
  noStroke(); // 關閉水桶外框。
  fill("#9AD1A5"); // 設定水桶顏色。
  ellipse(x + w * 0.5, y + h * 0.67, w * 0.28, h * 0.3); // 繪製水桶。

  fill("#4EA8DE"); // 設定積水顏色。
  ellipse(x + w * 0.5, y + h * 0.58, w * 0.23, h * 0.07); // 繪製積水。

  stroke("#815B3A"); // 設定刷子顏色。
  strokeWeight(3); // 設定刷子粗細。
  const brushMove = sin(time * 2) * 4; // 建立刷子動畫。
  line(x + w * 0.25 + brushMove, y + h * 0.34, x + w * 0.5, y + h * 0.61); // 繪製刷柄。

  fill("#F4A261"); // 設定刷毛顏色。
  noStroke(); // 關閉刷毛外框。
  rect(x + w * 0.2 + brushMove, y + h * 0.29, 17, 8, 3); // 繪製刷毛。

  stroke("#176B87"); // 設定放大鏡顏色。
  strokeWeight(2.5); // 設定放大鏡粗細。
  circle(x + w * 0.76, y + h * 0.3, 20); // 繪製放大鏡。
  line(x + w * 0.81, y + h * 0.38, x + w * 0.87, y + h * 0.48); // 繪製放大鏡握柄。

  stroke("#D9534F"); // 設定禁止符號顏色。
  strokeWeight(3); // 設定禁止符號粗細。
  circle(x + w * 0.76, y + h * 0.3, 29); // 繪製禁止圓圈。
  line(x + w * 0.67, y + h * 0.21, x + w * 0.85, y + h * 0.39); // 繪製禁止斜線。

  fill("#F4C95D"); // 設定閃光顏色。
  noStroke(); // 關閉閃光外框。
  circle(x + w * 0.19, y + h * 0.2 + sin(time * 3) * 2, 6); // 繪製清潔閃光。
  circle(x + w * 0.9, y + h * 0.68 + sin(time * 3 + 1) * 2, 6); // 繪製清潔閃光。
} // 結束防登革熱插圖函式。

// 繪製燙傷插圖。
function drawBurnIllustration(x, y, w, h, time) { // 顯示冷水、手部、冰袋與紗布。
  stroke("#4EA8DE"); // 設定水流顏色。
  strokeWeight(3); // 設定水流粗細。

  for (let i = 0; i < 5; i++) { // 繪製五條水流。
    const wave = sin(time * 3 + i) * 2; // 建立水流動畫。
    line(x + w * 0.4 + i * 4, y + h * 0.22 + wave, x + w * 0.4 + i * 4, y + h * 0.62); // 繪製水流。
  } // 結束水流迴圈。

  noStroke(); // 關閉手部外框。
  fill("#FFD6A5"); // 設定手部顏色。
  ellipse(x + w * 0.48, y + h * 0.7, w * 0.25, h * 0.17); // 繪製手部。

  fill("#D9F3FF"); // 設定冰袋顏色。
  stroke("#4EA8DE"); // 設定冰袋外框。
  strokeWeight(1.5); // 設定冰袋粗細。
  rect(x + w * 0.23, y + h * 0.58, 18, 18, 4); // 繪製冰袋。
  rect(x + w * 0.7, y + h * 0.54, 18, 18, 4); // 繪製冰袋。

  fill("#FFFFFF"); // 設定紗布顏色。
  stroke("#D9534F"); // 設定紗布外框。
  strokeWeight(1.5); // 設定紗布粗細。
  rect(x + w * 0.67, y + h * 0.72, w * 0.18, h * 0.13, 4); // 繪製紗布。

  fill("#E96B8D"); // 設定愛心顏色。
  noStroke(); // 關閉愛心外框。
  textAlign(CENTER, CENTER); // 設定愛心置中。
  textSize(17 + sin(time * 3) * 1.5); // 設定愛心動畫大小。
  text("♥", x + w * 0.78, y + h * 0.25); // 顯示愛心。
} // 結束燙傷插圖函式。

// 繪製過馬路插圖。
function drawCrossingIllustration(x, y, w, h, time) { // 顯示小朋友、斑馬線、紅綠燈與箭頭。
  noStroke(); // 關閉道路外框。
  fill("#667085"); // 設定道路顏色。
  rect(x, y + h * 0.6, w, h * 0.4); // 繪製道路。

  fill("#FFFFFF"); // 設定斑馬線顏色。

  for (let i = 0; i < 5; i++) { // 繪製五條斑馬線。
    rect(x + w * 0.18 + i * w * 0.15, y + h * 0.7, w * 0.08, h * 0.18); // 繪製斑馬線。
  } // 結束斑馬線迴圈。

  fill("#FFD6A5"); // 設定小朋友臉部顏色。
  circle(x + w * 0.27, y + h * 0.4, 21); // 繪製小朋友頭部。

  fill("#F28482"); // 設定衣服顏色。
  ellipse(x + w * 0.27, y + h * 0.59, w * 0.15, h * 0.22); // 繪製小朋友身體。

  fill("#263238"); // 設定眼睛顏色。
  circle(x + w * 0.23, y + h * 0.39, 2.5); // 繪製左眼。
  circle(x + w * 0.31, y + h * 0.39, 2.5); // 繪製右眼。

  fill("#263238"); // 設定交通號誌顏色。
  rect(x + w * 0.78, y + h * 0.2, 20, 58, 5); // 繪製交通號誌。

  fill("#E63946"); // 設定紅燈顏色。
  circle(x + w * 0.78 + 10, y + h * 0.32, 11); // 繪製紅燈。

  fill("#F4C95D"); // 設定黃燈顏色。
  circle(x + w * 0.78 + 10, y + h * 0.5, 11); // 繪製黃燈。

  fill("#54C27D"); // 設定綠燈顏色。
  circle(x + w * 0.78 + 10, y + h * 0.68, 11); // 繪製綠燈。

  fill("#F4A261"); // 設定停止標誌顏色。
  stroke("#FFFFFF"); // 設定停止標誌外框。
  strokeWeight(1.5); // 設定外框粗細。
  circle(x + w * 0.53, y + h * 0.28, 25); // 繪製停止標誌。

  noStroke(); // 關閉停止文字外框。
  fill("#FFFFFF"); // 設定停止文字顏色。
  textAlign(CENTER, CENTER); // 設定停止文字置中。
  textSize(8); // 設定停止文字大小。
  text("停", x + w * 0.53, y + h * 0.28); // 顯示停止文字。

  stroke("#176B87"); // 設定查看箭頭顏色。
  strokeWeight(2); // 設定箭頭粗細。
  line(x + w * 0.38, y + h * 0.38, x + w * 0.48, y + h * 0.32 + sin(time * 3) * 2); // 繪製右側箭頭。
  line(x + w * 0.38, y + h * 0.38, x + w * 0.28, y + h * 0.32 + sin(time * 3 + 1) * 2); // 繪製左側箭頭。
} // 結束過馬路插圖函式。

// 繪製急救插圖。
function drawFirstAidIllustration(x, y, w, h, time) { // 顯示急救員、AED、呼救泡泡與愛心。
  fill("#F8F9FA"); // 設定 AED 外殼顏色。
  stroke("#D9534F"); // 設定 AED 外框顏色。
  strokeWeight(2); // 設定 AED 外框粗細。
  rect(x + w * 0.62, y + h * 0.26, w * 0.22, h * 0.48, 6); // 繪製 AED 外殼。

  fill("#CDECCF"); // 設定 AED 螢幕顏色。
  rect(x + w * 0.66, y + h * 0.32, w * 0.14, h * 0.12, 3); // 繪製 AED 螢幕。

  fill("#E63946"); // 設定閃電顏色。
  noStroke(); // 關閉閃電外框。
  textAlign(CENTER, CENTER); // 設定文字置中。
  textSize(18 + sin(time * 4) * 2); // 設定閃電大小。
  text("⚡", x + w * 0.73, y + h * 0.58); // 顯示 AED 閃電。

  fill("#FFD6A5"); // 設定急救員臉部顏色。
  circle(x + w * 0.3, y + h * 0.42, 21); // 繪製急救員頭部。

  fill("#5B8DEF"); // 設定急救員衣服顏色。
  ellipse(x + w * 0.3, y + h * 0.67, w * 0.2, h * 0.27); // 繪製急救員身體。

  fill("#FFFFFF"); // 設定急救十字顏色。
  rect(x + w * 0.27, y + h * 0.57, w * 0.05, h * 0.14, 2); // 繪製直向十字。
  rect(x + w * 0.23, y + h * 0.62, w * 0.13, h * 0.05, 2); // 繪製橫向十字。

  fill("#176B87"); // 設定呼救泡泡背景。
  stroke("#176B87"); // 設定呼救泡泡外框。
  strokeWeight(1.5); // 設定泡泡粗細。
  ellipse(x + w * 0.3, y + h * 0.18, w * 0.22, h * 0.17); // 繪製呼救泡泡。

  noStroke(); // 關閉文字外框。
  fill("#FFFFFF"); // 設定呼救文字顏色。
  textSize(10); // 設定呼救文字大小。
  text("叫！", x + w * 0.3, y + h * 0.18); // 顯示呼救文字。

  fill("#E96B8D"); // 設定愛心顏色。
  textSize(19 + sin(time * 3) * 1.5); // 設定愛心動畫大小。
  text("♥", x + w * 0.48, y + h * 0.25); // 顯示愛心。
} // 結束急救插圖函式。

// 繪製投放區。
function drawDropZone(topic, index, placedCard, wrong) { // 繪製完整口訣的投放區域。
  stroke(wrong ? "#D9534F" : "#65B891"); // 根據配對狀態設定外框顏色。
  strokeWeight(2); // 設定投放區外框粗細。
  fill(wrong ? "#FFF0F0" : "#F1FBF5"); // 根據配對狀態設定背景顏色。
  rect(topic.dropX, topic.dropY, topic.dropW, topic.dropH, 8); // 繪製投放區。

  if (!placedCard) { // 判斷投放區是否為空。
    noStroke(); // 關閉文字外框。
    fill("#2C7A4B"); // 設定提示文字顏色。
    textAlign(CENTER, CENTER); // 設定文字置中。
    textSize(layout.smallScreen ? 9 : 10); // 設定提示文字大小。
    text("拖曳完整口訣到這裡", topic.dropX + topic.dropW / 2, topic.dropY + topic.dropH / 2); // 顯示提示文字。
  } else { // 當投放區已有卡片時執行。
    drawPlacedCard(placedCard, topic, wrong); // 繪製已放置卡片。
  } // 結束投放區判斷。
} // 結束 drawDropZone 函式。

// 繪製已放置的完整卡片。
function drawPlacedCard(card, topic, wrong) { // 將整句口訣顯示在題目中。
  const x = topic.dropX + 6; // 計算卡片水平位置。
  const y = topic.dropY + 6; // 計算卡片垂直位置。
  const w = topic.dropW - 12; // 計算卡片寬度。
  const h = topic.dropH - 12; // 計算卡片高度。

  fill(wrong ? "#FFD7D7" : card.color); // 設定卡片背景。
  stroke(wrong ? "#D9534F" : "#65B891"); // 設定卡片外框。
  strokeWeight(1.5); // 設定卡片外框粗細。
  rect(x, y, w, h, 6); // 繪製已放置卡片。

  noStroke(); // 關閉文字外框。
  fill(wrong ? "#B53F3F" : "#245B4A"); // 設定文字顏色。
  textAlign(CENTER, CENTER); // 設定文字置中。
  textSize(layout.smallScreen ? 9 : 10); // 設定口訣文字大小。
  text(card.text, x + w / 2, y + h / 2); // 顯示完整口訣。
} // 結束 drawPlacedCard 函式。

// 繪製下方六個完整選項。
function drawOptionPool() { // 顯示尚未放置的整句口訣。
  noStroke(); // 關閉標題外框。
  fill("#315C5D"); // 設定標題顏色。
  textAlign(LEFT, CENTER); // 設定文字靠左。
  textSize(layout.bodySize); // 設定標題大小。
  text("六個完整選項", layout.margin, layout.poolY + 20); // 顯示選項區標題。

  for (const card of optionCards) { // 逐一繪製選項卡片。
    if (card.location !== -1 && !card.isDragging) { // 判斷卡片是否已放置。
      continue; // 已放置卡片不在選項區顯示。
    } // 結束已放置判斷。

    drawOptionCard(card); // 繪製完整選項卡。
  } // 完成選項繪製。
} // 結束 drawOptionPool 函式。

// 繪製完整選項卡片。
function drawOptionCard(card) { // 顯示不可拆分的整句口訣。
  const shadow = card.isDragging ? 5 : 3; // 設定卡片陰影偏移。

  noStroke(); // 關閉陰影外框。
  fill(0, 0, 0, 22); // 設定陰影顏色。
  rect(card.x + shadow, card.y + shadow, card.w, card.h, 8); // 繪製卡片陰影。

  fill(card.isDragging ? "#FFE28A" : card.wrong ? "#FFD7D7" : card.color); // 設定卡片背景。
  stroke(card.isDragging ? "#E2A522" : card.wrong ? "#D9534F" : "#8AC6D1"); // 設定卡片外框。
  strokeWeight(1.5); // 設定卡片外框粗細。
  rect(card.x, card.y, card.w, card.h, 8); // 繪製選項卡片。

  noStroke(); // 關閉文字外框。
  fill(card.wrong ? "#B53F3F" : "#245B4A"); // 設定文字顏色。
  textAlign(CENTER, CENTER); // 設定文字置中。
  textSize(layout.smallScreen ? 12 : 14); // 設定口訣大小。
  text(card.text, card.x + card.w / 2, card.y + card.h / 2); // 顯示完整口訣。
} // 結束 drawOptionCard 函式。

// 繪製測驗按鈕。
function drawButtons() { // 顯示交卷按鈕。
  const buttonW = layout.smallScreen ? 140 : 155; // 設定按鈕寬度。
  const buttonH = 42; // 設定按鈕高度。
  const startX = (width - buttonW) / 2; // 計算按鈕水平位置。

  drawButton({ x: startX, y: layout.buttonY, w: buttonW, h: buttonH }, "交卷", false); // 繪製交卷按鈕。
} // 結束 drawButtons 函式。

// 繪製單一按鈕。
function drawButton(button, label, disabled) { // 繪製按鈕與按鈕文字。
  const hovering = isPointInRect(mouseX, mouseY, button); // 判斷滑鼠是否位於按鈕上。
  noStroke(); // 關閉按鈕外框。
  fill(disabled ? "#AFC7C3" : hovering ? "#0D809A" : "#176B87"); // 設定按鈕顏色。
  rect(button.x, button.y, button.w, button.h, 10); // 繪製按鈕。
  fill("#FFFFFF"); // 設定按鈕文字顏色。
  textAlign(CENTER, CENTER); // 設定文字置中。
  textSize(layout.smallScreen ? 13 : 15); // 設定文字大小。
  text(label, button.x + button.w / 2, button.y + button.h / 2); // 顯示按鈕文字。
} // 結束 drawButton 函式。

// 繪製獨立成績畫面。
function drawResultScreen() { // 交卷後只顯示成績畫面。
  drawResultBackground(); // 繪製成績頁背景。

  if (fireworksEnabled) { // 判斷是否顯示煙火。
    updateFireworks(); // 更新煙火粒子。
    drawFireworks(); // 繪製煙火粒子。
  } // 結束煙火判斷。

  const pageWidth = min(width - 24, 680); // 設定成績卡片寬度。
  const pageHeight = layout.smallScreen ? 690 : 570; // 設定成績卡片高度。
  const pageX = (width - pageWidth) / 2; // 計算成績卡片水平位置。
  const pageY = 30; // 設定成績卡片垂直位置。

  noStroke(); // 關閉陰影外框。
  fill(0, 0, 0, 35); // 設定成績卡片陰影。
  rect(pageX + 5, pageY + 7, pageWidth, pageHeight, 24); // 繪製成績卡片陰影。

  fill("#FFFFFF"); // 設定成績卡片背景。
  rect(pageX, pageY, pageWidth, pageHeight, 24); // 繪製成績卡片。

  fill("#176B87"); // 設定標題顏色。
  textAlign(CENTER, CENTER); // 設定文字置中。
  textStyle(BOLD); // 設定粗體。
  textSize(layout.smallScreen ? 30 : 38); // 設定成績標題大小。
  text("測驗完成！", width / 2, pageY + 52); // 顯示成績標題。

  fill(scorePercent > 60 ? "#2C7A4B" : "#B05B37"); // 根據成績設定分數顏色。
  textSize(layout.smallScreen ? 48 : 64); // 設定分數大小。
  text(`${scorePercent}%`, width / 2, pageY + 125); // 顯示百分比分數。

  textStyle(NORMAL); // 恢復一般字體。
  fill("#315C5D"); // 設定答對數量顏色。
  textSize(layout.smallScreen ? 16 : 19); // 設定答對數量大小。
  text(`答對 ${correctCount} / 6 組`, width / 2, pageY + 165); // 顯示答對組數。

  const resultColumns = layout.smallScreen ? 1 : 2; // 設定結果欄數。
  const resultGap = layout.smallScreen ? 8 : 12; // 設定結果間距。
  const resultWidth = (pageWidth - 48 - resultGap * (resultColumns - 1)) / resultColumns; // 計算結果卡片寬度。
  const resultHeight = layout.smallScreen ? 52 : 48; // 計算結果卡片高度。
  const resultsY = pageY + 195; // 設定逐題結果起始位置。

  for (let i = 0; i < topics.length; i++) { // 逐一繪製六題結果。
    const column = i % resultColumns; // 計算結果欄數。
    const row = floor(i / resultColumns); // 計算結果列數。
    const resultX = pageX + 24 + column * (resultWidth + resultGap); // 計算結果水平位置。
    const resultY = resultsY + row * (resultHeight + resultGap); // 計算結果垂直位置。
    const card = topics[i].placedCard; // 取得該題放置卡片。
    const correct = card && card.ownerIndex === i; // 判斷該題是否答對。

    fill(correct ? "#E5F6EA" : "#FFE8E8"); // 設定結果卡片背景。
    stroke(correct ? "#65B891" : "#D9534F"); // 設定結果卡片外框。
    strokeWeight(1.5); // 設定結果卡片外框粗細。
    rect(resultX, resultY, resultWidth, resultHeight, 10); // 繪製結果卡片。

    noStroke(); // 關閉文字外框。
    fill(correct ? "#2C7A4B" : "#B53F3F"); // 設定結果顏色。
    textAlign(LEFT, CENTER); // 設定文字靠左。
    textSize(layout.smallScreen ? 12 : 13); // 設定結果文字大小。
    text(`${i + 1}. ${topics[i].title}`, resultX + 10, resultY + 17); // 顯示題目名稱。

    fill("#607D7D"); // 設定口訣文字顏色。
    textSize(layout.smallScreen ? 10 : 11); // 設定口訣文字大小。
    text(topics[i].slogan, resultX + 10, resultY + 36); // 顯示完整口訣。

    fill(correct ? "#2C7A4B" : "#B53F3F"); // 設定答題結果顏色。
    textAlign(RIGHT, CENTER); // 設定結果文字靠右。
    textSize(layout.smallScreen ? 12 : 13); // 設定答題結果大小。
    text(correct ? "答對" : "答錯", resultX + resultWidth - 10, resultY + resultHeight / 2); // 顯示答對或答錯。
  } // 完成六題結果。

  fill(scorePercent > 60 ? "#2C7A4B" : "#B05B37"); // 設定鼓勵文字顏色。
  textAlign(CENTER, CENTER); // 設定鼓勵文字置中。
  textSize(layout.smallScreen ? 14 : 17); // 設定鼓勵文字大小。
  text(scorePercent > 60 ? "太棒了！你已掌握六句安全口訣！" : "再試一次，你一定會更進步！", width / 2, pageY + pageHeight - 92); // 顯示鼓勵文字。

  const resetWidth = layout.smallScreen ? 210 : 240; // 設定重新作答按鈕寬度。
  const resetHeight = 50; // 設定重新作答按鈕高度。
  const resetX = (width - resetWidth) / 2; // 計算重新作答按鈕水平位置。
  const resetY = pageY + pageHeight - 72; // 計算重新作答按鈕垂直位置。

  const resetButton = { x: resetX, y: resetY, w: resetWidth, h: resetHeight }; // 建立重新作答按鈕資料。
  drawButton(resetButton, "重新作答", false); // 繪製重新作答按鈕。
} // 結束 drawResultScreen 函式。

// 繪製成績頁背景。
function drawResultBackground() { // 繪製成績頁背景與裝飾。
  background(scorePercent > 60 ? "#E8F8F0" : "#F3FAF8"); // 根據成績設定背景顏色。
  noStroke(); // 關閉裝飾外框。
  fill("#D7F3DC"); // 設定綠色裝飾。
  circle(width * 0.08, 90, 90); // 繪製左上裝飾。
  fill("#CDE7F0"); // 設定藍色裝飾。
  circle(width * 0.92, 170, 110); // 繪製右上裝飾。
  fill("#FFF0B8"); // 設定黃色裝飾。
  circle(width * 0.1, height - 90, 90); // 繪製左下裝飾。
  fill("#F7C8E0"); // 設定粉色裝飾。
  circle(width * 0.9, height - 120, 100); // 繪製右下裝飾。
} // 結束 drawResultBackground 函式。

// 判斷點是否在矩形內。
function isPointInRect(px, py, rectangle) { // 接收點座標與矩形資料。
  return px >= rectangle.x && px <= rectangle.x + rectangle.w && py >= rectangle.y && py <= rectangle.y + rectangle.h; // 回傳是否在矩形內。
} // 結束 isPointInRect 函式。

// 找出指標下方的選項卡片。
function findCardAtPoint(px, py) { // 搜尋滑鼠或觸控點下方的選項。
  for (let i = optionCards.length - 1; i >= 0; i--) { // 從最上層開始搜尋。
    const card = optionCards[i]; // 取得目前卡片。

    if (isPointInRect(px, py, card)) { // 判斷指標是否在卡片內。
      return card; // 回傳找到的卡片。
    } // 結束卡片判斷。
  } // 結束搜尋迴圈。

  return null; // 找不到卡片時回傳空值。
} // 結束 findCardAtPoint 函式。

// 找出指標下方的主題卡片。
function findTopicAtPoint(px, py) { // 搜尋目前指標所在主題。
  for (let i = 0; i < topics.length; i++) { // 逐一檢查六個主題。
    const topic = topics[i]; // 取得目前主題。

    if (isPointInRect(px, py, topic)) { // 判斷指標是否在主題卡內。
      return i; // 回傳主題索引。
    } // 結束主題判斷。
  } // 結束搜尋迴圈。

  return -1; // 找不到主題時回傳負一。
} // 結束 findTopicAtPoint 函式。

// 開始拖曳完整選項。
function startDragging(px, py) { // 開始拖曳整句卡片。
  if (submitted) { // 判斷是否已經交卷。
    return; // 交卷後禁止拖曳。
  } // 結束交卷判斷。

  const card = findCardAtPoint(px, py); // 找出被點擊的卡片。

  if (!card) { // 判斷是否找到卡片。
    return; // 沒有找到卡片時結束。
  } // 結束卡片判斷。

  if (card.location !== -1) { // 判斷卡片是否原本放在題目中。
    const oldTopic = topics[card.location]; // 取得原本所在主題。
    oldTopic.placedCard = null; // 清除原本主題的卡片。
    card.location = -1; // 設定卡片為未放置。
  } // 結束原位置處理。

  draggingCard = card; // 儲存拖曳中的卡片。
  card.isDragging = true; // 設定卡片正在拖曳。
  card.wrong = false; // 清除錯誤狀態。
  dragOffsetX = px - card.x; // 計算水平偏移。
  dragOffsetY = py - card.y; // 計算垂直偏移。
} // 結束 startDragging 函式。

// 移動拖曳中的卡片。
function moveDragging(px, py) { // 更新卡片位置。
  if (!draggingCard) { // 判斷是否有拖曳卡片。
    return; // 沒有卡片時結束。
  } // 結束卡片判斷。

  draggingCard.x = px - dragOffsetX; // 更新水平位置。
  draggingCard.y = py - dragOffsetY; // 更新垂直位置。
} // 結束 moveDragging 函式。

// 結束拖曳。
function stopDragging(px, py) { // 將完整選項放到主題或選項區。
  if (!draggingCard) { // 判斷是否有拖曳卡片。
    return; // 沒有卡片時結束。
  } // 結束卡片判斷。

  const card = draggingCard; // 保存目前拖曳卡片。
  const targetIndex = findTopicAtPoint(px, py); // 找出目標主題。
  card.isDragging = false; // 結束拖曳狀態。

  if (targetIndex === -1) { // 判斷是否放在主題外。
    card.location = -1; // 將卡片放回選項區。
    card.wrong = false; // 清除錯誤狀態。
  } else { // 當卡片放入主題時執行。
    const targetTopic = topics[targetIndex]; // 取得目標主題。

    if (targetTopic.placedCard && targetTopic.placedCard !== card) { // 判斷目標是否有其他卡片。
      const oldCard = targetTopic.placedCard; // 取得原本卡片。
      oldCard.location = -1; // 將原卡片放回選項區。
      oldCard.wrong = false; // 清除原卡片錯誤狀態。
    } // 結束原卡片判斷。

    if (card.location !== -1) { // 判斷卡片是否仍記錄在其他題目。
      topics[card.location].placedCard = null; // 清除原本題目的卡片。
    } // 結束原題目清除。

    targetTopic.placedCard = card; // 將卡片放入目標主題。
    card.location = targetIndex; // 記錄卡片所在主題。
    card.wrong = card.ownerIndex !== targetIndex; // 判斷是否配對錯誤。
  } // 結束放置判斷。

  draggingCard = null; // 清除拖曳狀態。
  positionOptionCards(); // 重新排列選項卡。
} // 結束 stopDragging 函式。

// 判斷所有選項是否都已放置。
function allCardsPlaced() { // 檢查是否可以交卷。
  return optionCards.every((card) => card.location !== -1); // 回傳是否全部放置。
} // 結束 allCardsPlaced 函式。

// 執行交卷。
function submitQuiz() { // 計算配對結果並切換成績畫面。
  if (!allCardsPlaced()) { // 判斷是否全部放置。
    return; // 尚未全部放置時不能交卷。
  } // 結束放置判斷。

  correctCount = optionCards.filter((card) => card.location === card.ownerIndex).length; // 計算答對組數。
  scorePercent = round((correctCount / optionCards.length) * 100); // 計算分數百分比。
  submitted = true; // 設定已交卷。
  resultShown = true; // 切換到獨立成績畫面。
  fireworksEnabled = scorePercent > 60; // 判斷是否啟用煙火。
  resizeCanvas(windowWidth, getResultScreenHeight()); // 調整成績頁高度。
} // 結束 submitQuiz 函式。

// 處理按鈕點擊。
function handleButtonClick(px, py) { // 判斷目前頁面中的按鈕。
  if (resultShown) { // 判斷目前是否為成績頁。
    const resetWidth = layout.smallScreen ? 210 : 240; // 設定重新作答按鈕寬度。
    const resetHeight = 50; // 設定重新作答按鈕高度。
    const resetX = (width - resetWidth) / 2; // 計算按鈕水平位置。
    const resetY = 30 + (layout.smallScreen ? 690 : 570) - 72; // 計算按鈕垂直位置。
    const resetButton = { x: resetX, y: resetY, w: resetWidth, h: resetHeight }; // 建立重新作答按鈕。

    if (isPointInRect(px, py, resetButton)) { // 判斷是否點擊重新作答。
      initializeQuiz(); // 重新初始化測驗。
      calculateLayout(); // 重新計算測驗版面。
      resizeCanvasToContent(); // 恢復測驗畫布高度。
      return true; // 回傳按鈕已處理。
    } // 結束重新作答判斷。

    return false; // 成績頁不處理其他按鈕。
  } // 結束成績頁判斷。

  const buttonW = layout.smallScreen ? 140 : 155; // 設定交卷按鈕寬度。
  const buttonH = 42; // 設定交卷按鈕高度。
  const startX = (width - buttonW) / 2; // 計算交卷按鈕水平位置。
  const submitButton = { x: startX, y: layout.buttonY, w: buttonW, h: buttonH }; // 建立交卷按鈕。

  if (isPointInRect(px, py, submitButton)) { // 判斷是否點擊交卷。
    submitQuiz(); // 執行交卷。
    return true; // 回傳按鈕已處理。
  } // 結束交卷判斷。

  return false; // 回傳未點擊按鈕。
} // 結束 handleButtonClick 函式。

// 處理滑鼠按下事件。
function mousePressed() { // p5.js 滑鼠按下事件。
  if (handleButtonClick(mouseX, mouseY)) { // 優先處理按鈕。
    return false; // 阻止瀏覽器預設行為。
  } // 結束按鈕判斷。

  if (!resultShown) { // 判斷目前是否為測驗頁。
    startDragging(mouseX, mouseY); // 開始拖曳完整選項。
  } // 結束測驗頁判斷。

  return false; // 阻止瀏覽器預設行為。
} // 結束 mousePressed 函式。

// 處理滑鼠拖曳事件。
function mouseDragged() { // p5.js 滑鼠拖曳事件。
  if (!resultShown) { // 判斷目前是否為測驗頁。
    moveDragging(mouseX, mouseY); // 移動拖曳中的卡片。
  } // 結束測驗頁判斷。

  return false; // 阻止瀏覽器預設行為。
} // 結束 mouseDragged 函式。

// 處理滑鼠放開事件。
function mouseReleased() { // p5.js 滑鼠放開事件。
  if (!resultShown) { // 判斷目前是否為測驗頁。
    stopDragging(mouseX, mouseY); // 完成卡片放置。
  } // 結束測驗頁判斷。

  return false; // 阻止瀏覽器預設行為。
} // 結束 mouseReleased 函式。

// 處理觸控開始事件。
function touchStarted() { // p5.js 觸控開始事件。
  const point = getTouchPoint(); // 取得觸控座標。

  if (point && handleButtonClick(point.x, point.y)) { // 優先處理按鈕。
    return false; // 阻止預設行為。
  } // 結束觸控按鈕判斷。

  if (point && !resultShown) { // 判斷目前是否為測驗頁。
    startDragging(point.x, point.y); // 開始觸控拖曳。
  } // 結束測驗頁判斷。

  return false; // 阻止頁面滾動。
} // 結束 touchStarted 函式。

// 處理觸控移動事件。
function touchMoved() { // p5.js 觸控移動事件。
  const point = getTouchPoint(); // 取得觸控座標。

  if (point && !resultShown) { // 判斷目前是否為測驗頁。
    moveDragging(point.x, point.y); // 移動拖曳卡片。
  } // 結束測驗頁判斷。

  return false; // 阻止頁面滾動。
} // 結束 touchMoved 函式。

// 處理觸控結束事件。
function touchEnded() { // p5.js 觸控結束事件。
  const point = getTouchPoint(true); // 取得最後觸控座標。

  if (point && !resultShown) { // 判斷目前是否為測驗頁。
    stopDragging(point.x, point.y); // 完成卡片放置。
  } // 結束測驗頁判斷。

  return false; // 阻止頁面滾動。
} // 結束 touchEnded 函式。

// 取得觸控座標。
function getTouchPoint(useMouseFallback = false) { // 取得第一個觸控點。
  if (touches && touches.length > 0) { // 判斷是否有觸控點。
    return { x: touches[0].x, y: touches[0].y }; // 回傳觸控座標。
  } // 結束觸控判斷。

  if (useMouseFallback) { // 判斷是否使用滑鼠座標備援。
    return { x: mouseX, y: mouseY }; // 回傳滑鼠座標。
  } // 結束滑鼠備援判斷。

  return null; // 沒有座標時回傳空值。
} // 結束 getTouchPoint 函式。

// 產生煙火。
function spawnFirework() { // 建立一組煙火粒子。
  const firework = { // 建立煙火物件。
    x: random(width * 0.15, width * 0.85), // 設定煙火水平位置。
    y: random(60, min(height * 0.42, 340)), // 設定煙火垂直位置。
    particles: [], // 建立粒子陣列。
    life: 255 // 設定煙火生命值。
  }; // 完成煙火物件。

  for (let i = 0; i < 50; i++) { // 建立五十個粒子。
    const angle = random(TWO_PI); // 產生粒子角度。
    const speed = random(1.5, 5); // 產生粒子速度。

    firework.particles.push({ // 加入煙火粒子。
      x: firework.x, // 設定粒子水平位置。
      y: firework.y, // 設定粒子垂直位置。
      vx: cos(angle) * speed, // 設定水平速度。
      vy: sin(angle) * speed, // 設定垂直速度。
      life: random(160, 255), // 設定粒子生命值。
      color: color(random(255), random(180, 255), random(80, 220)) // 設定粒子顏色。
    }); // 完成粒子資料。
  } // 完成粒子迴圈。

  fireworks.push(firework); // 將煙火加入陣列。
} // 結束 spawnFirework 函式。

// 更新煙火。
function updateFireworks() { // 更新煙火與粒子位置。
  if (millis() - lastFireworkTime > 900) { // 判斷是否需要產生新煙火。
    spawnFirework(); // 產生新煙火。
    lastFireworkTime = millis(); // 更新產生時間。
  } // 結束產生判斷。

  for (let i = fireworks.length - 1; i >= 0; i--) { // 從最後一組煙火開始更新。
    const firework = fireworks[i]; // 取得目前煙火。
    firework.life -= 3; // 減少煙火生命值。

    for (const particle of firework.particles) { // 更新每一個粒子。
      particle.x += particle.vx; // 更新粒子水平位置。
      particle.y += particle.vy; // 更新粒子垂直位置。
      particle.vy += 0.035; // 加入重力效果。
      particle.life -= 3; // 減少粒子生命值。
    } // 完成粒子更新。

    if (firework.life <= 0) { // 判斷煙火是否消失。
      fireworks.splice(i, 1); // 移除煙火。
    } // 結束生命判斷。
  } // 完成煙火更新。
} // 結束 updateFireworks 函式。

// 繪製煙火。
function drawFireworks() { // 顯示煙火粒子。
  blendMode(ADD); // 使用加亮混合模式。
  noStroke(); // 關閉粒子外框。

  for (const firework of fireworks) { // 逐一繪製煙火。
    for (const particle of firework.particles) { // 逐一繪製粒子。
      const alpha = constrain(particle.life, 0, 255); // 限制粒子透明度。
      fill(red(particle.color), green(particle.color), blue(particle.color), alpha); // 設定粒子顏色。
      circle(particle.x, particle.y, 4); // 繪製粒子。
    } // 完成粒子繪製。
  } // 完成煙火繪製。

  blendMode(BLEND); // 恢復一般混合模式。
} // 結束 drawFireworks 函式。

// 視窗大小改變時重新配置。
function windowResized() { // p5.js 視窗大小改變事件。
  resizeCanvas(windowWidth, resultShown ? getResultScreenHeight() : height); // 先同步畫布寬度與高度。
  calculateLayout(); // 重新計算版面。
  if (!resultShown) { // 判斷是否為測驗頁。
    resizeCanvasToContent(); // 重新調整測驗畫布高度。
  } // 結束測驗頁判斷。
} // 結束 windowResized 函式。