import React, { useState, useEffect, useContext } from "react";
import { Redirect, useHistory } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../../context/UserContext";
import Row from "../Row/Row";
import Modal from "../Modal/Modal";
import "bootstrap/dist/css/bootstrap.min.css";
import "./dashboard.css";

const Dashboard = () => {
  const history = useHistory();
  const [modal, setModal] = useState(false);
  const { globalUser } = useContext(UserContext);
  const [currentUser, setcurrentUser] = useState(null);
  const [passwordList, setPasswordList] = useState([]);

  const handleEdit = (updateUser) => {
    setcurrentUser(updateUser);
    setModal(!modal);
  };

  const toggleModal = () => {
    setModal(!modal);
  };

  const handleLogout = async () => {
    try {
      await axios.get("/logout");
      history.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getPasswordsList = async () => {
      try {
        const { data } = await axios.get("/sync-passwords");
        setPasswordList(data.passwords);
      } catch (error) {
        console.log(error.response);
      }
    };

    getPasswordsList();
  }, []);

  if (!globalUser.isAuthenticated) return <Redirect to="/" />;
  return (
    <div className="dashboard">
      <div className={`modal__background modalShowing-${modal}`}>
        <Modal
          modal={modal}
          setModal={setModal}
          update={currentUser}
          setUpdate={setcurrentUser}
          passwordList={passwordList}
          setPasswordList={setPasswordList}
        />
      </div>
      <h2 className="heading">
        Password Manager
      </h2>
      <div className="dashboard__container">
        <div className="dashboard__profile">
          <div className="profile">
            <div className="profile__info">
              <h3>Username: {globalUser.user.name}</h3>
              <p>Email: {globalUser.user.email}</p>
              <button onClick={toggleModal}>Add Passwords</button>
            </div>
          </div>
          <div className="logout">
            <button onClick={handleLogout}>
              Logout <i className="fas fa-sign-out-alt"></i>
            </button>
          </div>
        </div>

        <div className="dashboard__body">
          <div className="dashboardTable__header">
            <div className="title">
              <span>Source</span>
            </div>
            <div className="username">
              <span>Email</span>
            </div>
            <div className="passwordBx">
              <span>Password</span>
            </div>
            <div className="options">
              <span>Options</span>
            </div>
          </div>

          {passwordList ? (
            passwordList.map((password) => (
              <Row
                password={password}
                key={password._id}
                edit={handleEdit}
                passwordList={passwordList}
                setPasswordList={setPasswordList}
              />
            ))
          ) : (
            <div className="welcome">
              <p className="msg">
                Please click on <span>Add Password</span> button to save your
                passwords here ..!!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
