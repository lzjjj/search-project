var globalUrl = 'http://localhost:8080/'
let requestUrls = {
  WeChatlogin: globalUrl + 'CxWechat/WeChatlogin.do', //登录接口
  getSwiperImgs: globalUrl + 'pic/list.do', //获取轮播图接口
  searchType: globalUrl + 'con/findList.do', //获取搜索结果列表接口
  resultDetail: globalUrl + 'con/getDetails.do', //获取结果详情列表
  getNotice: globalUrl + 'an/findList.do' //获取结果详情列表
}
export default requestUrls
