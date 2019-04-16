// pages/imauditor/pass/x.js
const app = getApp()
var thePage;
Page({
  data: {
    showIcon: true
  },
  onLoad: function (options) {
    thePage = this;
    let workSeqNo = options.workSeqNo;
    thePage.setData({
      workSeqNo: workSeqNo
    });
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  }
})