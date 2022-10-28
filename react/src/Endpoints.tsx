import * as React from 'react';
import styled from 'styled-components';

type Props = {
    error: string | undefined;
};

type State = {
    accountsResponse?: string;
    intervalsResponse?: any;
    billsResponse?: any;
    intervalsAccountIdInput: string;
    intervalsStartDate: string;
    intervalsEndDate: string;
    intervalsType: string;
    billsAccountIdInput: string;
};

const Outer = styled.div`
    display: flex;
    justify-content: center;
`;

const Container = styled.div`
    width: 800px;
`;

export class Endpoints extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            accountsResponse: undefined,
            intervalsResponse: undefined,
            billsResponse: undefined,
            intervalsAccountIdInput: '',
            intervalsStartDate: '',
            intervalsEndDate: '',
            intervalsType: 'ELECTRIC',
            billsAccountIdInput: '',
        };
    }

    // Fetch Accounts from server
    fetchAccounts = async () => {
        const response = await fetch('/accounts', { method: 'POST' })
        const data = await response.json()
        this.setState({ accountsResponse: JSON.stringify(data, null, 2) })
    };

    // Fetch Intervals from server
    fetchIntervals = async () => {
        const response = await fetch('/intervals', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                intervalsAccountIdInput: this.state.intervalsAccountIdInput,
                intervalsType: this.state.intervalsType,
                intervalsStartDate: this.state.intervalsStartDate,
                intervalsEndDate: this.state.intervalsEndDate,
            }),
        })
        const data = await response.json()
        this.setState({ intervalsResponse: JSON.stringify(data, null, 2) })
    };

    // Fetch Bills from server
    fetchBills = async () => {
        const response = await fetch('/bills', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                billsAccountIdInput: this.state.billsAccountIdInput,
            }),
        })
        const data = await response.json()
        this.setState({ billsResponse: JSON.stringify(data, null, 2) })
    };

    // - - - - - - - - - - - - Rendering Logic - - - - - - - - - - - -

    // Accounts
    renderAccountsEndpoint() {
        const clearAccountsData = () => {
            this.setState({ accountsResponse: undefined });
        };
        return (
            <div>
                <div>
                    Click "Submit" to make a request to <code><a href='https://pelm.com/docs/api-reference/accounts/get-accounts' target='_blank'>GET /accounts</a></code>
                </div>
                <button onClick={this.fetchAccounts}>Submit</button>
                {this.state.accountsResponse && <button onClick={clearAccountsData}>Clear Data</button>}
                {this.maybeRenderAccountsResponse()}
            </div>
        );
    }

    maybeRenderAccountsResponse() {
        if (this.state.accountsResponse === undefined) {
            return null;
        }
        return (
            <div>
                This is the response:
                <div style={{border: '1px solid black', maxHeight: "500px", overflowY: 'scroll' }}>
                    <pre>{this.state.accountsResponse}</pre>
                </div>
            </div>
        );
    }

    // Intervals
    renderIntervalsEndpoints() {
        return (
            <div>
                <div>
                Click "Submit" to make a request to <code><a href='https://pelm.com/docs/api-reference/usage/get-usage-intervals' target='_blank'>GET /intervals</a></code>
                </div>
                <input
                    id="accountId"
                    name="accoundId"
                    type="text"
                    value={this.state.intervalsAccountIdInput}
                    onChange={this.onIntervalsInputChange}
                    placeholder="Enter Account Id"
                />
                <input
                    id="startDate"
                    name="startDate"
                    type="text"
                    value={this.state.intervalsStartDate}
                    onChange={this.onIntervalsStartDateChange}
                    placeholder="Enter Start Date"
                />
                <input
                    id="endDate"
                    name="endDate"
                    type="text"
                    value={this.state.intervalsEndDate}
                    onChange={this.onIntervalsEndDateChange}
                    placeholder="Enter End Date"
                />
                <select onChange={this.onIntervalsTypeChange}>
                    <option value="ELECTRIC">ELECTRIC</option>
                    <option value="GAS">GAS</option>
                </select>
                <button onClick={this.fetchIntervals}>Submit</button>
                {this.maybeRenderIntervalsResponse()}
            </div>
        );
    }

    onIntervalsInputChange = (event: { target: any }) => {
        const target = event.target;
        const value = target.value;

        this.setState({
            intervalsAccountIdInput: value,
        });
    };

    onIntervalsStartDateChange = (event: { target: any }) => {
        const target = event.target;
        const value = target.value;

        this.setState({
            intervalsStartDate: value,
        });
    };

    onIntervalsEndDateChange = (event: { target: any }) => {
        const target = event.target;
        const value = target.value;

        this.setState({
            intervalsEndDate: value,
        });
    };

    onIntervalsTypeChange = (event: { target: any }) => {
        const target = event.target;
        const value = target.value;

        this.setState({
            intervalsType: value,
        });
    };

    maybeRenderIntervalsResponse() {
        if (this.state.intervalsResponse === undefined) {
            return null;
        }

        const clearIntervalsData = () => {
            this.setState({ intervalsResponse: undefined });
        };

        return (
            <>
                <button onClick={clearIntervalsData}>Clear</button>
                <div>
                    This is the response:
                    <div style={{ border: '1px solid black', maxHeight: "500px", overflowY: 'scroll'  }}>
                        <pre>{this.state.intervalsResponse}</pre>
                    </div>
                </div>
            </>
        );
    }

    // Bills
    renderAccountBillsEndpoint() {
        return (
            <div>
                <div>
                Click "Submit" to make a request to <code><a href='https://docs.pelm.com/reference/get_bills' target='_blank'>GET /bills</a></code>
                </div>
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
        );
    }

    onBillsInputChange = (event: { target: any }) => {
        const target = event.target;
        const value = target.value;

        this.setState({
            billsAccountIdInput: value,
        });
    };

    maybeRenderAccountBillsResponse() {
        if (this.state.billsResponse === undefined) {
            return null;
        }

        const clearBillsData = () => {
            this.setState({ billsResponse: undefined });
        };

        return (
            <>
                <button onClick={clearBillsData}>Clear</button>
                <div>
                    This is the response:
                    <div style={{ border: '1px solid black', maxHeight: "500px", overflowY: 'scroll' }}>
                        <pre>{this.state.billsResponse}</pre>
                    </div>
                </div>
            </>
        );
    }

    render() {
        return (
            <Outer>
                <Container>
                    <br />
                    {this.renderAccountsEndpoint()}
                    <br />
                    <br />
                    {this.renderIntervalsEndpoints()}
                    <br />
                    <br />
                    {this.renderAccountBillsEndpoint()}
                    <br />
                    <div style={{ marginTop: "20px" }}>
                        <span>
                            View our other endpoints at our <a href="https://pelm.com/docs/api-reference/overview" target={'_blank'}>Docs</a>
                        </span>
                    </div>
                </Container>
            </Outer>
        );
    }
}
