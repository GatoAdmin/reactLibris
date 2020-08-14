var mongoose = require('mongoose');
const Schema = mongoose.Schema;
 
const FestivalSchema = new Schema({
    title: String,
    festivalType : [{tpye:Number}],//공모전, 할인을 같이 할 수 있을수도 있으니 복수화해놓음.
    // 어지간하면 다른 이벤트로 할것
    enterTag: String, //참가 태그는 하나로 해둘것
    targetTags:[String],//할인 이벤트 할때 여러개 할인 대상 태그
    termDate : {//실질적인 이벤트 기간, 투표가능 시간.
        startTime : {type: Date, default:Date.now},
        endTime : {type: Date, default:Date.now}
    },
    openSiteDate : {//종료후에도 사이트가 보여야할수도 있음.
        startTime : {type: Date, default:Date.now},
        endTime : {type: Date, default:Date.now}
    },
    banners : [{//다양한 배너 사진을 사용할 경우 크기 확인
        image :{type: String},//그림 주소 넣기
        bannerType: {type: Number}//헤더 광고에 사용되거나 사이드 광고에 추가될경우
    }],
    headeImage : {type:String}, //그림 주소 넣기. 이벤트 화면 헤더에 걸리는 용
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now },
    enabled: { type: Boolean, default: true }
});
 
module.exports =  mongoose.model('Festival', FestivalSchema);