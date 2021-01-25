import { request } from "../../request/index.js"
Page({
  data: {
    goods:[],
    isFocus:false,
    inpValue:""
  },
  TimeId:-1,
  //输入框监听事件
  handleInput(e){
    const {value}=e.detail;
    //检测合法性
    if(!value.trim()){
      this.setData({
        goods:[],
        isFocus:false
      })
      clearTimeout(this.TimeId)
      return;
    }
    //准备发送请求获取数据
    this.setData({
      isFocus:true
    })
    clearTimeout(this.TimeId)
    this.TimeId=setTimeout(()=>{
      this.qsearch(value)
    },1000)
  },
  async qsearch(query){
    const res=await request({url:"/goods/qsearch",data:{query}});
    this.setData({
      goods:res.data.message
    })
  },
  handleCancel(){
    clearTimeout(this.TimeId)
    this.setData({
      inpValue:"",
      goods:[],
      isFocus:false
    })
 
  }
})