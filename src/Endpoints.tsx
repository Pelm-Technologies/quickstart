import * as React from "react";
import styled from 'styled-components';

import {CLIENT_ID, CLIENT_SECRET, USER_ID, ENVIRONMENT} from './constants'

type Props = {
    accessToken: string;
}

type State = {
    accountsData?: string;
    intervalData?: any;
    billsData?: any;
    billDetailsData?: any;
    intervalsAccountIdInput: string;
    billsAccountIdInput: string;
    billIdInput: string;
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
            accountsData: undefined,
            intervalData: undefined,
            billDetailsData: undefined,
            billsData: undefined,
            intervalsAccountIdInput: "",
            billsAccountIdInput: "",
            billIdInput: "",
        }
    }

    fetchAccounts = () => {
        const accessToken = this.props.accessToken
        const headers = new Headers();
        headers.set('Environment', ENVIRONMENT);
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
                console.log(data);
                this.setState({
                    accountsData: JSON.stringify(data, null, 2)
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
        headers.set('Environment', ENVIRONMENT);
        headers.set('Authorization', 'Bearer ' + accessToken);
        headers.set('client_id', CLIENT_ID);
        headers.set('client_secret', CLIENT_SECRET);

        const requestOptions = {
            method: 'GET',
            headers
        };

        const url = 'https://api.pelm.com/accounts/' + this.state.intervalsAccountIdInput + '/intervals'

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

    fetchBills = () => {
        this.setState({
            billsData: undefined
        })

        const accessToken = this.props.accessToken
        const headers = new Headers();
        headers.set('Environment', ENVIRONMENT);
        headers.set('Authorization', 'Bearer ' + accessToken);
        headers.set('client_id', CLIENT_ID);
        headers.set('client_secret', CLIENT_SECRET);

        const requestOptions = {
            method: 'GET',
            headers
        };

        const url = 'https://api.pelm.com/accounts/' + this.state.billsAccountIdInput + '/bills'

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
                    billsData: data
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

    fetchBillDetails = () => {
        this.setState({
            billDetailsData: undefined
        })

        const accessToken = this.props.accessToken
        const headers = new Headers();
        headers.set('Environment', ENVIRONMENT);
        headers.set('Authorization', 'Bearer ' + accessToken);
        headers.set('client_id', CLIENT_ID);
        headers.set('client_secret', CLIENT_SECRET);

        const requestOptions = {
            method: 'GET',
            headers
        };

        const url = 'https://api.pelm.com/bills/' + this.state.billIdInput

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
                    billDetailsData: data
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
        if (this.state.accountsData === undefined) {
            return null;
        }

        const data = this.state.accountsData

        return (
            <div>
                This is the response:
                <div>
                    <pre>
                        {data}
                    </pre>
                </div>
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

    maybeRenderAccountBillsResponse() {
        if (this.state.billsData === undefined) {
            return null;
        }

        const data = this.state.billsData

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

    maybeRenderBillDetailsResponse() {
        if (this.state.billDetailsData === undefined) {
            return null;
        }

        const data = this.state.billDetailsData

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

    onIntervalsInputChange = (event: { target: any; }) => {
        const target = event.target;
        const value = target.value;

        this.setState({
            intervalsAccountIdInput: value
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
                    value={this.state.intervalsAccountIdInput}
                    onChange={this.onIntervalsInputChange}
                    placeholder="Enter Account Id"
                />
                <button onClick={this.fetchIntervals}>Submit</button>
                {this.maybeRenderIntervalsResponse()}
            </div>
        )
    }

    onBillsInputChange = (event: { target: any; }) => {
        const target = event.target;
        const value = target.value;

        this.setState({
            billsAccountIdInput: value
        })
    }

    renderAccountBillsEndpoint() {
        return (
            <div>
                <div>Click this button to make a GET request to <code>/accounts/:account_id/bills</code></div>
                <input
                    id="accountId"
                    name="accoundId"
                    type="text"
                    value={this.state.billsAccountIdInput}
                    onChange={this.onBillsInputChange}
                    placeholder="Enter Account Id"
                />
                <button onClick={this.fetchBills}>Submit</button>
                {this.maybeRenderAccountBillsResponse()}
            </div>
        )
    }

    onBillIdInputChange = (event: { target: any; }) => {
        const target = event.target;
        const value = target.value;

        this.setState({
            billIdInput: value
        })
    }

    renderBillDetailsEndpoint() {
        return (
            <div>
                <div>Click this button to make a GET request to <code>/bills/:bill_id</code></div>
                <input
                    id="billId"
                    name="billId"
                    type="text"
                    value={this.state.billIdInput}
                    onChange={this.onBillIdInputChange}
                    placeholder="Enter Bill Id"
                />
                <button onClick={this.fetchBillDetails}>Submit</button>
                {this.maybeRenderBillDetailsResponse()}
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
                    <br/>
                    <br/>
                    {this.renderAccountBillsEndpoint()}
                    <br/>
                    <br/>
                    {this.renderBillDetailsEndpoint()}
                </Container>
            </Outer>
        )
    }

}
