import React, { useState } from "react";
import "./App.css";
import { login as loginFn, logout, getToken } from "./services/auth.service";
import { getUserInfo } from "./services/graph.service";

export default () => {
  const [userInfo, setUserInfo] = useState(null);
  const [apiCallFailed, setApiCallFailed] = useState(null);
  const [loginFailed, setLoginFailed] = useState(null);
  const [user, setUser] = useState(null);

  const callAPI = () => {
    setApiCallFailed(false);
    getToken().then(
      (token) => {
        getUserInfo(token).then(
          (data) => {
            setUserInfo(data);
          },
          (error) => {
            console.error(error);
            setApiCallFailed(true);
          }
        );
      },
      (error) => {
        console.error(error);
        setApiCallFailed(true);
      }
    );
  };

  const login = () => {
    setLoginFailed(false);
    loginFn().then(
      (user) => {
        user ? setUser(user) : setLoginFailed(true);
      },
      () => {
        setLoginFailed(true);
      }
    );
    // getToken();
  };

  let templates = [];
  user && templates.push(<LoggedIn callAPI={callAPI} userName={user.name} />);
  !user && templates.push(<LoggedOut login={login} />);
  userInfo && templates.push(<pre key="userInfo">{JSON.stringify(userInfo, null, 4)}</pre>);
  loginFailed && templates.push(<strong key="loginFailed">Login unsuccessful</strong>);
  apiCallFailed && templates.push(<strong key="apiCallFailed">Graph API call unsuccessful</strong>);
  return <div className="App">{templates}</div>;
};

const LoggedIn = ({ userName, callAPI }) => (
  <div key="loggedIn">
    <button onClick={callAPI} type="button">
      Call Graph's /me API
    </button>
    <button onClick={logout} type="button">
      Logout
    </button>
    <h3>Hello {userName}</h3>
  </div>
);

const LoggedOut = ({ login }) => (
  <div key="loggedout">
    <button onClick={login} type="button">
      Login with Microsoft
    </button>
  </div>
);
