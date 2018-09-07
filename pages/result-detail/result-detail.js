// pages/result-detail/result-detail.js
import RequestUrls from '../../common/api.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    resultDetail: "",
    showNone:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.conId){
      this.getTrd_session(options.conId)
    }
  },

  //获取trd_session
  getTrd_session(conId) {
    wx.getStorage({
      key: 'trd_session',
      success: (res) => {
        this.setData({
          trd_session: res.data
        })
        this.getResultDetail(conId, res.data);
      },
    })
  },
  //获取查询详情
  getResultDetail(conId, trd_session) {
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: RequestUrls.resultDetail + "?trd_session=" + trd_session,
      method:"POST",
      data:{
        obj:{
          "conId": conId
        }
      },
      success:res=>{
        if(res.data.success){
          this.setData({
            resultDetail:res.data.obj,
            showNone: res.data.obj ? false:true
          })
          wx.hideLoading();
        }
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})