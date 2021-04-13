import React from 'react'
import ListEntry from '../ListEntry/ListEntry'
import box_unchecked_icon from './../../Assets/Icons/box_unchecked.svg'
// import searchIcon from './../../Assets/Icons/search.svg'
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
        this.getList()
    }

    getList = async() => {
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
                    key={entry.id + entry.created_at}
                />
            )
        }

        return (
            <div className="listContainer">
                <div className="search">
                    {/* <div data={searchIcon} className="searchIcon"></div> */}
                    <input className="searchInput" type="text" placeholder="Search for a contact"></input>
                </div>
                <div className="listHeader">
                    <span className="requestsText">Requests</span>
                    <span className="requestsText">Sort</span>
                </div>
                <div className="entry entryTitleContainer">
                    <div data={box_unchecked_icon} className="checkbox"></div>
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
