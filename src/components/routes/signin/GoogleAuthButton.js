import React from 'react';
import {connect} from "react-redux";
import {Button, Icon} from "semantic-ui-react";
import {signInUsingOAuth} from "../../../actions"


class GoogleAuthButton extends React.Component {
    onSignInClick = () => {
       
        this.props.signInUsingOAuth(this.props.googleAuthReducer.oAuth)
    };

    render() {
        
        return (
            <Button className='googleButtonStyle' color='google plus' onClick={this.onSignInClick}>
                <Icon name='google plus'/> Google
            </Button>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        googleAuthReducer: state.googleAuthReducer
    }
}

export default connect(mapStateToProps, {signInUsingOAuth})(GoogleAuthButton);