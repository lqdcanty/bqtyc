const app = getApp()
var thePage;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    mybill: [],
    pageNum:1,
    lastPage:false,
    showIcon:true,
    lastPage:false,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: options.type == 1 ? '我获得的版权力' : '我的兑换记录'
    });
    thePage = this;
    thePage.setData({
      type: options.type,
      searchBarTop: app.globalData.statusBarHeight + app.globalData.titleBarHeight,
      pageTitle: options.type == 1 ? '我获得的版权力' : '我的兑换记录'
    });
    thePage.getData(thePage.data.pageNum)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  getData:function(num){
    let that=this;
    if (that.data.lastPage) {
      return;
    }
    app.doPost(
      '/bql/api/query', { scoreType: thePage.data.type, pageNumber: num, token: app.globalData.userInfo.authToken }, null, function (rs) {
      
        var datas = rs.result.powers;
        thePage.data.pageNum = rs.result.pageNumber;
        var passs = thePage.data.mybill;
        passs = thePage.getResultDate(datas, passs);
        thePage.data.mybill = passs;
        console.log(passs)
        thePage.setData({
          mybill: passs,
          lastPage: rs.result.totalPage == rs.result.pageNumber,
          flage: rs.result.totalPage == rs.result.pageNumber
        });
        console.log(thePage.data)
      }, 'get');
  },
  getResultDate: function (datas, passs) {
    for (var j = 0; j < datas.length; j++) {
      var date = datas[j].date;
      var rdata = datas[j].scores;
      var isContinue = thePage.isCountinueDate(date, passs);
      if (isContinue) {
        for (var i = 0; i < passs.length; i++) {
          var pdate = passs[i].date;
          var pData = passs[i].scores;
          if (date == pdate) {
            for (var k = 0; k < rdata.length; k++) {
              pData.push(rdata[k]);
            }
          }
        }
      } else {
        passs.push({ "date": date, "scores": datas[j].scores });
      }
    }
    return passs;
  },
  isCountinueDate: function (date, passs) {
    for (var i = 0; i < passs.length; i++) {
      if (passs[i].date == date) {
        return true;
      }
    }
    return false;
  },
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

    var pageNum = parseInt(this.data.pageNum) + 1
    this.getData(pageNum);
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  }
})