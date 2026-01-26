
const map_dash = new Map();
const map_wipe = new Map();

function sceneAction(req, res) {
  let body = '';
  // 接收请求的数据
  req.on('data', (data) => {
    body += data;
  });

  // 请求数据接收完成后的处理
  req.on('end', () => {
    // 解析请求数据
    const requestData = JSON.parse(body); //println(body);
    let action = requestData.action;
    let filter = requestData.filter;

    let obj = {
      filter: filter,
      action: action
    };

    let obj_return = null;

    if (action == 'GETDASH') {
      obj_return = map_dash.get(filter);
      if (!obj_return) 
        obj_return = { "state": "empty" };
      else 
        map_dash.delete(filter);
    } else if (action == 'GETWIPE') {
      obj_return = map_wipe.get(filter);
      if (!obj_return) 
        obj_return = { "state": "empty" };
      else 
        map_wipe.delete(filter);
    } else if (action.startsWith('S')) {
      map_dash.set(filter, obj); print('.dash ' + filter + '.');
      obj_return = { "state": "success" };
    } else {
      map_wipe.set(filter, obj); print('.wipe ' + filter + '.');
      obj_return = { "state": "success" };
    }

    res.setHeader('Content-Type', 'application/json');// 发送响应数据
    res.end(JSON.stringify(obj_return));

  });
}

module.exports = {
    sceneAction
}