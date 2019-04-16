// pages/imauditor/false/x.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showIcon: true
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  },

})