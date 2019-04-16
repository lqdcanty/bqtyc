// pages/work/x.js
const util = require("../../utils/util.js")
const app = getApp()
var start_clientX;
var end_clientX;
var obj = wx.getSystemInfoSync();
var workHeight = obj.windowHeight;
var workWidth = obj.windowWidth;

var thePage;
var changeTitle = false;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    actionsOpened: false,
    actionsData: null,
    actionsTitle: null,
    windowWidth: workWidth,
    windowHeight: workHeight,
    userbarZindex: 0,
    navigateZindex: 0,
    copyright_navigates: null,
    contributors_data: null,
    left_navigates: null,
    userInfo: null,
    showIcon: true,
    userDashboard: {
      character: {
        sharer: "disabled",
        editor: "disabled",
        auditor: "disabled",
      }
    },//用户登录后的用户dashboard数据
  },
  showPropertyActions: function (e) {
    let title = e.currentTarget.dataset.title;
    this.setData({
      actionsOpened: true,
      actionsData: [
        { name: "汇编权", icon: "prompt" },
        { name: "翻译权", icon: "prompt" },
        { name: "改编权", icon: "prompt" },
        { name: "摄制权", icon: "prompt" },
        { name: "信网传播权", icon: "prompt" },
        { name: "广播权", icon: "prompt" },
        { name: "放映权", icon: "prompt" },
        { name: "展览权", icon: "prompt" },
        { name: "表演权", icon: "prompt" },
        { name: "出租权", icon: "prompt" },
        { name: "发行权", icon: "prompt" },
        { name: "复制权", icon: "prompt" },
      ],
      actionsTitle: title,
    });
  },
  //显示初始著作权人
  showOrigins: function (e) {
    let data_indx = e.currentTarget.dataset.index;
    let oper_tips;
    var origin = this.data.work_origins[data_indx];
    console.log("openActions", origin);
    var originsData = [];
    for(var i = 0; i < origin.data.length; i++){
      originsData.push({
        name: origin.data[i],
        icon: 'eye',
      });
    }
    this.setData({
      actionsOpened: true,
      actionsData: originsData,
      actionsTitle: origin.title,
    });

  },
  closeActions: function(){
    this.setData({
      actionsOpened: false,
    });
  },
  handleActions: function(){
    wx.navigateTo({
      url: "../copyright/x"
    });
  },
  onShareAppMessage: function(res) {
    console.log("有一个分享请求", res);
    return {
      title: ("[" + this.data.work.copyright.type + "]"+
      this.data.work.title + "@" + this.data.work.category+ this.data.work.type),
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    thePage = this;
    wx.setNavigationBarTitle({
      title: '版权人'
    });
    this.setData({
      code: options.code,
      searchBarTop: app.globalData.statusBarHeight + app.globalData.titleBarHeight+2
    })
    this.getData()
    setTimeout(function () {
      let my_navigates = [];
      let holding_navigates = [
        {
          title: "影视",
          url: "../welcome/x?word=影视",
          amount:2,
          borderBottom: "1",
          width: "25%",
          icon: "http://fdfs.banquanjia.com.cn/group2/M01/0B/87/CgoKDFxAJCuABUF1AAAJfYWL-ec594.png",
          iconActive: "http://fdfs.banquanjia.com.cn/group2/M00/0B/84/CgoKDVxAJCyAL_o_AAAJo_aaGEA615.png",
        },
        {
          title: "文字",
          url: "../welcome/x?word=文字",
          amount: 0,
          borderBottom: "1",
          width: "25%",
          icon: "http://fdfs.banquanjia.com.cn/group2/M01/0B/84/CgoKDVxAJCyAHmuYAAADCV85vqA926.png",
          iconActive: "http://fdfs.banquanjia.com.cn/group2/M01/0B/67/CgoKDVw__qCALT8-AAADII9_zzg302.png",
        },
        {
          title: "动漫",
          url: "../welcome/x?word=动漫",
          amount: 4,
          borderBottom: "1",
          width: "25%",
          icon: "http://fdfs.banquanjia.com.cn/group2/M00/0B/87/CgoKDFxAJCuAetT1AAAL4wElgEo306.png",
          iconActive: "http://fdfs.banquanjia.com.cn/group2/M02/0B/B9/CgoKC1xAJE2Aa1zpAAAL3cPkTpk084.png",
        },
        {
          title: "艺术",
          url: "../welcome/x?word=艺术",
          amount: 3,
          borderBottom: "1",
          width: "25%",
          icon: "http://fdfs.banquanjia.com.cn/group2/M01/0B/87/CgoKDFxAJC2AA1kYAAAGEzFFpFk562.png",
          iconActive: "http://fdfs.banquanjia.com.cn/group2/M00/0B/67/CgoKDVw__qCAPPMGAAAGDuTIeoM851.png",
        },
        {
          title: "音乐",//no
          url: "../welcome/x?word=音乐",
          amount: 1,
          borderBottom: "1",
          width: "25%",
          icon: "http://fdfs.banquanjia.com.cn/group2/M00/0B/9C/CgoKDVxARRSAdkqYAAAFXz36Coc681.png",
          iconActive: "http://fdfs.banquanjia.com.cn/group2/M00/0B/A0/CgoKDFxARRSAM9iSAAAFbUL68qk469.png",
        },
        {
          title: "软件",
          url: "../welcome/x?word=软件",
          amount: 4,
          borderBottom: "1",
          width: "25%",
          icon: "http://fdfs.banquanjia.com.cn/group2/M02/0B/87/CgoKDFxAJC2AOKeMAAAD5SqdbXI821.png",
          iconActive: "http://fdfs.banquanjia.com.cn/group2/M00/0B/9C/CgoKC1w__sOAe1EYAAAD-W9KEFg447.png",
        },
      ];
      my_navigates.push({
        title: "版权人持有版权",
        rows: app.buildGridShowData(holding_navigates, 4),
      });
      let info_navigates = [
        {
          title: "官方登记",
          url: "../welcome/x?word=官方登记",
          amount: 4,
          borderBottom: "1",
          width: "25%",
          icon: "http://fdfs.banquanjia.com.cn/group2/M01/0A/42/CgoKDFw-pKeAItnlAAAR2ErgBcQ225.png",
          iconActive: "http://fdfs.banquanjia.com.cn/group2/M02/0A/42/CgoKDFw-pKiATb24AAAIwXDA1EY581.png",
        },
        {
          title: "侵权举报",
          url: "../welcome/x?word=侵权举报",

          amount: 4,
          borderBottom: "0",
          width: "25%",
          icon: "http://fdfs.banquanjia.com.cn/group2/M01/0A/73/CgoKC1w-pNOAWv6PAAAHETFsoqo411.png",
          iconActive: "http://fdfs.banquanjia.com.cn/group2/M00/0A/73/CgoKC1w-pNSANm0ZAAAHKivWh8M749.png",
        },
        {
          title: "法律诉讼",
          url: "../welcome/x?word=法律诉讼",
          amount: 0,
          borderBottom: "0",
          width: "25%",
          icon: "http://fdfs.banquanjia.com.cn/group2/M01/0A/73/CgoKC1w-pMWAPV_2AAAPqGKMJic356.png",
          iconActive: "http://fdfs.banquanjia.com.cn/group2/M02/0A/41/CgoKDFw-pKSAfFRhAAAPwexs9CY905.png",
        },
        {
          title: "版权动态",
          url: "../welcome/x?word=版权动态",
          amount: 5,
          borderBottom: "0",
          width: "25%",
          icon: "http://fdfs.banquanjia.com.cn/group2/M00/0A/73/CgoKC1w-pMGAapKJAAADx8bhzwk174.png",
          iconActive: "http://fdfs.banquanjia.com.cn/group2/M02/0A/73/CgoKC1w-pMGAbIiXAAAD0NV7EJg868.png",
        },
      ];
      my_navigates.push({
        title: "版权人资讯",
        rows: app.buildGridShowData(info_navigates, 4),
      });
      let copyrightServices = [
        {
          title: "版权登记",
          url: "/components/webview/c?url=" + encodeURIComponent("https://dci.bqj.cn/#/"),
          borderBottom: "1",
          width: "25%",
          amount: null,
          iconActive: "http://fdfs.banquanjia.com.cn/group2/M00/0A/E2/CgoKC1w_BnuAP-UbAAAKPNsU9KQ010.png",
        },
        {
          title: "软著办理",
          url: "../services/ruanzhu/x",
          borderBottom: "1",
          width: "25%",
          amount: null,
          iconActive: "http://fdfs.banquanjia.com.cn/group2/M02/0A/B1/CgoKDFw_BlqAdvL_AAAKA63GPoE713.png",
        },
        {
          title: "游戏出版",
          url: "../services/banhao/x",
          borderBottom: "1",
          width: "25%",
          amount: null,
          iconActive: "http://fdfs.banquanjia.com.cn/group2/M01/0A/AD/CgoKDVw_BliAXVkTAAAGr64Ow0A025.png",
        },
        {
          title: "代理维权",
          url: "../welcome/x?word=代理维权",
          borderBottom: "1",
          width: "25%",
          amount: null,
          iconActive: "http://fdfs.banquanjia.com.cn/group2/M00/0A/AD/CgoKDVw_BliAVGXiAAAIvRdk1Go873.png",
        },
        {
          title: "版权交易",
          //url: "../services/banquanjia/jiaoyi/x"
          url: "../welcome/x?word=版权交易",
          borderBottom: "1",
          width: "25%",
          amount: null,
          iconActive: "http://fdfs.banquanjia.com.cn/group2/M01/0A/E2/CgoKC1w_BnuAPsmiAAAMRiP1O9o299.png",
        },
        {
          title: "买稿买稿",
          //url: "http://gg.bqj.cn/#/"
          url: "../welcome/x?word=买稿买稿",
          borderBottom: "1",
          width: "25%",
          amount: null,
          iconActive: "http://fdfs.banquanjia.com.cn/group2/M01/0A/B1/CgoKDFw_BlmAevJJAAAOCI9CFUc612.png",
        },
        {
          title: "音乐ISRC申领",
          //url: "../services/huayun/isrc/x"
          url: "../welcome/x?word=音乐ISRC申领",
          borderBottom: "1",
          width: "25%",
          amount: null,
          iconActive: "http://fdfs.banquanjia.com.cn/group2/M01/0A/B1/CgoKDFw_BliALhwnAAAM0atqvLg283.png",
        },
        {
          title: "音乐版权登记",
          //url: "../services/huayun/dciyuanzhu/x"
          url: "../welcome/x?word=音乐版权登记",
          borderBottom: "1",
          width: "25%",
          amount: null,
          iconActive: "http://fdfs.banquanjia.com.cn/group2/M02/0A/AD/CgoKDVw_BluAA8pPAAAKf0OrqLc655.png",
        },
        {
          title: "音乐授权备案",
         //url: "../services/huayun/dci/x"
          url: "../welcome/x?word=音乐授权备案",
          borderBottom: "1",
          width: "25%",
          amount: null,
          iconActive: "http://fdfs.banquanjia.com.cn/group2/M01/0A/AD/CgoKDVw_BlqALEYNAAAGa6lj_5k189.png",
        },
        {
          title: "图盾",
          url: "/components/webview/c?url=" + encodeURIComponent("http://www.itudun.com/"),
          borderBottom: "1",
          width: "25%",
          amount: null,
          iconActive: "http://fdfs.banquanjia.com.cn/group2/M00/0A/B1/CgoKC1w-zciAZX3vAAAIr8BSCmE055.png",
        },
        {
          title: "版权估值",
          //url: "../services/guzhi/x",
          url: "../welcome/x?word=版权估值",
          borderBottom: "1",
          width: "25%",
          amount: null,
          iconActive: "http://fdfs.banquanjia.com.cn/group2/M01/0A/9F/CgoKDVw-5UGAeqcjAAAMDjGSR20440.png",
        },
      ]; 
      my_navigates.push({ title: "版权服务", rows: app.buildGridShowData(copyrightServices, 3), });
      var colsize, e;
      for (var i = 0; i < my_navigates.length; i++) {
        // console.log("[" + i + "]", my_navigates[i].rows);
        for (var j = 0; j < my_navigates[i].rows.length; j++) {
          // console.log("    [" + j + "]", my_navigates[i].rows[j]);
          colsize = my_navigates[i].rows[j].cols.length;
          for (var k = 0; k < colsize; k++) {
            e = my_navigates[i].rows[j].cols[k];
            e.width = "25%";
            if (my_navigates[i].title == "版权服务") {
              e.width = "33.33333%";
            }
            else{
              //e.amount = Math.floor((Math.random() * 5));
              e.yesShowNumber = true;
            }
            if( e.title == "" ){
              continue;
            }
            e.borderBottom = 1;
            if (j + 1 == my_navigates[i].rows.length) {
              e.borderBottom = 0;
            }
          }
        }
       // my_navigates[i].icon = all_icons[Math.floor((Math.random() * all_icons.length))];
      }
      console.log("构建桌面导航", my_navigates);
      thePage.setData({
        copyright_navigates: my_navigates,
      });
    }, 500);
  },

  onReady: function () {
    console.log("onReady");
  },
  getData:function(){
    let that=this;
    let _token = app.globalData.userInfo ? app.globalData.userInfo.authToken : '';
    let url = "/obligee/detail?code=" + this.data.code + '&token=' + _token;
    app.doPost(
      url, null, null, function (result) {
        let data = result.result.obligee;
        that.setData({
          // dynamics版权动态
          //officialTotal官方登记
          //legalTotal法律诉讼
          //tortTotal强权举报
          canAuth: data.canAuth,
          clickTotal:data.clickTotal,
          copyright: data.copyright,
          owner: data.obligee,
          ownerStatus: data.evaluate
        })
        console.log(result)
      }, "get", function () {
        that.setData({
          nullStatus: true
        })
      })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log('@触发下拉刷新');
    setTimeout(function () {
      console.log("@完成下拉刷新");
      wx.stopPullDownRefresh();
    }, 1000);
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
});
