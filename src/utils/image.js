const fs = require("fs");

const _supportFormat = [{format:".jpg", data:"data:image/jpeg;base64,"}, {format:".png", data:"data:image/png;base64,"},{format:".svg",data:"data:image/svg+xml;base64,"}, {format:".gif", data:"data:image/gif;base64,"}];

const saveImageFromBase64 = (imageBase64Data, pathPrefix, fileName) => {
    try {
        let fmtInfo = null;
        for(let i in _supportFormat) {
            if(imageBase64Data.startsWith(_supportFormat[i].data)) {
                fmtInfo = _supportFormat[i];
                break;
            }
        }
        if(!fmtInfo) {
            //respError(res, "LOGO_IMAGE_FMT_ERROR");
            console.log("saveImageFromBase64 LOGO_IMAGE_FMT_ERROR")
            return "";
        }

        const dataStr = imageBase64Data.split(fmtInfo.data)[1];
        if(atob(dataStr).length > 100000) {
            console.log("saveImageFromBase64 ImageSize Error");
            return "";
        }

        const buffer = Buffer.from(dataStr, 'base64');
        fs.writeFileSync(process.env.RES_PATH + pathPrefix + fileName + fmtInfo.format, buffer);
        return fileName + fmtInfo.format;
    } catch (e) {
        console.error(e);
        return "";
    }
}

module.exports = {saveImageFromBase64}