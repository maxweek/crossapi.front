import axios from "axios";
import { deleteCookie, getCookie, setCookie } from "./helper";
import AppStore from "./store/store";
// import NotifStore from "./store/_notifStore";
// import crypto from 'crypto'

export const _SITE_URL = import.meta.env.VITE_API_URL;
export const _IS_DEV = import.meta.env.VITE_DEV === 'true';
// console.log(_SITE_URL)
// debugger

const API = axios.create({
    baseURL: _SITE_URL,
})

if (getCookie('access')) {
    API.defaults.headers.common['Authorization'] = `Bearer ${getCookie('access')}`;
}

interface IRequestPayload {
    data: {

    }
}

interface ISetRequest {
    type: 'GET' | 'POST',
    url: string,
    data?: any,
    success: (res: any) => any,
    error?: (err: any) => any,
}
interface ISetRequestList {
    requests: ISetRequest[]
    successList: () => void,
    errorList?: () => void,
}

export const apiRequest = (props: ISetRequest) => {
    if (props.type === 'GET') {
        API.get(props.url).then(props.success).catch(props.error)
    }
    if (props.type === 'POST') {
        API.post(props.url, props.data).then(props.success).catch(props.error)
    }
}

export const setRequestList = (props: ISetRequestList) => {
    let i = 0
    let max = props.requests.length
    props.requests.map(request => {
        var oldSuccess = request.success
        var oldError = request.error
        function newSuccess(payload: any) {
            oldSuccess(payload)
            i++;
            checkRequests()
        }
        function newError(err: any) {
            if (typeof oldError === 'function' && typeof props.errorList === 'function') {
                oldError(err)
                props.errorList()
            }
        }
        request.success = newSuccess
        request.error = newError

        setRequest(request)
    })


    function checkRequests() {
        if (i === max) {
            props.successList()
        }
    }
}
export const setRequest = (props: ISetRequest) => {
    if (props.type === 'GET') {
        API.get(props.url).then(handleRequest).catch(handleCatch)
    }
    if (props.type === 'POST') {
        API.post(props.url, { ...props.data, __timeZoneOffset__: new Date().getTimezoneOffset() }).then(handleRequest).catch(handleCatch)
    }

    function handleRequest(res: any) {
        console.log(`🟢 ${props.type} | ${props.url} \n`, res);
        if (res.data.status === 'success') {
            props.success(res.data.payload)
        }
        if (res.data.status === 'error') {
            // NotifStore.setWarning('Ошибка запроса', res.data.message)
            if (typeof props.error === 'function') {
                props.error(res.data.error)
            }
        }
        // if (res.data.status === 'expired') {
        //     const data = {
        //         refresh_token: getCookie('refresh'),
        //     }
        //     getToken(data, () => {
        //         setRequest(props)
        //     });
        // }
        // if (res.data.status === 'expired_refresh') {
        //     logOut()
        //     // NotifStore.addItem({
        //     //     title: 'Ошибка проверки токена',
        //     //     text: `Логинься заново`,
        //     //     type: 'warning'
        //     // })
        //     if (typeof props.error === 'function') {
        //         props.error(res.data.payload)
        //     }
        // }
    }

    function handleCatch(err: any) {
        console.error(props.type, props.url, err)
        // NotifStore.addItem({
        //     title: 'Ошибка запроса',
        //     text: `${props.type} ${props.url}`,
        //     type: 'warning'
        // })
        if (typeof props.error === 'function') {
            props.error(err)
        }
    }
}

export const getToken = (data: any, success: () => void, error?: (err: any) => void) => {
    console.log("GET TOKEN")
    setRequest({
        type: 'POST',
        url: "/token/",
        data: data,
        success: (payload) => {
            const refresh = payload['refresh_token']
            const access = payload['access_token']
            if (refresh && access) {
                setToken(access, refresh)
                success();
            } else {
                logOut()
            }
        },
        error: (err) => {
            logOut()
            if (typeof error === 'function') {
                error(err)
            }
        }
    })
}

export const checkToken = (cb: () => void, cbSuccess: () => void, cbErr: () => void) => {
    if (!getCookie('access') || !getCookie('refresh')) {
        cb()
        logOut()
        cbErr()
        return;
    }
    setRequest({
        type: 'GET',
        url: '/check/',
        success: () => {
            logIn();
            cb()
            cbSuccess()
        },
        error: () => {
            cb()
            cbErr()
            logOut()
        }
    })
}

export const logOut = () => {
    deleteCookie('access')
    deleteCookie('refresh')
    AppStore.setLogged(false)
}
export const logIn = () => {
    console.log('loggedIn')
    AppStore.setLogged(true)
}

export const setToken = (access: string, refresh: string) => {
    // console.log('token', token)
    setCookie('access', access)
    setCookie('refresh', refresh)
    API.defaults.headers.common['Authorization'] = `Bearer ${access}`;
    // @ts-ignore
    // let salt: string = 'c0b288b9d3aa1cc3ee5fb1ecac0e638d1e95ed18f7dd10eeeca36ed2527b3adf'
    // @ts-ignore
    // const encryptString = async (plainText, encryptionKey) => {
    //     const encoder = new TextEncoder();
    //     const data = encoder.encode(plainText);
    //     const keyBuffer = await crypto.subtle.importKey(
    //         'raw',
    //         encoder.encode(encryptionKey),
    //         { name: 'AES-CBC', length: 256 },
    //         false,
    //         ['encrypt']
    //     );

    //     const iv = crypto.getRandomValues(new Uint8Array(16)); // Initialization Vector (IV)
    //     const encryptedData = await crypto.subtle.encrypt({ name: 'AES-CBC', iv }, keyBuffer, data);

    //     // Convert the encrypted data and IV to a single Uint8Array
    //     const result = new Uint8Array(encryptedData.byteLength + iv.byteLength);
    //     result.set(new Uint8Array(encryptedData), 0);
    //     result.set(new Uint8Array(iv), encryptedData.byteLength);

    //     return result;
    // };
    // //@ts-ignore
    // const hashData = async (data) => {
    //     const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    //     const hashArray = Array.from(new Uint8Array(hashBuffer));
    //     const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
    //     return hashHex;
    // };

    // //@ts-ignore
    // const encryptData = async (plainText, encryptionKey) => {
    //     try {
    //         const result = await encryptString(plainText, encryptionKey);
    //         console.log('encryptData ', result);

    //     } catch (error) {
    //         console.error('Error while encrypting data:', error);
    //     }
    // };

    // //@ts-ignore
    // const hashDat = async (data) => {
    //     try {
    //         const result = await hashData(data);
    //         console.log('hashData ', result);
    //     } catch (error) {
    //         console.error('Error while hashing data:', error);
    //     }
    // };
    // console.log('test')
    // encryptData('test', salt)
}

export default API;