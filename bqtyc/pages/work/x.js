const { $Message } = require('../../dist/base/index');
const util = require("../../utils/util.js");
const app = getApp()
var start_clientX;
var end_clientX;
var obj = wx.getSystemInfoSync();
var workHeight = obj.windowHeight;
var workWidth = obj.windowWidth;
var workSeqNo = workSeqNo;
var authIsShow = true;
var thePage;
var changeTitle = false;
var optionsObj;
var user;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    ec: {
      onInit: initChart
    },
    showIcon: true,
    versionString: app.globalData.versionString,
    fangtao: false, //头部延迟显示开关
    content_height: 0,
    authIsShow:true,
    actionsOpened: false,
    actionsData: null,
    actionsTitle: null,
    windowWidth: workWidth,
    windowHeight: workHeight,
    userbarZindex: 0,
    navigateZindex: 0,
    contributors_data: [],
    left_navigates: null,
    userInfo: null,
    workSeqNo:'',
    workObj: null,//获取的作品类型及基本情况
    workDetailObj:null,//获取图片详情
    workName:'',
    _canvas_delay:false,
    navigates:null,
    monitor:[],
    the_copyriht_power:null,
    userDashboard: {
      character: {
        sharer: "disabled",
        editor: "disabled",
        auditor: "disabled",
      }
    },//用户登录后的用户dashboard数据
    rankNumber: 0,
    bqDataWork:null,
    workNlist:null,
  },
  onShareAppMessage: function(res) {
    app.doPost("/work/share/" + thePage.data.workSeqNo, { token: user.authToken ? user.authToken : ''}, null, function (data) {
    }, "get");
    app.pageShareLog('wrok', 'wrok', 'wrok', 'wrok', this.url)
    return {
      title: "[" + this.data.workDetailObj.type + "]"+
        thePage.data.workDetailObj.name + "@" + thePage.data.workDetailObj.category,
    }
  },
  //显示初始著作权人
  showOrigins: function (e) {
    let data_indx = e.currentTarget.dataset.index;
    let oper_tips;
    var origin = this.data.workObj.copyright[data_indx];
    
    var originsData = [];
    for (var i = 0; i < origin.keyValue.value.length; i++) {
      originsData.push({
        name: origin.keyValue.value[i].keyWord.name,
        keyValue: origin.keyValue.value[i].keyValue.citiaoCode,
        icon: 'eye',
      });
    }
    this.setData({
      actionsOpened: true,
      actionsData: originsData,
      actionsTitle: origin.keyWord.key,
    });

  },
  closeActions: function () {
    this.setData({
      actionsOpened: false,
    });
  },
  
  handleActions: function ({detail}) {
    wx.navigateTo({
      url: "../copyright/blockchain/x?citiaoCode=" + thePage.data.actionsData[detail.index].keyValue + "&workSeqNo=" + thePage.data.workSeqNo + "&timestamp=" + (new Date()).valueOf()
    });
  },
  queryAuditor: function () {  //审核中申请查询
    var token = app.globalData.userInfo.authToken;
    let h = app.globalData.statusBarHeight + app.globalData.titleBarHeight
    thePage.setData({
      messageHeight: h
    })
    app.doPost(
      '/apply/queryAuditor?token=' + token, null, null, function (data) {
        if (data.resultCode == '200') {
          if (data.result.status == 3) {  //没有申请
            wx.navigateTo({
              url: '../imauditor/x'
            });
          } else if (data.result.status == 0) {  //申请待审核
            wx.navigateTo({
              url: '../copyright/complete/x?word=版权编辑人申请成功&index=0'
            });
          } else if (data.result.status == 1) {  //申请通过
            $Message({
              content: '恭喜你，你已经是编辑者，无需再申请！',
              type: 'success'
            });
          } else if (data.result.status == 2) { //申请失败
            wx.navigateTo({
              url: '../imauditor/x?status=' + data.result.status + '&id=' + data.result.datas.id
            });
          }
        }
      }, 'get');
  },
  queryAuditor: function () {  //审核中申请查询
    var token = app.globalData.userInfo.authToken;
    let h = app.globalData.statusBarHeight + app.globalData.titleBarHeight
    thePage.setData({
      messageHeight: h
    })
    app.doPost(
      '/apply/queryAuditor?token=' + token, null, null, function (data) {
        if (data.resultCode == '200') {
          if (data.result.status == 3) {  //没有申请
            wx.navigateTo({
              url: '../imauditor/x'
            });
          } else if (data.result.status == 0) {  //申请待审核
            wx.navigateTo({
              url: '../copyright/complete/x?word=版权审核者申请成功&index=0'
            });
          } else if (data.result.status == 1) {  //申请通过
            $Message({
              content: '恭喜你，你已经是审核者，无需再申请！',
              type: 'success'
            });
          } else if (data.result.status == 2) { //申请失败
            wx.navigateTo({
              url: '../imauditor/false/x'
            });
          }
        }
      }, 'get');
  },
  queryEditor: function () {  //编辑者申请
    var token = app.globalData.userInfo.authToken;
    let h = app.globalData.statusBarHeight + app.globalData.titleBarHeight
    thePage.setData({
      messageHeight: h
    })
    app.doPost(
      '/apply/queryEditor?token=' + token, null, null, function (data) {
        if (data.resultCode == '200') {
          if (data.result.status == 0) {  //没有申请
            wx.navigateTo({
              url: '../redactor/x'
            });
          } else if (data.result.status == 1) {  //申请通过
            $Message({
              content: '恭喜你，你已经是编辑者，无需再申请！',
              type: 'success'
            });
          }
        }
      }, 'get');
  },
  queryRegister: function () {
    let token = app.globalData.userInfo.authToken;
    app.doPost(
      '/register/realNameStatus?token=' + token, null, null, function (data) {
        if (data.resultCode == '200') {
          if (data.result.status == 3) {  //没有申请
            wx.navigateTo({
              url: '../certificate/x'
            });
          } else if (data.result.status == 0) {  //申请待审核
            wx.navigateTo({
              url: '../copyright/complete/x?word=实名认证申请成功&index=0'
            });
          } else if (data.result.status == 1) {  //申请通过
            $Message({
              content: '恭喜你，你已经是实名认证通过！',
              type: 'success'
            });
          } else if (data.result.status == 2) { //申请失败
            wx.navigateTo({
              url: '../certificate/x?status=' + data.result.status + '&code=' + data.result.datas.realCode
            });
          }
        }
      }, 'get');
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    thePage = this;
    var the_copyriht_power = app.globalData.the_copyriht_power;
    console.log(workHeight - app.globalData.statusBarHeight - app.globalData.titleBarHeight)
    user = app.globalData.userInfo;
    thePage.setData({
      version: app.version,
      windowHeight: workHeight - app.globalData.statusBarHeight - app.globalData.titleBarHeight,
      the_copyriht_power: the_copyriht_power,
      bqDataWork: app.globalData.bqData,
      workSeqNo: options.workSeqNo,
      sysTitle: app.globalData.sysTitle,
      sysLogo: app.globalData.sysLogo,
      _canvas_delay: true,
      navTitle:"版权作品",
      fixedTop: app.globalData.statusBarHeight + app.globalData.titleBarHeight
    })
    if (the_copyriht_power.length <= 0) {
      app.doPost("/bql/api/count", { token: user.authToken ? user.authToken : ''}, null, thePage.copyrihtPowerCallback, "get");
    }
    app.pageRouteLog("work", "work", 'work', 'work', this.url)
    wx.getSetting({
      success: setRes => {
        var t = setRes.authSetting['scope.userInfo'];
        if (t == 'undefined ' || t == null) {
          thePage.setData({
             authIsShow:false
          });
        }
      }
    });
    optionsObj = options;
    thePage.dataLoad(options);

    if (app.globalData.userInfo) {
      thePage.setData({
        userInfo: app.globalData.userInfo,
      })
    }else{
      thePage.onauthorizeEvent()
    }
    if (app.globalData.userDashboard){
      thePage.setData({
        userDashboard: app.globalData.userDashboard,
      })
    } else if (!app.globalData.userDashboard && app.globalData.userInfo){
      thePage.getCount()
    }
  },
  dataLoad: function (options){
    app.doPost('/work/details', { workSeqNo: options.workSeqNo, token: user.authToken ? user.authToken : '',
     timestamp: (new Date()).valueOf() }, null, function (data) {

      thePage.setData({
        workDetailObj: data.result.workModel,
        workName: data.result.workModel.name
      });
      thePage.detailsFun(options);
      thePage.bqjt();
      thePage.bjfw();
    }, 'get');
    
     //版权服务类型
      
    //提示用户信息
    var use = app.globalData.userInfo;

    app.doPost('/work/read/msg', { workSeqNo: options.workSeqNo, token: user ? use.authToken:'',timestamp: (new Date()).valueOf() }, null, function (data) {
      if (data.result.isAlert) {
        let h = app.globalData.statusBarHeight + app.globalData.titleBarHeight
        thePage.setData({
          fixedTop: h
        })
        $Message({
          content: data.result.userHint,
          type: 'success',
          duration: 3
        });
      }
    }, 'get');
    // 基本类型
  },
  bqjt: function () {///bqctmk/module /bqctmk/owner
    app.doCssPost("work", 'bqctmk', "monitor", {}, function (status, res) {
      console.log(status, res, "hahha")
      if (status) {
        if (res.data.errcode == 0) {
          var allArr = res.data.result;
          var showArr=[];
          allArr.forEach((item)=>{
            if (item.ranges.length>0){
              item.ranges.forEach((string)=>{
                if (string === (thePage.data.workDetailObj.category + thePage.data.workDetailObj.type)){
                  showArr.push(item);
                }
              })
              //showArr.push(item)
            }
          })
          thePage.setData({
            bqjtObj: lineBlock(showArr.sort(sortNumber),4)
          })
        }
      }
    });
  },
  bjfw:function(){
    var copyrightServices = [];
    if (app.globalData.bqservices) {
      app.globalData.bqservices.forEach(function(item,p2){
        if (item.ranges.length > 0) {
          item.ranges.forEach((string) => {
            if (string === (thePage.data.workDetailObj.category + thePage.data.workDetailObj.type)) {
              copyrightServices.push(item);
            }
          })
        }
        if (item.ranges===""){
          copyrightServices.push(item);
        }
      })
      thePage.setData({ copyrightServices: lineBlock(copyrightServices, 3) });// sort
    } else {
      app.doCssPost("index", "index", "servicesload", new Object(), function (status, res) {
        res.data.result.forEach((item) => {
          if (item.ranges.length > 1) {
            item.ranges.forEach((string) => {
              if (string === (thePage.data.workDetailObj.category + thePage.data.workDetailObj.type)) {
                copyrightServices.push(item);
              }
            })
            //showArr.push(item)
          }
        })
        function sortNumber(a, b) {
          return a.sort - b.sort
        }
        app.globalData.bqservices = res.data.result.sort(sortNumber);
        thePage.setData({ copyrightServices: lineBlock(copyrightServices.sort(sortNumber), 3) });// sort
      });
    }
  },
  echartClick(e){
     var echart = e.currentTarget.dataset.list;
    let bcode = echart.code;
    let bview = echart.bimg;
    let title = echart.title;
    let name = echart.name;
    let durl = echart.defualtUrl;
    let introduce = echart.introduce;
      if (durl && durl != "") {
        wx.navigateTo({
          url: durl,
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        })

      } else {
        wx.navigateTo({
          url: '../services/copyrightbusiness/servicecontent/x?bcode=' + bcode + "&bview=" + bview + "&btitle=" + title + "&bname=" + name + "&introduce=" + introduce,
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        })
      }


  },
  imageClick: function (e) {
    var list = e.currentTarget.dataset.list;
    console.log(list,"list")
    if (thePage.data.versionString == 'develop' || thePage.data.versionString == 'trial' || thePage.data.versionString == 'undefined'){
      if (list.exper == 'false'){
        wx.navigateTo({
          url: '../welcome/x?word=' + list.name,
        })
      } else if (list.exper == 'true'){
        floorFun();
      }
    } else if (thePage.data.versionString == 'release'){
      if (list.visable == 'false') {
        wx.navigateTo({
          url: '../welcome/x?word=' + list.name,
        })
      } else if (list.visable == 'true'){
        floorFun();
      }
    }

    function floorFun(){
      switch (list.floor) {
        case 0:
          if (list.name == "许可使用") {
            wx.navigateTo({
              url: '../copyright/property/common/show/x?workSeqNo=' + thePage.data.workDetailObj.workSeqNo + '&citiaoClass=2'
            })
          } else if (list.name == "权利转让") {
            wx.navigateTo({
              url: '../copyright/property/common/show/x?workSeqNo=' + thePage.data.workDetailObj.workSeqNo + '&citiaoClass=3'
            })
          } else if (list.name == "权利质押") {
            wx.navigateTo({
              url: '../copyright/property/common/show/x?workSeqNo=' + thePage.data.workDetailObj.workSeqNo + '&citiaoClass=4'
            })
          } else {
            wx.navigateTo({
              url: '../copyright/' + list.code + '/x?workSeqNo=' + thePage.data.workDetailObj.workSeqNo + '&name=' + thePage.data.workDetailObj.name
            })
          }
          break;
        case 1:
          wx.navigateTo({
            url: '../copyright/' + list.code + '/x?workSeqNo=' + thePage.data.workDetailObj.workSeqNo + '&name=' + thePage.data.workDetailObj.name
          })
          break;
        case 2:
          wx.navigateTo({
            url: '../../packageEchart/pages/echart/x?code=' + list.code.substring(6) + '&workSeqNo=' + thePage.data.workDetailObj.workSeqNo + '&name=' + list.name
          })
          break;
        // case 3:
        //   wx.navigateTo({
        //     url: '../../packageEchat/pages/monitor/' + list.code + '/x?workSeqNo=' + thePage.data.workDetailObj.workSeqNo + '&name=' + thePage.data.workDetailObj.name
        //   })
        //   break;
        default:
          wx.navigateTo({
            url: '../../packageEchart/pages/monitor/' + list.code + '/x?workSeqNo=' + thePage.data.workDetailObj.workSeqNo + '&name=' + thePage.data.workDetailObj.name
          })
      }
    }
  },
  detailsFun(options){
    app.doPost('/work/basic', { workSeqNo: options.workSeqNo, token: user.authToken ? user.authToken:'', timestamp: (new Date()).valueOf() }, null, function (data) {
      var powerTypeString = data.result.baseInfo.powerType;
      data.result.baseInfo.copyrightTags.forEach((item)=>{
        if (item.choose==true){
          if (item.typeDesc == '有侵权' || item.typeDesc == '有诉讼' || item.typeDesc == '有争议') item.color = 'red'; else item.color = 'green';
        }else{
          item.color = 'disabled';
        }
      })
      var demo_navigates = [
        {
          title: "基本情况",
          navigates:
            [{
              title: "人身权",
              amount: !data.result.baseInfo.counPerson ? 0 : data.result.baseInfo.counPerson
            },
            {
                title: "邻接权",
                //amount: data.result.baseInfo.counPerson,
                amount: 0
              },
            {
              title: "财产权",
              amount: !data.result.baseInfo.counFinacial? 0:data.result.baseInfo.counFinacial
            },
            {
              title: "使用版权",
              amount: !data.result.baseInfo.countUse ? 0 : data.result.baseInfo.countUse
            },
            {
              title: "衍生版权",
              amount: !data.result.baseInfo.countDrived ? 0 : data.result.baseInfo.countDrived
            },
            {
              title: "许可使用",
              amount: !data.result.baseInfo.countPermit ? 0 : data.result.baseInfo.countPermit,
            },
            {
              title: "权利转让",
              amount: !data.result.baseInfo.countTransferPermit ? 0 : data.result.baseInfo.countTransferPermit
            },
            {
              title: "权利质押",
              amount: !data.result.baseInfo.countPledgePermit ? 0 : data.result.baseInfo.countPledgePermit
            },
            {
              title: "全版权",
              amount: !data.result.baseInfo.allCount ? 0 : data.result.baseInfo.allCount
            }
            ],
        },
        {
          title: "相关资讯",
          navigates: [
            {
              title: "官方登记",
              amount:null
              //amount: data.result.baseInfo.countRegisterOffice,
            },
            {
              title: "侵权举报",
              amount: null
             // amount: data.result.baseInfo.countReport
            },
            {
              title: "法律诉讼",
              amount: null,
            },
            {
              title: "版权动态",
              amount: null,
            },
            {
              title: "获奖情况",
              amount: null,
            },
            {
              title: "版权故事",
              amount: null,
            },
          ],
        },
        {
          title: "版权图谱",
          icon: "",
          navigates: [
            {
              title: "全版权",  amount: null
            },
            {
              title: "人身权",amount: null,
            },
            {
              title: "使用版权",  amount: null
            },
            {
              title: "衍生版权", amount: null,
            },
            {
              title: "复制权", amount: null,
            },
            {
              title: "发行权", amount: null,
            },
            {
              title: "出租权", amount: null,
            },
            {
              title: "展览权",  amount: null,
            },
            {
              title: "表演权",  amount: null,
            },
            {
              title: "放映权",  amount: null,
            },
            {
              title: "广播权",  amount: null,
            },
            {
              title: "信网传播权",amount: null,
            },
            {
              title: "摄制权",  amount: null,
            },
            {
              title: "改编权",amount: null,
            },
            {
              title: "翻译权", amount: null,
            },
            {
              title: "汇编权",  amount: null,
            }
          ],
        },
      ];
      app.doCssPost("work", 'bqctmk', "module", {}, function (status, res) {
          console.log(status, res, "hahha")
          if (status) {
            if (res.data.errcode == 0) {
              var bqallArr = res.data.result;
              var navigates0 = {}, navigates1 = {}, navigates2 = {}, navigates3 = {};
              navigates0.navigates = [];
              navigates1.navigates = [];
              navigates2.navigates = [];
              navigates3.navigates = [];
              if (powerTypeString =='邻接权') {
                bqallArr.forEach((item,index)=>{
                  if (item.name=='人身权'){
                    bqallArr.splice(index,1)
                  } else if (item.name == '使用版权'){
                    bqallArr.splice(index, 1)
                  }
                })
              }else{
                bqallArr.forEach((item, index) => {
                  if (item.name == '邻接权'){
                    bqallArr.splice(index, 1)
                  }
                })
              }
              bqallArr.forEach((item) => {
                switch (item.floor) {
                  case 0:
                    navigates0.title = '基本情况';
                    navigates0.navigates.push(item);
                    break;
                  case 1:
                    navigates0.title = '相关资讯';
                    navigates1.navigates.push(item); break;
                  case 2:
                    navigates0.title = '版权图谱';
                    navigates2.navigates.push(item); break;
                }
              })
              navigates0.navigates.forEach((item) => {
                  demo_navigates[0].navigates.forEach((inner) => {
                    if(item.name == inner.title){
                    item.amount = inner.amount;
                  }
                })
              })
              navigates1.navigates.forEach((item) => {
                demo_navigates[1].navigates.forEach((inner) => {
                  if (item.name == inner.title) {
                    item.amount = inner.amount;
                  }
                })
              })
              navigates2.navigates.forEach((item) => {
                demo_navigates[2].navigates.forEach((inner) => {
                  if (item.name == inner.title) {
                    item.amount = inner.amount;
                  }
                })
              })
            var allObjArr = lineBlock(navigates0.navigates.sort(sortNumber), 4).concat(lineBlock(navigates1.navigates.sort(sortNumber), 4)).concat(lineBlock(navigates2.navigates.sort(sortNumber), 4))
            allObjArr[0].title = '基本情况';
            allObjArr[1].title = '相关资讯';
            allObjArr[2].title = '版权图谱';
              console.log(allObjArr,"navigatesnavigatesnavigates")
            thePage.setData({
              navigates: allObjArr
            })
          }
        }
      });
      
      thePage.setData({
        workObj: data.result.baseInfo ? data.result.baseInfo : {},
      });
      wx.stopPullDownRefresh();
    }, 'get');
  },
  //向下滚动
  onReachBottom: function () {
    var number = thePage.data.rankNumber + 1;
    var params = { "pageNumber": number, "pageSize": 10, token: user.authToken ? user.authToken : '' };
    app.doPost("/bql/api/count", params, null, function (rs) {
      var powers = rs.result.contributionRanks;
      if (powers != null && powers.length > 0) {
        thePage.data.rankNumber = number;
        var copyrihtPowers = app.globalData.the_copyriht_power;
        for (var i = 0; i < powers.length; i++) {
          copyrihtPowers.push(powers[i]);
        }
        app.globalData.the_copyriht_power = copyrihtPowers;
        thePage.setData({
          the_copyriht_power: copyrihtPowers,
        });
      }
      wx.hideLoading();
    }, "get");
  },
  handleClick: function () {
    wx.navigateTo({
      url: '../user/x'
    });
  },
  linkClick: function (res) {
    var url = app.base64encode(app.utf16to8(res.currentTarget.dataset.url))
    wx.navigateTo({
      url: "../../components/webview/c?url=" + app.urlDecode(res.currentTarget.dataset.url) + '&title=' + '[' + this.data.workDetailObj.type + ']' + this.data.workDetailObj.name + '@' + this.data.workDetailObj.category + '&type=[版权词条参考资料]'
    })
  },
  /**
   * 用户点击登录，初始化用户数据
   */
  onauthorizeEvent: function (e) {
    let canIUse = wx.canIUse('button.open-type.getUserInfo');
    this.setData({
      authIsShow: true
    });
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
            wx.getUserInfo({
              success: userRes => {
                // 可以将 res 发送给后台解码出 unionId
                // app.globalData.userInfo = userRes.userInfo
                app.doPost(
                '/auth/xcx/new', {
                  code: res.code,
                  encryptedData: userRes.encryptedData,
                  iv: userRes.iv
                }, '用户登录', function (result) {

                  var data = result;
                  if (data.resultCode == '200') {
                    wx.setStorageSync("userInfo", data.result.userInfo);
                    thePage.setData({
                      authIsShow: true
                    })
                    var userInfo = data.result.userInfo;
                    app.globalData.userInfo = userInfo;
                      thePage.setData({
                        userInfo: userInfo
                      });
                    thePage.getCount()
                  }
              }, 'post')
              }
            });
      }
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
  onPageScroll: function (event) {
    var thePage=this;
    if (!changeTitle && event.scrollTop > 32) {
      changeTitle = true;
      thePage.setData({
        navTitle: this.data.workDetailObj.name
      });
    }
    else if (changeTitle && event.scrollTop == 0) {
      changeTitle = false;
      thePage.setData({
        navTitle: '版权作品'
      });
    }
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
    thePage.dataLoad(optionsObj);
  },

  getCount:function(){
    if (app.globalData.userInfo) {
      var token = app.globalData.userInfo.authToken;
      app.doPost(
        '/auth/count?token=' + token, null, null, function (result) {
          var data = result;
          if (data.resultCode == '200') {
            var userInfo = data.result.userInfo;
            thePage.setData({
              userDashboard: {
                bql_size: userInfo.coyrightPower,
                count_edit: userInfo.editCountStr,
                count_audit: userInfo.auditCountStr,
                count_share: userInfo.shareCountStr,
                userDashboard: {
                  character: {
                    sharer: userInfo.share ? "blue" : "disabled",
                    editor: userInfo.editor ? "blue" : "disabled",
                    auditor: userInfo.audit ? "blue" : "disabled",
                  },
                }
              }
            });
            app.globalData.userDashboard = thePage.data.userDashboard;
          }
        }, 'get');
    }
  },

  // 显示用户导航
  showUserbar: function (offsetX) {
    if (this.data.navigateZindex == 0) {
      this.setData({
        navigateZindex: 0,
        userbarZindex: 1,
        mask_display_userbar: "mask_display_userbar",
        mask_display_navigate: "",
        display_userbar_tag: "none",
        display_navigate_tag: "none",
        translateX: 'transform: translateX(' + -(this.data.windowWidth * 0.7) + 'px);'
      });
    

    }
    else {
      thePage.hideNavigate(offsetX);
    }
  },
  // 显示功能导航
  showNavigate: function (offsetX) {
    if (this.data.userbarZindex == 0) {
      this.setData({
        userbarZindex: 0,
        navigateZindex: 1,
        mask_display_userbar: "",
        mask_display_navigate: "mask_display_navigate",
        display_userbar_tag: "none",
        display_navigate_tag: "none",
        translateX: 'transform: translateX(' + this.data.windowWidth * 0.7 + 'px);'
      });
      this.geWorkBql();
    }
    else {
      thePage.hideNavigate(offsetX);
    }
  },
  // 遮拦
  hideNavigate: function (offsetX) {
    if (this.data.navigateZindex != 0 ||
      this.data.userbarZindex != 0) {
      if (offsetX) {
        
      }
      this.setData({
        navigateZindex: 0,
        userbarZindex: 0,
        mask_display_userbar: "",
        mask_display_navigate: "",
        display_userbar_tag: "block",
        display_navigate_tag: "block",
        translateX: '',
      });
    }
  },
  geWorkBql:function(){
    var thePage=this;
    app.doPost(
      '/work/workEditSummary', {
        workSeqNo: thePage.data.workSeqNo,
        token: user.authToken ? user.authToken : ''
      },null, function (result) {
        var data = result;
        if (data.resultCode == '200') {
          thePage.setData({
            workeditCount: data.result.vo.editCount,
            workpeopleCount: data.result.vo.peopleCount,
            workshareCount: data.result.vo.shareCount,
            worktotoalScore: data.result.vo.totoalScore,
            worklinks: data.result.vo.links,
            workNlist: data.result.vo.list,
          })
        }
      }, 'get')
  },
  goHome: function () {
    wx.navigateTo({
      url: '../index/x'
    });
  },
  handleAction: function (rs) {
    var workSeqNo = rs.currentTarget.dataset.workseqno;
    var globalData = app.globalData.userInfo;
    let that=this;
    if (globalData == null){
      that.setData({
        authIsShow:false
      }) 
    } else {
        wx.navigateTo({
          url: "../work/edit/x?workSeqNo=" + workSeqNo
        })
    }
    },  
});


var demo_contributors_data = [
  {
    avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/ls9fnfHwd8fSHXVPI4yghiaOibiaUd94kfAvmVqysVpt0Fo29xzI5biaIvEVrkOd90pib1bot4icKgc1NmaQws85a2yg/132",
    degree: "1.3万",
    nickName: "静谧也哉",
  },
];
function initChart(canvas, width, height) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);
  var option = {

  }
  chart.setOption(option);
  return chart;
}
// function createServices(category,type,id){
//   let services=[
//     {
//       title: "版权登记",
//       icon: 'http://fdfs.banquanjia.com.cn/group2/M00/0A/E2/CgoKC1w_BnuAP-UbAAAKPNsU9KQ010.png',
//       icon_color: "#e0e0e0",    
//       url: "/components/webview/c?url=" + app.urlDecode("https://dci.bqj.cn/#/"),
//       borderBottom: "1"
//     }
//   ];
//   if (category=="软件"){
//     services.push({
//       title: "软著办理",
//       icon: 'http://fdfs.banquanjia.com.cn/group2/M02/0A/B1/CgoKDFw_BlqAdvL_AAAKA63GPoE713.png',
//       icon_color: "#e0e0e0",
//       url: "../services/ruanzhu/x",
//       borderBottom: "1"
//     })
//   };
//   if (type=="游戏"){
//     services.push({
//       title: "游戏版号办理", icon: 'http://fdfs.banquanjia.com.cn/group2/M01/0A/AD/CgoKDVw_BliAXVkTAAAGr64Ow0A025.png', icon_color: "#e0e0e0", url: "../services/banhao/x",borderBottom: "1"
//     })
//   };
//   services.push(
//     { title: "代理维权", icon: 'http://fdfs.banquanjia.com.cn/group2/M00/0A/AD/CgoKDVw_BliAVGXiAAAIvRdk1Go873.png', icon_color: "#e0e0e0", url: "../services/banquanjia/weiquan/x", borderBottom: "1" },
//     { title: "版权交易", icon: 'http://fdfs.banquanjia.com.cn/group2/M01/0A/E2/CgoKC1w_BnuAPsmiAAAMRiP1O9o299.png', icon_color: "#e0e0e0", url: "../welcome/x?word=版权交易", borderBottom: "1"}
//   );
//   if (category=="文字"){
//     services.push({
//       title: "买稿买稿", icon: 'http://fdfs.banquanjia.com.cn/group2/M01/0A/B1/CgoKDFw_BlmAevJJAAAOCI9CFUc612.png', icon_color: "#e0e0e0", url: "../welcome/x?word=买稿买稿", borderBottom: "1"
//     })
//   }
//   if (category=="音乐"){
//     services.push(
//       { title: "音乐ISRC申领", icon: 'http://fdfs.banquanjia.com.cn/group2/M01/0A/B1/CgoKDFw_BliALhwnAAAM0atqvLg283.png', icon_color: "#e0e0e0", url: "../welcome/x?word=音乐ISRC申领", borderBottom: "1" },//url: "../services/huayun/isrc/x"
//       { title: "音乐版权登记", icon: 'http://fdfs.banquanjia.com.cn/group2/M02/0A/AD/CgoKDVw_BluAA8pPAAAKf0OrqLc655.png', icon_color: "#e0e0e0", url: "../welcome/x?word=音乐版权登记", borderBottom: "1" },// url: "../services/huayun/dciyuanzhu/x"
//       { title: "音乐授权备案", icon: 'http://fdfs.banquanjia.com.cn/group2/M01/0A/AD/CgoKDVw_BlqALEYNAAAGa6lj_5k189.png', icon_color: "#e0e0e0", url: "../welcome/x?word=音乐授权备案", borderBottom: "1" }//url: "../services/huayun/dci/x"
//     );
//   }
//   if (category == "艺术") {
//     services.push({
//       title: "图盾", icon: 'http://fdfs.banquanjia.com.cn/group2/M00/0A/B1/CgoKC1w-zciAZX3vAAAIr8BSCmE055.png', icon_color: "#e0e0e0", url: "/components/webview/c?url=" + encodeURIComponent("http://www.itudun.com/"), borderBottom: "1"
//     })
//   }
//   services.push({
//     title: "版权估值", icon: 'http://fdfs.banquanjia.com.cn/group2/M01/0A/9F/CgoKDVw-5UGAeqcjAAAMDjGSR20440.png', icon_color: "#e0e0e0", url:"../welcome/x?word=版权估值", borderBottom: "1"
//   })
//   return services;
// }
function lineBlock(my_navigates,num){
  var colsize, e,newB=[];
  newB.push({
    rows: app.buildGridShowData(my_navigates, num),
  });
  var length1 = newB.length;
  for (var i = 0; i < length1; i++) {
    var length2 = newB[i].rows.length;
    for (var j = 0; j < length2; j++) {
      colsize = newB[i].rows[j].cols.length;
      for (var k = 0; k < colsize; k++) {
        e = newB[i].rows[j].cols[k];
        switch (num) {//colsize
          case 2:
            e.width = "50%";
            break;
          case 3:
            e.width = "33.333%";
            break;
          case 4:
          case 5:
            e.width = "25%";
            break;
        }
        e.borderBottom = 1;
        if (j + 1 == newB[i].rows.length) {
          e.borderBottom = 0;
        }
      }
    }
  }
  return newB;
};
function sortNumber(a, b) {
  return a.sort - b.sort
}