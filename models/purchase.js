var mongoose = require('mongoose');
const Schema = mongoose.Schema;
 
const PurchaseSchema = new Schema({
    user : {type: Schema.Types.ObjectId, ref:'UserInfo'},
    //작품 구매와 코인 둘 중 하나만 존재할 수 있음.
    purchaseWork :{
        content: {type: Schema.Types.ObjectId},            
        article: {type: Number, default:0},
        spendCoin : {type: Number},
        discount :[{
            discountKind: {type:Number},//쿠폰, 할인 행사 등등
            discountCode: {type:String}, //쿠폰 코드 같은 경우
            discountAmount:{type:Number} //실제로 할인된 금액(반액, 25% 등등 환산이 끝난 수를 기록)
        }],
        purchaseVersion :  {type: Number, default:0}//구매했을때의 버전
    },
    purchaseCoin :{
        coinAmount: {type: Number},     
        freeCoin : {type:Number},
        purchaseMethod: {//TODO:결제 API에 따라서 수정필요
            purchaseMethodKind: {type: Number, default:0},
            useCard :{    //사용된 카드가 필요한경우 
                name:String, 
                creditCard:String, 
                salt: String, 
                expirationDate: String, 
                cvc: String
            },
            purchaseCode : {type:String} //결제 API 코드.
        },
    },
    canceled: [{ //결제 취소
        //작품 결제 취소를 거절 당했으나 수긍하지 못하고 다시 요청할 경우
        //TODO : 코인 결제의 경우 자동으로 결제가 취소 될수 있도록 짜야함
        cancelRequest: { type: Date },
        cancelReason : {type:String},
        isChecked :  { type: Boolean, default: false },
        isCancel :  { type: Boolean, default: false },
        rejectionReason : {type:String}
    }],
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now },
    enabled: { type: Boolean, default: true }
});
 
module.exports =  mongoose.model('Purchase', PurchaseSchema);