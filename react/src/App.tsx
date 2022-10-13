import * as React from 'react';

import { Endpoints } from './Endpoints';

import { ConnectButton, Config } from 'react-pelm-connect';

type State = {
    isLoading: boolean;
    error?: string;
    connectToken?: string;
    accessed: boolean;
};

export class App extends React.Component<{}, State> {
    constructor(props = {}) {
        super(props);

        this.state = {
            isLoading: true,
            error: undefined,
            connectToken: undefined,
            accessed: false,
        };
    }

    componentDidMount(): void {
        this.generateConnectToken();
    }

    // Create a connect token using client credentials in order to initiate the Connect Flow.
    generateConnectToken() {
        this.setState({ isLoading: true });

        fetch('/connect')
            .then((r) => r.json())
            .then((d) => {
                this.setState({ isLoading: false });
                this.setState({ connectToken: d.connectToken });
            });
    }

    // Use the authorizationCode to get an access_token and refresh_token.
    generateAccessToken(authorizationCode: string) {
        this.setState({ isLoading: true });

        fetch('/authorization', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ authorizationCode }),
        })
            .then((r) => r.json())
            .then((d) => {
                this.setState({ isLoading: false });
                this.setState({ accessed: true })
            })
    }

    // This is the callback that is called when your User successfully connects their utility account.
    onSuccess = (authorizationCode: string) => {
        this.generateAccessToken(authorizationCode);
    };

    // This is the callback that is called when Connect is exited but the user has not successfully connected their utility account.
    onExit = () => {
        console.log('exit');
    };

    render(): React.ReactNode {
        if (this.state.isLoading) {
            return 'Loading';
        }

        if (this.state.error) {
            return 'Error: ' + this.state.error;
        }

        // The config is used to specify your Connect Token and callbacks for the success and exit cases.
        const config: Config = {
            connectToken: this.state.connectToken!,
            onSuccess: this.onSuccess,
            onExit: this.onExit,
        };

        return this.state.accessed ? (
            <Endpoints accessed={this.state.accessed!} />
        ) : (
            <ConnectButton config={config} />
        );
    }
}
