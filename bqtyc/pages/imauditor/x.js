// pages/imauditor/x.js
const app = getApp()
const { $Message } = require('../../dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    authIsShow:true,
    cuntDown: false,
    phone: '',
    name: '',
    email: '',
    code: '',
    showIcon: true,
    time: "60s"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this;
    that.setData({
      messageHeight: app.globalData.statusBarHeight + app.globalData.titleBarHeight
    })
    app.pageRouteLog("imauditor", "imauditor", 'imauditor', 'imauditor', this.url)
    if(options.status){
      $Message({
        content: '你的审核者申请被驳回，请重新申请',
        type: 'error'
      });
      let token = app.globalData.userInfo.authToken;
      app.doPost(
        '/apply/audit/detail?id=' + options.id, null, null, function (data) {
            that.setData({
              email: data.result.data.email,
              phone: data.result.data.phone,
              name: data.result.data.realName
            })
        }, 'get');
    }

  },
  formSubmint:function(){
    if (this.data.name == "") {
      $Message({
        content: '联系人姓名不能为空，请填写',
        type: 'error'
      });
      return
    }
    if (this.data.email == "") {
      $Message({
        content: '邮箱不能为空，请填写',
        type: 'error'
      });
      return
    }
    console.log(this.validatemobile(this.data.phone))
    if (!this.validatemobile(this.data.phone)) {
      $Message({
        content: '请输入正确的手机号',
        type: 'error'
      });
      return
    }
    if (this.data.code == "") {
      $Message({
        content: '验证码不能为空，请填写',
        type: 'error'
      });
      return
    }
    let that = this;
    let token = app.globalData.userInfo.authToken;
    app.doPost(
      '/apply/saveAuditor?token=' + token + '&email=' + that.data.email + '&realName=' + that.data.name + '&phoneNumber=' + that.data.phone + '&verfNmuber=' + that.data.code, null, null, function (data) {
        if (data.resultCode == '200' && data.result.success == 1) {
          wx.navigateTo({
          //url: './pass/x'
            url: '../copyright/complete/x?word=版权审核人申请成功&index=1'
          })
        }
      }, 'get');
  },
  validatemobile: function (mobile) {
    if (mobile.length == 0) {
      return false;
    }
    if (mobile.length != 11) {
      return false;
    }
    var myreg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
    return myreg.test(mobile)
  },
  codeFun: function (event) {
    this.setData({
      code: event.detail.value
    })
  },
  nameFun: function (event) {
    this.setData({
      name: event.detail.value
    })
  },
  emailFun: function (event) {
    this.setData({
      email: event.detail.value
    })
  },
  phoneFun: function (event) {
    this.setData({
      phone: event.detail.value
    })
  },
  cuntDownFun:function(){
    console.log(this.data.phone)
    let that=this;
    if (this.data.phone && this.data.phone != ""){
        that.setData({
          cuntDown:true
        })
        that.sendCode(that.data.phone);
        let t=60;
        let s=setInterval(function(){
            t=t-1;
            that.setData({
              time: t+'s'
            })
            if(t==0){
              clearInterval(s);
              that.setData({
                cuntDown: false
              })
            }
        }, 1000)
    }else{
      $Message({
        content: '请填写正确的手机号码',
        type: 'error'
      });
    }
  },
  sendCode: function (phone) {
    let token = app.globalData.userInfo.authToken;
    app.doPost(
      '/apply/sendVeriyNmuber?token=' + token + '&phoneNmuber=' + phone + '&type=auditor', null, null, function (data) {
        $Message({
          content: '短信发送成功，请注意查收',
          type: 'success'
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
    wx.getSetting({
      success: setRes => {
        var t = setRes.authSetting['scope.userInfo'];
        if (t == 'undefined ' || t == null) {
          thePage.setData({
            authIsShow: false
          });
        }
      }
    });
  },
  bindGetUserInfo: function (e) {
    let thePage=this;
    console.log(e.detail.userInfo);
    if (e.detail.userInfo == null) {
      console.log("未获取到授权");
    } else {
      console.log("已获取到授权");
      thePage.setData({
        authIsShow: true
      });
      this.login(this);
    }
  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    app.pageShareLog("imauditor", "imauditor", 'imauditor', 'imauditor', this.url)
    return {
      title: ('成为词条审核人'),
    }
  }
})