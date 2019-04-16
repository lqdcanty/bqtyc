// pages/services/copyrightbusiness/servicecontent/x.js
var thePage;
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showIcon:true,
    bimg:null,
    bcode:null,
    btitle:null,
    bname:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options,"options")
    let bcode = options.bcode;
    let bname = options.bname;
    let btitle = options.btitle;
    let bview=options.bview;
    let introduce = options.introduce;
    console.log(options.introduce)
    thePage=this;
    thePage.setData({
      bimg:decodeURIComponent(bview),
      bcode:decodeURIComponent(bcode),
      bname:decodeURIComponent(bname),
      btitle:decodeURIComponent(btitle),
      introduce: decodeURIComponent(introduce)
    })
  },
  onPaste:function(){
    console.log("点击了")
    wx.navigateTo({
      url: '../../shenlingcommon/x?bcode=' + thePage.data.bcode + '&bname=' + thePage.data.bname + '&btitle=' + thePage.data.btitle + "&introduce=" + thePage.data.introduce,
    })
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
    wx.stopPullDownRefresh()
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
    console.log(thePage.data.bview,
      thePage.data.bcode,
      thePage.data.bname,
      thePage.data.btitle)
    return {
      title: "[" + thePage.data.bname + "]" + thePage.data.btitle
    }
  }
})