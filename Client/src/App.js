import React from 'react';
// import ReactDOM from "react-dom";
import { JsonToTable } from "react-json-to-table";
import axios from 'axios';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { myJson: "null", host: "", user: "", password: "", database: "", type_DBMS: "" };
  }
  handleChange_Host(event) {
    var value = event.target.value;
    this.setState({
      host: value
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
    if(this.state.type_DBMS === "MySQL"){
      axios
        .post('/getdata_mysql', {
          host: this.state.host,
          database: this.state.database,
          user: this.state.user,
          password: this.state.password
        })
        .then(res => {
          console.log(res.data);
          this.setState({
            myJson: JSON.parse(JSON.stringify(res.data))
          });
        })
        .catch(err => {
          alert("Error Happen!");
          this.setState({
            myJson: "null"
          })
          console.log(err);
        })
    }
    if(this.state.type_DBMS === "Oracle"){

    }
    if(this.state.type_DBMS === "MongoDB"){

    }
    if(this.state.type_DBMS === "SQLServer"){

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
          <form onSubmit={event => this.handleSubmitForm(event)}>
            <div className="form-group row">
              <label htmlFor="inputHost3" className="col-sm-2 col-form-label">Host: </label>
              <div className="col-sm-10">
                <input type="text" className="form-control" onChange={event => this.handleChange_Host(event)} id="inputHost3" placeholder="localhost" />
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="inputDatabase3" className="col-sm-2 col-form-label">Database: </label>
              <div className="col-sm-10">
                <input type="text" className="form-control" onChange={event => this.handleChange_Database(event)} id="inputDatabase3" placeholder="learning_sql" />
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="inputUser3" className="col-sm-2 col-form-label">User</label>
              <div className="col-sm-10">
                <input type="text" className="form-control" onChange={event => this.handleChange_User(event)} id="inputUser3" placeholder="root" />
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">Password</label>
              <div className="col-sm-10">
                <input type="password" className="form-control" onChange={event => this.handleChange_Password(event)} id="inputPassword3" placeholder="Password" />
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="inputType" className="col-sm-2 col-form-label">Type DBMS: </label>
              <div className="col-sm-2">
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
      );
    }

  }
}

export default App;
