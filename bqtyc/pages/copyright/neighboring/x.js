// pages/copyright/related/x.js
var oper_data;
var work_data;
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
    actionsOpened: false,
    actionsOpenedAdd: false,
    actions: null,
    neighboring_detail: "authorship",
    powerType:null,
    showIcon: true,
    personalAdd:null
  },

  handleChange({ detail }) {
    console.log(detail);
    thePage.setData({
      neighboring_detail: detail.key,
    });
  },
  gotoOwner: function (e) {
    console.log(e, "ee");
    var originList = [];
    thePage.data.personalData.forEach(function (item) {
      originList.push({
        name: item.roleVal
      })
    })
    thePage.setData({
      actionsOpenedAdd: true,
      actionsAdd: originList
    })
  },
  onCancelAdd: function () {
    thePage.setData({
      actionsOpenedAdd: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: "邻接权",
    });
    thePage = this;
    thePage.setData({
      workSeqNo: options.workSeqNo,
      authToken: app.globalData.userInfo ? app.globalData.userInfo.authToken:""
    });
   
    thePage.getData();
    app.doPost('/work/details', { workSeqNo: options.workSeqNo }, null, function (data) {
      thePage.setData({
        workName: data.result.workModel.name,
        workObj: data.result.workModel,
        powerType: data.result.powerType
      });
    }, 'get');
  },
  getData:function(){
    app.doPost('/citiao/queryShowCitiao', { workSeqNo: thePage.data.workSeqNo, token: thePage.data.authToken, citiaoType: 4, citiaoClass: 10, timestamp: (new Date()).valueOf() }, null, function (data) {
      if (data.result.items.length > 0) {
        thePage.setPersonal(data.result.items)
        thePage.setData({
          personalObj: data.result.items,
          datano: false
        });
      } else {
        thePage.setData({
          datano: true
        })
      }
      thePage.setData({
        loading: true
      })
    }, 'get');
  },
  setPersonal(data){
    let personalData=[];
    let nameArry=[];
    let dataArry=[]
    data.forEach((p1,p2)=>{
      if (p1.citiao.abutRight.origin==0){
        personalData.push(p1.citiao.abutRight)
      }
      if(nameArry.indexOf(p1.citiao.abutRight.roleName)==-1){
        dataArry.push({
          name: p1.citiao.abutRight.roleName,
          list:[p1]
        })
        nameArry.push(p1.citiao.abutRight.roleName);
      }else{
        dataArry[nameArry.indexOf(p1.citiao.abutRight.roleName)].list.push(p1)
      }
    })
    this.setData({
      personalData: personalData,
      listData: dataArry
    })
    console.log(dataArry)
  },
  addCopyright() {
    wx.navigateTo({
      url: "add/x"
    });
  },
  openActions(e) {
    mine = e.currentTarget.dataset.mine;
    status = e.currentTarget.dataset.status;
    operation = e.currentTarget.dataset.operation ? e.currentTarget.dataset.operation : '';
    citiaoCode = e.currentTarget.dataset.copyrightcode;
    console.log(citiaoCode, "citiaoCode1")
    if (mine == false && status == 'pass') {
      this.setData({
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
          }
        ],
      });
    } else if (mine == true && status == 'pass') {
      this.setData({
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
          }
        ],
      });
    } else if (mine == true && status == 'wait_audit' && operation == 'add') {
      this.setData({
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
    } else if (mine == true && status == 'wait_audit' && operation == 'update') {
      this.setData({
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
    } else if (mine == true && status == 'wait_audit' && operation == 'delete') {
      this.setData({
        actionsOpened: true,
        status_info: '你删除的词条正在审核',
        oper_tips: "点击撤销可撤销删除版权词条",
        actions: [
          {
            name: '查看区块链存证 ',
            icon: 'share_fill',
          }, {
            name: '撤销删除版权词条 ',
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
    console.log(citiaoCode, "citiaoCode")
    if (status == 'pass') {
      if (detail.index == 0) {
        wx.navigateTo({
          url: "../blockchain/x?workSeqNo=" + this.data.workSeqNo + "&citiaoCode=" + citiaoCode
        });
      } else if (detail.index == 1) {
        wx.navigateTo({
          url: 'edit/x?workSeqNo=' + thePage.data.workSeqNo + '&citiaoCode=' + citiaoCode + '&status=' + status + '&operation=' + operation + '&tableType=2'
        });
      }else if (detail.index == 2) {
        wx.navigateTo({
          url: 'delete/x?workSeqNo=' + thePage.data.workSeqNo  + '&citiaoCode=' + citiaoCode + '&status=' + status
        });
      }
      thePage.setData({
        actionsOpened: false
      });
    } else if (status == 'wait_audit'&& (operation == "add" || operation == "update") ) {
      if (detail.index == 0) {
        wx.navigateTo({
          url: 'edit/x?workSeqNo=' + thePage.data.workSeqNo + '&citiaoCode=' + citiaoCode + '&status=' + status + '&operation=' + operation +'&tableType=2'
        });
      }
      thePage.setData({
        actionsOpened: false
      });
    } else if (status == 'wait_audit' && operation == 'delete') {
      if (detail.index == 0) {
        wx.navigateTo({
          url: "../blockchain/x?workSeqNo=" + this.data.workSeqNo + "&citiaoCode=" + citiaoCode
        });
      }
      else {
        wx.navigateTo({
          url: 'delete/x?workSeqNo=' + thePage.data.workSeqNo + '&citiaoCode=' + citiaoCode + '&status=' + status + '&operation=' + 'delete' + '&tableType=2' 
        });
      }
      thePage.setData({
        actionsOpened: false
      });
    } else if (status == 'reject' && (operation == "add" || operation == "update")) {
      if (detail.index == 0) {
        wx.navigateTo({
          url: 'edit/x?workSeqNo=' + thePage.data.workSeqNo + '&citiaoCode=' + citiaoCode + '&status=' + status + '&operation=' + operation + '&tableType=2' 
        });
      }else {
        wx.navigateTo({
          url: 'edit/x?workSeqNo=' + thePage.data.workSeqNo + '&citiaoCode=' + citiaoCode + '&status=' + status + '&operation=' + operation + '&tableType=2' + '&rejectStatus=' + true
        });
      }
      thePage.setData({
        actionsOpened: false
      });
    } else if (status == 'reject' && (operation == "delete")) {
      if (detail.index == 0) {
        wx.navigateTo({
          url: 'delete/x?workSeqNo=' + thePage.data.workSeqNo + '&citiaoCode=' + citiaoCode + '&status=' + status + '&operation=' + 'delete' + '&tableType=2' 
        });
      } else {
        wx.navigateTo({
          url: 'delete/x?workSeqNo=' + thePage.data.workSeqNo + '&citiaoCode=' + citiaoCode + '&status=' + status + '&operation=' + 'delete' + '&rejectStatus=' + true + '&tableType=2' 
        });
      }
      thePage.setData({
        actionsOpened: false
      });
    }
  }
})