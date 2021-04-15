import React from 'react'
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import ListEntry from '../ListEntry/ListEntry'
import box_unchecked_icon from './../../Assets/Icons/box_unchecked.svg'
import search_icon from './../../Assets/Icons/search.png'
import './List.css'

export default class List extends React.Component {
    constructor() {
        super()
        this.state = {
            retrievedList: undefined,
            displayedList: undefined,
            doneFetching: undefined,
            searchQuery: undefined,
            sortQuery: "",
            filterQuery: "",
            currentPage: undefined,
        }
        this.getList = this.getList.bind(this)
        this.handleSearch = this.handleSearch.bind(this)
        this.handleSort = this.handleSort.bind(this)
        this.handleFilter = this.handleFilter.bind(this)
        this.previousPage = this.previousPage.bind(this)
        this.nextPage = this.nextPage.bind(this)
    }

    componentDidMount() {
        // setting initial state
        this.setState({
            retrievedList: [],
            displayedList: [],
            doneFetching: false,
            searchQuery: "",
            sortQuery: "id",
            filterQuery: "",
            currentPage: 1,
        })
        this.getList()
    }

    // this function fetches the orders from the api provided and saves the data in the state
    getList = async() => {
        // since the api responds with missing headers we forward it to cors-anywhere to get those headers in the response
        const cors_anywhere = 'http://localhost:8080/'
        const url = 'https://o53hpo7bf9.execute-api.us-west-2.amazonaws.com/dev/orders'
        fetch(cors_anywhere + url)
            .then(res => res.json())
            .then((results => {
                this.setState({
                    retrievedList: results,
                    displayedList: results,
                    doneFetching: true,
                })
            }))
    }

    // comparing array objects based on order dates
    compareDate(order1, order2) {
        const date1 = new Date(order1.created_at)
        const date2 = new Date(order2.created_at)

        if (date1 < date2) {
            return -1;
        }

        if (date1 > date2) {
            return 1;
        }

        return 0;
    }

    // comparing array objects based on order id
    compareId(order1, order2) {
        const id1 = order1.id
        const id2 = order2.id

        if (id1 < id2) {
            return -1;
        }

        if (id1 > id2) {
            return 1;
        }

        return 0;
    }

    // saving the new search input in the state
    handleSearch(e) {
        this.setState({
            searchQuery: e.target.value,
            currentPage: 1,
        })
    }

    // saving the new sort input in the state
    handleSort(e) {
        this.setState({
            sortQuery: e.target.value,
            currentPage: 1,
        })
    }

    // saving the new filter input in the state
    handleFilter(e) {
        this.setState({
            filterQuery: e.target.value,
            currentPage: 1,
        })
    }

    // this function returns a list with the orders that satisfy the search, sort and filter inputs
    handleQueries() {
        let displayedList = { orders: this.state.retrievedList.orders }

        // handling the search query
        if (this.state.searchQuery !== "") {
            displayedList.orders = []
            // formatting the query to lower case
            const searchQuery = this.state.searchQuery.toLowerCase()
            this.state.retrievedList.orders.forEach(entry => {
                // fornmatting the customer name to lowercase
                const name = (entry.customer.fname + " " + entry.customer.lname).toLowerCase()
                if (name.includes(searchQuery))
                    displayedList.orders.push(entry)
            });
        }

        // handling the filter query
        if (this.state.filterQuery !== "") {
            let filteredList = { orders: [] }
            displayedList.orders.forEach(entry => {
                if (entry.status === this.state.filterQuery)
                    filteredList.orders.push(entry)
            });
            displayedList.orders = filteredList.orders
        }

        // handling the sort query
        if (this.state.sortQuery !== "") {
            if (this.state.sortQuery === "id") {
                displayedList.orders.sort(this.compareId)
            }
            else if (this.state.sortQuery === "date_newest") {
                displayedList.orders.sort(this.compareDate)
                // reversing the array since it returns from oldest to newest
                displayedList.orders.reverse()
            }
            else if (this.state.sortQuery === "date_oldest") {
                displayedList.orders.sort(this.compareDate)
            }
        }

        return displayedList
    }

    previousPage() {
        this.setState({ currentPage: this.state.currentPage - 1 })
    }

    nextPage() {
        this.setState({ currentPage: this.state.currentPage + 1 })
    }

    // this function takes an array of orders and return an array with maximum 8 orders based on the current page the user is viewing
    paginatedOrders(orders) {
        let pageOrders = []
        let i = 0
        const page = this.state.currentPage
        // calculating max page that a user can reach
        const maxPage = Math.ceil(orders.length / 8)
        
        // getting last index for the page, if the user is in the last page it has to be the last index in the orders array
        let lastIndex = page * 8
        if (page === maxPage) {
            lastIndex = orders.length
        }

        // ((page * 8) - 8 + i) will get the index within a certain page
        while (((page * 8) - 8 + i) < lastIndex) {
            const index = (page * 8) - 8 + i
            pageOrders.push(orders[index])
            i += 1
        }

        return pageOrders
    }
    
    render() {
        // setting initial HTML elements
        let entryElements = undefined
        let leftButton = <button className="pagination-btn pagination-btn-disabled left-btn-disabled"></button>
        let rightButton = <button className="pagination-btn pagination-btn-disabled right-btn-disabled"></button>
        let maxPage = 1

        if (this.state.doneFetching !== undefined && this.state.doneFetching) {
            // get the new orders based on the queries
            const orders = this.handleQueries().orders
            if (orders.length > 0) {
                // get the orders for the current page and map each one into a ListEntry
                const pageOrders = this.paginatedOrders(orders)
                entryElements = pageOrders.map((entry) =>
                    <ListEntry
                        created_at={entry.created_at}
                        email={entry.customer.email}
                        firstName={entry.customer.fname}
                        lastName={entry.customer.lname}
                        gender={entry.customer.gender}
                        id={entry.id}
                        status={entry.status}
                        supplier={entry.supplier}
                        total={entry.total}
                        // key={entry.id + entry.created_at}
                    />
                )
            }

            // calculating max page that a user can reach
            maxPage = Math.ceil(orders.length / 8)

            // setting previous and next buttons enabled if there are availabe pages
            if (this.state.currentPage > 1)
                leftButton = <button className="pagination-btn left-btn" onClick={this.previousPage}></button>
            if (this.state.currentPage < maxPage)
                rightButton = <button className="pagination-btn right-btn" onClick={this.nextPage}></button>
        }

        return (
            <div className="listContainer">
                <div className="search">
                    <img src={search_icon} className="searchIcon" alt=""/>
                    <input className="searchInput" placeholder="Search for a contact" onChange={this.handleSearch}></input>
                </div>
                <div className="listHeader">
                    <span className="requestsText">Requests</span>
                    <div className="queriesContainer">
                        <div className="filterContainer">
                            <span>Sort by &nbsp;&nbsp;</span>
                            <Select
                                className="select"
                                value={this.state.sortQuery}
                                onChange={this.handleSort}
                                displayEmpty
                            >
                                <MenuItem value="id">ID Number</MenuItem>
                                <MenuItem value="date_newest">Date: Newest</MenuItem>
                                <MenuItem value="date_oldest">Date: Oldest</MenuItem>
                            </Select>
                        </div>
                        <div className="filterContainer">
                            <span>Filter by &nbsp;&nbsp;</span>
                            <Select
                                className="select"
                                value={this.state.filterQuery}
                                onChange={this.handleFilter}
                                displayEmpty
                            >
                                <MenuItem value="">None</MenuItem>
                                <MenuItem value="confirmed">Confirmed</MenuItem>
                                <MenuItem value="pending_confirmation">Pending Confirmation</MenuItem>
                            </Select>
                        </div>
                    </div>
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
                <div className="pagination">
                    {leftButton}
                    {rightButton}
                </div>
            </div>
        )
    }
}
