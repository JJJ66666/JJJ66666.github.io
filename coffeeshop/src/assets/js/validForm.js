import Vue from 'vue'
import {Notify} from 'vant'

Vue.use(Notify)

class ValidForm{
    valid(o){
        for (const key in o) {
            if (!o[key].reg.test(o[key].value)) {
                Notify({
                    type:'warning',
                    message:o[key].errorMsg
                })
                return false;
            }
        }
        return true;
    }
}

export const validForm = new ValidForm();