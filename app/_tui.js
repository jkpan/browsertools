// 設置標準輸入為原始模式來捕捉單個鍵盤按鍵
process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.setEncoding('utf8');

// 清除螢幕並將光標移動到 (0,0)
function clearScreen() {
  process.stdout.write('\x1B[2J\x1B[0;0H');
}

// 顯示基本的UI
function renderUI(position) {
  clearScreen();
  console.log("=== CMD ===");
  console.log("Use W (up), A (left), S (down), D (right) to move the cursor.");
  console.log("Press Q to quit.");
  console.log("\nCurrent Position: ", position);
}

// 初始化光標的位置
let position = { x: 0, y: 0 };

// 監聽鍵盤輸入
process.stdin.on('data', (key) => {
  if (key === '\u0003' || key.toLowerCase() === 'q') { // 按下 Ctrl+C 或 'q' 退出
    process.exit();
  }

  // 更新光標位置
  switch (key.toLowerCase()) {
    case 'w': position.y--; break; // 向上移動
    case 'a': position.x--; break; // 向左移動
    case 's': position.y++; break; // 向下移動
    case 'd': position.x++; break; // 向右移動
  }

  // 重新渲染UI
  renderUI(position);
});

// 初次渲染UI
renderUI(position);

/*
module.exports = {

};
*/