// pages/copyright/property/x.js
const app = getApp()
var thePage;
var copyright_data;
var mine, status, operation, editEnable;
var oper_data;//当前操作的版权词条
var theChains = [];
const right_categories = [
  { title: "许可使用" },
  { title: "权利转让" },
  { title: "权利质押" },
];
const right_types = [
  { title: "复制权" },
  { title: "发行权" },
  { title: "出租权" },
  { title: "展览权" },
  { title: "表演权" },
  { title: "放映权" },
  { title: "广播权" },
  { title: "信息网络传播权" },
  { title: "摄制权" },
  { title: "改编权" },
  { title: "翻译权" },
  { title: "汇编权" },
];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    workSeqNo:'',
    citiaoCode:'',
    chainsNo:false,
    powerType:'',
    scope:'',
    ctClass:'',
    showIcon: true,
    chains:null
  },
  //递归加载数据
  loadDataItems: function (depth, children, chains) {
    if (children) {
      for (var i = 0; i < children.length; i++) {
        var e = children[i];
        e.indx = chains.length;
        e.padding = depth * 7;
        e.display = true;
        if (e.propertyViewVo.mine && e.propertyViewVo.operation=='pass'){
          e.status_color = "#4db798"
        } else if (e.propertyViewVo.mine && e.propertyViewVo.operation == 'pass') {
          e.status_color = "#5cadff"
        } else if (e.citiao.auditStatus == 'wait_audit' && e.propertyViewVo.operation == 'success' &&  e.propertyViewVo.operation == 'delete') {
          e.status_color = "#4db798"
        } else if (e.citiao.auditStatus == 'reject') {
          e.status_color = "#ed3f14"
        }
        chains.push(e);
        if (thePage.loadDataItems(depth + 1, e.children, chains)) {
        }
        e.icon = "unfold";
      }
      return true;
    }
    return false;
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    thePage = this;
    thePage.setData({
      navHeight: app.globalData.statusBarHeight + app.globalData.titleBarHeight,
      authToken: app.globalData.userInfo.authToken,
      workSeqNo: options.workSeqNo,
      scope: options.scope,
      citiaoClass: options.citiaoClass
    });
    thePage.getData()
    app.doPost('/work/details', { workSeqNo: options.workSeqNo, timestamp: (new Date()).valueOf() }, null, function (data) {
      thePage.setData({
        powerType: data.result.powerType,
        work: data.result.workModel
      });
    })
  },
  pledge_p(res) {
    console.log(thePage.data.titleStr)
    if (thePage.data.citiaoClass == 4) {
      wx.navigateTo({
        url: '../../../pledge/add/x?workSeqNo=' + thePage.data.workSeqNo + '&citiaoClass=' + thePage.data.citiaoClass
      });
    } else if (thePage.data.citiaoClass == 3) {
      wx.navigateTo({
        url: '../../../transfer/edit/x?workSeqNo=' + thePage.data.workSeqNo + '&title=权利转让' + '&citiaoClass=' + thePage.data.citiaoClass
      });
    } else {
      wx.navigateTo({
        url: '../../../license/add/x?workSeqNo=' + thePage.data.workSeqNo + '&citiaoClass=' + thePage.data.citiaoClass
      });
    }
  },
  getData (){
    app.doPost('/citiao/queryAuthRelationByClassAndScope', { token: this.data.authToken, workSeqNo: this.data.workSeqNo, scope: this.data.scope, citiaoClass: this.data.citiaoClass, timestamp: (new Date()).valueOf() }, null, function (data) {
      theChains = [];
      thePage.loadDataItems(0, data.result.list, theChains);
      wx.stopPullDownRefresh();
      thePage.setData({
        chains: theChains,
        scopeWord: data.result.scope,
        right_category: data.result.title,
        scope_desciption: data.result.scopeDescription
      });
    })
  },
  //以下是几个操作
  collapse: function (e) {
    let data_indx = e.currentTarget.dataset.index;
    var o = this.data.chains[data_indx];
    o.icon = o.icon == "unfold" ? "enter" : "unfold";
    var display = o.icon == "unfold";
    var o1, o2;
    for (var i = data_indx + 1; i < theChains.length; i++) {
      o1 = theChains[i];
      if (o1.padding <= o.padding) {
        break;
      }
      if (o2) {
        o1.display = false;
        if (o2.padding <= o1.padding) {
          o2 = null;
        }
      }
      if (o2 == null) {
        o1.display = display;
      }
      if (display && o1.icon == "enter") {
        o2 = o1;
      }
    }
    thePage.setData({
      chains: theChains,
    });
  },
  addCopyright() {
    wx.navigateTo({
      url: "../edit/x"
    });
  },
  openActions(e) {
    mine = e.currentTarget.dataset.mine;
    status = e.currentTarget.dataset.status;
    operation = e.currentTarget.dataset.operation;
    editEnable = e.currentTarget.dataset.editenable;
    thePage.setData({
      citiaoCode: e.currentTarget.dataset.citiaocode
    })
       if (mine == false && status == 'pass' ){
      thePage.setData({
        actionsOpened: true,
        status_info: '收录词条',
        oper_tips: "点击编辑可对词条内容进行修正或删除",
        actions: [
          {
            name: '查看区块链存证',
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
            name: '查看区块链存证',
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
            name: '查看区块链存证 ',
            icon: 'share_fill',
          }, {
            name: '撤销删除版权词条',
            icon: 'close',
          }
        ],
      }); 
   }else if (mine == true && status == 'reject') {
      this.setData({
        actionsOpened: true,
        status_info: '你的词条已被驳回',
        oper_tips: "点击编辑了对词条进行编辑或撤消",
        actions: [
          {
            name: '编辑版权词条',
            icon: 'share_fill',
          }, {
            name: '撤销版权词条',
            icon: 'close',
          }
        ],
      });
    }else if (mine == true && status == 'reject') {
      this.setData({
        actionsOpened: true,
        status_info: '你的词条已被驳回',
        oper_tips: "点击编辑了对词条进行编辑或撤消",
        actions: [
          {
            name: '编辑版权词条',
            icon: 'share_fill',
          }, {
            name: '撤销版权词条',
            icon: 'close',
          }
        ],
      });
    } else if (mine == true && status == 'reject') {
         this.setData({
           actionsOpened: true,
           status_info: '你的词条已被驳回',
           oper_tips: "点击编辑了对词条进行编辑或撤消",
           actions: [
             {
               name: '编辑版权词条',
               icon: 'share_fill',
             }, {
               name: '撤销版权词条',
               icon: 'close',
             }
           ],
         });
       }
  },
  onCancel() {
    this.setData({
      actionsOpened: false
    });
  },
  handleAction({ detail }) {
    const index = detail.index;
    let _citiaoClass = this.data.citiaoClass
    console.log()
    console.log(status)
    if (!editEnable){
      if (0 == index) {
        wx.navigateTo({
          url: "../../../../blockchain/x?workSeqNo=" + thePage.data.workSeqNo + "&citiaoCode=" + thePage.data.citiaoCode +"&rightType=财产权"
        });
        thePage.setData({
          actionsOpened: false
        });
      }
    }else{
      if (status == "pass"){
        thePage.setData({
          actionsOpened: false
        });
        if (0 == index) {
          wx.navigateTo({
            url: "../../../../blockchain/x?workSeqNo=" + thePage.data.workSeqNo + "&citiaoCode=" + thePage.data.citiaoCode + "&rightType=财产权"
          });
        } else if (1 == index){
          console.log(_citiaoClass == 2)
          if (_citiaoClass==2){
            wx.navigateTo({
              url: '../../../license/add/x?workSeqNo=' + thePage.data.workSeqNo + '&citiaoCode=' + thePage.data.citiaoCode + '&status=' + status
            });
          } else if (_citiaoClass==3){
            wx.navigateTo({
              url: '../../../transfer/edit/x?workSeqNo=' + thePage.data.workSeqNo + '&title=权利转让' + '&citiaoClass=' + _citiaoClass + '&status=' + status + '&citiaoCode=' + thePage.data.citiaoCode 
            });
          } else if (_citiaoClass==4){
            wx.navigateTo({
              url: '../../../pledge/add/x?workSeqNo=' + thePage.data.workSeqNo  + '&citiaoClass=' + _citiaoClass + '&status=' + status + '&citiaoCode=' + thePage.data.citiaoCode 
            });
          }

        }else if (index == 2){
          wx.navigateTo({
            url: '../../delete/x?workSeqNo=' + thePage.data.workSeqNo + '&citiaoClass=' + _citiaoClass + '&citiaoCode=' + thePage.data.citiaoCode + '&status=' + status
          });
        }
      } else if ((mine && status == "wait_audit" && operation == 'add') || (mine && status == "wait_audit" && operation == 'update')){
        thePage.setData({
          actionsOpened: false
        });
        if (_citiaoClass == 2) {
          wx.navigateTo({
            url: '../../../license/add/x?workSeqNo=' + thePage.data.workSeqNo + '&citiaoCode=' + thePage.data.citiaoCode + '&status=' + status + '&operation=' + operation +'&tableType=2'
          });
        } else if (_citiaoClass == 3) {
          wx.navigateTo({
            url: '../../../transfer/edit/x?workSeqNo=' + thePage.data.workSeqNo + '&title=权利转让' + '&citiaoClass=' + _citiaoClass + '&status=' + status + '&citiaoCode=' + thePage.data.citiaoCode + '&operation=' + operation + '&tableType=2'
          });
        } else if (_citiaoClass == 4) {
          wx.navigateTo({
            url: '../../../pledge/add/x?workSeqNo=' + thePage.data.workSeqNo + '&title=权利转让' + '&citiaoClass=' + _citiaoClass + '&status=' + status + '&citiaoCode=' + thePage.data.citiaoCode + '&operation=' + operation + '&tableType=2'
          });
        }
      } else if (mine && status == "wait_audit" && operation == 'delete'){
        if (detail.index == 0) {
          wx.navigateTo({
            url: "../x"
          });
        }
        else {
          wx.navigateTo({
            url: '../../delete/x?workSeqNo=' + thePage.data.workSeqNo + '&citiaoClass=' + _citiaoClass + '&citiaoCode=' + thePage.data.citiaoCode + '&status=' + status + '&operation=' + 'delete' + '&tableType=2'
          });
        }
        thePage.setData({
          actionsOpened: false
        });
      } else if ((mine && status == "reject" && operation == 'add') || (mine && status == "reject" && operation == 'update')) {
        thePage.setData({
          actionsOpened: false
        });
        if (_citiaoClass == 2) {
          wx.navigateTo({
            url: '../../../license/add/x?workSeqNo=' + thePage.data.workSeqNo + '&citiaoCode=' + thePage.data.citiaoCode + '&status=' + status + '&operation=' + operation + '&tableType=2' + '&rejectStatus=' + detail.index
          });
        } else if (_citiaoClass == 3) {
          wx.navigateTo({
            url: '../../../transfer/edit/x?workSeqNo=' + thePage.data.workSeqNo + '&title=权利转让' + '&citiaoClass=' + _citiaoClass + '&status=' + status + '&citiaoCode=' + thePage.data.citiaoCode + '&operation=' + operation + '&tableType=2' + '&rejectStatus=' + detail.index
          });
        } else if (_citiaoClass == 4) {
          wx.navigateTo({
            url: '../../../pledge/add/x?workSeqNo=' + thePage.data.workSeqNo + '&title=权利转让' + '&citiaoClass=' + _citiaoClass + '&status=' + status + '&citiaoCode=' + thePage.data.citiaoCode + '&operation=' + operation + '&tableType=2' + '&rejectStatus=' + detail.index
          });
        }
      } else if (mine && status == "reject" && operation == 'delete') {
        if (detail.index == 0) {
          wx.navigateTo({
            url: '../../delete/x?workSeqNo=' + thePage.data.workSeqNo + '&citiaoClass=' + _citiaoClass + '&citiaoCode=' + thePage.data.citiaoCode + '&status=' + status + '&operation=' + 'delete' + '&tableType=2'
          });
        }
        else {
          wx.navigateTo({
            url: '../../delete/x?workSeqNo=' + thePage.data.workSeqNo + '&citiaoClass=' + _citiaoClass + '&citiaoCode=' + thePage.data.citiaoCode + '&status=' + status + '&operation=' + 'delete' + '&rejectStatus=' + true + '&tableType=2'
          });
        }
        thePage.setData({
          actionsOpened: false
        });
      }
    }
  },
  onPullDownRefresh: function () {
    this.getData();
  },
  onShareAppMessage: function (res) {
    return {
      title: (this.data.work.category + this.data.work.type +
        "_" + this.data.work.name + "&版权链 " + this.data.right_type + this.data.right_category),
    }
  }
})