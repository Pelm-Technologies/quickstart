import * as React from 'react';

import { Endpoints } from './Endpoints';

import { ConnectButton, Config } from 'react-pelm-connect';

type State = {
    error?: string;
    connectToken?: string;
    hasAccessToken: boolean;
};

export class App extends React.Component<{}, State> {
    constructor(props = { error: undefined }) {
        super(props);

        this.state = {
            error: props.error,
            connectToken: undefined,
            hasAccessToken: false,
            // hasAccessToken: true,
        };
    }

    componentDidMount(): void {
        this.generateConnectToken();
    }

    // Create a connect token using client credentials in order to initiate the Connect Flow.
    async generateConnectToken() {
        const response = await fetch('/connect-token', { method: 'POST' });
        const data = await response.json();
        if (response.ok) {
            this.setState({ connectToken: data['connect_token'] })
        } else {
            this.setState({
                error: `Error while creating connect_token: ${JSON.stringify(data)}`
            })
        }
    }

    // Use the authorizationCode to get an access_token.
    async generateAccessToken(authorizationCode: string) {
        const response = await fetch('/authorization', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ authorization_code: authorizationCode }),
        })
        const data = await response.json()
        if (response.ok) {
            this.setState({ hasAccessToken: true })
        } else {
            this.setState({
                error: `Error while creating access_token: ${JSON.stringify(data)}`
            })
        }
    }

    // This is the callback that is called when your User successfully connects their utility account.
    onSuccess = (authorizationCode: string) => {
        this.generateAccessToken(authorizationCode);
    };

    // This is the callback that is called when Connect is exited but the user has not successfully connected their utility account.
    onExit = (status: string, metadata: any) => {
        const log = `onExit called with arguments:
        {
            'status': ${status}
            'metadata': ${JSON.stringify(metadata)}
        }`;
        console.log(log);
    };

    render(): React.ReactNode {
        const error = this.state.error
            ? <div><br/>{this.state.error}</div>
            : null;

        // The config is used to specify your Connect Token and callbacks for the success and exit cases.
        const config: Config = {
            connectToken: this.state.connectToken!,
            onSuccess: this.onSuccess,
            onExit: this.onExit,
        };

        return this.state.hasAccessToken ? (
            <Endpoints error={this.state.error} />
        ) : (
            <>
                <h1>Pelm Connect React Demo</h1>
                <ConnectButton config={config} />
                {error}
            </>
        );
    }
}
