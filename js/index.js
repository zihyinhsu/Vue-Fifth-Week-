// import { createApp } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.26/vue.esm-browser.min.js";
import productModal from "./productModal.js";


//加入特定規則
VeeValidate.defineRule('email', VeeValidateRules['email']);
VeeValidate.defineRule('required', VeeValidateRules['required']);
//多國語系

VeeValidateI18n.loadLocaleFromURL('../zh_TW.json');

// Activate the locale
VeeValidate.configure({
  generateMessage: VeeValidateI18n.localize('zh_TW'),
  validateOnInput: true, // 調整為輸入字元立即進行驗證
});

const app = Vue.createApp({
    data(){
        return{
            cartData:{},
            products:[],
            productId:'',
            isLoadingItem:'',
            form: {
                user: {
                  name: '',
                  email: '',
                  tel: '',
                  address: ''
                },
                message: ''
                }
        }
    },
    components:{
        productModal,
        //註冊表單驗證元件
        VForm:VeeValidate.Form,
        VField: VeeValidate.Field,
        ErrorMessage:VeeValidate.ErrorMessage
    },
    methods:{
        getProductsData(){
            axios.get(`${url}/api/${path}/products/all`)
            .then((res)=>{
                this.products = res.data.products
            }).catch((err)=>{
                console.log(err)
            })
        },
        //取得單一產品資料
        getProduct(id){
            this.productId = id
            this.$refs.productModal.openModal()
        },
        //取得購物車資訊
        getCarts(){
            axios.get(`${url}/api/${path}/cart`)
            .then((res)=>{
                this.cartData = res.data.data
            }).catch((err)=>{
                console.log(err)
            })
        },
        //加入購物車
        addToCart(id,qty = 1){
            //判斷loading的時機
            this.isLoadingItem = id
            axios.post(`${url}/api/${path}/cart`,{
                "data": {
                    "product_id": id,
                    "qty": qty
                }
            })
            .then((res)=>{
                this.isLoadingItem =''
                this.cartData = res.data.data
                this.getCarts()
                alert(res.data.message)
            }).catch((err)=>{
                alert(err.data.message)
            })
        },
        delAllCart(){
            this.isLoadingItem = 1
            axios.delete(`${url}/api/${path}/carts`)
            .then((res)=>{
                this.isLoadingItem = 0
                this.getCarts()
                alert(res.data.message)
            }).catch((err)=>{
                alert(err.data.message)
            })
        },
        delCartItem(id){
            axios.delete(`${url}/api/${path}/cart/${id}`)
            .then((res)=>{
                this.getCarts()
                alert(res.data.message)
            }).catch((err)=>{
                alert(err.data.message)
            })  
        },
        updateCartItem(item){
            this.isLoadingItem = item.id
            axios.put(`${url}/api/${path}/cart/${item.id}`,{
                "data": {
                    "product_id": item.id,
                    "qty": Number(item.qty)
                }
            })
            .then((res)=>{
                this.isLoadingItem = ''
                this.getCarts()
                alert(res.data.message)
            }).catch((err)=>{
                alert(err.data.message)
            })
        },
        //送出訂單
        onSubmit(){
            axios.post(`${url}/api/${path}/order`,{data:this.form})
            .then((res)=>{
                console.log(res)
                alert(res.data.message);
                this.getCarts()
                this.$refs.form.resetForm();
                this.form.message ='';
            }).catch((err)=>{
                console.log(err)
                alert(err.data.message);
            })
        },
        isPhone(value) {
            const phoneNumber = /^(09)[0-9]{8}$/
            return phoneNumber.test(value) ? true : '需要正確的電話號碼'
          }
    },
    mounted(){
        this.getProductsData()
        this.getCarts()
    }
})


app.mount('#app')
