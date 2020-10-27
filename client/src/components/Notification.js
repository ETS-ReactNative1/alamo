import React from 'react';
import io from 'socket.io-client';

class Notification extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            show: false,
            notification: null
        }
    }

    componentWillMount() {

        const socket = io.connect('http://localhost:8080')

        socket.on('new-user-online', (userId) => {
            setTimeout(() => {
                if (userId != this.props.userId) {
                    let message = userId + ' is now online';
                    this.setState({notification: message, show: true})

                    setTimeout(() => {
                        this.setState({notifcation: null, show: false})
                    }, 3000)

                } else {
                    this.setState({notification: null})
                }

            }, 500)
        })
        
    }

    render() {
        return(
            <div className={(this.state.show) ? "toast show" : "toast"} role="alert" aria-live="assertive" aria-atomic="true">
                <div className="toast-header">
                    <strong className="mr-auto">Bootstrap</strong>
                    <small className="text-muted">11 mins ago</small>
                    <button type="button" className="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                    <div className="toast-body">
                        {this.state.notification}
                    </div>
            </div>
        )
    }
}

export default Notification;
