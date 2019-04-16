const app = getApp()
var thePage;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabIndx: "tab1",
    myedit: null,
    work:null,
    powerType:'',
    lawObj:null,
    showIcon: true,
    lawObjLoad:false
  },
  handleChange({ detail }) {
    this.setData({
      tabIndx: detail.key
    });
    console.log(this.data.tabIndx);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    thePage = this;
    
    app.doPost('/work/details', { workSeqNo: options.workSeqNo }, null, function (data) {
      thePage.setData({
        workName: data.result.workModel.name,
        work: data.result.workModel,
        powerType: data.result.powerType,
        
      });
      // wx.setNavigationBarTitle({
      //   title: "法律诉讼@" + data.result.workModel.name,
      // });
    }, 'get');
    app.doPost('/law/query', { workSeqNo: options.workSeqNo, timestamp: (new Date()).valueOf() }, null, function (res) {
      thePage.setData({
        lawObj: res.result,
        listArrNo:true
      })
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
    this.setData({
      lawObjLoad: true
    });
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
    return { title: "文字作品“冰与火之歌”涉及的相关法律诉讼" };
  }
})