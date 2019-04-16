// pages/copyright/related/add/x.js
const app = getApp()
var thePage;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    categories:["企业","个人"],
    imgurl1: "../../../img/sfz_2.png",
    imgurl2: "../../../img/id-card.png",
    category:0,
    showIcon:true,
    address:"",
    nameEdit:true,
    obName:"",
    aliasName:"",
    certNo:"",
    obligeeType:1
  },
  
  onLoad: function (options) {
      thePage=this;
      this.setData({
        obligeeCode: options.code,
        token: app.globalData.userInfo.authToken,
      });
    app.doPost('/obligee/auth/detail', { obligeeCode: options.code, token: app.globalData.userInfo.authToken, timestamp: (new Date()).valueOf() }, null, function (data) {
      let obligee=data.result.obligee;
      console.log(obligee.auditStatus == 'wait_submit')
      console.log(obligee.auditStatus == "wait_audit")
      if (obligee.auditStatus=='wait_submit'){
        thePage.setData({
          obName:obligee.name,
          editStatus: obligee.auditStatus,
          aliasName: obligee.aliasName,
          nameEdit:false,
          obligee: obligee
        })
      } else {
        thePage.setData({
          obName: obligee.name,
          nameEdit: false,
          aliasName: obligee.aliasName,
          editStatus: obligee.auditStatus,
          address: obligee.address,
          category: obligee.obligeeType == 1 ? 0 : 1,
          imgurl1: obligee.certAttachUrl1,
          imgurl2: obligee.certAttachUrl2,
          obligeeType: obligee.obligeeType,
          obligee: obligee
        })
      }
    }, 'get');
  },
  addressInputChange:function(e){
      this.setData({
        address:  e.detail.value
      })
  },
  bindCategoryChange:function(res){
    thePage=this;
    this.setData({
      category: res.detail.value,
      obligeeType: res.detail.value==0?1:2,
      address: res.detail.value == 1 ? "" : thePage.data.address
    })
  },
  chooseImage1: function () {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        console.log(res)
        that.setData({
          imgurl1: res.tempFilePaths[0]
        });
        that.imgUpload(res.tempFilePaths[0],1)
      }
    })
  },
  chooseImage2: function () {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          imgurl2: res.tempFilePaths[0]
        });
        that.imgUpload(res.tempFilePaths[0],2)
      }
    })
  },
  imgUpload:function(imgUrl,type){
    let that=this;
    wx.uploadFile({
      url: 'https://t.banquanbaike.com.cn/file/upload/server',
      filePath: imgUrl,
      name: 'file',
      header: {
        "Content-Type": "multipart/form-data"
        //"Content-Type": "application/json"
      },
      success: function (res) {
        var result = JSON.parse(res.data);
        console.log(res, "res11")
        wx.hideToast();
        if (result.resultCode == "200") {
          var url = result.result.url;
          if(type==1){
            that.setData({
              imgurl1: url
            });
          }else{
            that.setData({
              imgurl2: url
            });
          }
          
        } else {
          wx.showModal({
            title: '错误提示',
            content: '图片上传失败',
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
          success: function (res) {
          }
        })
      }
    });
  },
  formSubmit(e) {
    thePage = this;
    var formData = e.detail.value;
    formData.obligeeCode = this.data.obligeeCode;
    formData.token = this.data.token;
    formData.address = this.data.address;
    app.doPost('/obligee/auth/apply', formData, null, function (data) {
      wx.navigateTo({
        url: '../x?code=' + thePage.data.obligeeCode
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