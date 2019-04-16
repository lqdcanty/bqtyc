import * as echarts from '../ec-canvas/echarts';

const app = getApp();
var chart=null;
function initChart(canvas, width, height) {
  chart= echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);
  return chart;
}


Page({
  data: {
    ec: {
      onInit: initChart
    },
    showIcon: true,
    url:null,
    paramsMap:null,
    spinShow: true
  },
  onReady: function () {
    setTimeout(this.initChartFun, 500);
  },
  onLoad: function (options) {
    var that=this;

    that.setData({
      title: '版权图谱——' + options.name,
      navTop:app.globalData.statusBarHeight + app.globalData.titleBarHeight
    });
    var that=this;
    if (options.code==1){
      that.setData({
          url:'/copyright/relation/allView',
          paramsMap: { workSeqNo: options.workSeqNo }
      });
    } else if (options.code == 2){
      that.setData({
          url:'/copyright/relation/signatureView',
          paramsMap: { workSeqNo: options.workSeqNo }
      });
    } else if (options.code == 3) {
      that.setData({
          url:'/copyright/relation/useView',
          paramsMap: { workSeqNo: options.workSeqNo }
      });
    } else if (options.code == 4) {
      that.setData({
          url:'/copyright/relation/deviceView',
          paramsMap: { workSeqNo: options.workSeqNo }
      });
    }else{
      that.setData({
          url:'/copyright/relation/scopeView',
          paramsMap: { workSeqNo: options.workSeqNo, scopeCode: options.code }
      });
    };

  },

  initChartFun:function(){
    let that=this;
    app.doPost(this.data.url, this.data.paramsMap, '提示', function (data) {
      that.setData({
        spinShow:false,
      });
      var option = {
        title: {
          text: data.result.list.title.text,
          subtext: data.result.list.title.subtext,
          right: 0,
          bottom: 10
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} : {b}"
        },
        toolbox: {
          show: true,
          left:"10",
          bottom:'10',
          feature: {
            restore: {
              show: true
            },
            magicType: {
              show: true,
              type: ["restore", "saveAsImage"]
            },
            saveAsImage: {
              show: true
            }
          }
        },
        legend: {
          left: "0",
          data: data.result.list.legend.data,
        },
        animationDurationUpdate: 1500,
        animationEasingUpdate: 'quinticInOut',

        series: [

          {
            type: 'graph',
            layout: 'force',
            symbolSize: 35,
            focusNodeAdjacency: false,
            roam: true,
            draggable: false,
            categories: data.result.list.series[0].categories,
            label: {
              normal: {
                show: true,
                textStyle: {
                  fontSize: 11
                },
              }
            },
            force: {
              repulsion: data.result.list.series[0].data.length<15?700:200
            },
            draggable: true,

            edgeSymbol: ['circle', 'arrow'],
            edgeSymbolSize: [0, 10],
            edgeLabel: {
                normal: {
                    show: true,
                    textStyle: {
                        fontSize: 10
                    },
                    formatter: "{c}"
                }
            },
            data: data.result.list.series[0].data,
            links: data.result.list.series[0].links,
            lineStyle: {
              normal: {
                opacity: 0.9,
                width: 1,
                curveness: 0
              }
            }
          }
        ]
      };
      console.log(option)
      chart.setOption(option)
    }, 'get'); 
  }
});
