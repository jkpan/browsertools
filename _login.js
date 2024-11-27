
//var token = '';

async function auth(username, password) {

    const response = await fetch('/login', { //await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (response.ok) {
        let token = data.token; // 儲存 token
        localStorage.setItem('token', token); // 儲存 token 到 localStorage
        //alert('Login successful!');
        console.log("response.ok");
        return { state: 1, des: "Login successful!" };
    } else {
        console.log("!response.ok");
        return { state: -1, des: data.error };
        //alert(data.error);
    }
}

async function chk() {
    //window.close();return;
    const token = localStorage.getItem('token')
    let obj = {
        method: 'POST',
        headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    };
    const response = await fetch('/protected', obj);
    const data = await response.json();
    if (response.ok) {
        return { state: 1, des: "check ok" };
    } else {
        return { state: -1, des: data.error };
    }
}

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

function logout() {
    localStorage.removeItem('token'); // 移除 token
    alert('Logged out successfully.');
    window.location.href = '/login.html'; // 導向登入頁
}