import React from 'react';
// import ReactDOM from "react-dom";
import { JsonToTable } from "react-json-to-table";
import axios from 'axios';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { myJson: "null", host: "", port: "", user: "", password: "", database: "", type_DBMS: "" };
  }
  handleChange_Host(event) {
    var value = event.target.value;
    this.setState({
      host: value
    });
  }
  handleChange_Port(event) {
    var value = event.target.value;
    this.setState({
      port: value
    });
  }
  handleChange_Database(event) {
    var value = event.target.value;
    this.setState({
      database: value
    });
  }
  handleChange_User(event) {
    var value = event.target.value;
    this.setState({
      user: value
    });
  }
  handleChange_Password(event) {
    var value = event.target.value;
    this.setState({
      password: value
    });
  }
  handleChange_TypeDBMS(event) {
    var value = event.target.value;
    // alert(value);
    this.setState({
      type_DBMS: value
    });
  }
  handleSubmitForm(event) {
    // alert(this.state.host + "|" + this.state.database + "|" + this.state.user + "|" + this.state.password + "|" + this.state.type_DBMS);
    event.preventDefault();
    if (!this.isFormValid()) {
      alert("You need fill out and check infomation again!");
      return;
    }
    if (this.state.type_DBMS === "MySQL") {
      axios
        .post('/getdata_mysql', {
          host: this.state.host,
          port: this.state.port,
          database: this.state.database,
          user: this.state.user,
          password: this.state.password
        })
        .then(res => {
          // console.log(typeof(res.data));
          if(typeof(res.data) === "string"){
            alert("Error Happen! Please check and try again\n"+ res.data);
            this.setState({
              myJson: "null"
            })
          }else{
            this.setState({
              myJson: JSON.parse(JSON.stringify(res.data))
            });
          }
        })
        .catch(err => {
          alert("Error Happen! Please check and try again\n"+ err);
          this.setState({
            myJson: "null"
          })
        })
    }
    if (this.state.type_DBMS === "Oracle") {

    }
    if (this.state.type_DBMS === "MongoDB") {

    }
    if (this.state.type_DBMS === "SQLServer") {

    }
  }
  isFormValid() {
    return (this.state.host !== "" && this.state.database !== "" && this.state.type_DBMS !== "" && this.state.user !== "");
  }
  render() {
    if (this.state.myJson !== "null") {
      console.log(this.state.myJson);
      return (
        <div className="container">
          <h1>This is Database of you</h1>
          {/* =============================== */}
          {/* HOW TO USE IT         */}
          {/* =============================== */}
          <JsonToTable json={this.state.myJson} />
          {/* =============================== */}
        </div>
      );
    } else {
      return (
        <div className="container">
          <h1>Select Database Source: </h1>
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <a className="nav-link active" data-toggle="tab" href="#formHost">Get from Host Server</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" data-toggle="tab" href="#fromFile">Get from File CSV</a>
            </li>
          </ul>

          <div className="tab-content">
            <div id="formHost" className="container tab-pane active">
              <br></br>
              <form onSubmit={event => this.handleSubmitForm(event)}>
                <div className="form-group row">
                  <label htmlFor="inputHost3" className="col-sm-1 col-form-label">Host: </label>
                  <div className="col-sm-6">
                    <input type="text" className="form-control" onChange={event => this.handleChange_Host(event)} id="inputHost3" placeholder="localhost" />
                  </div>
                  <label htmlFor="inputPort3" className="col-sm-1 col-form-label">Port: </label>
                  <div className="col-sm-2">
                    <input type="text" className="form-control" onChange={event => this.handleChange_Port(event)} id="inputPort3" placeholder="localhost" />
                  </div>
                </div>
                <div className="form-group row">
                  <label htmlFor="inputDatabase3" className="col-sm-1 col-form-label">Database: </label>
                  <div className="col-sm-5">
                    <input type="text" className="form-control" onChange={event => this.handleChange_Database(event)} id="inputDatabase3" placeholder="learning_sql" />
                  </div>
                </div>
                <div className="form-group row">
                  <label htmlFor="inputUser3" className="col-sm-1 col-form-label">User</label>
                  <div className="col-sm-5">
                    <input type="text" className="form-control" onChange={event => this.handleChange_User(event)} id="inputUser3" placeholder="root" />
                  </div>
                </div>
                <div className="form-group row">
                  <label htmlFor="inputPassword3" className="col-sm-1 col-form-label">Password</label>
                  <div className="col-sm-5">
                    <input type="password" className="form-control" onChange={event => this.handleChange_Password(event)} id="inputPassword3" placeholder="Password" />
                  </div>
                </div>
                <div className="form-group row">
                  <label htmlFor="inputType" className="col-sm-1 col-form-label">Type DBMS: </label>
                  <div className="col-sm-3">
                    <select id="inputType" onChange={event => this.handleChange_TypeDBMS(event)} className="form-control">
                      <option defaultValue>...</option>
                      <option>MySQL</option>
                      <option>Oracle</option>
                      <option>MongoDB</option>
                      <option>SQLServer</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
              </form>
            </div>
            <div id="fromFile" className="container tab-pane fade">
              <h3>Menu 1</h3>
              <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            </div>
          </div>
        </div>
      );
    }

  }
}

export default App;
