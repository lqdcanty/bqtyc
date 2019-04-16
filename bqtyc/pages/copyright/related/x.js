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
    work_arr:[],
    showIcon: true,
    copyright_derive:null,
    copyright_deriveNo:false,
    citiaoCode:'',
    powerType:'',
    workSeqNo:'',
    actions: [
      {
        name: '查看区块链',
        icon: 'share',
      },
    ],
    status_info: "收录词条",
    oper_tips: "查看区块链存证"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  
  onLoad: function (options) {
    thePage = this; //workSeqNo
    let work_id = '201812051355245032';
    if (!work_id) work_id = 0;
    app.doPost('/work/details', { workSeqNo: options.workSeqNo, timestamp: (new Date()).valueOf() }, null, function (data) {
      thePage.setData({
        work: data.result.workModel,
        workSeqNo: options.workSeqNo,
        powerType: data.result.powerType
      });
    })

    app.doPost('/userwork/queryUserWork', { workSeqNo: options.workSeqNo, timestamp: (new Date()).valueOf() }, null, function (data) {
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
    this.setData({
      actionsOpened: true,
       citiaoCode: e.currentTarget.dataset.citiaocode
    });
  },

  handleAction({ detail }) {
    wx.navigateTo({
      url: '../blockchain/x?citiaoCode=' + thePage.data.citiaoCode + '&workSeqNo=' + thePage.data.workSeqNo,
    })
  },
 
  onCancel(e) {
    this.setData({
      actionsOpened: false
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {//url, para, title, callback, method)
  
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
    console.log("有一个分享请求", res);
    console.log(this.data.work.type, this.data.work.name, this.data.work.category, this.data.work.type)
    return {
      title: ("[" + this.data.work.type + "]" +
        this.data.work.name + "@" + this.data.work.category)
    }
  }
})