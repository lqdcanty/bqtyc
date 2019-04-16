// pages/copyright/related/x.js
const app = getApp()
var thePage;
var work_data;
var oper_data;//当前操作的版权词条
var mine, status, operation, citiaoCode;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    actionsOpened: false,
    workSeqNo:'',
    showIcon: true,
    actions: [
      {
        name: '查看版权区块存证',
        icon: 'share',
      },
      {
        name: '编辑版权词条',
        icon: 'editor',
      },
    ],
    status_info: "",
    copyright_pirate:null,
    oper_tips: "",
    work:null,
    powerType:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    thePage = this;


    app.doPost('/accusation/view', { workSeqNo: options.workSeqNo, timestamp: (new Date()).valueOf() }, null, function (data) {
      
        thePage.setData({
          copyright_pirate: data.result.copyrights,
          workSeqNo: options.workSeqNo,
          copyright_registerNo:false
        });
      
    }, 'get');

    app.doPost('/work/details', { workSeqNo: options.workSeqNo, timestamp: (new Date()).valueOf() }, null, function (data) {
      thePage.setData({
        work: data.result.workModel,
        powerType: data.result.powerType,
        workName: data.result.workModel.name
      });
      // wx.setNavigationBarTitle({
      //   title: "侵权举报@" + data.result.workModel.name
      // });
    }, 'get');
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
    citiaoCode = e.currentTarget.dataset.citiaocode;
    console.log("citiaoCo", mine, status, operation, citiaoCode)
    if (mine == false && status == 'pass') {
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
        ],
      });
    } else if (mine == true && status == 'pass') {
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
        ],
      });
    } else if (mine == true && status == 'wait_audit' && operation == 'add') {
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
    } else if (mine == true && status == 'wait_audit' && operation == 'update') {
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
    } else if (mine == true && status == 'wait_audit' && operation == 'delete') {
      thePage.setData({
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
    }
  },
  onCancel() {
    this.setData({
      actionsOpened: false
    });
  },
  handleAction({ detail }) {
    console.log(citiaoCode, "citiaoCode")
    if (mine == false && status == 'pass') {
      if (detail.index == 0) {
        wx.navigateTo({
          url: "../blockchain/x?citiaoCode=" + citiaoCode + "&workSeqNo=" + thePage.data.workSeqNo
        });
      } else {
        wx.navigateTo({
          url: "edit/x"
        });
      }
      thePage.setData({
        actionsOpened: false
      });
    }
    else if (mine == true && status == 'wait_audit' && operation == "add" || mine == true && status == 'wait_audit'&&operation == "update") {
      if (detail.index == 0) {
        wx.navigateTo({
          url: "edit/x"
        });
      }
      thePage.setData({
        actionsOpened: false
      });
    }
    else if (mine == true && status == 'wait_audit'&&operation == 'delete') {
      if (detail.index == 0) {
        wx.navigateTo({
          url: "../blockchain/x?citiaoCode=" + citiaoCode + "&workSeqNo=" + thePage.data.workSeqNo
        });
      }
      else {
        wx.navigateTo({
          url: "edit/x"
        });
      }
      thePage.setData({
        actionsOpened: false
      });
    }
  },
  onShareAppMessage: function (res) {
    console.log("有一个分享请求", res);
    console.log(this.data.work.type, this.data.work.name, this.data.work.category, this.data.work.type)
    return {
      title: ("[" + this.data.work.type + "]" +
        this.data.work.name + "@" + this.data.work.category)
    }
  }
})