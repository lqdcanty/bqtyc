// pages/copyright/related/add/x.js
const app = getApp()
var thePage;
var work_data;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight:0,
    titleBarHeight:0,
    showIcon:true,
    categories: ["影视", "文字", "动漫", "音乐", "艺术", "软件", "",],
    category: 0,
    types: ["电影", "文学", "漫画", "人物形象", "词曲"],
    type: 0,
    refer_actions: [
      {
        color: '#fff',
        fontsize: '22',
        width: 48,
        icon: 'delete',
        background: '#ed3f14'
      },
      {
        width: 48,
        color: '#80848f',
        fontsize: '20',
        icon: 'undo'
      }
    ]
  },
  onActionCancel() {
    this.setData({
      actionsOpened: false
    });
  },
  handleAction(e) {
    console.log("handleAction", e);
    const index = e.detail.index;
    if (index == 1) {
      wx.navigateTo({
        url: '/components/uploader/c',
      })
    }
    else if (index == 0) {
      wx.navigateTo({
        url: '/components/pasteurl/c',
      })
    }
  },
  addReferer(e) {
    this.setData({
      actionsTitle: "参考资料请选择以下2种方式提供",
      actionsOpened: true,
      actions: [
        {
          name: '复制粘贴引用链接',
          icon: 'accessory',
        },
        {
          name: '拍照或从相册上传图片',
          icon: 'picture',
        },
      ],
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    thePage = this;
    thePage.setData({
      statusBarHeight: app.globalData.statusBarHeight,
      titleBarHeight: app.globalData.titleBarHeight
    })
    let work_id = options.work_id;//这里从全局的测试数据中取数据
    if (work_id) {
      wx.setNavigationBarTitle({
        title: "编辑财产权许可使用词条",
      });
    }
    else {
      work_id = 0;
      wx.setNavigationBarTitle({
        title: "新增财产权许可使用词条",
      });
    }

    work_data = app._queryWork(work_id);
    work_data.id = work_id;
    thePage.setData({
      work: work_data
    });
  }
})