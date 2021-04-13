import React from 'react'
import ListEntry from '../ListEntry/ListEntry'
import './List.css'

export default class List extends React.Component {
    constructor() {
        super()
        this.state = {
            retrievedList: undefined,
            doneFetching: undefined,
        }
        this.getList = this.getList.bind(this)
    }

    componentDidMount() {
        this.setState({
            retrievedList: [],
            doneFetching: false,
        })
        // this.getCorsAccess()
        // this.createProxy()
        this.getList()
    }

    getCorsAccess() {
        var cors_api_host = 'cors-anywhere.herokuapp.com';
        var cors_api_url = 'https://' + cors_api_host + '/';
        var slice = [].slice;
        var origin = window.location.protocol + '//' + window.location.host;
        var open = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function() {
            var args = slice.call(arguments);
            // eslint-disable-next-line
            var targetOrigin = /^https?:\/\/([^\/]+)/i.exec(args[1]);
            if (targetOrigin && targetOrigin[0].toLowerCase() !== origin &&
                targetOrigin[1] !== cors_api_host) {
                args[1] = cors_api_url + args[1];
            }
            return open.apply(this, args);
        };
    }

    getList = async() => {
        // const cors_anywhere = 'https://cors-anywhere.herokuapp.com/'
        const cors_anywhere = 'http://localhost:8080/'
        const url = 'https://o53hpo7bf9.execute-api.us-west-2.amazonaws.com/dev/orders'
        fetch(cors_anywhere + url)
            .then(res => res.json())
            .then((results => {
                this.setState({
                    retrievedList: results,
                    doneFetching: true,
                })
            }))
    }
    
    render() {
        let entryElements = undefined
        if (this.state.doneFetching !== undefined && this.state.doneFetching) {
            const orders = this.state.retrievedList.orders
            entryElements = orders.map((entry) =>
                <ListEntry
                    createdAt={entry.created_at}
                    email={entry.customer.email}
                    firstName={entry.customer.fname}
                    lastName={entry.customer.lname}
                    gender={entry.customer.gender}
                    id={entry.id}
                    status={entry.status}
                    supplier={entry.supplier}
                    total={entry.total}
                    key={entry.id}
                />
            )
        }

        return (
            <div className="listContainer">
                <div className="entry entryTitleContainer">
                    <span className="entryId entryTitle">ID number</span>
                    <span className="entryName entryTitle">Name </span>
                    <span className="entryStatus entryTitle">Status</span>
                    <span className="entrySupplier entryTitle">Supplier</span>
                    <span className="entryDate entryTitle">Date</span>
                </div>
                {entryElements}
            </div>
        )
    }
}
