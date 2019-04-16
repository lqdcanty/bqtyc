// pages/copyright/complete/x.js
var thePage;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navTitle:'版权百科',
    showIcon:true,
    color:"#FFD800",
    word:'',
    workSeqNo:'',
    backUrl:'',
    official:false,
    index:0,
    bqservice:false,
    citiaoTip:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    thePage=this;
    //console.log(options.type, "type", options)
    thePage.setData({
      word: options.word,
    })
    if (options.citiao){
      thePage.setData({
        citiaoTip: true,
      })
    }
    if (options.workSeqNo){
      thePage.setData({
        workSeqNo: options.workSeqNo,
      })
    }
    if (options.index){
      thePage.setData({
        index: options.index
      })
    }
    if (options.type){
      
      thePage.setData({
        type: options.type,
        backUrl:"/pages/search/subject/x?keywords=" + thePage.data.type
      })
      
      // wx.navigateTo({
      //   url: '../../search/x?keywords=' + thePage.data.type,
      // })
    }
    if (options.bqservice){
      thePage.setData({
        bqservice: true
      })
    }
  },
  ewmClick:function(){
    wx.previewImage({
      current:'http://fdfs.banquanjia.com.cn/group2/M01/1C/50/CgoKDFyRoquAJTeSAACi-7tRVyY623.png',
      urls: ['http://fdfs.banquanjia.com.cn/group2/M01/1C/50/CgoKDFyRoquAJTeSAACi-7tRVyY623.png'],
    })
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
    if (wx.getLaunchOptionsSync().scene == 1011 || wx.getLaunchOptionsSync().scene == 1047) {
      thePage.setData({ official: true })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function (option) {
    console.log("页面卸载");
    var pages = getCurrentPages(); // 获取页面栈
    var currPage = pages[pages.length - 1]; // 当前页面
    if (thePage.data.index==1){
      var prevPage = pages[pages.length - 3];
      console.log(pages, prevPage, "abc1")
      wx.navigateBack();
    } else if (thePage.data.index==0){
    } else if(thePage.data.index == 2){
      var prevPage = pages[pages.length - 3]; //回到词条列表页
      //console.log(pages, prevPage, "abc")
      prevPage.getData({ workSeqNo: thePage.data.workSeqNo });
      wx.navigateBack();
    }
  }
})