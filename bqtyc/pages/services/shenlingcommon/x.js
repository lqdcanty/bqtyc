var thePage;
const { $Message } = require('../../../dist/base/index');
const app = getApp();
var bname, btitle, introduce, bqs, orderCode;
Page({
  data: {
    navTitle: "",
    showIcon: true,
    fixedTop: app.globalData.statusBarHeight + app.globalData.titleBarHeight + 5,
    result: null,
    opendStatus: false,
    worksList: null,
    flage: false,
    typeWxchart:true,//wxchart
    bname:"",
    btitle:"",
    bcode:"",
    backUrl:'',
    sysLogo: app.globalData.sysLogo,
    authIsShow:true,
    param:{
      copyrightType:'',
      applyContent:'',
      contactName:'',
      contactMobile:null,
      formId:''
    },
  },
  onauthorizeEvent: function (e) {
    this.setData({
      authIsShow: e.detail == 1 ? true : false
    });
    //app.globalData.authIsShow = true;
    app.login(function(res){
      thePage.initData(); 
    },function(res){

    });
    //app.globalData.authIsShow = e.detail == 1 ? true : false;
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    thePage = this;
    console.log(options,"options")
    var pages=getCurrentPages();
    thePage.setData({
      bcode: options.bcode
    })
    if (pages.length == 1) {
      thePage.setData({ backUrl: '/pages/index/x' })
    }
    var user = app.globalData.userInfo;
    if (!user){
      console.log("有use")
      thePage.getScopeUserInfo(options);
    }else{
      thePage.initData(options);
    }
    orderCode=options.oid;
    bqs = app.globalData.bqservices;
    
    console.log(user, "user",app.globalData.authIsShow)
   
  },
  getScopeUserInfo: function (options) {//授权判断
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
          app.login(function(res){
            thePage.initData(options);
          })
        }
      }
    })
  },
  initData(options){
    if (bqs) {
      for (var i = 0; i < bqs.length; i++) {
        if (thePage.data.bcode == bqs[i].code) {
          thePage.initLoad(bqs[i].name, bqs[i].title, bqs[i].code, bqs[i].introduce, orderCode);
          break;
        }
      }
    } else if (!bqs) {
      app.doCssPost("shenglingcommon", "index", "servicesload", new Object(), function (status, res) {
        function sortNumber(a, b) {
          return a.sort - b.sort
        }
        app.globalData.bqservices = res.data.result.sort(sortNumber);
        bqs = app.globalData.bqservices;
        for (var i = 0; i < bqs.length; i++) {
          if (thePage.data.bcode == bqs[i].code) {
            thePage.initLoad(bqs[i].name, bqs[i].title, bqs[i].code, bqs[i].introduce, orderCode);
            break;
          }
        }
      });
    }
  },
  initLoad(bname, btitle, bcode, introduce, orderCode){
    thePage.setData({ bname: bname, btitle: btitle, bcode: bcode, "param.copyrightType": bcode, introduce: introduce });
    if (orderCode){
      thePage.setData({ typeWxchart: false });
      app.doCssPost("shenlingcommon" + "_" + thePage.data.bcode, "yydengji", "queryorder", { orderCode:orderCode}, function (status, res)      {
          //console.log(res);
        var param = thePage.data.param;
          param.applyContent = res.data.result.applyContent;
          param.contactName = res.data.result.contactName;
          param.contactMobile = res.data.result.contactMobile;
          thePage.setData({
            param: param
          })
      });
    }else{
      app.doCssPost("shenlingcommon" + "_" + thePage.data.bcode, "yydengji", "searchwechatuser", {}, function (status, res) {
        console.log(status, res, "hahha")
        if (status) {
          res.errcode
          if (res.data.errcode == 0) {
            var param = thePage.data.param;
            param.contactName = res.data.result.contactName,
              param.contactMobile = res.data.result.contactMobile
            thePage.setData({
              param: param
            })
          } else {
            $Message({
              content: '联系人信息获取失败',
              type: 'success',
              duration: 2
            });
          }
        }
      });
    }
    
  },
  gamecoderegisterClick: function () {
    wx.redirectTo({
      url: '../gamecodeserach/serach/x',
    })
  },
  softwareClick:function(){
    wx.redirectTo({
      url: '../ruanzhuserach/serach/x',
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  doOnload: function () {
    this.setData({
      nullStatus: false
    });
    this.getData();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  homeClick:function(e){
    var param = thePage.data.param;
    param.formId = e.detail.formId;
    console.log(e)
    thePage.setData({
      param:param
    })
    if (!thePage.data.param.applyContent){
      $Message({
        content: '业务内容不能为空',
        type: 'error',
        duration: 4
      });
      return false;
    }
    if (!thePage.data.param.contactName) {
      $Message({
        content: '联系人不能为空',
        type: 'error',
        duration: 4
      });
      return false;
    }
    if (!thePage.data.param.contactMobile) {
      $Message({
        content: '手机号码不能为空',
        type: 'error',
        duration: 4
      });
      return false;
    }else{
      if (thePage.data.param.contactMobile) {
        var isPhone = /(^1[3|4|5|7|8|9]\d{9}$)|(^09\d{8}$)/;;// 手机
        if (isPhone.test(thePage.data.param.contactMobile)) {

        } else {
          $Message({
            content: '请输入正确的手机号码',
            type: 'error'
          });
          return false;
        }
      }
    }
    
    app.doCssPost("shenlingcommon" + "_" + thePage.data.bcode, "yydengji", "save", thePage.data.param, function (status, res) {
      console.log(status, res,"hahha")
      if (status){
        console.log(status,"status")
        if (res.data.errcode==0){
          $Message({
            content: '您需要办理的业务已预约成功',
            type: 'success',
            duration: 2
          });
          setTimeout(()=>{
            wx.navigateTo({
              url: '../../copyright/complete/x?word=' + thePage.data.bname+'&bqservice=1'
            })
            thePage.setData({
              param: {
                copyrightType: '',
                applyContent: '',
                contactName: '',
                contactMobile: null,
                formId: ''
              },
            })

          },2000)
        }
      }
    });
  },

  applyContentInput:function(e){
    var param = thePage.data.param;
    param.applyContent = e.detail.value;
    thePage.setData({
      param: param
    })
  },
  contactNameInput: function (e) {
    var param = thePage.data.param;
    param.contactName = e.detail.detail.value;
    thePage.setData({
      param: param
    })
  },
  contactMobileInput: function (e) {
    var param = thePage.data.param;
    param.contactMobile = e.detail.detail.value;
    thePage.setData({
      param: param
    })
  },
  opendIt: function () {
    this.selectComponent('#id-card').onshow()
  },
  closeIt: function () {
    this.selectComponent('#id-card').onshow()
  },
  inputBind: function (e) {
    thePage.setData({
      searchValue: e.detail.value,
    });
  },

  query: function () {
    if (thePage.data.searchValue != '') {
      thePage.setData({
        keyword: thePage.data.searchValue,
      });
      wx.navigateTo({
        //url: '../result/x?keyword=' + thePage.data.keyword
        url: '../../copyright/complete/x?keyword='+ thePage.data.keyword
      })
    }
  },
  // addWork: function () {
  //   wx.navigateTo({
  //     url: '../work/add/x'
  //   })
  // },
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
    wx.stopPullDownRefresh();
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: "[" + bname + "]" + btitle + "@" + bname+"申请"
    }
  }
})