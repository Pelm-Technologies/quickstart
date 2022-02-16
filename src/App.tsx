import * as React from "react";

import { Endpoints } from "./Endpoints";

import { ConnectButton, Config } from "react-pelm-connect";

import { CLIENT_ID, CLIENT_SECRET, USER_ID, ENVIRONMENT } from "./constants";


type State = {
    isLoading: boolean;
    error?: string;
    connectToken?: string;
    accessToken?: string;
}

export class App extends React.Component<{}, State> {

    constructor() {
        super({})

        this.state = {
            isLoading: true,
            error: undefined,
            connectToken: undefined,
            accessToken: undefined,
        }
    }

    componentDidMount(): void {
        this.generateConnectToken()
    }

    /*
        We're requeseting the connect_token here for simplicity.
        In an ideal world, you would make this request from your server and then pass the token to your client.
    */
    generateConnectToken() {
        this.setState({ isLoading: true })

        const headers = new Headers();
        headers.set('Environment', ENVIRONMENT);
        headers.set('client_id', CLIENT_ID);
        headers.set('client_secret', CLIENT_SECRET);

        const data = new FormData();
        data.append('user_id', USER_ID)

        const requestOptions = {
            method: 'POST',
            headers,
            body: data,
        };

        fetch('https://api.pelm.com/auth/connect-token', requestOptions)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    return response.text().then(text => { throw new Error(text) })
                }
            })
            .then((data) => {
                this.setState({
                    isLoading: false,
                    connectToken: data['connect_token']
                })
            })
            .catch((error: Error) => {
                try {
                    this.setState({
                        isLoading: false,
                        error: error.message
                    })
                    const errorObject = JSON.parse(error.message);
                    console.log(errorObject)
                } catch(e) {
                    console.log("an error occurred")
                }
            });
    }

    /*
        We're requeseting the access_token here for simplicity.
        In an ideal world, you would pass this authorizationCode to your server, which would then:
        1. use the authorizationCode to get an access_token and refresh_token
        2. save the access_token and refresh_token to your db
        3. use the access_token to make requests for a given user's energy data
    */
    generateAccessToken(authorizationCode: string) {
        this.setState({ isLoading: true })

        const headers = new Headers();

        headers.set('Environment', ENVIRONMENT);
        headers.set('client_id', CLIENT_ID);
        headers.set('client_secret', CLIENT_SECRET);

        const data = new FormData();
        data.append('grant_type', 'code')
        data.append('code', authorizationCode)

        const requestOptions = {
            method: 'POST',
            body: data,
            headers
        };

        fetch('https://api.pelm.com/auth/token', requestOptions)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    return response.text().then(text => { throw new Error(text) })
                }
            })
            .then((data) => {
                this.setState({
                    isLoading: false,
                    accessToken: data['access_token']
                })
            })
            .catch((error: Error) => {
                try {
                    this.setState({
                        isLoading: false,
                        error: error.message
                    })
                    const errorObject = JSON.parse(error.message);
                    console.log(errorObject)
                } catch(e) {
                    console.log("an error occurred")
                }
            });
    }

    onSuccess = (authorizationCode: string) => {
        this.generateAccessToken(authorizationCode)
    }

    onExit = () => {
        console.log("exit")
    }

    render(): React.ReactNode {
        if (this.state.isLoading) {
            return "Loading"
        }

        if (this.state.error) {
            return "Error: " + this.state.error
        }

        const config: Config = {
            connectToken: this.state.connectToken!,
            onSuccess: this.onSuccess,
            onExit: this.onExit,
            environment: ENVIRONMENT,
        }

        return this.state.accessToken
            ? <Endpoints accessToken={this.state.accessToken!} />
            : <ConnectButton config={config} />
    }
}