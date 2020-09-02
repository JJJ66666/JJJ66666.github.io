class Utils{
    queryString(o){
        let params = '';
        for (const key in o) {
            params += `${key}=${o[key]}&`;
        }
        return params.slice(0,-1);
    }
}

export const utils = new Utils();