import * as React from 'react';

import { Endpoints } from './Endpoints';

import { ConnectButton, Config } from 'react-pelm-connect';

type State = {
    isLoading: boolean;
    error?: string;
    connectToken?: string;
    has_access_token: boolean;
};

export class App extends React.Component<{}, State> {
    constructor(props = { error: undefined }) {
        super(props);

        this.state = {
            isLoading: true,
            error: props.error,
            connectToken: undefined,
            has_access_token: false,
        };
    }

    componentDidMount(): void {
        this.generateConnectToken();
    }

    // Create a connect token using client credentials in order to initiate the Connect Flow.
    async generateConnectToken() {
        this.setState({ isLoading: true });

        await fetch('/connect-token', { method: 'POST' })
            .then(async (r) => {
                if (r.ok) {
                    return r.json();
                } else {
                    return r.text().then((t) => {
                        throw new Error(t);
                    });
                }
            })
            .then((d) => {
                this.setState({ isLoading: false });
                this.setState({ connectToken: d.connect_token });
            })
            .catch((e) => {
                this.setState({ error: e });
            });
    }

    // Use the authorizationCode to get an access_token.
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
                this.setState({ has_access_token: true });
            })
            .catch((e) => {
                this.setState({ error: e });
            });
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
        if (this.state.isLoading && !this.state.error) {
            return 'Loading';
        }

        if (this.state.error) {
            return `${this.state.error}`;
        }

        // The config is used to specify your Connect Token and callbacks for the success and exit cases.
        const config: Config = {
            connectToken: this.state.connectToken!,
            onSuccess: this.onSuccess,
            onExit: this.onExit,
        };

        return this.state.has_access_token ? <Endpoints error={this.state.error} /> : <ConnectButton config={config} />;
    }
}
