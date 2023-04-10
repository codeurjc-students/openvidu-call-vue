import axios from 'axios';
import './axiosInterceptor';

const APPLICATION_SERVER_URL = "http://localhost:5000/";

export default class SessionService {

    constructor() {}

    async getTokens(sessionId, nickname) {
        let config = JSON.stringify({
            headers: {
                "Content-Type": "application/json"
            }
        });

        const response = await axios.post(APPLICATION_SERVER_URL + 'sessions', 
            { sessionId: sessionId, nickname: nickname}, 
            config);

        return response.data; 
    }
}