var image_base64 = null;
var forPlay = 0;

function isKeepRatio() {
  var checkbox = document.getElementById("keepratio");
  var isChecked = checkbox.checked;
  return isChecked;
}

function selectFile(event) {
    let file = event.target.files[0];
    
    /*
    var fileInfo = "檔案名稱: " + file.name + "<br>" +
                                 "檔案類型: " + file.type + "<br>" +
                                 "檔案大小: " + file.size + " bytes";
    alert(fileInfo);
    */

    if (file.type === 'application/json') {
      getJsonObj(file);
      return;
    } 
    
    if (file.type.startsWith('text/html')) {
      displayHTMLFile(file);
      return;
    }
  
    if (file.type.startsWith('image/')) {
      displayImageFile(file);
      return;
    }
    if (file.type.startsWith('video/')) {
      displayVideoFile(file);
      return;
    }
    if (file.type.startsWith('application/pdf')) {
      displayPDFFile(file);
      return;
    }
  
  }
  
  function openFile(elmid) {
    document.getElementById(elmid).click();
  }
  
  function displayHTMLFile(file) {
  
    document.querySelector('body').style.background = 'transparent';
    document.getElementById("ui").hidden = true;
  
    // 讀取檔案並將其轉換成Data URL
    var reader = new FileReader();
    reader.onload = function(event) {
      var imageUrl = event.target.result;
      document.getElementById("web").hidden = false;
      document.getElementById("web").src = imageUrl;
    };
    reader.readAsDataURL(file);
  }

  function showImage() {
    document.querySelector('body').style.background = 'transparent';
    document.getElementById("ui").hidden = true;

    document.getElementById("reloadPage").hidden = false;
    if (forPlay)
        document.getElementById("reloadPage").hidden = true;

    console.log(":::" + document.getElementById("reloadPage").hidden);
    
    
    let img = new Image();
    img.src = image_base64;
    img.onload = function() {
      var width = img.width;
      var height = img.height;//window.location.href = imageUrl; return;
      let div = document.getElementById("image_container");
      div.hidden = false;
      
      if (isKeepRatio()) {
        div.innerHTML = '<img class="img_ratio" src="' + image_base64 + '" />';
      } else {
        div.innerHTML = '<img class="img_full" width="100%" height="100%" src="' + image_base64 + '" />';
      }
      
      /*
      if (isKeepRatio()) {
        if (width >= height) 
          div.innerHTML = '<img class="centered" width="100%" height="auto" src="' + image_base64 + '" />';
        else 
          div.innerHTML = '<img class="centered" width="auto" height="100%" src="' + image_base64 + '" />';
      } else {
        div.innerHTML = '<img class="centered" width="100%" height="100%" src="' + image_base64 + '" />';
      }
      */

    };
    

    /*
    let div = document.getElementById("image_container");
    div.hidden = false;
      if (isKeepRatio()) {
        if (width >= height) 
          div.innerHTML = '<img class="centered" width="100%" height="auto" src="' + image_base64 + '" />';
        else 
          div.innerHTML = '<img class="centered" width="auto" height="100%" src="' + image_base64 + '" />';
      } else {
        div.innerHTML = '<img class="centered" width="100%" height="100%" src="' + image_base64 + '" />';
      }
      */
  }
  
  function displayImageFile(file) {
  
    //document.querySelector('body').style.background = 'transparent';
    //document.getElementById("ui").hidden = true;;
    // 讀取檔案並將其轉換成Data URL

    var reader = new FileReader();
    reader.onload = function(event) {
      image_base64 = event.target.result;//console.log('image_base64:' + image_base64);
      showImage();
    };
    reader.readAsDataURL(file);

  }
  
  function displayPDFFile(file) {
    //displayHTMLFile(file);
    document.getElementById("reloadPage").hidden = false;
    //document.querySelector('body').style.background = 'transparent';
    document.getElementById("ui").hidden = true;
    const fileURL = URL.createObjectURL(file);
    const iframe = document.getElementById('web');
    iframe.hidden = false;
    iframe.src = fileURL;
    //window.location.href = fileURL;

  }
  
  function displayVideoFile(file) {
  
    document.querySelector('body').style.background = 'transparent';
    document.getElementById("ui").hidden = true;
  
    //const file = event.target.files[0];
    const videoURL = URL.createObjectURL(file);
  
    const video = document.getElementById("vsrc");
    video.src = videoURL;
    video.hidden = false;
  }
  
  //window.addEventListener('message', (e) => {}, false);

  function getJsonObj(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const contents = e.target.result;
      const jsonData = JSON.parse(contents);
      console.log(JSON.stringify(jsonData));
      //handleProfile(JSON.stringify(jsonData));
    };
    reader.readAsText(file);
  }
  
  function dropHandler(event) {
      
      event.preventDefault();
  
      // 檢查是否有拖拉的檔案
      if (event.dataTransfer.items) {
          // 使用 DataTransferItemList 物件來檢查檔案是否是圖片
          for (var i = 0; i < event.dataTransfer.items.length; i++) {
              if (event.dataTransfer.items[i].kind === 'file') {
                  var file = event.dataTransfer.items[i].getAsFile();
                  if (file.type.startsWith('text/html')) {
                    displayHTMLFile(file);
                    return;
                  }
                  if (file.type === 'application/json') {
                    getJsonObj(file);
                    return;
                  } 
                  if (file.type.startsWith('image/')) {
                      // 顯示圖片
                      displayImageFile(file);
                      return;
                  }
                  if (file.type === 'application/pdf') {
                      // 顯示PDF
                      //displayPDF(file);
                      displayPDFFile(file);
                      return;
                  }
                  if (event.dataTransfer.items[i].type.indexOf("video") !== -1) {
                      //var file = event.dataTransfer.items[i].getAsFile();
                      displayVideoFile(file);
                      return;
                  }
              }
          }
      }
  }
  
  function dragOverHandler(event) {
      event.preventDefault();
  }

  function reloadPage() {
    location.reload();
  }
  