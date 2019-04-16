// pages/services/shenlingcommon/result/x.js
var thePage;
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showIcon:true,
    bname:'版权服务业务办理成功'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    thePage=this;
    console.log(wx.getLaunchOptionsSync(),"场景值")
    thePage.setData({
      bname: options.bname
    })


  },
  // abck:function(){
  //   wx.navigateTo({
  //     url: '/components/webview/c?url=' + app.urlDecode('https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzU5MTQ2Njc3OQ==#wechat_redirect'),
  //     success: function(res) {
        
  //     },
  //     fail: function(res) {},
  //     complete: function(res) {},
  //   })
  // },
  imgBig:function(){
    wx.previewImage({
      current: 'http://fdfs.banquanjia.com.cn/group2/M00/1C/47/CgoKDVx87SSAdqR4AADmY4E68HM112.png', // 当前显示图片的http链接
      urls: ['http://fdfs.banquanjia.com.cn/group2/M00/1C/47/CgoKDVx87SSAdqR4AADmY4E68HM112.png'] // 需要预览的图片http链接列表
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
    console.log(wx.getLaunchOptionsSync(), "场景值");
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

  }
})