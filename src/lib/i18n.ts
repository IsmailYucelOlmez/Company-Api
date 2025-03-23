const i18n = require("../config/i18n");

class I18n {
    private lang:string

	constructor(lang:string) {
    this.lang = lang;
	}

	translate(text:string, lang = this.lang, params = []) {

    let arr = text.split("."); // COMMON.VALIDATION_ERROR_TITLE => ['COMMON','VALIDATION_ERROR_TITLE']

    let val = i18n[lang][arr[0]]; // i18n["EN"]["COMMON"];

    for (let i = 1; i < arr.length; i++) {
        val = val[arr[i]]; // i=1 için; va["VALIDATION_ERROR_TITLE"]
    }

    val = val + "";
    // kullanım amacı config dosyasındaki default metni değiştirmemektir.
    //artık farklı bir bellek alanında bulunduğu için config'de bulunan metni etkilemez.
    
    for (let i = 0; i < params.length; i++) {
        val = val.replace("{}", params[i]);
    }

    return val || "";
	}
	}
	
	module.exports = I18n;