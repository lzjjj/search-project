//index.js
//获取应用实例
const app = getApp()
import RequestUrls from '../../common/api.js'
Page({
  data: {
    text: '欢迎查询，查询请联系18613989789，目前属于开放',
    marqueePace: 0.8,//滚动速度
    marqueeDistance: 0,//初始滚动距离
    marqueeDistance2: 0,
    marquee2copy_status: false,
    marquee2_margin: 60,
    size: 14,
    orientation: 'left',//滚动方向
    interval: 15, // 时间间隔
    index: 0,
    indicatorDots: false,
    autoplay: true,
    interval2: 5000,
    duration: 1000,
    searchType: "0",//0：表示机器型号，1：表示耗材型号
    imgUrls: [//轮播数据图片
     
    ],
    inputValue:"",//input框的值
    notice:""
  },
  onLoad:function(){
    this.getSwipers();
    this.getNotice();
  },
  onShow: function () {
    
  },
  typeChange(e) {
    var type = e.currentTarget.dataset.type;
    this.setData({
      searchType: type
    })
  },

  getNotice(){
    wx.request({
      url: RequestUrls.getNotice,
      method: 'POST',
      data:{

      },
      dataType: 'json',
      success: (res) => {
        if (res.data.success) {
          this.setData({
            notice: res.data.obj[0].anDetails
          })
        }
      },

    })
  },

  getSwipers() {//获取轮播图
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: RequestUrls.getSwiperImgs,
      method: 'GET',
      dataType: 'json',
      success: (res) => {
        if(res.data.success){
          this.setData({
            imgUrls:res.data.obj
          })
          wx.hideLoading();
        }
      },

    })
  },
  inputChange(e){//监听input框值的变化
      this.setData({
        inputValue:e.detail.value
      })
  },

  luanchToResults(e){//跳转查询结果页
    wx.navigateTo({
      url: '/pages/results/results?type=' + this.data.searchType + "&detail=" + this.data.inputValue,
    })
  }
})
