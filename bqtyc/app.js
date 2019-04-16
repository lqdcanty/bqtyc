let RsaJS = require('utils/wxapp_rsa.js');
let LogUtils = require('utils/CssUtil.js');
//app.js
const { $Message } = require('./dist/base/index');
var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
const sysTitle="版权百科";

const sysLogo ="http://fdfs.banquanjia.com.cn/group2/M02/1C/43/CgoKDVxzxzGAH3SWAAF1m7UZIJU419.png";
var base64DecodeChars = new Array(
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,  -1, 62, -1, -1, -1, 63,
  52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
  -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
  15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
  -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
  41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);
App({
  onLaunch: function (options) {
    this.checkNewVersion();
    this.version();
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();
    month = month > 9 ? String(month) : ("0" + month);
    day = day > 9 ? String(day) : ("0" + day);
    hour = hour > 9 ? String(hour) : ("0" + hour);
    minute = minute > 9 ? String(minute) : ("0" + minute);
    second = second > 9 ? String(second) : ("0" + second);
    this.globalData.event_time = year + month + day + hour + minute + second;
  
    // 展示本地存储能力
    var that=this;
    var app=getApp();
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);
    this.globalData.onlanch_options=options;
    this.globalData.sysinfo = wx.getSystemInfoSync();

    wx.getSystemInfo({
      success: function (res) {
        var name = 'iPhone X'
        if (res.model.indexOf(name) > -1) {
          that.globalData.isIpx = true
        }
      }
    })
  },
  versionNum:'v.0.5.5beta', //版本号
  checkNewVersion:function(fn){
    // 获取小程序更新机制兼容
    let _this=this;
    if (wx.canIUse("getUpdateManager")) {
      const updateManager = wx.getUpdateManager();
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        console.log('跟新提示' + res.hasUpdate)
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: "新版本" + _this.versionNum+"发布",
              content: "动态样式修改，浏览记录修改，游戏版号、软著办理更新，是否重启应用？",
              success: function (res) {
                if (res.confirm) {
                  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate();
                }
              }
            });
          });
          updateManager.onUpdateFailed(function () {
            // 新的版本下载失败
            wx.showModal({
              title: "已经有新版本了哟~" + _this.versionNum,
              content: "新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~"
            });
          });
        } else if (!res.hasUpdate && fn){
          fn()
        }
      });
    } else {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
        title: "提示",
        content: "当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。"
      });
    }
  },
  // 登录代码
  login: function (callbackSuccess,callbackerror){
    var userInfo = null;
    if (!this.globalData.authIsShow) {
      return;
    }
     wx.login({
       success: res => {
         //用户授权核心代码
         console.log(res,"jin777")
         wx.getUserInfo({
           success: userRes => {
             console.log(userRes,"userRes1")
             var that=this;
             that.doPost(
               '/auth/xcx/new', {
                 code: res.code,
                 encryptedData: userRes.encryptedData,
                 iv: userRes.iv
               }, null, function (result) {
                 console.log(result,"result")
                 var data = result;
                 if (data.resultCode == '200') {
                   userInfo = data.result.userInfo;
                   that.globalData.userInfo = userInfo;
                   wx.setStorageSync("userInfo", data.result.userInfo);
                   that.globalData.cookie = that.globalData.userInfo.authToken;
                   if (callbackSuccess){
                     callbackSuccess(result);
                   }
                 }
               }, "post")
           }, fail: function (result) {
               console.log("未获取到用户信息--->");
             if (callbackerror){
               callbackerror(result);
               }
             
               //TODO:执行二次授权
             }
           })
       }
     })
   },
  buildGridShowData: function (data, size) {
    let rows = [];
    if (data) {
      let cols;
      for (var i = 0; i < data.length; i++) {
        if (Math.floor(i % size) == 0) {
          cols = [];
          rows.push({ indx: i, cols: cols });
        }
        cols.push(data[i]);
      }
    }
    //console.log("[" + size + "]" + data.length, rows);
    return rows;
  },
  //获取手机型号
  getModel: function () {
    return this.globalData.sysinfo["model"]
  },
  //获取微信版本号
  getVersion: function () {
    return this.globalData.sysinfo["version"]
  },
  //获取操作系统版本
  getSystem: function () {
    return this.globalData.sysinfo["system"]
  },
  //获取客户端平台
  getPlatform: function () {
    return this.globalData.sysinfo["platform"]
  },
  //获取客户端基础库版本
  getSDKVersion: function () {
    return this.globalData.sysinfo["SDKVersion"]
  },
  getAuthToken:function(){
    if(this.globalData.userInfo){
      return this.globalData.userInfo.authToken;
    }
  },


  //实现查询作品数据
  _queryWork: function(work_id){
    if( work_id >= 0 ) {
      return this.globalData.demo_work_data[work_id];
    }
    return null;
  },

  urlDecode:function(url){
    if (url) {
      var reg = new RegExp("[\\u4E00-\\u9FFF]+", "g"); ///.*[\u4e00-\u9fa5]+.*$/
      var urlDec;
      if (reg.test(decodeURIComponent(url))) {
        console.log("有汉字", decodeURIComponent(url))
        urlDec = this.base64encode(this.utf16to8(encodeURI(decodeURIComponent(url))))
        console.log(encodeURI(decodeURIComponent(url)))
        console.log(urlDec,"编码结果1");
      } else {
        console.log("无汉字", decodeURIComponent(url));
        urlDec = this.base64encode(this.utf16to8(decodeURIComponent(url)))
        console.log(urlDec, "编码结果2");
      }
      return urlDec;
    }else{
      return '';
    }
  },
  //同意request请求封装
  doPost: function (url, para, title, callback, method,callbackerror) {
    if (title != null) {
      wx.showLoading({
          title: title,
          mask: true
      })  
    }
    if (callback == null){
      return;
    }
    wx.request({
          url: url.indexOf("http") > -1 ? url : ('https://t.banquanbaike.com.cn' + url),                                                           
          data: para,
          method: method != null ? method : "GET",
          dataType: "json",
          header: {
            'content-type': 'application/x-www-form-urlencoded',
            'appid': "wx7d1808b88bcec345"
          },
          success: function (res) {
            res = res.data;
            wx.hideLoading();
            if ((res != null && res.resultCode == '200') || (res != null && res.resultCode == 0)){
              callback(res);
            } else {
              var title = ((res != null) ? res.resultMsg :  '服务访问错误');
              if(title==undefined){
                title='';
              }
              wx.showToast({
                icon: "none",
                title: title,
                duration: 5000
              })
            }
        },
        fail: function () {
          wx.hideLoading();
          if (callbackerror) {
            callbackerror()
          }else{
            wx.showToast({
              icon: "none",
              title: '网络连接错误'
            })
          }
        },
        complete: function (res) {
          if (res.errMsg =="request:fail "){
            if (callbackerror){
              callbackerror()
            }
           
          }
        }
    })
  },  
  sign: function (ts) {

    var signstr = this.globalData.token + ts + this.globalData.event_time;
    //console.log("签名前", signstr);
    var rsa = new RsaJS.RSAKey();
    //console.log("私钥", this.globalData.privatekey);
    rsa = RsaJS.KEYUTIL.getKey(this.globalData.privatekey);
    // console.log("RsaJS", rsa);
    var signature = rsa.signString(signstr, "sha1");
    // signature = RsaJS.hex2b64(signature); // hex 转 b64
    // console.log("签名", signature);
    return signature;
  },
  doCssPost: function (page, module, method, data, callback) {
    // http://192.168.101.4:10081/
    let url = this.globalData.cssurl;
    url += module; url += "/";
    url += method; url += "/";
    url += this.globalData.version; url += "/";
    let ts = new Date().getTime();
    url += ts; url += "/";
    url += this.globalData.event_time; url += "/";
    url += this.sign(ts);
    console.log("请求的数据", url, data);
    var header = {
      'content-type': 'application/json',
      'page': page,
      'authtoken': this.globalData.cookie,
      'wxappid': wx.getAccountInfoSync().miniProgram.appId,
      'sysinfo': JSON.stringify(this.globalData.sysinfo)
    };
    if (this.globalData.cookie) {
      header["cookie"] = "JSESSIONID=" + this.globalData.cookie + ";";
    }
    wx.request({
      url: url,
      method: "POST",
      data: data,
      header: header,
      success(res) {
        callback(true, res);
      },
      fail(res) {
        callback(false, res);
      }
    });
  },
  pageRouteLog(moduleName, module, pageName, page, pageUrl) {
    LogUtils.pageRouteLog(moduleName, module, pageName, page, pageUrl, getApp());
  },
  pageShareLog(moduleName, module, pageName, page, pageUrl) {
    LogUtils.pageShareLog(moduleName, module, pageName, page, pageUrl, getApp());
  },

  globalData: {
    userInfoDetail:null,
    versionString:'',
    authIsShow: true,
    sysinfo: null,
    onlanch_options:null,
    userInfo: null,
    event_time:null,
    token: "215balabal",
    version: "0.1",
    cssurl:"https://css.efida.com.cn/",
    privatekey: "-----BEGIN RSA PRIVATE KEY-----\nMIIBOgIBAAJBAIrWjqmfR+ncgXpJLGgN+V7ZJIqBn5Hnz2RMlQbmC6rUbh9VHk3A\njrqXTU3jbnnsImTsI1ahjn35DXFaMDJ/NtMCAwEAAQJAPs1RGR9Iu1uYYgVpheQU\nUjgtFE4QLULLiFYv7z/uNSZXs+kKz1LiBKFzhp7CtYREnNsN9CwEpsT1GD4dJKx2\nIQIhAN0SQwzIiK5QPYr72Yof9A18z2tPkzcsxmN/9waTVSvjAiEAoMYvDTmx1Ueh\nvBoufsCM9Pix/Eff3cG9SEptKMBanFECIAeNeyrxovHJngCkkA8O/miDjhaNdmsZ\nJYH6ujbIS82fAiA2rxID6pLNG18sjq8v16haDljjmULQt3v9Iat9R+fJ8QIhAL9P\nd5MHzSOZXPAlh3Pte55+C0Ug2jeq19pxFh3lNzMB\n-----END RSA PRIVATE KEY-----\n",
    sysTitle: sysTitle,
    sysLogo: sysLogo,
    //初始著作权人定义（不代表一定是版权权利人），每个作品由作品分类、类型、名称，以及初始著作权人(要能获取主体唯一标识)唯一区分。
    the_hot_works: [],
    the_categories: [],
    the_dynamics:[],
    the_search_rank:[],
    the_copyriht_power:[],
    bqData:{

    },
    statusBarHeight: 0,
    titleBarHeight: 0,
    copyriht_power:{},
    demo_work_data:[]
  },
  
  //编码的方法
  base64encode:function(str) {
    var out, i, len;
    var c1, c2, c3;
    len = str.length;
    i = 0;
    out = "";
    while(i <len) {
      c1 = str.charCodeAt(i++) & 0xff;
      if (i == len) {
        out += base64EncodeChars.charAt(c1 >> 2);
        out += base64EncodeChars.charAt((c1 & 0x3) << 4);
        out += "==";
        break;
      }
      c2 = str.charCodeAt(i++);
      if (i == len) {
        out += base64EncodeChars.charAt(c1 >> 2);
        out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
        out += base64EncodeChars.charAt((c2 & 0xF) << 2);
        out += "=";
        break;
      }
      c3 = str.charCodeAt(i++);
      out += base64EncodeChars.charAt(c1 >> 2);
      out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
      out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
      out += base64EncodeChars.charAt(c3 & 0x3F);
    }
        return out;
  },
    //解码的方法
  base64decode:function(str) {
    var c1, c2, c3, c4;
    var i, len, out;
    len = str.length;
    i = 0;
    out = "";
    while (i < len) {

      do {
        c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
      } while (i < len && c1 == -1);
      if (c1 == -1)
        break;

      do {
        c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
      } while (i < len && c2 == -1);
      if (c2 == -1)
        break;
      out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));

      do {
        c3 = str.charCodeAt(i++) & 0xff;
        if (c3 == 61)
          return out;
        c3 = base64DecodeChars[c3];
      } while (i < len && c3 == -1);
      if (c3 == -1)
        break;
      out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));

      do {
        c4 = str.charCodeAt(i++) & 0xff;
        if (c4 == 61)
          return out;
        c4 = base64DecodeChars[c4];
      } while (i < len && c4 == -1);
      if (c4 == -1)
        break;
      out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
    }
    return out;
  },
  utf16to8:function(str) {
    var out, i, len, c;
    out = "";
    len = str.length;
    for (i = 0; i < len; i++) {
      c = str.charCodeAt(i);
      if ((c >= 0x0001) && (c <= 0x007F)) {
        out += str.charAt(i);
      } else if (c > 0x07FF) {
        out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
        out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
        out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
      } else {
        out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
        out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
      }
    }
    return out;
  },
  utf8to16:function(str) {
    var out, i, len, c;
    var char2, char3;
    out = "";
    len = str.length;
    i = 0;
    while (i < len) {
      c = str.charCodeAt(i++);
      switch (c >> 4) {
        case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
          // 0xxxxxxx
          out += str.charAt(i - 1);
          break;
        case 12: case 13:
          // 110x xxxx   10xx xxxx
          char2 = str.charCodeAt(i++);
          out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
          break;
        case 14:
          // 1110 xxxx  10xx xxxx  10xx xxxx
          char2 = str.charCodeAt(i++);
          char3 = str.charCodeAt(i++);
          out += String.fromCharCode(((c & 0x0F) << 12) |
            ((char2 & 0x3F) << 6) |
            ((char3 & 0x3F) << 0));
          break;
      }
    }
    return out;
  },
  //版本监听
  version: function () {
    console.log('envVersion', __wxConfig.envVersion);
    let version = __wxConfig.envVersion;
    switch (version) {
      case 'develop':
        //return '测试版环境域名';
        this.globalData.versionString ='develop';
        break;
      case 'trial':
        //return '体验版环境域名';
        this.globalData.versionString = 'trial';
        break;
      case 'release':
        this.globalData.versionString = 'release';
        //return '线上环境域名';
        break;
      default:
        this.globalData.versionString = 'trial';
      //return '测试版环境域名';
    }
  }

})



