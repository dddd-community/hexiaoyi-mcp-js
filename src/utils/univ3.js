const Big = require("big.js");

class Univ3 {
    static priceToTick(price) {
        // 计算价格的平方根
        let sqrtPrice = Math.sqrt(price);
        // 计算tick
        let tick = Math.log(sqrtPrice) / Math.log(1.0001);
        return Math.round(tick);
    }

    static tickToPrice(tick) {
        // 计算价格
        let price = Math.pow(1.0001, tick) ** 2;
        return price;
    }

    static priceToSqrtRatioX96(price) {
        // 使用big.js来进行高精度计算
        const sqrtPrice = new Big(price).sqrt();
        const twoTo96 = new Big(2).pow(96);
        const sqrtRatioX96 = sqrtPrice.times(twoTo96);
        return sqrtRatioX96.toFixed(0); // 将结果转换为整数字符串
    }

    static getParamsByInitPrice(initPrice, tickSpacing) {

        const tick = Univ3.priceToTick(initPrice)
        //console.log("tick", tick);
        const fixedInitPrice = Univ3.tickToPrice(tick);

        const result = {};

        result.initPrice = initPrice;
        result.fixedInitPrice = fixedInitPrice;
        result.start0Price = Univ3.priceToSqrtRatioX96(fixedInitPrice);
        result.tick0 = parseInt((tick / tickSpacing) + "") * tickSpacing;
        result.tick0Add = 0;
        const check0 = Univ3.tickToPrice(result.tick0);
        //console.log("check0",check0, fixedInitPrice)
        //这个单边流动性的，价格范围必须在设定的起始价格意外，如果正序的，其实价格为1，tickLower的就逼需要大于1
        if(check0 < fixedInitPrice) {
            result.tick0Add = tickSpacing;
            //console.log("check000",Univ3.tickToPrice(result.tick0))
        }
        result.start1Price = Univ3.priceToSqrtRatioX96(1 / fixedInitPrice);
        result.tick1 = parseInt((-tick / tickSpacing) + "") * tickSpacing;
        result.tick1Add = 0;
        const check1 = Univ3.tickToPrice(result.tick1);
        //console.log("check1",check1, 1 / fixedInitPrice)
        if(check1 > 1 / fixedInitPrice) {
            result.tick1Add = tickSpacing;
            //console.log("check111",Univ3.tickToPrice(result.tick1))
        }

        return result;
    }
}

module.exports = {Univ3}