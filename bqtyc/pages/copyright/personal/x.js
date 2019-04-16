// pages/copyright/related/x.js
const { $Message } = require('../../../dist/base/index');
const app = getApp()
var thePage;
var obj = wx.getSystemInfoSync();
var workHeight = obj.windowHeight;
var workWidth = obj.windowWidth;
var mine, status, operation, citiaoCode;
var user;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navTitle: "人身权",
    showIcon:true,
    fixedTop: app.globalData.statusBarHeight + app.globalData.titleBarHeight + 5,
    actionsOpened: false,
     personalObj:null,
    personalAdd:null,
    actionsAdd:[],
     datano:false,
    actionsOpenedAdd:false,
    windowWidth: workWidth,
    windowHeight: workHeight,
    workSeqNo:'',
    workObj:null,
    powerType:'',
    token:'',
    workName:'',
    scopesArr:null,
    status_info:'',
    actionsTitleAdd:'权利人列表',
    actions: [
      {
        name: '查看版权词条',
        icon: 'share',
      },
      {
        name: '编辑版权词条',
        icon: 'share',
      },
      {
        name: '新增许可链版权词条',
        icon: 'share',
      },
    ],
    scopeList1: false,
    scopeList2: false,
    scopeList3: false    
   },
  onShareAppMessage: function (res) {
    console.log("有一个分享请求", res);
    console.log(thePage.data.workObj.type, thePage.data.workObj.name, thePage.data.workObj.category, thePage.data.workObj.type)
    return {
      title: ('[人身权][' + this.data.workObj.type + ']' +
        thePage.data.workObj.name),
    }
  },
  gotoOwner:function(e){
    console.log(e,"ee");
    var originList=[];
    thePage.data.scopesArr.forEach(function(item){
      originList.push({
        name: item.aliasName ? item.aliasName: item.name,
        citiaoCode: item.copyrightCode
      })
    })
    thePage.setData({
      actionsOpenedAdd:true,
      actionsAdd:originList
    })
  },
  onCancelAdd:function(){
    thePage.setData({
      actionsOpenedAdd: false
    })
  },
  handleActionAdd:function({detail}){
    wx.redirectTo({
      url: "../blockchain/x?citiaoCode=" + thePage.data.actionsAdd[detail.index].citiaoCode + "&workSeqNo=" + thePage.data.workSeqNo +"&rightType=人身权"
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    thePage = this;
    user = app.globalData.userInfo;
    thePage.setData({
      workSeqNo: options.workSeqNo,
      token: user ? user.authToken : ''
    });
    if (!user){
      $Message({
        content: 'token获取失败，请登录！',
        type: 'warning'
      });
      setTimeout(()=>{
        return;
      },1000)
    }

    thePage.getData({workSeqNo: options.workSeqNo});

    app.doPost('/work/details', { workSeqNo: options.workSeqNo, timestamp: (new Date()).valueOf() }, null, function (data) {
      thePage.setData({
        workName: data.result.workModel.name,
        workObj: data.result.workModel,
        powerType: data.result.powerType
      });
    }, 'get');


  },
  getData:function(params){
    var param = params;
    param.timestamp = (new Date()).valueOf();
    param.token=thePage.data.token;
   // , timestamp: (new Date()).valueOf()
    app.doPost('/personal/querySignature', param, null, function (data) {
      console.log(data.result.copyrights, "copyrights")
      if (data.result.copyrights.length > 0) {
        var scopesArr = [];
        data.result.copyrights.forEach((item) => {
          item.keyValue.data.forEach((itemInner) => {
            if (itemInner.scopes.length > 0) {
              for (var i = 0; i < itemInner.scopes.length; i++) {
                if (itemInner.scopes[i] == '1' || itemInner.scopes[i] == '3' || itemInner.scopes[i] == '4') {
                  scopesArr.push(itemInner);
                  break;
                }
              }
            }
          })

        })
        console.log(scopesArr, "arrr");
        thePage.setData({
          scopesArr: scopesArr,
        });
        var scopeList = data.result.scopeList;
        scopeList.forEach((item) => {
          if (item == '发表权') {
            thePage.setData({
              scopeList1: true,
            });
          } else if (item == '修改权') {
            thePage.setData({
              scopeList2: true,
            });
          } else if (item == '保护作品完整权') {
            thePage.setData({
              scopeList3: true,
            });
          }
        })

        thePage.setData({
          personalObj: data.result.copyrights,
          personalAdd: data.result,
          datano: false
        });
      } else {
        thePage.setData({
          datano: true
        })
      }
    }, 'get');
  },
  addCopyright() {
    console.log(user,"user")
    if (!user){
      $Message({
        content: '请登录',
        type: 'warning'
      });
      return;
    }
    wx.navigateTo({
      //url: "add/x?workSeqNo=" + thePage.data.workSeqNo
      url: "addx/x?workSeqNo=" + thePage.data.workSeqNo
    });
  },
  openActions(e) {
    mine = e.currentTarget.dataset.mine; 
    status = e.currentTarget.dataset.status;
    operation = e.currentTarget.dataset.operation ? e.currentTarget.dataset.operation:'';
    citiaoCode = e.currentTarget.dataset.copyrightcode;
    console.log(citiaoCode,"citiaoCode1")
    if (mine == false && status == 'pass' ){
      thePage.setData({
        actionsOpened: true,
        status_info: '收录词条',
        oper_tips: "点击编辑可对词条内容进行修正或删除",
        actions: [
          {
            name: '查看版权词条',
            icon: 'share_fill',
          }, 
          {
            name: '编辑版权词条',
            icon: 'editor',
          },
          {
            name: '删除版权词条',
            icon: 'delete',
          },
        ],
      });  
    } else if (mine == true && status == 'pass'){
      thePage.setData({
        actionsOpened: true,
        status_info: '你的词条收录成功',
        oper_tips: "点击编辑可对词条内容进行修正或删除",
        actions: [
          {
            name: '查看版权词条',
            icon: 'share_fill',
          },
          {
            name: '编辑版权词条',
            icon: 'editor',
          },
          {
            name: '删除版权词条',
            icon: 'delete',
          },
        ],
      });  
    } else if (mine == true && status == 'wait_audit' && operation == 'add'){
      thePage.setData({
        actionsOpened: true,
        status_info: '你的词条正在审核',
        oper_tips: "点击撤销可撤销你新增词条",
        actions: [
          {
            name: '撤销新增版权词条',
            icon: 'close',
          }
        ],
      }); 
    } else if (mine == true && status == 'wait_audit' && operation == 'update'){
      thePage.setData({
        actionsOpened: true,
        status_info: '你的词条正在审核',
        oper_tips: "点击撤销可撤销你修改词条",
        actions: [
          {
            name: '撤销修改版权词条',
            icon: 'close',
          }
        ],
      }); 
    } else if (mine == true && status == 'wait_audit' && operation == 'delete'){
      thePage.setData({
        actionsOpened: true,
        status_info: '你删除的词条正在审核',
        oper_tips: "点击撤销可撤销删除版权词条",
        actions: [
          {
            name: '撤销删除版权词条 ',
            icon: 'close',
          }
        ],
      }); 
    } 
    else if (mine == true && status == 'reject' && operation == 'add') {
      thePage.setData({
        actionsOpened: true,
        status_info: '你的词条已驳回',
        oper_tips: "点击编辑可对词条内容进行修正或撤销",
        actions: [
          {
            name: '编辑版权词条',
            icon: 'editor',
          },
          {
            name: '撤销新增版权词条',
            icon: 'close',
          }
        ],
      });
    } else if (mine == true && status == 'reject' && operation == 'update') {
      thePage.setData({
        actionsOpened: true,
        status_info: '你的词条已驳回',
        oper_tips: "点击编辑可对词条内容进行修正或撤销",
        actions: [
          {
            name: '编辑版权词条',
            icon: 'editor',
          },
          {
            name: '撤销修改版权词条',
            icon: 'close',
          }
        ],
      });
    } else if (mine == true && status == 'reject' && operation == 'delete') {
      thePage.setData({
        actionsOpened: true,
        status_info: '你的词条已驳回',
        oper_tips: "点击编辑可对词条内容进行修正或撤销",
        actions: [
          {
            name: '编辑版权词条',
            icon: 'editor',
          },
          {
            name: '撤销版权词条',
            icon: 'close',
          }
        ],
      });
    } 
  },
  onCancel() {
    thePage.setData({
      actionsOpened: false
    });
  },

  handleAction({ detail }) {
    console.log(citiaoCode,"citiaoCode")
    if (!user) {
      $Message({
        content: '请登录',
        type: 'warning'
      });
      return;
    }
    if (status == 'pass') {
      if (detail.index == 0) {
        wx.navigateTo({
          url: "../blockchain/x?workSeqNo=" + thePage.data.workSeqNo + "&citiaoCode=" + citiaoCode + "&rightType=人身权"
        });
      } else if (detail.index == 1) {
        wx.navigateTo({
          url: "edit/x?citiaoCode=" + citiaoCode + "&isMine=" + mine + "&status=" + status + "&workSeqNo=" + thePage.data.workObj.workSeqNo
        });
      }else{
        wx.navigateTo({
          url: "delete/x?citiaoCode=" + citiaoCode + "&isMine=" + mine + "&status=" + status + "&workSeqNo=" + thePage.data.workObj.workSeqNo+"&delete=1"
        });
      }
      thePage.setData({
        actionsOpened: false
      });
    }
    else if ((operation == "add" || operation == "update") && status == 'wait_audit') {
      if (detail.index == 0) {
        wx.navigateTo({
          url: "edit/x?citiaoCode=" + citiaoCode + "&isMine=" + mine + "&status=" + status + "&workSeqNo=" + thePage.data.workObj.workSeqNo
        });
      }
      thePage.setData({
        actionsOpened: false
      });
    }
    else if ((operation == "add" || operation == "update") && status == 'reject') {
      if (detail.index == 0) {
        wx.navigateTo({
          url: "edit/x?citiaoCode=" + citiaoCode + "&isMine=" + mine + "&status=" + status + "&workSeqNo=" + thePage.data.workObj.workSeqNo
        });
      } else if (detail.index == 1){
        wx.navigateTo({
          url: "edit/x?citiaoCode=" + citiaoCode + "&isMine=" + mine + "&status=" + status + "&workSeqNo=" + thePage.data.workObj.workSeqNo+"&cancel=1"
        });
      }
      thePage.setData({
        actionsOpened: false
      });
    }
    else if (operation == "delete" && status == 'wait_audit') {
      if (detail.index == 0){
        wx.navigateTo({
          url: "delete/x?citiaoCode=" + citiaoCode + "&isMine=" + mine + "&status=" + status + "&workSeqNo=" + thePage.data.workObj.workSeqNo + "&cancel=1"
        });
      }
      thePage.setData({
        actionsOpened: false
      });
    } else if (operation == "delete" && status == 'reject') {
      if (detail.index == 0) {
        wx.navigateTo({
          url: "delete/x?citiaoCode=" + citiaoCode + "&isMine=" + mine + "&status=" + status + "&workSeqNo=" + thePage.data.workObj.workSeqNo+'&reject=1'
        });
      }else{
        wx.navigateTo({
          url: "delete/x?citiaoCode=" + citiaoCode + "&isMine=" + mine + "&status=" + status + "&workSeqNo=" + thePage.data.workObj.workSeqNo + '&cancel=1'
        });
      }
      thePage.setData({
        actionsOpened: false
      });
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  }
})