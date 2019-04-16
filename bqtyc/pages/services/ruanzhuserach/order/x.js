// pages/work/x.js
const app = getApp()
var start_clientX;
var end_clientX;
var obj = wx.getSystemInfoSync();
var workHeight = obj.windowHeight;
var workWidth = obj.windowWidth;

var thePage;
var changeTitle = false;
let ruanzhu = {
  name: "天天欢乐抓娃娃（口袋）网络游戏软件",
  owner: "北京聚云纳新科技有限公司",
  regcode: "2018SR154462",
};
Page({
  /**
   * 页面的初始数据
   */
  data: {
    verticalCurrent:0,
   // verticalCurrent:0,
    typeList: ['材料审查', '软著认证', '软著出证'],
    photoUrl:'',
    showIcon: true,
    abc:false,
    certificateNumberChange:null,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    thePage = this;
    console.log(options,"获取蚕食")
    if (options.certificateNumber){
      app.doPost('https://www.ry365.com.cn/software/order/pdetailc', { cnumber: options.certificateNumber }, null, function (data) {
        var lengthArr = thePage.data.typeList; //certificateNumberChange
        thePage.setData({
          certificateNumberChange: true
        })
        if(data.result.softOrder.progressStatus == '软著出证') {
            thePage.setData({
              text0: '已通过',
              text1: '已通过',
              verticalCurrent: 3,
              photoUrl: data.result.softOrder.digitalCertificate
            })
        }
        thePage.setData({
          orderObj: data.result.softOrder,
        });
      }, 'get');
    }
    if (options.prn){
      app.doPost('https://www.ry365.com.cn/software/order/pdetail', { prn: options.prn }, null, function (data) {
        //thePage.data.typeList.forEach(function(item,index){
        if (data.result.softOrder.certificateNumber && (data.result.softOrder.certificateNumber.indexOf("*") != -1 || data.result.softOrder.certificateNumber.indexOf(".") != -1)) {
          console.log(data.result.softOrder.certificateNumber, "you")
          thePage.setData({
            certificateNumberChange: false
          })
        } else {
          console.log(data.result.softOrder.certificateNumber, "无")
          thePage.setData({
            certificateNumberChange: true
          })
        }
        var lengthArr = thePage.data.typeList;
        for (var i = 0; i < lengthArr.length; i++) {
          if (data.result.softOrder.progressStatus == '材料审查') {
            thePage.setData({
              text0: '未通过',
              verticalCurrent: 0,
              text1: '进行'
            })
          } else if (data.result.softOrder.progressStatus == '软著认证') {
            thePage.setData({
              text0: '已通过',
              text1: '进行',
              verticalCurrent: 1
            })
          } else if (data.result.softOrder.progressStatus == '认证失败') {
            thePage.setData({
              text0: '已通过',
              text1: '未通过',
              verticalCurrent: 1
            })
          } else if (data.result.softOrder.progressStatus == '软著出证') {
            thePage.setData({
              text0: '已通过',
              text1: '已通过',
              verticalCurrent: 3,
              photoUrl: data.result.softOrder.digitalCertificate
            })
          }
        }
        thePage.setData({
          orderObj: data.result.softOrder,
        });
      }, 'get');
    }
    
    
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
      });
    }
  },
  handleClick:function(){
    wx.navigateTo({
      url: "../../../welcome/x?word=版权词条",
    })
  },
  showPhoto(){
    wx.previewImage({
      current: thePage.data.photoUrl, // 当前显示图片的http链接
      urls: [thePage.data.photoUrl]
    })
  },
  homeClick:function(){
    wx.navigateTo({
      url: '../../../index/x',
    })
  },
  /**
   * 用户点击登录，初始化用户数据
   */
  doLogin: function (e) {
    let canIUse = wx.canIUse('button.open-type.getUserInfo');
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log("登录结果", res);
      }
    });
    // 获取用户信息
    wx.getSetting({
      success: res => {
        var setting = res.authSetting['scope.userInfo'];
        console.log("获取设置结果", res, setting);
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
        }
        wx.getUserInfo({
          success: res => {
            // 可以将 res 发送给后台解码出 unionId
            app.globalData.userInfo = res.userInfo
            console.log('getUserInfo', res.userInfo);
            thePage.setData({
              userInfo: res.userInfo,
              userDashboard: {
                bql_size: 34.52,
                count_edit: 5,
                count_audit: 0,
                count_share: 2,
                character: {
                  sharer: "blue",
                  editor: "blue",
                  auditor: "disabled",
                }
              }
            });
          }
        });
      }
    })

    //这里执行登录操作，以上是登录模拟
    wx.getUserInfo({
      success: res => {
        app.globalData.userInfo = res.userInfo;
      }
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log("onReady");
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
  bhClick:function(){
    wx.navigateTo({
      url: '../../copyrightbusiness/servicecontent/x?bcode=software&bview=http://fdfs.banquanjia.com.cn/group2/M01/1C/7A/CgoKC1x3ReuAA9ebAAlO90D6fE0618.png&btitle=最快速的软件著作权登记&bname=软著办理服务',
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  goHome: function () {
    wx.navigateTo({
      url: '../index/x'
    });
  },
  onShareAppMessage: function () {
    return {
      title: "[" + thePage.data.orderObj.progressStatus + "]" + thePage.data.orderObj.softFullname +"@软著办理查询"
    }
  }
});

///'../services/copyrightbusiness/servicecontent/x?bcode=' + bcode + "&bview=" + bview + "&btitle=" + title + "&bname=" + name