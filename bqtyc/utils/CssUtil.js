

/**
 * 记录页面路由日志，方式：优先在 app.js 的onLanch中获取 options中的数据，进行全局存储，数据如下：
 * path	string	启动小程序的路径
 * scene	number	启动小程序的场景值  -参看场景参数
 * query	Object	启动小程序的 query 参数
 * shareTicket	string	shareTicket
 * 当shareTicket不为空，需要调用 获取分享信息 调用后端解密算法，获取数据shareObjId
 * 
 */
function pageRouteLog(moduleName,module, pageName, page, pageUrl,app){
  if (app.globalData.onlanch_options.scene == 1044 && app.globalData.onlanch_options.path && app.globalData.onlanch_options.shareTicket && pageUrl== app.globalData.onlanch_options.path){
    //为了防止异常导致后续页面判断出现异常，所以进入该方法，就相对于处理了分享信息，清空关键判断字段。本身该判断用户打开小程序只执行一次。
    app.globalData.onlanch_options.path = null;
    wx.login({
      success: function (res) {
        let code = res.code;
        wx.getShareInfo({
          shareTicket: shareTicket,
          success: function (res) {
            let data = new Object();
            data.code = code;
            data.authToken =app.globalData.cookie;
            data.encryptedData = res.encryptedData;
            data.iv = res.iv;
            let header = {
              'content-type': 'application/json',
              'page': page,
              'wxappid': wx.getAccountInfoSync().miniProgram.appId,
              'sysinfo': JSON.stringify(app.globalData.sysinfo)
            };
            if (app.globalData.cookie) {
              header["cookie"] = "JSESSIONID=" + app.globalData.cookie + ";";
            }
            wx.request({
              url: serverUrl,
              method: "POST",
              data: data,
              header: header,
              success(res) {
                console.log("解密结果数据==>", res);
                //跳转其他页面再跳转回来的时候就不会再次进行统计了。
                let data = new Object();
                data.logType = "route";
                data.scene = scene;
                data.share_obj_id = res.data.openGId;
                data.module_name = moduleName;
                data.module = module;
                data.page_name = pageName;
                data.page = page;
                data.page_url = pageUrl;
                logSave(data);
              },
              fail(res) {
                console.log("解密异常信息==>", res);
                callback(null);
              }
            });
          },
          fail: function (res) {
            callback(null);
          },
          complete: function (res) { },
        })
      },
      fail: function (res) {
        callback(null);
      },
      complete: function (res) { },
    })
  }else{
    let data = new Object();
    data.logType = "route";
    data.scene = app.globalData.onlanch_options.scene;
    // data.share_obj_id = null;
    data.module_name = moduleName;
    data.module = module;
    data.page_name = pageName;
    data.page = page;
    data.page_url = pageUrl;
    logSave(data, app);
  }
}
/**
 * 用户点击分享后，进行存储,这里根本不知道用户是否真的进行了分享，用户可以取消，微信2.3.1升级后就没了分享回调方法。。
 * 先记录吧，虽然不知道实际是否分享，但是还是先考虑存储。
 */
function pageShareLog(moduleName, module, pageName, page, pageUrl, app) {
  let data = new Object();
  data.logType = "share";
  data.scene = app.globalData.onlanch_options.scene;
  data.module_name = moduleName;
  data.module = module;
  data.page_name = pageName;
  data.page = page;
  data.page_url = pageUrl;
  logSave(data, app);
}

function logSave(data,app) {
  data.timestamp = new Date().getTime();
  data.event_time = app.globalData.event_time; 
  data.version = app.globalData.version;
  data.authToken = app.globalData.cookie;
  var header = {
    'content-type': 'application/json',
    'wxappid': wx.getAccountInfoSync().miniProgram.appId,
    'sysinfo': JSON.stringify(app.globalData.sysinfo)
  };
  
  if (app.globalData.cookie) {
    header["cookie"] = "JSESSIONID=" + app.globalData.cookie + ";";
  }
  console.log("日志记录详细==>", data, header);
  wx.request({
    url: app.globalData.cssurl +"log/spider",
    method: "POST",
    data: data,
    header: header,
    success(res) {
      console.log(data.page_url+"==>日志存储成功",res);
    },
    fail(res) {
      console.log(data.page_url +"==>日志存储异常",res);
    }
  });
}

module.exports = {
  pageRouteLog: pageRouteLog,
  pageShareLog: pageShareLog,
}  