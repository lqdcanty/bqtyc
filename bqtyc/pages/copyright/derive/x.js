// pages/copyright/related/x.js
const app = getApp()
var thePage;
var copyright_data;
var work_data;
var oper_data;//当前操作的版权词条
var copyright_deleting;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    actionsOpened: false,
    work:null,
    powerType:'',
    workSeqNo:'',
    showIcon: true,
    copyright_derive:null,
    actions: [
      {
        name: '编辑版权词条',
        icon: 'share',
      },
      {
        name: '新增许可链版权词条',
        icon: 'share',
      },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    thePage = this;
    app.doPost('/work/details', { workSeqNo: options.workSeqNo, timestamp: (new Date()).valueOf() }, null, function (data) {
      thePage.setData({
        work: data.result.workModel,
        powerType: data.result.powerType,
        workSeqNo: options.workSeqNo
      });
    })
    app.doPost('/dericework/queryDericeWork', { workSeqNo: options.workSeqNo, timestamp: (new Date()).valueOf() }, null, function (data) {
      thePage.setData({
        copyright_derive: data.result.list,
      });
    })
  },
  addCopyright() {
    wx.navigateTo({
      url: "add/x"
    });
  },
  openActions(e) {
    console.log("openActions", e);
    let status_info = e.currentTarget.dataset.status_info;
    let data_indx = e.currentTarget.dataset.index;
    let oper_tips;
    oper_data = work_data.copyright_data.derive[data_indx];
    console.log("oper_data", oper_data);
    let actions = [
      {
        name: '申请撤销词条收录',
        icon: 'close',
      },
    ];
    copyright_deleting = false;
    oper_tips = "点击下面按钮取消作品的衍生版权关系";
    if (status_info.indexOf("删除词条") != -1) {
      oper_tips = "您可以撤销对该词条的删除操作";
      copyright_deleting = true;
      actions = [
        {
          name: '取消撤销词条收录',
          icon: 'return',
        },
      ];
    }
    this.setData({
      actionsOpened: true,
      status_info: status_info,
      oper_tips: oper_tips,
      actions: actions,
    });
  },
  onCancel() {
    this.setData({
      actionsOpened: false
    });
  },

  handleAction({ detail }) {
    const index = detail.index + 1;
    $Message({
      content: '点击了选项' + index
    });
  }
})