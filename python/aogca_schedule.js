//for startArrange() using //const START = "2024-01-01"; // 开始日期 //const END = "2024-03-31"; // 结束日期
const SHEET_WORKING = "arrange";
const SHEET_SETTING = "setting";

const URL = "https://docs.google.com/spreadsheets/d/1cL15C-cKAJufv7JFfcOpWmJo7I4M0j3kDq1C9R0HeCI/edit";
           //https://docs.google.com/spreadsheets/d/1cL15C-cKAJufv7JFfcOpWmJo7I4M0j3kDq1C9R0HeCI/edit?usp=drive_link
//#gid=130662762";

var ssheet = null;

function startArrange() {
  
  //cleanSheet();

  //if (!generateDates()) return;

  let process = getNameList_('安排順序');
  for (let i=0;i<process.length;i++) {
    let array = process[i].split(',');
    let arg0 = array[0].trim();
    let arg1 = array[1].trim();
    let arg2 = array[2].trim();
    putByService_(arg0, arg1, arg2);
  }
  
  checkRecurring_(SHEET_WORKING);

}

/*
function doGet(e) {
  return HtmlService.createHtmlOutputFromFile("main.html");
}
*/

function opOpen() {
  let ui = SpreadsheetApp.getUi();
  ui.createMenu('TPCAOG擴充').
    addItem('產生聚會和日期', 'generateDates').
    addItem('開始排服事表', 'startArrange').
    addItem('檢查', 'checkRecurring').
    addItem('輸出Json', 'toJson').
    addItem('清除工作區', 'cleanSheet').addToUi();
}

function showResult(result) {
  var ui = SpreadsheetApp.getUi(); // Same variations.
  ui.alert(result);
  /*
  var result = ui.alert(
     'Please confirm',
     'Are you sure you want to continue?',
      ui.ButtonSet.YES_NO);
  // Process the user's response.
  if (result == ui.Button.YES) {
    // User clicked "Yes".
    ui.alert('Confirmation received.');
  } else {
    // User clicked "No" or X in the title bar.
    ui.alert('Permission denied.');
  }
  */
}

function toJson() {
  var ss = openSheetApp_();
  let sn = ss.getActiveSheet().getName();
  if (sn === SHEET_SETTING || sn === 'notice') {
    showResult('End');
    return 'End';
  }

  var sheet = ss.getSheetByName(sn);//SHEET4JSON); // 修改为你的工作表名称
  let obj = {};
  const _ROW = 3; // 开始的行数
  const _COL = 1; // 开始的列数

  let row_max = sheet.getLastRow();
  let col_max = sheet.getLastColumn();

  for (let row=_ROW;row<=row_max;row++) {
    let date_obj = null;
    for (let col=_COL;col<=col_max;col++) {
      if (col == 1) {
        var formattedDate = Utilities.formatDate(sheet.getRange(row, 1).getValue(), SpreadsheetApp.getActive().getSpreadsheetTimeZone(), "yyyy/MM/dd");
        obj[formattedDate] = date_obj = {};
        continue;
      }
      date_obj[sheet.getRange(2, col).getValue()] = sheet.getRange(row, col).getValue();
    }
    date_obj = null;
  }
  //let str = JSON.stringify(obj, null, "\t");
  let str = JSON.stringify(obj);
  console.log(str);
  //SpreadsheetApp.getActive().toast(str, "10秒內複製以下字串", 10);
  showResult(str);
  return str;//obj;
}

function openSheetApp_() {
  if (ssheet == null) 
    ssheet = //SpreadsheetApp.openByUrl(URL);
             SpreadsheetApp.getActiveSpreadsheet();
  return ssheet;
}

/*
function checkRecurringxx() {
  let ss = openSheetApp_();
  ss.getActiveSheet();
}
*/

function checkRecurring() {
  //let ss = openSheetApp_();
  //let sheet = ss.getSheetByName(sheetname);
  //ss.getActiveSpreadsheet
  checkRecurring_(SpreadsheetApp.getActiveSheet().getName());//SHEET4CHK);
}

function checkRecurring_(sheetname) {
  const _ROW = 3; // 开始的行数
  const _COL = 3; // 开始的列数
  let ss = openSheetApp_();
  let sheet = ss.getSheetByName(sheetname);

  let row_max = sheet.getLastRow();
  let col_max = sheet.getLastColumn();

  Logger.log('clean red ...' + row_max +', ' + col_max);

  for (let row=_ROW;row<=row_max;row++) 
    for (let col=_COL;col<=col_max;col++) 
      sheet.getRange(row, col).setFontColor("black");
    
  Logger.log('checking ...');

  for (let row=_ROW;row<=row_max;row++) { //37
    for (let col=_COL;col<=col_max;col++) { //20
      let cell = sheet.getRange(row, col).getValue().trim();
      if (cell.length == 0) continue;
      for (let _c = col+1;_c<=col_max;_c++) {
        let _cell = sheet.getRange(row, _c).getValue().trim();
        if (_cell.length == 0) continue;
        if (cell === _cell) {
          sheet.getRange(row, col).setFontColor("red");
          sheet.getRange(row, _c).setFontColor("red");
        } 
      }     
    }
  }
}

function generateDates() {

  let sd = getSettingDate_('開始時間');//('Start Date');
  let ed = getSettingDate_('結束時間');//'End Date');

  Logger.log(sd + ', ' + ed)

  if (sd == null || ed == null) return false;

  var startDate = sd;//new Date(sd);//START); // 开始日期
  var endDate = ed;//new Date(ed);//END); // 结束日期
  
  var currentDate = new Date(startDate);

  //Logger.log(currentDate.getMonth() + '/' + currentDate.getDate() + ':'+currentDate.getDay());
  
  var ss = openSheetApp_();
  var sheet = ss.getSheetByName(SHEET_WORKING); // 修改为你的工作表名称
  
  var row = 3; // 开始的行数
  var col = 1; // 开始的列数

  let col_max = sheet.getLastColumn();
  
  while (currentDate <= endDate) {
    var dayOfWeek = currentDate.getDay(); // 获取星期几（0-6，0表示星期天）
    if (dayOfWeek === 0 || dayOfWeek === 3) { // 只处理星期天和星期三
      sheet.getRange(row, col+1).setHorizontalAlignment("center");
      sheet.getRange(row, col).setHorizontalAlignment("center");
      if (dayOfWeek === 0) {
        for (let col=1;col<=col_max;col++) sheet.getRange(row, col).setBackground("white");
        //sheet.getRange(row, col).setFontColor("black");
        sheet.getRange(row, col+1).setValue("主日敬拜");
      } else if (dayOfWeek === 3) {
        for (let col=1;col<=col_max;col++) sheet.getRange(row, col).setBackground("#f0f0f0");
        sheet.getRange(row, col+1).setValue("禱告會");
      }

      var formattedDate = Utilities.formatDate(currentDate, SpreadsheetApp.getActive().getSpreadsheetTimeZone(), "yyyy/MM/dd");
      Logger.log(formattedDate);
      sheet.getRange(row, col).setValue(formattedDate);
      //Logger.log(formattedDate.toString());
      row++;
    }
  
    currentDate.setDate(currentDate.getDate() + 1); // 增加一天
  }

  return true;
  
}

function getSettingDate_(caption) {
  var ss = openSheetApp_();
  var member = ss.getSheetByName(SHEET_SETTING);
  for (let col=1;col<100;col++) {
    if (member.getRange(1, col).getValue() === caption) {
      return member.getRange(2, col).getValue();;
    }
  }
  return null;
}

function getNameList_(service) {
  var ss = openSheetApp_();
  var member = ss.getSheetByName(SHEET_SETTING);
  let list = [];
  for (let col=1;col<100;col++) {
    if (member.getRange(1, col).getValue() === service) {
      for (let row=2;row<100;row++) {
        let cell = member.getRange(row, col).getValue().trim();
        if (cell === '') break;
        list[row - 2] = cell;
      }
      break;
    }
  }
  return list;
}

function exchange_(list, t, k) {
  if (t == k) return;
  let tmp = list[t];
  list[t] = list[k];
  list[k] = tmp;
}

function checkPass_(sheet, row, col, name) {
  for (let _col=3;_col<=20;_col++) {
    if (_col == col) continue;
    let cell = sheet.getRange(row, _col).getValue().trim();
    if (cell === name) 
      return false;
  }
  return true;
}

function getColByService_(ser) {
  var ss = openSheetApp_();
  var sheet = ss.getSheetByName(SHEET_WORKING);
  for (let col=1;col<100;col++) {
    //let cell = sheet.getRange(2, col).getValue().trim();
    //Logger.log('cell: ' + col + ': ' + cell);
    if (sheet.getRange(2, col).getValue().trim() === ser) {
      return col;
    }
  }
  return -1;
}

function putByService_(sername, sercol, type) {
  let col = getColByService_(sercol);//Logger.log('Col: ' + col);
  if (col == -1) return;
  var ss = openSheetApp_();
  let name = getNameList_(sername); //Logger.log(name);
  var sheet = ss.getSheetByName(SHEET_WORKING); // 修改为你的工作表名称
  let idx = 0;
  for (let row=3;row<100;row++) {
    
    //取得聚會種類
    let cell = sheet.getRange(row, 2).getValue().trim();
    
    //已經手動填上 就略過
    if (sheet.getRange(row, col).getValue().trim().length > 0) continue;
    
    if (cell === type) {
      sheet.getRange(row, col).setFontColor("black");
      let t = 1;
      while (!checkPass_(sheet, row, col, name[idx])) {
        exchange_(name, idx, (idx+t)%name.length);
        t++;
        if (t > name.length) {
          sheet.getRange(row, col).setFontColor("red");
          break;
        }
      }
      
      sheet.getRange(row, col).setHorizontalAlignment("center");
      
      //填空
      sheet.getRange(row, col).setValue(name[idx]);

      idx = (idx + 1)%name.length;
    }
  }
}

function cleanSheet() {
  var ss = openSheetApp_();
  var sheet = ss.getSheetByName(SHEET_WORKING);
  let col_max = sheet.getLastColumn();
  for (var col = 1; col <= col_max; col++) {
    sheet.getRange(3, col, sheet.getLastRow(), 1).clearContent();
  }

  
  for (let row=3;row<=52;row++) 
    for (let col=1;col<=col_max;col++) {
      sheet.getRange(row, col).setFontColor("black");
      sheet.getRange(row, col).setBackground("white");
    }

}
