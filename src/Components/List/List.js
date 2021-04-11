import React from 'react'

export default class List extends React.Component {
    constructor() {
        super()
        this.state = {
            text: undefined
        }
        // this.getList = this.getList.bind(this)
    }

    componentDidMount() {
        this.setState({
            
        })
        this.getList()
    }

    getList = async() => {
        // const url = 'https://o53hpo7bf9.execute-api.us-west-2.amazonaws.com/dev/orders'
        // const APICall = await fetch(url, {
        //     mode: 'no-cors',
        //     method: 'GET',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         "Access-Control-Allow-Origin" : "*", 
        //         "Access-Control-Allow-Credentials" : true 
        //     }
        // });
        // const response = await APICall.json();
        // console.log(response);
        // if (response.items !== undefined && response.items.length > 0) {
        //     this.saveFetchedData(response.items);
        // } else {
        //     setTimeout(this.getGithubRepos(this.state.page), 5000);
        // }

        const myHeaders = {
            // 'Content-Type': 'application/json',
            "Access-Control-Allow-Origin" : "accept", 
            "Access-Control-Allow-Credentials" : true 
        }

        // fetch('https://o53hpo7bf9.execute-api.us-west-2.amazonaws.com/dev/orders', {
        //     // mode: 'no-cors',
        //     method: 'GET',
        //     format: 'json',
        //     headers: myHeaders
        // })
        const cors_anywhere = 'https://cors-anywhere.herokuapp.com/'
        const url = 'https://o53hpo7bf9.execute-api.us-west-2.amazonaws.com/dev/orders'
        fetch(cors_anywhere + url)
            .then(res => res.json())
            .then((results => {
                console.log(results)
            }))
    }
    
    render() {

        return (
            <div>{this.state.text}</div>
        )
    }
}
