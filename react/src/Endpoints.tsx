import * as React from 'react';
import styled from 'styled-components';

type Props = {
    error: string | undefined;
};

type State = {
    accountsData?: string;
    intervalData?: any;
    billsData?: any;
    intervalsAccountIdInput: string;
    intervalsStartDate: string;
    intervalsEndDate: string;
    intervalsType: string;
    billsAccountIdInput: string;
    billIdInput: string;
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
            accountsData: undefined,
            intervalData: undefined,
            billsData: undefined,
            intervalsAccountIdInput: '',
            intervalsStartDate: '',
            intervalsEndDate: '',
            intervalsType: 'ELECTRIC',
            billsAccountIdInput: '',
            billIdInput: '',
        };
    }

    // Sending request to our backned at the accounts endpoint
    fetchAccounts = () => {
        fetch('/accounts', { method: 'POST' })
            .then((r) => r.json())
            .then((data) => {
                this.setState({ accountsData: JSON.stringify(data, null, 2) });
            });
    };

    // Sending request to our backned at the intervals endpoint
    fetchIntervals = () => {
        fetch('/intervals', {
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
            .then((r) => r.json())
            .then((d) => {
                this.setState({ intervalData: d });
            });
    };

    // Sending request to our backned at the bills endpoint
    fetchBills = () => {
        fetch('/bills', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                billsAccountIdInput: this.state.billsAccountIdInput,
            }),
        })
            .then((r) => r.json())
            .then((d) => {
                this.setState({ billsData: d });
            });
    };

    // - - - - - - - - - - - - Front-End Rendering Logic - - - - - - - - - - - -

    maybeRenderAccountsResponse() {
        if (this.state.accountsData === undefined) {
            return null;
        }

        const data = this.state.accountsData;

        return (
            <div>
                This is the response:
                <div>
                    <pre>{data}</pre>
                </div>
            </div>
        );
    }

    renderAccountsEndpoint() {
        const clearAcountsData = () => {
            this.setState({ accountsData: undefined });
        };
        return (
            <div>
                <div>
                    Click this button to make a GET request to <code>/accounts</code>
                </div>
                <button onClick={this.fetchAccounts}>Submit</button>
                {this.state.accountsData && <button onClick={clearAcountsData}>Clear Data</button>}
                {this.maybeRenderAccountsResponse()}
            </div>
        );
    }

    maybeRenderIntervalsResponse() {
        if (this.state.intervalData === undefined) {
            return null;
        }

        const clearIntervalData = () => {
            this.setState({ intervalData: undefined });
        };

        return (
            <>
                <button onClick={clearIntervalData}>Clear</button>
                <div>
                    This is the response:
                    <div>
                        <pre>{JSON.stringify(this.state.intervalData, null, 2)}</pre>
                    </div>
                </div>
            </>
        );
    }

    maybeRenderAccountBillsResponse() {
        if (this.state.billsData === undefined) {
            return null;
        }

        const clearBillsData = () => {
            this.setState({ billsData: undefined });
        };

        return (
            <>
                <button onClick={clearBillsData}>Clear</button>
                <div>
                    This is the response:
                    <div>
                        <pre>{JSON.stringify(this.state.billsData, null, 2)}</pre>
                    </div>
                </div>
            </>
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

    renderIntervalsEndpoints() {
        return (
            <div>
                <div>
                    Click this button to make a GET request to <code>/intervals</code>
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

    onBillsInputChange = (event: { target: any }) => {
        const target = event.target;
        const value = target.value;

        this.setState({
            billsAccountIdInput: value,
        });
    };

    renderAccountBillsEndpoint() {
        return (
            <div>
                <div>
                    Click this button to make a GET request to <code>/accounts/:account_id/bills</code>
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

    onBillIdInputChange = (event: { target: any }) => {
        const target = event.target;
        const value = target.value;

        this.setState({
            billIdInput: value,
        });
    };

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
                </Container>
            </Outer>
        );
    }
}
