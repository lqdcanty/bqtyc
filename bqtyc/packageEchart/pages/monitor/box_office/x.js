import * as echarts from '../../ec-canvas/echarts';
const Charts = require("../../../../utils/wxcharts.js")

const app = getApp()
var thePage;

var officeChart;
function initChart(canvas, width, height) {
  officeChart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(officeChart);
  return officeChart;
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ec: {
      onInit: initChart
    },
    windowWidth:320,
    monitor:{
      haha:''
    },
    details:null,
    chartDatas:null,
    movieInfo:null,
    showIcon: true,
    work_id:null,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    thePage = this;
    console.log(options)
    thePage.setData({
      work_id: options.workSeqNo,
      windowWidth: wx.getSystemInfoSync().windowWidth - 15,
    });
    setTimeout(thePage.dataLoad, 500);
  },
  dataLoad:function(){
    var thePage=this;
    var param = { workSeqNo: thePage.data.work_id };
    app.doPost("/api/movie/office/query?timestamp=" + (new Date()).valueOf(), param, "加载作品数据", function (data) {
       let pNum=0;
      let amount = data.result.mdata.totalBoxOffice;
      if (amount.indexOf("亿") != -1 ){
        amount=parseInt(amount.split("亿")[0])*100000000;
      } else if (amount.indexOf("万") != -1 ){
        amount = parseInt(amount.split("万")[0]) * 10000
      }
      pNum = Math.ceil(amount/35);
      thePage.setData({
        movieInfo: data.result.mdata,
        movieSubtitle: data.result.work.workTitle,
        details: data.result.datas.trendDetailList,
        chartDatas: data.result.datas.trendChart,
        peopleNum: (pNum/10000).toFixed(2)+'万'
      });
      thePage.loadChart(thePage.data.chartDatas.date, thePage.data.chartDatas.value);
      wx.stopPullDownRefresh();
    }, "get");
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
      //
    thePage.dataLoad();
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
      title: ("院线票房"),
    };
  },
  loadChart: function (xdatas,sdatas){
    var option = {
      backgroundColor: '#fff',
      color: ["#4db798"],
      legend: {
        data: ['票房'],
        top: 5,
        left: 'center',
        z: 100
      },
      grid: {
        containLabel: true,
        top:35,
        bottom:20
      },
      tooltip: {
        show: true,
        trigger: 'axis',
        // trigger: 'item',
        formatter: "{a}:{c}",
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: xdatas,
        axisLine: {
          lineStyle: {
            color: '#999'
          }
        }
      },
      yAxis: {
        x: 'center',
        name:'单位(万元)',
        type: 'value',
        splitLine: {
          lineStyle: {
            type: 'dashed'
          }
        },
        axisLine: {
          lineStyle: {
            color: '#999'
          }
        },
        axisLabel: {
          formatter: function (value) {
            return (value / 10000/10000).toFixed(2)+"万" ;
          }
        }
        // show: false
      },
      series: [{
        name: '票房数据',
        type: 'line',
        smooth: true,
        data: sdatas,

        itemStyle: {
          normal: {
            label: {
              formatter: function (a, b, c) { return (c / 10000).toFixed(2) + "万元" }
            }
          }
        }
      }]
    };
    officeChart.setOption(option);
  }
})