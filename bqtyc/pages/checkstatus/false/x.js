// pages/imauditor/false/x.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showIcon: true
  },

  onLoad: function (options) {
    this.setData({
      title: options.title,
      url: options.url ? options.url : '../../index/x'
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  },

})