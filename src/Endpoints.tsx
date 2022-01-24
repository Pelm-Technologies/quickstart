import * as React from "react";
import styled from 'styled-components';

import {CLIENT_ID, CLIENT_SECRET, USER_ID} from './constants'

type Props = {
    accessToken: string;
}

type State = {
    accountIds?: string[];
    intervalData?: any;
    inputtedAccountId: string;
}

const Outer = styled.div`
    display: flex;
    justify-content: center;

`

const Container = styled.div`
    width: 800px;
`

export class Endpoints extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            accountIds: undefined,
            intervalData: undefined,
            inputtedAccountId: "",
        }
    }

    fetchAccounts = () => {
        const accessToken = this.props.accessToken
        const headers = new Headers();
        headers.set('Authorization', 'Bearer ' + accessToken);
        headers.set('client_id', CLIENT_ID);
        headers.set('client_secret', CLIENT_SECRET);

        const requestOptions = {
            method: 'GET',
            headers
        };

        const url = 'https://api.pelm.com/users/' + USER_ID + '/accounts'

        fetch(url, requestOptions)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    return response.text().then(text => { throw new Error(text) })
                }
            })
            .then((data) => {
                this.setState({
                    accountIds: data['account_ids']
                })
            })
            .catch((error: Error) => {
                try {
                    const errorObject = JSON.parse(error.message);
                    console.log(errorObject)

                } catch(e) {
                    console.log("an error occurred")
                }
            });
    }

    fetchIntervals = () => {
        this.setState({
            intervalData: undefined
        })

        const accessToken = this.props.accessToken
        const headers = new Headers();
        headers.set('Authorization', 'Bearer ' + accessToken);
        headers.set('client_id', CLIENT_ID);
        headers.set('client_secret', CLIENT_SECRET);

        const requestOptions = {
            method: 'GET',
            headers
        };

        const url = 'https://api.pelm.com/accounts/' + this.state.inputtedAccountId + '/intervals'

        fetch(url, requestOptions)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    return response.text().then(text => { throw new Error(text) })
                }
            })
            .then((data) => {
                this.setState({
                    intervalData: data
                })
            })
            .catch((error: Error) => {
                try {
                    const errorObject = JSON.parse(error.message);
                    console.log(errorObject)

                } catch(e) {
                    console.log("an error occurred")
                }
            });
    }

    maybeRenderAccountsResponse() {
        if (this.state.accountIds === undefined) {
            return null;
        }

        return (
            <div>
                This is the response:
                {this.state.accountIds}
            </div>
        )
    }

    renderAccountsEndpoint() {
        return (
            <div>
                <div>Click this button to make a GET request to <code>/users/:user_id/accounts</code></div>
                <button onClick={this.fetchAccounts}>Submit</button>
                {this.maybeRenderAccountsResponse()}
            </div>
        )
    }

    maybeRenderIntervalsResponse() {
        if (this.state.intervalData === undefined) {
            return null;
        }

        const data = this.state.intervalData

        return (
            <div>
                This is the response:
                <div>
                    <pre>
                        {JSON.stringify(data, null, 2)}
                    </pre>
                </div>
            </div>
        )
    }

    onAccountIdChange = (event: { target: any; }) => {
        const target = event.target;
        const value = target.value;

        this.setState({
            inputtedAccountId: value
        })
    }

    renderIntervalsEndpoints() {
        return (
            <div>
                <div>Click this button to make a GET request to <code>/accounts/:account_id/intervals</code></div>
                <input
                    id="accountId"
                    name="accoundId"
                    type="text"
                    value={this.state.inputtedAccountId}
                    onChange={this.onAccountIdChange}
                    placeholder="Enter Account Id"
                />
                <button onClick={this.fetchIntervals}>Submit</button>
                {this.maybeRenderIntervalsResponse()}
            </div>
        )
    }

    render() {
        return (
            <Outer>
                <Container>
                    <br/>
                    {this.renderAccountsEndpoint()}
                    <br/>
                    <br/>
                    {this.renderIntervalsEndpoints()}
                </Container>
            </Outer>
        )
    }

}
