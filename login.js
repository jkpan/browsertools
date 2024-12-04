
//var token = '';
//function _ajax(json, url, cb, errorcb) {
function _ajax_auth(url, _header, _body, succcb, errcb) {
    fetch(url, {
        method: "POST",
        headers: _header, //{"Content-Type": "application/json"},
        body: JSON.stringify(_body)
      }).then((response) => {
        if (response.ok) {
          return response.json(); // 解析JSON回應
        } else {
          throw new Error("請求失敗：" + response.status);
        }
      }).then((data) => { // 在這裡處理解析後的JSON物件 //console.log(data);
        succcb(data);
      }).catch((error) => { //console.log('' + error);
        errcb(error);
      });
}

async function auth(username, password, succcb, errcb) {
   
    
    //url, _header, _body, succcb, errcb
    _ajax_auth('/login', 
            { "Content-Type": "application/json" }, 
            { username, password },
            succcb, 
            errcb
    );
    
    return;
    
    const response = await fetch('/login', { //await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (response.ok) {
        let token = data.token; // 儲存 token
        localStorage.setItem('token', token); // 儲存 token 到 localStorage
        //alert('Login successful!'); console.log("response.ok");
        return { state: 1, des: "Login successful!", username: data.username };
    } else {
        console.log("!response.ok");
        return { state: -1, des: data.error };
        //alert(data.error);
    }
}

async function chk(succcb, errcb) {
    const token = localStorage.getItem('token');
    console.log('token :' + token);
    if (token == null) { 
        console.log('token null');
        //alert('token null');
        return {state:-1, des:"token null"};
    }
    _ajax_auth('/loginchk', 
        {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }, 
        {},
        succcb,
        errcb
    );
}

/*
async function chk2() {

    //window.close();return;
    const token = localStorage.getItem('token')

    let obj = {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    };
    const response = await fetch('/loginchk', obj);
    const data = await response.json();
    console.log(JSON.stringify(data));
    if (response.ok) {
        return { state: 1, des: "check ok", username: data.username };
    } else {
        return { state: -1, des: data.error };
    }
}
*/

function logout() {
    localStorage.removeItem('token'); // 移除 token
    alert('Logged out successfully.');
    window.location.href = '/login.html'; // 導向登入頁
}

/*
function isLoggedIn() {
    const token = localStorage.getItem('token');
    return !!token; // 有 token 則回傳 true，否則回傳 false
}

function checkThenOpen() {
    // 檢查並限制訪問
    if (isLoggedIn()) {
        console.log('User is logged in. Access granted.');
        // 使用 token 進行進一步的驗證或請求
    } else {
        console.log('User is not logged in. Redirecting to login...');
        window.location.href = '/_login.html'; // 導向登入頁
    }

}

function fetchProtectedData() {
    const token = localStorage.getItem('token');

    if (!token) {
        alert('You must log in to access this feature.');
        window.location.href = '/login.html'; // 導向登入頁
        return;
    }

    fetch('/protected', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(response => {
            if (response.status === 401 || response.status === 403) {
                alert('Session expired. Please log in again.');
                localStorage.removeItem('token'); // 移除無效 token
                window.location.href = '/login.html';
            }
            return response.json();
    }).then(data => {
            console.log('Protected data:', data);
        })
        .catch(error => console.error('Error:', error));
}
*/
