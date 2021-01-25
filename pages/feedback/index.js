// pages/feedback/index.js
Page({
  data: {
    orders:[],
    tabs:[
      {
        id:0,
        value:"体验问题",
        isActive:true
      },
      {
        id:1,
        value:"商品、商家投诉",
        isActive:false
      }
    ],
    chooseImgs:[],
    textVal:""
  },
  //外网的图片的路径数组
  UpLoadImgs:[],

  handleTabsItemChange(e){
    //获取被点击的标题索引
    const {index}=e.detail;
    //修改源数组
    let {tabs}=this.data;
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
    this.setData({
      tabs
    })
  },
  //添加图片
  handleChooseImg(){
    //调用小程序内置的选中图片api
    wx.chooseImage({
      //同时选中的图片数量
      count: 9,
      //图片的格式 原图/压缩
      sizeType: ['original', 'compressed'],
      //图片的来源 相册/照相机
      sourceType: ['album', 'camera'],
      success: (result) => {
        this.setData({
          chooseImgs:[...this.data.chooseImgs,...result.tempFilePaths]
        })
      }
    });
      
  },
  //删除被点击的图片
  handleRemoveImg(e){{
    //获取被点击图片的索引
    const {index}=e.currentTarget.dataset;
    console.log(index);
    //获取data中的图片数组
    let {chooseImgs}=this.data;
    //删除元素
    chooseImgs.splice(index,1);
    this.setData({
      chooseImgs
    })
  }},
  //文本域输入事件
  handleTextInput(e){
    this.setData({
      textVal:e.detail.value
    })
  },
  //提交按钮点击事件
  handleFormSubmit(){
    //获取文本域的内容
    const{textVal,chooseImgs}=this.data
    //合法性验证
    if(!textVal.trim()){
      wx.showToast({
        title: '输入不合法',
        icon: 'none',
        mask: true,
      });
      return;
    }
    //准备上传图片，到专门的图片服务器
    //上传文件的api 不支持多个文件同时上传
    //通过遍历，逐个上传
    wx.showLoading({
      title: "正在上传中",
      mask: true
    });
    //判断有没有需要上次的图片数组
    if(chooseImgs.length!=0){
      chooseImgs.forEach((v,i)=>{
        wx.uploadFile({
          //图片上传的地址
          url: 'https://img.coolcr.cn/api/upload',
          //被上次的文件路径
          filePath: v,
          //上传的文件的名称，后台来获取文件
          name: "image",
          //顺带的文本信息
          formData: {},
          success: (result) => {
            console.log(result.data);
            let url=JSON.parse(result.data).url;
            this.UpLoadImgs.push(url);
            //所有得图片上传完毕才触发
            if(i===chooseImgs.length-1){
              this.setData({
                textVal:"",
                chooseImage:[]
              })
              //返回上一个页面
              wx.navigateBack({
                delta: 1
              });
                
            }
          }
        });
      })
    }else{
      wx.hideLoading();
      wx.navigateBack({
        delta: 1
      });
    }
  }
})