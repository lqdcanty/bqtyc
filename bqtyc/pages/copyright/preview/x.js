const goto = "components/webview";
const app = getApp()
var thePage, user;
Page({
  data: {
    copyright: null,
    pageIndx: 0,
    tabIndx: 0,
    background: ['demo-text-1', 'demo-text-2', 'demo-text-3'],
    vertical: false,
    autoplay: false,
    circular: false,
    interval: 2000,
    duration: 500,
    previousMargin: 0,
    nextMargin: 0,
    showIcon: true,
    work: null,
    detailAll: null,
    backUrl:'',
    detailObj: null,
    powerType: '',
    listIndex: 0,
    imagesMak: '../../../img/id-card.png',
    imagesMakShow: false,
    statusBarHeight:0,
    titleBarHeight:0,
    authIsShow:true,
    sysLogo: app.globalData.sysLogo,
  },
  onauthorizeEvent: function (e) {
    this.setData({
      authIsShow: e.detail == 1 ? true : false
    });
    app.globalData.authIsShow = e.detail == 1 ? true : false;
    app.login(function (res) {
      app.globalData.userInfo = res.result.userInfo;
      user = res.result.userInfo
      thePage.getData(thePage.data.optionsObj);
    })
  },
  getScopeUserInfo: function () {//授权判断
    wx.getSetting({
      success: setRes => {
        console.log(setRes, "第一页的设置11")
        var t = setRes.authSetting['scope.userInfo'];
        if (t == 'undefined ' || t == null) {
          thePage.setData({
            authIsShow: false
          });
        } else {
          thePage.setData({
            authIsShow: true
          });
          app.login(function (res) {
            app.globalData.userInfo = res.result.userInfo;
            user = res.result.userInfo
            thePage.getData(thePage.data.optionsObj);
          })
        }
      }
    })
  },
  onShareAppMessage: function (res) {
    console.log("有一个分享请求", res);
    console.log(this.data.work.type, this.data.work.name, this.data.work.category, this.data.work.type)
    return {
      title: ("[" + this.data.work.type + "]" +
        this.data.work.name + "@" + this.data.work.category),
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    thePage = this;
    thePage.setData({
      statusBarHeight: app.globalData.statusBarHeight,
      titleBarHeight: app.globalData.titleBarHeight
    })
    user = app.globalData.userInfo;
    thePage.setData({ optionsObj: options })
    var pages=getCurrentPages();
    if (pages.length==1){
      thePage.setData({ backUrl: '/pages/index/x' })
    }
    if (user) {
      thePage.getData(options);
    } else {
      thePage.getScopeUserInfo();
    }

    // if(getCurrentPages().length>1){
    //   thePage.getData(options);
    // }else{
    //   var time = setInterval(() => {
    //     var user = app.globalData.userInfo;
    //     if (user) {
    //       clearInterval(time);
    //       thePage.getData(options)
    //     }
    //   }, 1000)
    // }
  },
  getData: function (options){
    app.doPost('/work/details', { workSeqNo: options.workSeqNo, timestamp: (new Date()).valueOf() }, null, function (data) {
      thePage.setData({
        work: data.result.workModel,
        powerType: data.result.powerType
      });
    }, 'get');
    app.doPost('/copyrightDetail/queryDetail', { citiaoCode: options.citiaoCode, timestamp: (new Date()).valueOf() }, null, function (data) {
      thePage.setData({
        detailObj: data.result.detail,
      });
    }, 'get');
  },
  onReady: function () {

  },
  switchNavigate: function (e) {
    let indx = e.currentTarget.dataset.current;
    if (this.data.tabIndx == -1) {
      return;
    } else {
      thePage.setData({
        tabIndx: indx,
      });
    }
  },
  changeProperty: function (e) {
    this.setData({
      listIndex: e.detail.current,
      detailObj: thePage.data.detailAll[e.detail.current]
    })
  },
  blockClick: function (e) {
    var fileType = e.currentTarget.dataset.filetype;
    var url = e.currentTarget.dataset.url;
    var arr = [url];
    if (fileType == 0) {
      wx.navigateTo({
        url: "../../../components/webview/c?title=[" + thePage.data.work.category + "]" + thePage.data.work.name + "@" + thePage.data.work.type + '[' + thePage.data.rightType+']' + "&type=版权词条参考资料" + "&url=" + app.urlDecode(url) ,
      });
    } else if (fileType == 1) {
      wx.previewImage({
        urls: arr,// 需要预览的图片http链接列表
      })
    } else if (fileType == 2) {
      wx.downloadFile({
        url: url,
        success: function (res) {
          var filePath = res.tempFilePath
          wx.openDocument({
            filePath: filePath,
            success: function (res) {
              console.log('打开文档成功')
            }
          })
        }
      })
    }
  }
})
