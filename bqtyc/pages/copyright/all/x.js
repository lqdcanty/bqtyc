// pages/copyright/related/x.js
const app = getApp()
var thePage;
var oper_data;
var work_data;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    actionsOpened: false,
    actions: null,
    work: null,
    powerType:'',
    currenIndex:3,
    showIcon: true,
    otherAllShow:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    thePage = this;
    app.doPost('/work/details', { workSeqNo: options.workSeqNo }, null, function (data) {
      thePage.setData({
        work: data.result.workModel,
        powerType: data.result.powerType
      });
    }, 'get');
    app.doPost('/copyrightallview/query', { workSeqNo: options.workSeqNo }, null, function (data) {
      thePage.setData({
        queryAll: data.result.vo
      });
    }, 'get');
  },
  addReferer:function(res){
    console.log(res,"hhhh")
    wx.navigateTo({
      url: "../personal/x?workSeqNo=" + res.currentTarget.dataset.workseqno
    })
  },
  addReferer2: function (res) {
    console.log(res, "hhhh")
    wx.navigateTo({
      url: "../property/x?workSeqNo=" + res.currentTarget.dataset.workseqno
    })
  },
  addReferer3:function(){
    thePage.setData({
      otherAllShow:false,
      currenIndex: thePage.data.queryAll.otherAll
    })
  },
  openActions(e) {
    console.log("openActions", e);
    let data_indx = e.currentTarget.dataset.index;
    oper_data = work_data.copyright_data.authorship[data_indx];
    let status_info = oper_data.status_info;
    let status = oper_data.status_icon;
    if (status == "add") {
      this.setData({
        actionsOpened: true,
        status_info: status_info,
        oper_tips: "点击编辑可对词条内容进行修正或删除",
        actions: [
          {
            name: '编辑版权词条',
            icon: 'editor',
          },
          {
            name: '撤销新增版权词条',
            icon: 'delete',
          },
        ],
      });
    }
    else if (status == "success") {
      this.setData({
        actionsOpened: true,
        status_info: status_info,
        oper_tips: "点击编辑可对词条内容进行修正或删除",
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
      });
    }
    else if (status == "delete") {
      this.setData({
        actionsOpened: true,
        status_info: status_info,
        oper_tips: "您可以撤销对该词条的删除操作",
        actions: [
          {
            name: '查看版权区块存证',
            icon: 'share',
          },
          {
            name: '撤销删除版权词条',
            icon: 'delete',
          },
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
    const index = detail.index + 1;
    console.log("handleAction", index);
    let status = oper_data.status_icon;
    if (status == "add") {
      if (1 == index) {
        wx.navigateTo({
          url: "edit/x"
        });
        thePage.setData({
          actionsOpened: false
        });
      }
      else {
        oper_data.status_info = "你的词条操作已成功撤销";
        oper_data.status_icon = "success";
        oper_data.status_color = "#4db798";
        thePage.setData({
          copyright_authorship: thePage.buidCopyrightAuthorshipData(work_data.copyright_data.authorship),
          actionsOpened: false
        });
      }
    }
    else if (status == "success") {
      thePage.setData({
        actionsOpened: false
      });
      if (2 == index) {
        wx.navigateTo({
          url: "../x"
        });
      }
      else {
        wx.navigateTo({
          url: "edit/x"
        });
      }
    }
    else if (status == "delete") {
      thePage.setData({
        actionsOpened: false
      });
      if (1 == index) {
        wx.navigateTo({
          url: "../x"
        });
      }
      else {
        oper_data.status_info = "你的词条操作已成功撤销";
        oper_data.status_icon = "success";
        oper_data.status_color = "#4db798";
        thePage.setData({
          copyright_authorship: thePage.buidCopyrightAuthorshipData(work_data.copyright_data.authorship),
          actionsOpened: false
        });
      }
    }
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

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  onShareAppMessage: function (res) {

    return {
      title: ("[" + this.data.work.type + "]" +
        thePage.data.work.name + "@" + thePage.data.work.category),
    }
  }
})