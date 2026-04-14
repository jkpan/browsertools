
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

function isEnglishCharacter(char) {
    return /^[A-Za-z]$/.test(char);
}

function isImageFile(filename) {
    // 定義常見的圖片副檔名
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];//, '.webp', '.svg'];

    // 轉小寫來避免大小寫問題
    const lower = filename.toLowerCase();

    // 用 some() 來判斷是否符合其中一個副檔名
    return imageExtensions.some(ext => lower.endsWith(ext));
}

function getImageExt(filename) {
    const lower = filename.toLowerCase();
    // 定義常見的圖片副檔名
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];
    for (let i = 0; i < imageExtensions.length; i++) {
        if (lower.endsWith(imageExtensions[i])) {
            return imageExtensions[i];
        }
    }
    return null;

    /*
    const extension = {
        '.jpg' : 'jpg',
        '.jpeg': 'jpeg',
        '.png' : 'png',
        '.gif' : 'gif',
        '.bmp' : 'bmp'
    }[ext];
    */
    // 轉小寫來避免大小寫問題
    /*
    const lower = filename.toLowerCase();
    if (imageExtensions.some(ext => lower.endsWith(ext))) {
      return true;
    }
    return false;
    */
}


function urlAction(url, handler, error) {
    fetch(url)
        .then(res => {
            if (!res.ok) {
                throw new Error("HTTP error " + res.status);
            }
            return res.json();
        })
        .then(data => {
            handler(data);
        })
        .catch(err => {
            error(err);
        });
}
