// pages/search/x.js
const app = getApp();
var thePage;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showIcon: true,
    searchKeyWord:"",
    dynamics: [],
    loadding: false,
    category: "文字文学",
   
      duration: 1000,
      interval: 5000,
      autoplay: true,
   
    banners:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    thePage = this;
    let _code = options.code ? options.code : "";
    let _keyword = options.keywords ? options.keywords : "";
    this.setData({
      searchKeyWord: options.keywords ? options.keywords : "音乐歌曲",
      searchBarTop: app.globalData.statusBarHeight + app.globalData.titleBarHeight,
      rankings: [],
      navTitle: options.type?'搜索':"主题搜索"
    });
    app.pageRouteLog('subject', 'subject', 'subject', 'subject', this.url)
    thePage.searchFun(_keyword)
    thePage.getNews()
  },
  // adsFunction:function(){
  //   app.doCssPost("index", "xcx", "bannerload", new Object(), function (status, res) {
  //     thePage.setData({
  //       firstbanner: res.data.result.customer
  //     })
  //   });
  // },
  getNews: function (page) {
    let _page = page ? page : 0;
    this.setData({
      newsPage: _page
    })
    app.doCssPost("index", "copyright", "news", { word: thePage.data.searchKeyWord + ' ' + '版权', page: _page }, function (status, res) {
      if (status) {
        thePage.copyrightNewsFn(res)
      } else {
        console.log('网络连接失败')
      }
    });
  },
  searchFun: function (keyword){
    thePage = this;
    app.doPost(
      '/search/work/summary/keyword?keyword=' + keyword+'&pageSize=12', null, null, function (result) {
        let data = result.result.searchResult;
        let workList = data.work.items;
        let newWork = [];
        workList.forEach(function (p1, p2) {
          if (p1.total < 3) {
            newWork.push(p1)
          } else if (p1.total > 2 && p1.total<7) {
            newWork.push(thePage.createWork1(p1));
          } else if (p1.total >6) {
            newWork.push(thePage.createWork(p1));
          }       
        })
        let newObligee=[]
        let obligeeArry = data.obligee ? data.obligee.items[0] : null;
        if (data.obligee && data.obligee.items.length > 1 && data.obligee.items.length < 7){
          data.obligee.items.splice(0,1)
          newObligee.push(thePage.createWork2(data.obligee));
        } else if (data.obligee && data.obligee.items.length > 6){
          data.obligee.items.splice(0, 1)
          newObligee.push(thePage.createWork(data.obligee));
        }
        thePage.setData({
          obligee: data.obligee,
          searchKeyWord: data.searchKeyWord,
          works: data.work.items ? newWork:[],
          obligeeArry: obligeeArry,
          newObligee: data.obligee ? newObligee[0] : [],
          banners: data.banners
          
        });
        console.log(obligeeArry)
        wx.stopPullDownRefresh();
      }, "get", function () {
        thePage.setData({
          nullStatus: true
        })
      })
  },
  createWork(item){
    let rows = [];
    let cols;
    item.items.forEach(function (k1, k2) {
      if (Math.floor(k2 % 2) == 0) {
        cols = [];
        rows.push({ indx: k2, cols: cols });
      }
      cols.push(k1);
    })
  
    if (item.items.length%2!=0){
      rows[Math.ceil(item.items.length / 2)-1].cols.push({})
    }
    item.items = rows;
    item.pageNumer = 1;
    return item;
  },
  createWork1(item){
    let rows = [];
    let cols;
    item.items.forEach(function (k1, k2) {
      if (Math.floor(k2 % 3) == 0) {
        cols = [];
        rows.push({ indx: k2, cols: cols });
      }
      cols.push(k1);
    })
    item.items = rows;
    return item;
  },
  createWork2(item) {
    let rows = [];
    let cols;
    item.items.forEach(function (k1, k2) {
      if (Math.floor(k2 % 4) == 0) {
        cols = [];
        rows.push({ indx: k2, cols: cols });
      }
      cols.push(k1);
    })
    item.items = rows;
    return item;
  },
  copyrightNewsFn: function (rs) {
    var dynamics = rs.data.data;
    if (!dynamics || dynamics.length < 1) {
      thePage.setData({
        loadAll: true
      });
      return;
    }
    dynamics.forEach(function (k1, k2) {
      k1.cover = k1.cover.indexOf('.baidu-img.cn/timg') != -1 ? '' : k1.cover
      let _url = 'https://p.banquanbaike.com.cn/http?link=' + encodeURIComponent(k1.avatar)
      k1.avatar = k1.cover.indexOf('p.banquanbaike.com.cn') != -1 ? encodeURIComponent(k1.avatar) : _url
      k1.images.forEach(function (j1, j2) {
        k1.images[j2] = encodeURIComponent(j1)
      })
    })
    let c = thePage.data.dynamics.concat(dynamics)
    thePage.setData({
      dynamics: c,
      loadding:false
    });
  },
  addWord () {
    wx.navigateTo({
      url: '../../work/add/x',
    })
  },
  scroll(e) {
    let _works = thePage.data.works;
    if (parseInt(_works[e.target.dataset.page].pageNumer) >= Math.ceil(_works[e.target.dataset.page].total/12)){
      return
    }
    _works[e.target.dataset.page].pageNumer = parseInt(_works[e.target.dataset.page].pageNumer) + 1;
    app.doPost(
      '/search/work/scene/list/keyword?category=' + e.target.dataset.gory + '&type=' + e.target.dataset.type + '&keyword=' + thePage.data.searchKeyWord + '&pageNumber=' + _works[e.target.dataset.page].pageNumer+'&pageSize=12', null, null, function (result) {
        let data = result.result.searchResult;
        if (data.items.length<1){
          return
        }
        let newWork = _works[e.target.dataset.page].items.concat(thePage.createWork(data).items);
        _works[e.target.dataset.page].items = newWork
        thePage.setData({
          works: _works
        });
      }, "get", function () {
        thePage.setData({
          nullStatus: true
        })
      })
  },
  scroll1(e) {
    let _obligee = thePage.data.newObligee;
    console.log(thePage.data.newObligee)
    if (parseInt(_obligee.pageNumer) > Math.ceil(_obligee.total / 12)) {
      return
    }
    _obligee.pageNumer = parseInt(_obligee.pageNumer) + 1;
    app.doPost(
      '/search/obligee/scene/list/keyword?keyword=' +  thePage.data.searchKeyWord + '&pageNumber=' + _obligee.pageNumer + '&pageSize=12', null, null, function (result) {
        let data = result.result.searchResult;
        if (data.items.length < 1) {
          return
        }
        let newobligee = _obligee.items.concat(thePage.createWork(data).items);
        _obligee.items = newobligee;
        thePage.setData({
          newObligee: _obligee
        });
      }, "get", function () {
        thePage.setData({
          nullStatus: true
        })
      })
  },
  inputBind:function(e){
    this.setData({
      searchKeyWord: e.detail.value,
    });
    if (e.detail.value!=''){
      this.searchSuggest()
    }else{
      this.setData({
        searchTipsList: []
      });
    }
  },
  linkClick: function (res) {
    if (res.currentTarget.dataset.url == '') {
      return
    }
    wx.navigateTo({
      url: "/components/webview/c?url=" + app.base64encode(app.utf16to8(res.currentTarget.dataset.url)) + '&title=' + res.currentTarget.dataset.title + '&type=' + res.currentTarget.dataset.type
    })
  },
  inputFocus: function (e) {
    this.setData({
      searchTipsList: []
    });
    if (e.detail.value != '') {
      this.searchSuggest()
    }
  },
  //搜索失去焦点
  inputBlur: function (e) {
    let that=this;
    setTimeout(function(){
      that.setData({
        searchTipsList: []
      });
    },500)
  },
  // tipSearch:function(event){
  //   this.setData({
  //     searchTipsList: [],
  //     searchKeyWord: event.currentTarget.dataset.word,
  //   });
  //   this.searchFun(event.currentTarget.dataset.word)
  // },
  searchSuggest: function () {
    let that = this;
    let type = "w";
    app.doPost("/search/suggest?keyword=" + that.data.searchKeyWord + '&type=' + type, null, null, function (rs) {
      that.setData({
        searchTipsList: rs.result.searchResult
      })
    }, "get");
  },
  query:function(){
    let that = this;
    if (that.data.searchKeyWord != '') {
      that.searchFun(that.data.searchKeyWord)
    } else {

    }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.searchFun(this.data.searchKeyWord)
  },
  onShareAppMessage: function (res) {
    app.pageShareLog('subject', 'subject', 'subject', 'subject', this.url)
    return {
      title: (this.data.navTitle + "@" + this.data.searchKeyWord)
    }
  },
  onReachBottom: function () {
    thePage.setData({
      loadding: true
    });
    let pageNow = thePage.data.newsPage + 1;
    thePage.getNews(pageNow)
  }
})