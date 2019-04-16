import * as echarts from '../../ec-canvas/echarts';
const Charts = require("../../../../utils/wxcharts.js")

const app = getApp()
var thePage;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showIcon: true,
    mointor: null,
    workSeqNo: '',

    movielogo: [{     //影视

      "name": "腾讯视频",
      "url": "http://fdfs.banquanjia.com.cn/group2/M01/01/ED/CgoKC1w0HjWAWwgLAAApaRrvCCs247.png"
    }, {
      "name": "优酷",
      "url": "http://fdfs.banquanjia.com.cn/group2/M00/01/F8/CgoKDFw0Hg6AOWaAAAAsU-4EncE643.png"
    }, {
      "name": "百度视频",
      "url": "http://fdfs.banquanjia.com.cn/group2/M02/01/ED/CgoKC1w0HjOARgHkAAAxapkjHyw093.png"
    }, {
      "name": "爱奇艺",
      "url": "http://fdfs.banquanjia.com.cn/group2/M02/01/F8/CgoKDVw0HhWAfDsmAAAcuHrKwc0002.png"
    }

    ],

    Comiclogo: [{     //动漫

      "name": "网易漫画",
      "url": "http://fdfs.banquanjia.com.cn/group2/M02/01/F9/CgoKDVw0HiSAbEl-AAAjyxJZV7U792.png"
    }, {
      "name": "腾讯动漫",
      "url": "http://fdfs.banquanjia.com.cn/group2/M01/01/ED/CgoKC1w0HkKAXtTtAAAmtpcuqnA818.png"
    }

    ],

    musiclogo: [{     //音乐
      "name": "网易云音乐",
      "url": "http://fdfs.banquanjia.com.cn/group2/M02/01/ED/CgoKC1w0HmqAC_kJAAAZy0YrLyY236.png"
    }, {
      "name": "qq音乐",
      "url": "http://fdfs.banquanjia.com.cn/group2/M00/01/F9/CgoKDVw0HkeAMFXSAAAXLfwhF04021.png"
    }, {
      "name": "酷狗音乐",
      "url": "http://fdfs.banquanjia.com.cn/group2/M00/01/F9/CgoKDFw0Hk2AWkOoAAAc-rt_lO8758.png"
    }, {
      "name": "咪咕音乐",
      "url": "http://fdfs.banquanjia.com.cn/group2/M01/01/ED/CgoKC1w0HmeAXBPiAAAtKHWMgO0853.png"

    }],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    thePage = this;

    app.doPost('/work/details', { workSeqNo: options.workSeqNo, timestamp: (new Date()).valueOf() }, '提示', function (data) {
      console.log(data)
      thePage.setData({
        mointor: data.result.workModel,
        workSeqNo: options.workSeqNo
      });

    }, 'get');
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: ("用户评价" +
        "@" + this.data.work.category + this.data.work.type +
        "_" + this.data.work.title + ""),
    };
  }
})