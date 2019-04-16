const app = getApp()
var thePage;
var user;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showIcon: true,
    work: null,
    workSeqNo:'',
    playData:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


    thePage = this;

    user = app.globalData.userInfo;

    app.doPost('/work/details', { workSeqNo: options.workSeqNo, timestamp: (new Date()).valueOf() }, '提示', function (data) {
      thePage.setData({
        work: data.result.workModel,
        workSeqNo: options.workSeqNo
      });

    }, 'get');

    app.doPost('/work/monitor/network/player', { workSeqNo: options.workSeqNo, token: user ? user.authToken : '', timestamp: (new Date()).valueOf() }, '提示', function (data) {
      console.log(data)
      thePage.setData({
        playData: data.result.data,
      });
      console.log(thePage.data.playData)
    }, 'get');


  },

  addCopyright() {
    console.log(user, "user")
    if (!user) {
      $Message({
        content: '请登录',
        type: 'warning'
      });
      return;
    }
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
    return {
      title: ("网络播放" +
        "@" + this.data.work.category + this.data.work.type +
        "_" + this.data.work.title + ""),
    };
  }
})