 // components/webview/c.js
const { $Toast } = require('../../dist/base/index');
const { $Message } = require('../../dist/base/index');
const app = getApp();
var title,optionsUrl;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showIcon: true
  },
  onLoadError(e) {
    console.log("onLoadError", e);
  },
  onLoadView(e) {
    console.log("onLoadView", e);
    this.setData({
      loading: false,
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    
    let url
    // if (options.url.indexOf("http")>-1){
    //   url= options.url
    // }else{
       url = app.base64decode(options.url)
   // }
    console.log( url, "解码")
    //let url = decodeURIComponent(options.url);//这里从全局的测试数据中取数据

    optionsUrl = decodeURI(url);
    console.log(encodeURIComponent(url),"再次解码")
    if (!url) {
      url = "https://baijiahao.baidu.com/s?id=1571511092765669&wfr=spider&for=pc";
    }
    let protocol = 0;
    if (url.indexOf("https:") == 0) {
      url = url.substring(6);
      console.log(url,"https")
      protocol = 1;
    }
    else {
      url = url.substring(5);
      console.log(url, "http")
    }
    $Toast({
      content: '打开链接',
      type: 'loading'
    });
    //decodeURIComponent
    if (url.indexOf("mp.weixin.qq.com") == -1
      && url.indexOf("toutiao.com") == -1
      && url.indexOf("zhihu.com") == -1
      // && url.indexOf("baijiahao.baidu.com") == -1
      //&& url.indexOf("cq.cqnews.net") == -1
    ) {
      // url = "http://127.0.0.1:8080/http!get.action?link=" +protocol + encodeURIComponent(url);
      //var abc=decodeURIComponent(url);
      url = "https://p.banquanbaike.com.cn/http?link=" + protocol + encodeURIComponent(url);
    }
    console.log("redirect", url);
    console.log(options)
    this.setData({
      url: url,
      searchBarTop: app.globalData.statusBarHeight + app.globalData.titleBarHeight,
      title: options.title ? options.title:"",
      pageTitle: options.pageTitle ? options.pageTitle : "",
      type: options.type ? options.type : "",
    });
  },
  chr2Unicode(str) {
    if ('' != str) {
      var st, t, i;
      st = '';
      for (i = 1; i <= str.length; i++) {
        t = str.charCodeAt(i - 1).toString(16);
        if (t.length < 4)
          while (t.length < 4)
            t = '0'.concat(t);
        t = t.slice(2, 4).concat(t.slice(0, 2))
        st = st.concat(t);
      }
      return (st.toUpperCase());
    }
    else {
      return ('');
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (options) {
    var s = this.data.title + '[' + this.data.type + ']';
    console.log(s, "sss")
    return {
      title: this.data.type ? s:" ",
      path: '/pages/index/x?url=' + encodeURIComponent(options.webViewUrl) + '&title=' + this.data.title + "&type=" + this.data.type +'&shareId=share',
      success: function (res) {
        // 转发成功
        console.log(res)
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})