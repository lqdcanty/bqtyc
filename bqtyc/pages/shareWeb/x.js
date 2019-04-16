Page({
  data: { // 参与页面渲染的数据
    url: '',
    showIcon: true
  },
  onShareAppMessage(options) {
    var s = '[' + this.data.type + ']' + this.data.title;
    console.log(s,"sss")
    url = '/pages/shareWeb/x?url=' + encodeURIComponent(options.webViewUrl) + '&title=' + this.data.title + "&type=" + this.data.type;
    return {
      title: this.data.type ? s : " ",
      desc: '',
      path: url
    }
  },
  onLoad: function (options) {
    options.url ? this.setData({ url: decodeURIComponent(options.url), title: options.titles ? options.title : "", type: options.type ? options.type : "" }) : this.setData({ url: options.url, title: options.titles ? options.title : "", type: options.type ? options.type : ""});
  }
})