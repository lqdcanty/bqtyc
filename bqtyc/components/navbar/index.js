const app = getApp();
Component({
  properties: {
    //小程序页面的表头
    title: {  //标题
      type: String,
      default: ''
    },
    color:{  //头部背景色
      type: String,
      default: '#000'
    },
    iconColor:{  //按钮颜色
      type: String,
      default: '#FFFFFF'
    },
    lineColor:{  // 按钮分割线的颜色
      type: String,
      default: '#FFFFFF'
    },
    navColor: {  // 按钮操作面板的背景色
      type: String,
      default: '#FFFFFF'
    },
    fontColor:{  //标题颜色
      type: String,
      default: '#FFFFFF'
    },
    backUrl:{  //返回上一页的路径
      type: String,
      default: ''
    },
    //是否展示返回和主页按钮
    showIcon: {
      type: Boolean,
      default: true
    },
    delta:{  
      type: Number,
      default: 1
    }
  },

  data: {
    statusBarHeight: 0,
    titleBarHeight: 0,
  },

  ready: function () {
    console.log(app.globalData.statusBarHeight + ',' + app.globalData.titleBarHeight)
    // 因为很多地方都需要用到，所有保存到全局对象中
    if (app.globalData && app.globalData.statusBarHeight && app.globalData.titleBarHeight) {
      this.setData({
        statusBarHeight: app.globalData.statusBarHeight,
        titleBarHeight: app.globalData.titleBarHeight
      });
    } else {
     
      let that = this
      wx.getSystemInfo({
        success: function (res) {
          if (!app.globalData) {
            app.globalData = {}
          }
          if (res.model.indexOf('iPhone') !== -1) {
            app.globalData.titleBarHeight = 44
          } else {
            app.globalData.titleBarHeight = 48
          }
          app.globalData.statusBarHeight = res.statusBarHeight
          that.setData({
            statusBarHeight: app.globalData.statusBarHeight,
            titleBarHeight: app.globalData.titleBarHeight
          });
        },
        failure() {
          that.setData({
            statusBarHeight: 0,
            titleBarHeight: 0
          });
        }
      })
    }
  },

  methods: {
    headerBack() {
      console.log(this.properties.delta)
      if (this.properties.backUrl && this.properties.backUrl!=""){
        wx.navigateTo({
          url: this.properties.backUrl
        })
        return;
      }
      wx.navigateBack({
        delta: this.properties.delta==1?1:this.properties.delta,
        fail(e) {
          console.log(e)
          wx.navigateTo({
            url: '../../pages/index/x'
          })
        }
      })
    },
    headerHome() {
      wx.navigateTo({
        url: '../../pages/index/x'
      })
    }
  }
})
