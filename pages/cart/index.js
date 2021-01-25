import {showToast} from "../../utils/asyncWx.js"
Page({
  data:{
    address:{},
    cart:[],
    allChecked:false
  },
  onShow(){
    const address=wx.getStorageSync("address");
    const cart=wx.getStorageSync("cart")||[];
    // const allChecked=cart.length?cart.every(v=>v.checked):false;
    this.setData({address})
    this.setCart(cart)
  },
  handleChooseAddress(e){
    wx.chooseAddress({
      success: (address) => {
        address.all=address.provinceName+address.cityName+address.countyName+address.detailInfo
        wx.setStorageSync("address", address);
      },
      fail: () => {
       
      },
      complete: () => {}
    });
  },
  handleItemChange(e){
    //被修改商品的id
    const goods_id=e.currentTarget.dataset.id;
    //获取购物车数组
    let {cart}=this.data;
    //从中找到被修改的对象
    let index=cart.findIndex(v=>v.goods_id===goods_id)
    //选中状态取反
    cart[index].checked=!cart[index].checked;
    this.setCart(cart);
  },
  setCart(cart){
    let allChecked=true
    let totalPrice=0;
    let totalNum=0;
    cart.forEach(v=>{
      if(v.checked){
        totalPrice+=v.num*v.goods_price;
        totalNum+=v.num;
      }else{
        allChecked=false;
      }
    })
    allChecked=cart.length!=0?allChecked:false;
    this.setData({
      cart,
      allChecked,
      totalPrice,
      totalNum
    }),
    wx.setStorageSync("cart", cart);
      
  },
  handleItemAllCheck(){
    let {cart,allChecked}=this.data;
    allChecked=!allChecked;
    cart.forEach(v=>v.checked=allChecked);
    this.setCart(cart);
  },
  handleItemNumEdit(e){
    const {operation,id}=e.currentTarget.dataset;
    let {cart}=this.data;
    const index=cart.findIndex(v=>v.goods_id===id);
    if(cart[index].num===1&&operation===-1){
      wx.showModal({
        title: '您是否要删除？',
        content: '',
        showCancel: true,
        cancelText: '取消',
        cancelColor: '#000000',
        confirmText: '确定',
        confirmColor: '#3CC51F',
        success: (result) => {
          if(result.confirm){
            cart.splice(index,1);
            this.setCart(cart);
          }
        },
        fail: ()=>{},
        complete: ()=>{}
      });
    }else{
      cart[index].num+=operation;
      this.setCart(cart);
    }
  },
  async handlePay(){
    const {address,totalNum}=this.data;
    if(totalNum===0){
      await showToast({title:"您还没有选购商品"})
      return;
    }
    if(!address.userName){
      await showToast({title:"您还没有选择收货地址"})
      return;
    }
    wx.navigateTo({
      url: '/pages/pay/index',
    });
  }
})