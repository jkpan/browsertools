var _login = null;
//var username = null;

function getRootUrl() {
  let all = window.location.href; //console.log(all);
  let root = all.substring(0, all.indexOf('/dashboard.html'));// .length - '/dashboard.html'.length);
  //all.substr(0, all.length - '/dashboard.html'.length); //console.log('root:' + root);
  return root;
}

function relativeUrl(url) {
  let root = getRootUrl();//let domain = window.location.origin;
  if (url.startsWith(root)) {
    let str = url.substring(root.length, url.length);
    return '.' + str;
  }
  return url;
}

function _ajax(json, url, cb, errorcb) {
  console.log(json);
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(json)
  }).then((response) => {
    if (response.ok) {
      return response.json(); // 解析JSON回應
    } else {
      throw new Error("請求失敗：" + response.status);
    }
  }).then((data) => {
    // 在這裡處理解析後的JSON物件 //console.log(data);
    cb(data);
  }).catch((error) => {
    // 處理錯誤
    console.log('' + error);
    errorcb();
  });
}

function ajax_savejson(fn, json) {
  _ajax({
    filename: fn,
    content: json
  },
    '/savejson',
    (res) => { alert('done'); console.log(JSON.stringify(res)); },
    () => { console.log('exception'); }
  );
}

function saveAsAction() {
  //document.getElementById('saveasBtn').hidden = true;
  for (let i = 1; i <= 5; i++) {
    let _id = 'btn_save_' + i;
    if (document.getElementById(_id))
      document.getElementById(_id).hidden = false;
  }
  setTimeout(function () {
    for (let i = 1; i <= 5; i++) {
      let _id = 'btn_save_' + i;
      if (document.getElementById(_id))
        document.getElementById(_id).hidden = true;
    }
  }, 5000);
}

function buildFname(_idx) {
  let fn = `./users/${username}/dash_${_idx.length == 1 ? '0' + _idx : _idx}.json`; //if (confirm(`確定要存入 #${_idx.trim()} ?`))
  return fn;
}

function savefileByname() {
  if (username == null) return
  let _idx = document.getElementById('preload_name').innerHTML.trim();
  if (_idx.trim().length == 0) {
    saveAsAction();
    return;
  }
  let fn = buildFname(_idx);//`./users/${username}/dash_${_idx.length == 1?'0'+_idx:_idx}.json`; //if (confirm(`確定要存入 #${_idx.trim()} ?`))
  ajax_savejson(fn, JSON.stringify(toObj()));
}

function savefile(idx) {
  if (username == null) return;
  let fn = buildFname('' + idx);//`./users/${username}/dash_0${idx}.json`;
  if (confirm(`確定要存入 #${idx} ?`)) {
    ajax_savejson(fn, JSON.stringify(toObj()));
    document.getElementById('preload_name').innerHTML = '' + idx;
    if (document.getElementById('saveBtn'))
      document.getElementById('saveBtn').hidden = false;
  }
}

function preloadSaved(idx) {
  if (username == null) return;

  let url = buildFname('' + idx);//`./users/${username}/dash_0${idx}.json`;
  //alert(url);


  fetch(url).then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }).then((json) => {
    handleProfile(JSON.stringify(json));
    document.getElementById('preload_name').innerHTML = '' + idx;
    if (document.getElementById('saveBtn')) document.getElementById('saveBtn').hidden = false;
  }).catch((error) => {
    alert('Error ' + error);
    console.log(`Error: ${error}`);
  });
}


function logout() {
  cleanLogin();
  document.getElementById('__username').hidden = true;
  document.getElementById('__username').innerHTML = '';
  document.getElementById('__login').hidden = false;
  document.getElementById('__logout').hidden = true;
  chkloginstatus();
}

function login() {
  closeLogin();
  _login = window.open("login.html", "", "popup=no,toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=no,width=400,height=500,top=" + (screen.height - 400) + ",left=" + (screen.width - 840));
}

function closeLogin() {
  if (_login)
    _login.close();
  _login = null;
}

async function chkloginstatus() {
  try {
    console.log('chkloginstatus...');
    let result = await doChk();
    handleLogin(result);
  } catch (error) {
    handleLogin({
      state: 0,
      username: "guest",
      token: null
    });
  }
}

function handleLogin(resultJson) {

  document.getElementById('__username').hidden = true;
  document.getElementById('__login').hidden = true;
  document.getElementById('__logout').hidden = true;
  username = null;
  //resultJson = {state:0, username:"guest", des:"dochk response not ok"};
  if (resultJson.state == 0) { //git hub 純網頁 沒有server能力
    username = resultJson.username;
    document.getElementById('saveBtn').remove();
    document.getElementById('saveasBtn').remove();
    for (let i = 1; i <= 5; i++) document.getElementById('btn_save_' + i).remove();//hidden = "true";
    return;
  }
  if (resultJson.state == 1) { //權限全開 anth
    username = resultJson.username;
    document.getElementById('__username').hidden = false;
    document.getElementById('__username').innerHTML = resultJson.username;
    if (resultJson.username == 'guest') { //全權限的guest 不需要login logout //no auth
      document.getElementById('__logout').hidden = true;
      document.getElementById('__login').hidden = true;
    } else { //正常user
      document.getElementById('__logout').hidden = false;
      document.getElementById('__login').hidden = true;
    }
    for (let i = 1; i <= 5; i++) {
      document.getElementById('btn_preload_' + i).hidden = false;
      //document.getElementById('btn_save_' + i).hidden = false;
    }
  } else if (resultJson.state == 2) { //半權限的guest auth
    username = resultJson.username;
    document.getElementById('__username').hidden = false;
    document.getElementById('__username').innerHTML = resultJson.username;
    document.getElementById('__logout').hidden = true;
    document.getElementById('__login').hidden = false;
    for (let i = 1; i <= 5; i++) {
      document.getElementById('btn_preload_' + i).hidden = false;
      //document.getElementById('btn_save_' + i).hidden = false;
    }
  } else { //auth失敗 有token 但過期 或是帳密錯誤
    document.getElementById('__login').hidden = false;
    document.getElementById('saveBtn').remove();
    document.getElementById('saveasBtn').remove();
    for (let i = 1; i <= 5; i++) {
      document.getElementById('btn_preload_' + i).hidden = false;
      document.getElementById('btn_save_' + i).remove();
    }
  }

}

(async function () {
  await chkloginstatus();
})();


