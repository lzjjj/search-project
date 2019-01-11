// pages/results/results.js
import RequestUrls from '../../common/api.js'
var touchDot = 0;//触摸时的原点  
var time = 0;// 时间记录，用于滑动时且时间小于1s则执行左右滑动  
var interval = "";// 记录/清理时间记录  
Page({

  /**
   * 页面的初始数据
   */
  data: {
    typeList: [],//类型结果列表
    page: 1,//分页页码
    type: 0,
    detail: "",
    trd_session: "",
    lastPage: true,
    showNone: true, 
    canRequest:true
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var type = options.type;
    var detail = options.detail ? options.detail : "";
    this.setData({
      type: type,
      detail: detail
    });
    this.getTrd_session();
  },

  //获取trd_session
  getTrd_session() {
    wx.getStorage({
      key: 'trd_session',
      success: (res) => {
        this.setData({
          trd_session: res.data
        })
        this.searchType(res.data);

      },
    })

  },

  searchType(trd_session) {//初始请求
    wx.showLoading({
      title: '加载中.....',
    })
    var type = this.data.type;
    var detail = this.data.detail;
    wx.request({
      url: RequestUrls.searchType + "?pageNum=" + this.data.page + "&pageSize=5&trd_session=" + trd_session,
      data: {
        "obj": {
          "conModel": type == 1 ? detail : "",  //耗材型号
          "conCompatible": type == 0 ? detail : ""//适用机型(机器型号)
        }
      },
      method: 'POST',
      success: (res) => {
        if (res.data.success) {
          wx.hideLoading();
          if (res.data.obj){
            this.setData({
              typeList: res.data.obj,
              lastPage: res.data.lastPage,
              showNone: res.data.obj.length == 0 ? true : false
            })
          }
        }

      },

    })
  },

  clickSearchType(e,handle) {//分页请求
    this.setData({
      canRequest:false
    })
    wx.showLoading({
      title: '加载中.....',
    })
    var key = e ? e.currentTarget.dataset.key : handle;
    var type = this.data.type;
    var detail = this.data.detail;
    if (key == 1) {
      if (this.data.page - 1 == 0) {
        this.setData({
          canRequest: true
        })
        wx.showToast({
          title: '已是是第一页',
        })
        return;
      } else {
        this.setData({
          page: this.data.page - 1
        })
      }
    } else if (key == 2) {
      if (this.data.lastPage) {
        this.setData({
          canRequest: true
        })
        wx.showToast({
          title: '已是最后一页',
        })
        return;
      } else {
        this.setData({
          page: this.data.page + 1
        })
      }

    }
    wx.request({
      url: RequestUrls.searchType + "?pageNum=" + this.data.page + "&pageSize=5&trd_session=" + this.data.trd_session,
      data: {
        "obj": {
          "conModel": type == 1 ? detail : "",  //耗材型号
          "conCompatible": type == 0 ? detail : ""//适用机型(机器型号)
        }
      },
      method: 'POST',
      success: (res) => {
        if (res.data.success) {
          this.setData({
            typeList: res.data.obj,
            lastPage: res.data.lastPage,
            canRequest: true
          })
          wx.hideLoading();
        }

      },

    })
  },
  luanchToDetail(e) {
    var conId = e.currentTarget.dataset.conid;
    console.log(conId);
    wx.navigateTo({
      url: '/pages/result-detail/result-detail?conId=' + conId,
    })
  },
  // 触摸开始事件  
  touchStart(e) {
    touchDot = e.touches[0].pageX; // 获取触摸时的原点  
    // 使用js计时器记录时间    
    interval = setInterval(function () {
      time++;
    }, 100);
  },
  // 触摸移动事件  
  touchMove(e) {
    var touchMove = e.touches[0].pageX;
    // 向左滑动
    if (touchMove - touchDot <= -40 && time < 10 && this.data.canRequest){
      console.log('向左滑动')
      this.clickSearchType('', 2)
    }
    // 向右滑动
    if (touchMove - touchDot >= 40 && time < 10 && this.data.canRequest) {
      console.log('向右滑动')
      this.clickSearchType('', 1)
    }
  },
  // 触摸结束事件 
  touchEnd(e) {
    clearInterval(interval); // 清除setInterval  
    time = 0;
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})