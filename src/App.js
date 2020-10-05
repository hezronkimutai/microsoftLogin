import React, { useState } from "react";
import "./App.css";
import { login as loginFn, logout, getToken } from "./services/auth.service";
import { getUserInfo } from "./services/graph.service";
import microsoftIcon from "./microsoft.png";

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
  };
  let templates = [];
  localStorage.getItem("msal.idtoken") &&
    templates.push(<LoggedIn key="loggedIn" callAPI={callAPI} userName={user && user.account.name} />);
  !localStorage.getItem("msal.idtoken") && templates.push(<LoggedOut key="loggedout" login={login} />);
  userInfo && templates.push(<pre key="userInfo">{JSON.stringify(userInfo, null, 4)}</pre>);
  loginFailed && templates.push(<strong key="loginFailed">Login unsuccessful</strong>);
  apiCallFailed && templates.push(<strong key="apiCallFailed">Graph API call unsuccessful</strong>);
  return <div className="App">{templates}</div>;
};

const LoggedIn = ({ userName, callAPI }) => (
  <div>
    {/* <button onClick={callAPI} type="button">
      Call Graph's /me API
    </button> */}
    <button onClick={logout} type="button">
      Logout
    </button>
    <h3>Hello {userName}</h3>
  </div>
);

const LoggedOut = ({ login }) => (
  <div style={{ padding: "40px" }}>
    <button style={{ display: "flex", margin: "auto" }} onClick={login} type="button">
      <img alt="microsoft icon" style={{ height: 30, padding: "3px 5px", width: 30 }} src={microsoftIcon} />
      <div style={{ margin: "auto", padding: "3px 5px" }}>Login with Microsoft</div>
    </button>
  </div>
);
