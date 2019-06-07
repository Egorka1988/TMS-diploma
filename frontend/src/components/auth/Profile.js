import React, {Component} from 'react'
// import { signIn, editProfile } from '../../store/actions/authActions'
import { connect } from 'react-redux'
import { Redirect } from "react-router-dom";
import { spinner } from '../../utils';


  
class Profile extends Component {

    state = 

    handleSubmit = (e) => {
        e.preventDefault();  
             
        this.setState({isLoading: true})
        this.props.editProfile(this.state)
            .finally(() => this.setState({isLoading: false}));
    }

    render() {
        
        let { username, firstName, lastName, email, isLoading } = this.props
        
        if ( isLoading ) {
            return spinner()
        }
        return (
            <div className="container">
                <form onSubmit={this.handleSubmit} className="white">
                    <h5 className="grey-text text-darken-3">Profile</h5>
                    <div className="input-field">
                        <label htmlFor="username">Username</label>
                        <input type="text" id="username" value={username} />
                    </div>
                    <div className="input-field">
                        <label >First Name</label>
                        <input type="text" id="firstName" value={firstName}/>
                    </div>
                    <div className="input-field">
                        <label htmlFor="lastName">Last Name</label>
                        <input type="text" id="lastName" value={lastName} />
                    </div>
                    <div className="input-field">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" value={email}/>
                    </div>
                    <div className="file-field input-field">
                        <div className="btn">
                            <span>Upload your logo</span>
                            <input type="file" />
                        </div>
                        <div className="file-path-wrapper">
                            <input className="file-path validate" type="text" />
                        </div>
                    </div>
                    <div className="input-field">
                        <button className="btn pink lighten-1 z-depth-0">Accept</button>
                    </div>
                </form>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        firstName: state.firstName,
        lastName: state.lastName,
        username: state.username,
        email: state.email,
        rating: state.rating,
        totalgames: state.total,
        wins: state.wins,
        avatar: state.avatar
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        editProfile: (editinfo) => dispatch(editProfile(editinfo))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile)