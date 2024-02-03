
function readParam(param) {

    // 获取当前页面的URL
    //var currentURL = window.location.href;
    //console.log('url: ' + currentURL);
    //console.log(':' + window.location.origin);

    // 通过URLSearchParams对象解析URL参数
    var urlParams = new URLSearchParams(window.location.search);

    // 获取特定参数的值
    var parameterValue = urlParams.get(param);//'参数名');

    // 输出参数值到控制台
    console.log(param + ' 参数值为: ' + parameterValue);

    return parameterValue;
}

/*
const hex2rgb = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return 'rgb(' + r + ',' + g + ',' + b + ')';
}
*/

function hex2rgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return 'rgb(' + r + ',' + g + ',' + b + ')';
}

function copyToBoard(value) {
    navigator.clipboard.writeText(value).then(() => {
          //console.log("Text copied to clipboard...")
      }).catch(err => {
          console.log('Something went wrong, ', err);
      });
}

function detectDevice() {
    var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            
    if (isMobile) {
        console.log('This is a mobile device.');
        return true;
    } else {
        console.log('This is a desktop device.');
        return false;
    }
}

/*
// 获取 URL 中的参数
function getParameterByName(name, url) {
    if (!url) 
        url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
*/

function dropHandler(event) {

    event.preventDefault();
  
    // 檢查是否有拖拉的檔案
    if (event.dataTransfer.items) {
        // 使用 DataTransferItemList 物件來檢查檔案是否是圖片
        for (var i = 0; i < event.dataTransfer.items.length; i++) {
            if (event.dataTransfer.items[i].kind === 'file') {
                var file = event.dataTransfer.items[i].getAsFile();
                if (file.type.startsWith('image/')) {
                  
                  //////loadBgImg(event);
                  img = null;
                  _repaint();
  
                  var reader = new FileReader();
                   // 读取文件内容
                  reader.onload = function (event) {
                    var _img = new Image();
                    _img.onload = function () {
                      img = _img;
                      _repaint(); 
                    };
                    _img.src = event.target.result;
                  };
                  reader.readAsDataURL(file);
                  //// 
  
                }
            }
        }
    }
  }
  
  function dragOverHandler(event) {
    event.preventDefault();
  }
  
  function loadBgImg(event) {
    //console.log(event);
    var files = event.target.files;
    var file;
    if (files && files.length > 0) {
      file = files[0];
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function(e) {
        var _img = new Image();
        _img.onload = function() {
          img = _img;
          _repaint(); 
        }
        _img.src = e.target.result;
      }
    }
  }
  
  function createBGHiddenFile() {
    let _file = document.createElement('input');
    _file.type = "file";
    _file.id = "img";
    _file.hidden = "true";
    _file.accept = "image/png, image/gif, image/jpeg";
    _file.onchange = loadBgImg;
    let body = document.getElementsByTagName("body")[0];
    body.appendChild(_file);
    //<input id="img" type="file" hidden="true"/>
  }
  