// pages/examinedetail/x.js
var thePage;
const app = getApp();
var user;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navTitle: '版权百科',
    showIcon: true,
    color: "#FFD800",
    authIsShow: true,
    dataMess:null,
    sysLogo: app.globalData.sysLogo,
    backUrl:'',
  },
  onauthorizeEvent: function (e) {
    this.setData({
      authIsShow: e.detail == 1 ? true : false
    });
     app.globalData.authIsShow = e.detail == 1 ? true : false;
    app.login(function (res) {
      app.globalData.userInfo = res.result.userInfo;
      user = res.result.userInfo
      thePage.getData();
    })
  },
  getScopeUserInfo: function () {//授权判断
    wx.getSetting({
      success: setRes => {
        console.log(setRes, "第一页的设置11")
        var t = setRes.authSetting['scope.userInfo'];
        if (t == 'undefined ' || t == null) {
          thePage.setData({
            authIsShow: false
          });
        } else {
          thePage.setData({
            authIsShow: true
          });
          app.login(function (res) {
            app.globalData.userInfo = res.result.userInfo;
            user = res.result.userInfo
            thePage.getData();
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    thePage=this;
    var pages = getCurrentPages(); 
   user = app.globalData.userInfo;
    console.log(user,"user")
    if (pages.length==1){
      thePage.setData({ backUrl:'/pages/index/x'})
    }
    if (options.status == 'wait_audit' && options.type=='auditor'){
      thePage.setData({
        text:'您的成为审核者申请成功，后台审核需要等待3～5个工作日，	审核结果会通过公众号通知您。',
        type:'auditor',
      })
    } if (options.status == 'success' && options.type == 'auditor') {
      thePage.setData({
        text: '您的成为审核者审核通过，欢迎您审核词条！',
        type: 'auditor',
      })
    }else if (options.status == 'success' && options.type == 'editor'){
      thePage.setData({
        text: '您已经成功成为编辑者，欢迎您编辑词条！',
        type: 'editor'
      })
    } else if (options.status == 'wait_audit' && options.type == 'realName') {
      thePage.setData({
        text: '您已经实名认证成功,后台审核需要等待3～5个工作日，	审核结果会通过公众号通知您。',
        type: 'realName',
      })
    } else if (options.status == 'success' && options.type == 'realName') {
      thePage.setData({
        text: '您的实名认证审核通过！',
        type: 'realName',
      })
    }
    if (user) {
      thePage.getData();
    } else {
      thePage.getScopeUserInfo();
    }
    
  },
  getData:function(){
    if (thePage.data.type == 'auditor') {
      app.doPost('/apply/queryAuditor', { token: user ? user.authToken : '' }, null, function (data) {
        thePage.setData({
          dataMess: data.result.datas
        })
      }, 'get');
    } else if (thePage.data.type == 'editor') {
      app.doPost('/apply/queryEditor', { token: user ? user.authToken : '' }, null, function (data) {
        thePage.setData({
          dataMess: data.result.datas
        })
      }, 'get');
    } else if (thePage.data.type == 'realName') {
      app.doPost('/register/realNameStatus', { token: user ? user.authToken : '' }, null, function (data) {
        thePage.setData({
          dataMess: data.result.datas
        })
      }, 'get');
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

  }
})