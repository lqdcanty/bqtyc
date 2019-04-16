const app = getApp()
var thePage;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    citiaoDetails: [],
    citiaoCode: "",
    showIcon: true,
    tabIndx: ""
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    thePage = this;
    const citiaoCode = options.citiaoCode;
    const status = options.status;
    thePage.data.citiaoCode = citiaoCode;
    thePage.data.tabIndx = options.tabIndx;
    thePage.setData({
      searchBarTop: app.globalData.statusBarHeight + app.globalData.titleBarHeight
    });
    var params = { "code": citiaoCode };
    app.doPost("/citiao/query/detail", params, "数据加载中", function (rs) {
      var datas = rs.result.datas;
      thePage.data.citiaoDetails = datas;
      let actions=[];
      datas.attachs.forEach(function(p1,p2){
        let _index=p2+1;
        if (p1.fileType == 0){
          actions.push({
            name: "[" + _index + "]" + '链接 ' + p1.smallFileName
          })
        }
        if (p1.fileType == 1) {
          actions.push({
            name: "[" + _index + "]" + '图片 ' + p1.smallFileName
          })
        }
        if (p1.fileType == 2) {
          actions.push({
            name: "[" + _index + "]" + '其他附件 ' + p1.smallFileName
          })
        }
      
      })
      thePage.setData({
        citiaoDetails: datas,
        actions: actions,
        status: status,
        tabIndx: options.tabIndx
      });
    }, "get");

  },
  handleOpen() {
    this.setData({
      actionsOpened: true
    });
  },
  handleCancel(){
    this.setData({
      actionsOpened: false
    });
  },
  handleAction:({detail})=>{
    let _index = detail.index;
    let item = thePage.data.citiaoDetails.attachs[_index]
    if (item.fileType==0){
      wx.navigateTo({
        url: '../../../../components/webview/c?url=' + app.urlDecode(item.url) + '&title=' + item.fileName 
      })
    } else if (item.fileType==1){
      wx.previewImage({
        current: item.url, // 当前显示图片的http链接
        urls: [item.url] // 需要预览的图片http链接列表
      })
    }
  },
  onPullDownRefresh: function () {
    var citiaoCode = thePage.data.citiaoCode;
    var params = { "code": citiaoCode };
    app.doPost("/citiao/query/detail", params, "数据加载中", function (rs) {
      var datas = rs.result.datas;
      thePage.data.citiaoDetails = datas;
      thePage.setData({
        citiaoDetails: datas,
      });
    }, "get");
    wx.stopPullDownRefresh();
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  },
  clickUrl: function (e) {
    var url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: "../../../../components/webview/c?url=" + encodeURIComponent(url)
    });
  },
  aduitPass: function(e){
    var token = app.globalData.userInfo.authToken;
    let citiaoCode = e.currentTarget.dataset.citiaocode;
    var index = thePage.data.tabIndx;
    var params = { "token": token, "citiaoCode": citiaoCode, "status": "pass" };
    app.doPost("/citiao/audit", params, null, function (rs) {
      if (rs.resultCode == '200') {
        wx.showModal({
          title: '消息提示',
          content: '词条审核成功',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              var index = thePage.data.tabIndx;
              var pages = getCurrentPages();
              var prevPage = pages[pages.length - 2]; //回到词条列表页
              prevPage.getData({ tabIndex: index });
              wx.navigateBack();
              // wx.navigateTo({
              //   url: "../x?tabIndex=" + index
              // });
            }
          }
        })
      } else {
        wx.showModal({
          title: '消息提示',
          content: '词条审核失败',
          showCancel: false,
          success: function (res) {
          }
        })
      }
    }, "get");
  },
  aduitReject: function(e){
    var index = thePage.data.tabIndx;
    let citiaoCode = e.currentTarget.dataset.citiaocode;
    wx.navigateTo({
      url: "../auditgd/x?tabIndex=" + index + "&citiaoCode=" + citiaoCode
    });
  },
  returnUp: function(){
    var index = thePage.data.tabIndx;
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2]; //回到词条列表页
    prevPage.getData({ tabIndex: index });
    wx.navigateBack();
  }
})