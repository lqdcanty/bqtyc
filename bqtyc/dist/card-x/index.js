const app = getApp();
Component({
    externalClasses: ['i-class'],

    options: {
        multipleSlots: true
    },

    properties: {
        full: {
            type: Boolean,
            value: false
        },
        thumb: {
            type: String,
            value: ''
        },
        title: {
            type: String,
            value: ''
        },
        url: {
          type: String,
          value: ''
        },
        type: {
          type: String,
          value: ''
        },
        webTitle: {
          type: String,
          value: ''
        },
        extra: {
            type: String,
            value: ''
        },
        subtitle: {
          type: String,
          value: ''
        },
        thumbMode: {
          type: String,
          value: 'aspectFit'
        },
        hidebody: {
          type: Boolean,
          value: false
        },
        iconStyle: {
          type: String,
          value: ''
        },
        headStyle: {
          type: String,
          value: ''
        },
    },
    methods:{
      linkClick: function (res) {
        var url = res.currentTarget.dataset.url, urlDec = '';
        wx.navigateTo({
          url: "/components/webview/c?url=" + app.urlDecode(url) + "&title=" + res.currentTarget.dataset.title + "&type=" + res.currentTarget.dataset.type
        })
      },
    }
});
