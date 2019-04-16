// pages/dynamic/detail/x.js
var app = getApp();
var thePage;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showIcon: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      thePage = this;
      let keyword = options.keyword;
      var params = { "dynamicCode": keyword};
      app.doPost("/dynamic/detail", params, "", thePage.dynamicDetailCallback, "get");
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

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
  dynamicDetailCallback: function(rs){
    var dynamic = rs.result.dynamic;
    thePage.setData({
      dynamic: dynamic,
    })
    console.log(dynamic);
  }
})