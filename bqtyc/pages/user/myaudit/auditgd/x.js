const app = getApp()
var thePage;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabIndx: "",
    citiaoCode: "",
    reason: "",
    showIcon: true
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    thePage = this;
    const citiaoCode = options.citiaoCode;
    const tabIndx = options.tabIndex;
    thePage.data.citiaocode = citiaoCode;
    thePage.data.tabIndx = tabIndx;
    thePage.setData({
      introLen : 0
    })
  },
  onShareAppMessage: function () {
  },
  introBindtap: function (e) {
    var intro = e.detail.value;
    if (intro.length > 1024) {
      wx.showModal({
        title: '错误提示',
        content: '驳回原因不能超过128个字符',
        showCancel: false,
        success: function (res) { }
      })
    }
    thePage.data.reason = e.detail.value;
    this.setData({
      introduction: e.detail.value,
      introLen: intro.length
    })
  },
  aduitReject: function (e) {
    var index = thePage.data.tabIndx;
    let citiaoCode = thePage.data.citiaocode;
    let reason = thePage.data.reason;

    var token = app.globalData.userInfo.authToken;
    var params = { "token": token, "citiaoCode": citiaoCode, "reason": reason, "status": "reject" };
    app.doPost("/citiao/audit", params, "数据提交中", function (rs) {
      if (rs.resultCode == '200') {
        wx.showModal({
          title: '消息提示',
          content: '词条驳回成功',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              var pages = getCurrentPages();
              var prevPage = pages[pages.length - 3]; //回到词条列表页
              prevPage.getData({ tabIndex: index });
              wx.navigateBack({
                delta: 2
              });
              // wx.navigateTo({
              //   url: "../x?tabIndex=" + index
              // });
            }
          }
        })
      } else {
        wx.showModal({
          title: '消息提示',
          content: '词条驳回失败',
          showCancel: false,
          success: function (res) {
          }
        })
      }
    }, "get");
  }
})  