let thePromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(100);
    }, 1000);
    console.log("111");
  });
  
  return;
  async function getData() {
    console.log("222");
    let res1 = await thePromise; //此时等待Promise实例对象thePromise转化成一个状态为fulfilled，值为100。之后交由await解析，await解析为结果100，赋值给res1。
    console.log(res1);
  }
  getData();
  console.log("333");
  