import decode from 'jwt-decode';

export default class Auth {
    
    constructor() {
        this.login = this.login.bind(this)
        this.loggedIn = this.loggedIn.bind(this)
        this.getToken = this.getToken.bind(this)
    
       
    
    }
    login(username,password,p){
        {
           
            fetch('http://localhost:8000/api/token/', {
                method: 'post',
                headers: new Headers({'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                }),
                body: "username="+username+"&password="+password
            }).then(response => 
                response.json().then(data => ({
                    data: data,
                    status: response.status
                })
            ).then(res => {
                this.setToken(res.data.access)
                this.checkStatus(res.status,p)
                
            }));
        }
    }
    checkStatus(e,p) {
        if(e >= 200 && e < 300){
           p.push('/home')

        }
        else{
            alert("Invaild Username or Password!!")
        }
    }
    loggedIn(h) {
        const token = localStorage.getItem('token')
        if(token !== null){
        return !!token && !this.isTokenExpired(token)}
        else {
                h.push('/')
        }

    }
    isTokenExpired(token) {
        try {
            const decoded = decode(token);
            if(decoded.exp < Date.now()/1000){
                
            }
            else 
                return false;
                
        }
        catch (err){
            return false;
        }
    }
    setToken(idToken) {
        localStorage.setItem('token',idToken)
    }
    getToken() {
        localStorage.getItem('token')
        
    }
    logout() {
        localStorage.removeItem('token');
    }
    getProfile() {
        return decode(localStorage.getItem('token'));
    }
    fetch(url, options) {
        // performs api calls sending the required authentication headers
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }

        // Setting Authorization header
        // Authorization: Bearer xxxxxxx.xxxxxxxx.xxxxxx
        if (this.loggedIn()) {
            headers['Authorization'] = 'Bearer ' + this.getToken()
        }

        return fetch(url, {
            headers,
            ...options
        })
            .then(this._checkStatus)
            .then(response => response.json())
    }
    
    
}