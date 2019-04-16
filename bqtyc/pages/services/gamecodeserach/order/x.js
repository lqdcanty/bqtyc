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
    typeList: ['材料审查', '市局审核', '总局审核', '游戏版号颁发'],
    progress1: '市局审核',
    progress2:'总局审核',
    photoUrl:'',
    showIcon: true,
    abc:false,
    progressStatus:"游戏版号颁发"
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    thePage = this;
    console.log(options,"options")
    app.doPost('https://www.ry365.com.cn/gamecode/plist', { keyword: options.isbnNo }, null, function (data) {
      //thePage.data.typeList.forEach(function(item,index){
      
      var lengthArr = thePage.data.typeList;
      for (var i = 0; i < lengthArr.length ;i++){
        if (thePage.data.progressStatus == '材料审查'){
          thePage.setData({
            text0 : '进行',
            verticalCurrent: 0,
             text1:'进行'
          })
        } else if (thePage.data.progressStatus == '市局审核'){
          thePage.setData({
            text0: '已通过',
            text1: '进行',
            verticalCurrent: 1
          })
        } else if (thePage.data.progressStatus == '市局驳回') {
          thePage.setData({
            text0: '已通过',
            text1: '未通过',
            verticalCurrent: 1,
            progress1: '市局驳回'
          })
        }else if (thePage.data.progressStatus == '总局审核'){
          thePage.setData({
            text0: '已通过',
            text1: '已通过',
            text2: '进行',
            verticalCurrent: 2,
          })
        } else if (thePage.data.progressStatus == '总局驳回') {
          thePage.setData({
            text0: '已通过',
            text1: '已通过',
            verticalCurrent: 2,
            text2: '未通过',
            progress1: '总局驳回'
          })
        } else if (thePage.data.progressStatus == '游戏版号颁发'){
          thePage.setData({
            text0: '已通过',
            text1: '已通过',
            text2: '已通过',
            verticalCurrent: 5
          })
        }
      }
      thePage.setData({
        orderObj: data.result.list.list[0],
      });
    }, 'get');
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
      });
    }
  },
  bhClick:function(){
    wx.navigateTo({
      url: '../../copyrightbusiness/servicecontent/x?bcode=gamecoderegister&bview=http://fdfs.banquanjia.com.cn/group2/M00/1C/49/CgoKDFx3Q4OAdgQ0AAnWoLOx37s193.png&btitle=游戏出版【版号】办理&bname=游戏出版服务',
    })
  },
  handleClick:function(){
    wx.navigateTo({
      url: "../../../welcome/x?word=版权词条",
    })
  },
  // showPhoto(){
  //   wx.previewImage({
  //     current: thePage.data.photoUrl, // 当前显示图片的http链接
  //     urls: [thePage.data.photoUrl]
  //   })
  // },
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
      title: "[" + thePage.data.progressStatus + "]" + thePage.data.orderObj.gameName +"@游戏版号办理查询"
    }
  }
});

