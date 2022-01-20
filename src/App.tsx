import * as React from "react";
import { useCallback } from "react";
import * as ReactModal from 'react-modal';

import { useConnect } from 'pelm-connect';

import Connect from './Connect'
import { Endpoints } from "./Endpoints";

import { Config } from "pelm-connect";

import { CLIENT_ID, CLIENT_SECRET, USER_ID } from "./constants";

// // TODO: fill in your client_id and client_secret here
// const CLIENT_ID = '1f1ae19e-78c6-11ec-b93c-d6e51c4bd11c'
// const CLIENT_SECRET = 'a354dacc68408452b0bf108bc30efb56559d125d0adaa5b650573320c541cdd2'

type Props = {

}

type State = {
    isLoading: boolean;
    connectToken?: string;
    isConnectSuccesful: boolean;
    accessToken?: string;
}

export class App extends React.Component<{}, State> {

    constructor() {
        super({})

        this.state = {
            isLoading: true,
            connectToken: undefined,
            // accessToken: undefined,
            accessToken: "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJhdXRoLXNlcnZlciIsImV4cCI6MTY0MjY0NDI4MC4xNjgxMDQ0LCJ1c2VyIjoiOCJ9.WaPVOlMO8lMA61MimQT5S620mbwIdwwgDhkQO01sJ8ldfnkK0UJ6hK4nYnNAkkBIR2nUwhrNyDVnXFZOu9owY3oLz2JD1LAQo1kl0T2K01hu15OYRUjOaPfUU7Q0w4FEHJP9W_-9rMlzejQgeqcIBXRKQvzbjvIoUANUBVd1XqLIx317rXrc_ewB9-mT8SMC3hg_-kidxroKTU58-bP7q7P2UX1FniaPE46Y6nT4PGiQI9uowY_c0BUr0Zjp9jco5kAWZpz21TQMu54ZQ8nDQv1cKYglF8Bjfu1sr7_kI0Th4Twa27RyYA50BVGgbdZZ1dGXy_mfQ5rAIa7OXrOoRQ",

            isConnectSuccesful: false,
        }
    }

    componentDidMount(): void {
        console.log("mounting app")

        this.generateConnectToken()
    }

    generateConnectToken() {
        this.setState({ isLoading: true })

        const headers = new Headers();
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
                console.log("response")
                console.log(response)
                if (response.ok) {
                    return response.json();
                } else {
                    console.log("error")
                    throw new Error('Something went wrong ...');
                }
            }, function (error) {
                console.log("poop")
                console.log(error.message)
            })
            .then(data => {
                console.log("data: ")
                console.log(data)
                this.setState({
                    isLoading: false,
                    connectToken: data['connect_token']
                })
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
        console.log("generating access token")

        this.setState({ isLoading: true })

        const headers = new Headers();
        headers.set('Authorization', 'Basic ' + btoa(CLIENT_ID + ":" + CLIENT_SECRET));

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
                console.log("success")
                console.log(data)

                this.setState({
                    isLoading: false,
                    accessToken: data['access_token']
                })
            })
            .catch((error: Error) => {
                console.log(error)
                console.log(error.name)
                console.log(error.message)

                try {
                    const errorObject = JSON.parse(error.message);
                    console.log(errorObject)

                } catch(e) {
                    console.log("other")
                }
            });
    }

    onSuccess = (authorizationCode: string) => {
        console.log("authorizationCode")
        console.log(authorizationCode)


        this.generateAccessToken(authorizationCode)

        // this.setState({
        //     isConnectSuccesful: true
        // })
    }

    onExit = () => {
        console.log("exit")
    }

    render(): React.ReactNode {
        console.log(this.state)

        if (this.state.isLoading) {
            return "Loading"
        }

        return this.state.accessToken
            ? <Endpoints accessToken={this.state.accessToken!} />
            : <Connect connectToken={this.state.connectToken!} onSuccess={this.onSuccess} onExit={this.onExit} />
    }

}