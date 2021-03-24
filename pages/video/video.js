// pages/video/video.js
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList: [],//导航标签数据
    navId:0,//导航的标识
    
    videoList: [], //视频的列表数据
    videoId:'',//视频id标识
    videoUpdateTime:[],//记录video播放时长，以便于下次继续播放
    isTriggered:false //下拉刷新是否生效
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取导航数据
    this.getVideoGroupListData();
  },
  async getVideoGroupListData(){
    let videoData = await request('/video/group/list');
    if(videoData.message === 'success'){
      this.setData({
        videoGroupList: videoData.data.slice(0,14),
        navId: videoData.data[0].id
      });
      //获取视频列表数据  需要先获取到navid
      this.getVideoList(this.data.navId) ;
    }
  },
  // 点击切换导航的回调
  changeNav(event){
    wx.showLoading({
      title: 'loading...'
    })
    let navId = event.currentTarget.id;
    // let navId = event.currentTarget.dataset.wwwww 这样获得是数字
    this.setData({
      navId: parseInt(navId)//通过id向event传参如果传的是Number会自动转换为string
    })
    //动态获取当前导航对应的视频数据
    this.getVideoList(this.data.navId);
    this.setData({
      videoUpdateTime: []
    })
  },
  //获取视频列表数据
  async getVideoList(navId){
    let data = await request('/video/group',{id:navId});
    let index =0;
    let videoList = data.datas.map(item => {
      item.id = index++;
      return item;
    })
    this.setData({
      videoList:videoList,
      isTriggered:false
    });
    wx.hideLoading({
      success: (res) => {},
    })
  },
  // 点击播放/继续播放问题
  handlePlay(event){
    console.log('进入')
    /**
     * 多个视频同时播放的问题
     * 需求：
     * 1.在点击播放的事件中需要找到上一个播放的视频
     * 2.在播放新的视频之前关闭上一个正在播放的视频
     * 关键：
     * 1.如何找到上一个视频
     * 2.如何确认点击播放的视频和在播放的视频不是同一个视频
     * 单例模式：
     * 1.需要创建多个对象的场景下，通过一个变量接受，始终只有一个对象
     * 2.节省内存
     */
    // 1.找到上一个播放的视频 2.关闭该视频
    let vid = event.currentTarget.id;
    //对同一个视频暂停后再继续播放不应该进入该逻辑 保存上一次的视频
    this.vid!==vid && this.videoContext && this.videoContext.stop();

    this.vid = vid;
    //更新data中videoId的状态数据
    this.setData({
      videoId:vid
    })
    //创建video标签的实例对象
    this.videoContext = wx.createVideoContext(vid);
    //判断当前的视频是否播放过
    let videoItem = this.data.videoUpdateTime.find(item => item.vid === vid);
    if(videoItem){
      this.videoContext.seek(videoItem.currentTime);
    }else{
      this.videoContext.play();
    }

  },
  handleTimeUpdate(event){
    let videoTimeObj = {vid:event.currentTarget.id,currentTime:event.detail.currentTime}
    /***
     * 判断记录播放时长的videoUpdateTime数组中是否有当前视频播放记录
     */
    let {videoUpdateTime} = this.data;
    let videoItem = videoUpdateTime.find(item => item.vid === videoTimeObj.vid)
    if(videoItem) {
      //之前有
      videoItem.currentTime = event.detail.currentTime;
    }else{
      videoUpdateTime.push(videoTimeObj);
    }
    this.setData({
      videoUpdateTime
    })
  },
  //视频播放结束调用
  handleEnded(event){
    let {videoUpdateTime} = this.data;
    let vid = event.currentTarget.id;
    let n = videoUpdateTime.findIndex( item => item.vid === vid);
    videoUpdateTime.splice(n,1);
    this.setData({
      videoUpdateTime
    })
  },
  //跳转至搜索界面
  toSearch(){
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },
//下拉刷新
handleRefresh(event){
  this.getVideoList(this.data.navId)
},
//上拉刷新
handleTollower(event){
  //暂时木有接口支持这个
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
  onShareAppMessage: function ({from}) {
    return {
      title:'自定义转发内容',
      page:'/pages/video/video',
      imageUrl:'/static/images/nvsheng.jpg'
    }
  }
})