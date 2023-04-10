import axios from 'axios';
import './axiosInterceptor';
import { BehaviorSubject, Observable } from 'rxjs';

const APPLICATION_SERVER_URL = "http://localhost:5000/";
const AUTH_DATA_NAME = "callAuthData";

export default class AuthService {
    isLoggedObs = undefined;
    loginError = false;
    logged = new BehaviorSubject(false);
    username = "";
    password = "";

    constructor() {
      this.isLoggedObs = this.logged.asObservable();
    }

    isLogged() {
      return this.logged.getValue();
    }

    getUsername() {
      return this.username;
    }
    getPassword() {
      return this.password;
    }

    getCredentialsFromStorage() {
      return localStorage.getItem(AUTH_DATA_NAME);
    }

    async loginUsingLocalStorageData() {
      try {
        const authData = this.getCredentialsFromStorage();
        if (authData) {
          const decodedDataArr = atob(authData)?.split(":");
          if (decodedDataArr?.length > 0) {
            this.username = decodedDataArr[0];
            this.password = decodedDataArr[1];
            await this.login(this.username, this.password);
          }
        }
      } catch (error) {
        this.loginError = true;
        this.logout();
      }
    }

    async login(username, password) {        
      try {
        await axios.post(APPLICATION_SERVER_URL + 'auth/login', 
          {username: username, password: password});
        const encodedAuthData = btoa(username + ":" + password);
        localStorage.setItem(AUTH_DATA_NAME, encodedAuthData); 

        this.username = username;
        this.password = password;
        this.loginError = false;
        this.logged.next(true);
        console.log('Loggin succeeded', username, password);
      } catch (error) {
        console.error('Error doing login ', error);
        this.loginError = true;
        this.logout();
      }
    }

    logout() {      
      this.username = '';
      this.password = '';
      this.logged.next(false);
      this.clearAuthData();
    }

    hadLoginError() {
      return this.loginError;
    }

    clearAuthData() {
      localStorage.removeItem(AUTH_DATA_NAME);
    }

}