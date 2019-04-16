// pages/upload/cover/x.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    files: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var url = "http://fdfs.banquanjia.com.cn/group2/M02/01/22/CgoKC1wiCSGAWyArAAAJLf9xD_4766.png";
    that.setData({
      file: that.data.files.concat(url)
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
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        //启动上传等待中...  
        wx.showToast({
          title: '正在上传...',
          icon: 'loading',
          mask: true,
          duration: 1000
        })
        for (var i = 0, h = tempFilePaths.length; i < h; i++) {
          wx.uploadFile({
            url: 'https://t.banquanbaike.com.cn/file/upload/server',
            filePath: tempFilePaths[i],
            name: 'file',
            header: {
              "Content-Type": "multipart/form-data"
            },
            success: function (res) {
              var result = JSON.parse(res.data);
              if (result.resultCode == "200") {
                var url = result.result.url;
                that.updateHigherPage(url);
                that.setData({
                  file: that.data.files.concat(tempFilePaths)
                });
              } else {
                wx.hideToast();
                wx.showModal({
                  title: '错误提示',
                  content: '封面图片上传失败',
                  showCancel: false,
                  success: function (res) { }
                })
              }
            },
            fail: function (res) {
              wx.hideToast();
              wx.showModal({
                title: '错误提示',
                content: '封面图片上传失败',
                showCancel: false,
                success: function (res) { }
              })
            }
          }); 
        }
      }
    })
  },
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },
  updateHigherPage: function(url){
    var pages = getCurrentPages();
    var Page = pages[pages.length - 1];//当前页
    var prevPage = pages[pages.length - 2];//上一个页面
    // var info = prevPage.data //取上页data里的数据也可以修改
    prevPage.setData({ //设置数据
      image : url
    })
  }

})
