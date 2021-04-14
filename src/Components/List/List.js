import React from 'react'
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import ListEntry from '../ListEntry/ListEntry'
import box_unchecked_icon from './../../Assets/Icons/box_unchecked.svg'
// import searchIcon from './../../Assets/Icons/search.svg'
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
        // this.handleQueries = this.handleQueries.bind(this)
    }

    componentDidMount() {
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

    getList = async() => {
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

    compareDate(order1, order2) {
        const date1 = new Date(order1.created_at)
        const date2 = new Date(order2.created_at)

        if (date1 < date2){
            return -1;
        }

        if ( date1 > date2 ){
            return 1;
        }
        return 0;
    }

    compareId(order1, order2) {
        const id1 = order1.id
        const id2 = order2.id

        if (id1 < id2){
            return -1;
        }

        if ( id1 > id2 ){
            return 1;
        }
        return 0;
    }

    handleSearch(e) {
        this.setState({
            searchQuery: e.target.value,
            currentPage: 1,
        })
        // this.handleQueries()
    }

    handleSort(e) {
        this.setState({
            sortQuery: e.target.value,
            currentPage: 1,
        })
        // this.handleQueries()
    }

    handleFilter(e) {
        this.setState({
            filterQuery: e.target.value,
            currentPage: 1,
        })
        // this.handleQueries()
    }

    handleQueries() {
        let displayedList = { orders: this.state.retrievedList.orders }

        if (this.state.searchQuery !== "") {
            displayedList.orders = []
            const searchQuery = this.state.searchQuery.toLowerCase()
            this.state.retrievedList.orders.forEach(entry => {
                const name = (entry.customer.fname + " " + entry.customer.lname).toLowerCase()
                if (name.includes(searchQuery))
                    displayedList.orders.push(entry)
            });
        }

        if (this.state.filterQuery !== "") {
            let filteredList = { orders: [] }
            displayedList.orders.forEach(entry => {
                if (entry.status === this.state.filterQuery)
                    filteredList.orders.push(entry)
            });
            displayedList.orders = filteredList.orders
        }

        if (this.state.sortQuery !== "") {
            if (this.state.sortQuery === "id") {
                displayedList.orders.sort(this.compareId)
            }
            else if (this.state.sortQuery === "date_newest") {
                displayedList.orders.sort(this.compareDate)
                displayedList.orders.reverse()
            }
            else if (this.state.sortQuery === "date_oldest") {
                displayedList.orders.sort(this.compareDate)
            }
        }

        // this.setState({ displayedList })
        return displayedList
    }

    previousPage() {
        this.setState({ currentPage: this.state.currentPage - 1 })
    }

    nextPage() {
        this.setState({ currentPage: this.state.currentPage + 1 })
    }

    paginatedOrders(orders) {
        let pageOrders = []
        let i = 0
        const page = this.state.currentPage
        const maxPage = Math.ceil(orders.length / 8)
        let lastIndex = page * 8

        // console.log(maxPage);

        if (page === maxPage) {
            lastIndex = orders.length
        }

        while (((page * 8) - 8 + i) < lastIndex) {
            const index = (page * 8) - 8 + i
            pageOrders.push(orders[index])
            i += 1
        }

        return pageOrders
    }
    
    render() {
        let entryElements = undefined
        let leftButton = <button className="pagination-btn pagination-btn-disabled left-btn-disabled"></button>
        let rightButton = <button className="pagination-btn pagination-btn-disabled right-btn-disabled"></button>
        let maxPage = 1

        if (this.state.doneFetching !== undefined && this.state.doneFetching) {
            // this.handleQueries()
            const orders = this.handleQueries().orders
            const pageOrders = this.paginatedOrders(orders)
            // const orders = this.state.displayedList.orders
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

            maxPage = Math.ceil(orders.length / 8)

            if (this.state.currentPage > 1)
                leftButton = <button className="pagination-btn left-btn" onClick={this.previousPage}></button>
            if (this.state.currentPage < maxPage)
                rightButton = <button className="pagination-btn right-btn" onClick={this.nextPage}></button>
        }

        return (
            <div className="listContainer">
                <div className="search">
                    {/* <div data={searchIcon} className="searchIcon"></div> */}
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
                    {/* <button className="pagination-btn left-btn"></button> */}
                    {/* <button className="pagination-btn pagination-btn-disabled left-btn-disabled"></button> */}
                    {/* <button className="pagination-btn right-btn"></button> */}
                </div>
            </div>
        )
    }
}
