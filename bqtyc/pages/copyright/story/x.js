// pages/copyright/related/x.js
const app = getApp()
var thePage;
var oper_data;
var work_data;
var obj = wx.getSystemInfoSync();
var workHeight = obj.windowHeight;
var workWidth = obj.windowWidth;
var mine, status, operation, citiaoCode, user;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    navTitle: "版权故事",
    showIcon: true,
    fixedTop: app.globalData.statusBarHeight + app.globalData.titleBarHeight + 5,
    cxtWidth: workWidth-72,
    actionsOpened: false,
    actions: null,
    work:null,
    powerType:'',
    copyright_story:null,
    workSeqNo:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    thePage = this;
    user = app.globalData.userInfo;
    //var workSeqNo ='201812051355245032';
    thePage.setData({workSeqNo: options.workSeqNo})
    app.doPost('/work/details', { workSeqNo: options.workSeqNo }, null, function (data) {
      thePage.setData({
        work: data.result.workModel,
        powerType: data.result.powerType
      });
    }, 'get');
    app.doPost('/story/queryStory', { workSeqNo: options.workSeqNo, token: user ? user.authToken : '' }, null, function (data) {
      thePage.setData({
        copyright_story: data.result.list,
      });
    }, 'get');
  },
  addCopyright() {
    if (!user) {
      $Message({
        content: '请登录',
        type: 'warning'
      });
      return;
    }
    wx.navigateTo({
      url: "add/x"
    });
  },
  openActions(e) {
    mine = e.currentTarget.dataset.mine;
    status = e.currentTarget.dataset.status;
    operation = e.currentTarget.dataset.operation ? e.currentTarget.dataset.operation : '';
    citiaoCode = e.currentTarget.dataset.citiaocode;
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
          },
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
          },
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
    }
  },
  onCancel() {
    this.setData({
      actionsOpened: false
    });
  },
  handleAction({ detail }) {
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
          url: "../blockchain/x?workSeqNo=" + thePage.data.workSeqNo + "&citiaoCode=" + citiaoCode
        });
      } else if (detail.index == 1){
        if (!user) {
          $Message({
            content: '请登录',
            type: 'warning'
          });
          return;
        }
        wx.navigateTo({
          url: "edit/x?citiaoCode=" + citiaoCode + "&workSeqNo=" + thePage.data.workSeqNo + "&isMine=" + mine + "&status=" + status
        });
      }else{
        if (!user) {
          $Message({
            content: '请登录',
            type: 'warning'
          });
          return;
        }
        wx.navigateTo({
          url: "delete/x?citiaoCode=" + citiaoCode + "&isMine=" + mine + "&status=" + status + "&workSeqNo=" + thePage.data.workSeqNo + "&delete=1"
        });
      }
      thePage.setData({
        actionsOpened: false
      });
    }
    else if ((operation == "add" || operation == "update") && status == 'wait_audit') {
      if (detail.index == 0) {
        if (!user) {
          $Message({
            content: '请登录',
            type: 'warning'
          });
          return;
        }
        wx.navigateTo({
          url: "edit/x?citiaoCode=" + citiaoCode + "&workSeqNo=" + thePage.data.workSeqNo + "&isMine=" + mine + "&status=" + status 
        });
      }
      thePage.setData({
        actionsOpened: false
      });
    }
    else if (operation == 'delete') {
      if (detail.index == 0) {
        wx.navigateTo({
          url: "../blockchain/x?workSeqNo=" + thePage.data.workSeqNo + "&citiaoCode=" + citiaoCode
        });
      }
      else {
        if (!user) {
          $Message({
            content: '请登录',
            type: 'warning'
          });
          return;
        }
        wx.navigateTo({
          url: "edit/x?citiaoCode=" + citiaoCode + "&isMine=" + mine + "&status=" + status+"&workSeqNo=" + thePage.data.workSeqNo + "&cancel=1"
        });
      }
      thePage.setData({
        actionsOpened: false
      });
    }
  },
  clickLink:function(res){
    var url = res.currentTarget.dataset.url, urlDec = '';
    console.log(res,"story")
    if (res.currentTarget.dataset.story.attachType == 1 || res.currentTarget.dataset.story.attachType == 3){
      wx.navigateTo({
        url: '/components/webview/c?url=' + app.urlDecode(url) + '&title=' + res.currentTarget.dataset.title + '&type=' + res.currentTarget.dataset.type
      })
    } else if (res.currentTarget.dataset.story.attachType == 2){
      wx.previewImage({
        current: res.currentTarget.dataset.story.pic[0], // 当前显示图片的http链接
        urls: res.currentTarget.dataset.story.pic // 需要预览的图片http链接列表
      })
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
})