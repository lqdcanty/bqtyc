// pages/dynamic/x.js
var app = getApp();
var thePage;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showIcon: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    thePage = this;
    var params = { "pageNumber": 1,"pageSize": 1};
    app.doPost("/dynamic/query", params, "", thePage.queryDynamicCallback, "get");

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
  queryDynamicCallback: function(rs){
    var dynamics = rs.result.datas;
    thePage.setData({
      dynamics: dynamics,
    });
  },
  onPullDownRefresh: function () {
    console.log('#触发下拉刷新');
    var params = { "pageNumber": 1, "pageSize": 5 };
    app.doPost("/dynamic/query", params, "", thePage.queryDynamicCallback, "get");
  },  
  

})