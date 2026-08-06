import React from 'react';
import './App.css';
import Sidebar from './components/Sidebar/sidebar';
import Chat from './components/Chat/Chat';
import { Switch, Route, Redirect } from 'react-router-dom';
import Login from './components/LogIn/Login';
import { auth } from './components/Firebase/firebase.utils';
import { connect } from 'react-redux';
import { setUser } from './components/Redux/user/user.action';
import ProfileDetail from './components/Profile-detail/profile-detail';

class App extends React.Component {
  componentDidMount() {
    const { setUser } = this.props;
    this.unsubscribeFromAuth = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
  }

  componentWillUnmount() {
    this.unsubscribeFromAuth?.();
  }

  render() {
    const { currentUser } = this.props;

    if (!currentUser) {
      return (
        <div className="app app--login">
          <Login />
        </div>
      );
    }

    return (
      <div className="app">
        <div className="app_body">
          <Sidebar />
          <Switch>
            {/* Already signed in — /login has nothing left to do. */}
            <Route path="/login">
              <Redirect to="/" />
            </Route>
            <Route path="/rooms/:roomId">
              <Chat />
            </Route>
            <Route path="/profile-detail">
              <ProfileDetail />
            </Route>
            {/* `exact path`, not `exactpath` — the old typo made this an
                unknown prop and the route matched everything. */}
            <Route exact path="/">
              <Chat />
            </Route>
          </Switch>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
});

const mapDispatchToProps = (dispatch) => ({
  setUser: (user) => dispatch(setUser(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
