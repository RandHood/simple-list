import React from 'react'
import box_unchecked_icon from './../../Assets/Icons/box_unchecked.svg'
import './ListEntry.css'

export default function ListEntry(props) {
    const status = props.status === 'confirmed' ? 'Confirmed' : props.status === 'pending_confirmation' ? 'Pending Confirmation' : 'Rejected'
    const style = status === 'Pending Confirmation' ? "entryPending" : "entry"

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    const created_at = new Date(props.created_at)
    const dateText = monthNames[created_at.getMonth()] + " " + created_at.getDate() + ", " + created_at.getHours() + ":" + created_at.getMinutes() + ", " + created_at.getFullYear();

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
