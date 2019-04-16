// pages/copyright/related/x.js
const app = getApp()
var thePage;
var oper_data;
var work_data;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    actionsOpened: false,
    actions: null,
    work:null,
    showIcon: true,
    powerType:'',
    prizes:null,
    datano:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    thePage = this;
    app.doPost('/work/details', { workSeqNo: options.workSeqNo }, null, function (data) {
      thePage.setData({
        work: data.result.workModel,
        powerType: data.result.powerType
      });
    }, 'get');
    app.doPost('/prize/queryPrize', { workSeqNo: options.workSeqNo }, null, function (data) {
      
        thePage.setData({
          prizes: data.result.prizes,
        });
    }, 'get');
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
})