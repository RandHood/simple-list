import React from 'react'
import box_unchecked_icon from './../../Assets/Icons/box_unchecked.svg'
import './ListEntry.css'

export default function ListEntry(props) {

    const status = props.status === 'confirmed' ? 'Confirmed' : props.status === 'pending_confirmation' ? 'Pending Confirmation' : 'Rejected'
    const style = status === 'Pending Confirmation' ? "entryPending" : "entry"

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    const createdAt = new Date(props.createdAt)
    const dateText = monthNames[createdAt.getMonth()] + " " + createdAt.getDate() + ", " + createdAt.getHours() + ":" + createdAt.getMinutes() + ", " + createdAt.getFullYear();

    return (
        <div className={style}>
            <div data={box_unchecked_icon} className="checkbox"></div>
            <span className="entryId">#{props.id}</span>
            <span className="entryName">{props.firstName + " " + props.lastName}</span>
            <span className="entryStatus">{status}</span>
            <span className="entrySupplier">{props.supplier}</span>
            <span className="entryDate">{dateText}</span>
        </div>
    )
}
