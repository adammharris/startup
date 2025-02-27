
//import Card from 'react-bootstrap/Card'

export default function Comment({username, id, text}) {
    return (
        <div className="border-bottom py-2">
            <div className="d-flex justify-content-between align-items-center mb-1">
                <strong>{username}</strong>
                <small className="text-muted">#{id}</small>
            </div>
            <p className="mb-1 text-break">{text}</p>
        </div>
    )
}