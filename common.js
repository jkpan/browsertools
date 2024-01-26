
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

