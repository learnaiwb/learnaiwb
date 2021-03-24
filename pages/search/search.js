// pages/search/search.js
import request from '../../utils/request'
let isSendTimer = null;//函数节流使用
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeholderContent:'',//placeholder内容
    hotList:[],//热搜榜
    searchContent:'',
    searchList:[],//关键字搜索结果
    historyList:[],//历史数据记录
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getInitData();
    let historyList = wx.getStorageSync('historyList');
    if(!historyList){
      historyList = []
    }
    this.setData({
      historyList
    })
  },
  // 获取初始化数据
  async getInitData(){
    let placeholderData = await request('/search/default');
    let hotList = await request('/search/hot/detail')
    this.setData({
      placeholderContent:placeholderData.data.showKeyword,
      hotList:hotList.data
    })
  },
// 输入内容查找
   handleInputChange(event){
    //跟新状态数据
    this.setData({
      searchContent:event.detail.value.trim()
    })
    isSendTimer && clearTimeout(isSendTimer);
  
   //函数节流
  isSendTimer = setTimeout(() => {
     //发送请求模糊匹配
    this.getSearchList();
    isSendTimer = null;
   }, 600);
  },
  //获取搜索数据的功能函数
  async getSearchList(){
    if(!this.data.searchContent){
      this.setData({
        searchList: []
      })
      return;
    };
    //异步请求获取关键字模糊匹配
    let searchListData = await request('/search',{keywords:this.data.searchContent,limit:10});
    
    let historyList = this.data.historyList;
    let searchContent = this.data.searchContent;
  
    if(historyList.length >0){
      let index = historyList.indexOf(searchContent);
      if(index !== -1){
        historyList.splice(index,1);}
      }
      historyList.unshift(searchContent);
      this.setData({
        historyList
      });
      wx.setStorageSync('historyList', historyList)
      this.setData({
      searchList: searchListData.result.songs
    })
    
  },
  // 删除搜索历史记录
  deleteHistoryList(){
    //询问用户是否删除
    wx.showModal({
      content:"是否删除",
      success: (res) =>{
        if(res.confirm){
          this.setData({
            historyList:[]
          });
          wx.removeStorageSync('historyList')
        } 
      }
    })


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
  onShareAppMessage: function () {

  }
})