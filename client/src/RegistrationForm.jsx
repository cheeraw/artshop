import React from 'react';
import Button from './Button.jsx';
import InputBar from './InputBar.jsx';
import { regex } from './functions/validations.js';
import statusOk from './misc/ok.png';
import statusNotOk from './misc/notOk.png';
import statusLoading from './misc/loading.png';

const request = require('superagent');
//const nocache = require('superagent-no-cache');
//const prefix = require('superagent-prefix')('/static');

class RegistrationForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      step: 1
    }

    this.steps = this.steps.bind(this);
    this.saveCredentials = this.saveCredentials.bind(this);
    this.savePersonalInfo = this.savePersonalInfo.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  steps(number) {
    this.setState({ step: number });
  }

  saveCredentials(data, number) {
    this.setState({
      username: data.username,
      email: data.email,
      password: data.password
    });
    this.setState({ step: number });
  }

  savePersonalInfo(data, number) {
    this.setState({
      firstname: data.firstname,
      lastname: data.lastname,
      country: data.country,
      city: data.city
    });
    this.setState({ step: number });
  }

  submitForm() {
    var url = "http://localhost:5000/register/submit";
    console.log("yo: " + this.state.username);
    var params = {
      username: this.state.username,
      email: this.state.email,
      password: this.state.password,
      firstname: this.state.firstname,
      lastname: this.state.lastname,
      country: this.state.country,
      city: this.state.city
    };
    request
      .post(url)
      .type('form')
      .send(params)
      .end((err, res) => {
      // Calling the end function will send the request
        try {
          if (res.body.message === "success") {
            console.log("success");
            this.setState({regStatus: "success", step: 0});
            setTimeout(() => {
              this.props.toggle();
              this.props.toggleLogin();
            }, 2000);
          } else if (res.body.message === "failed") {
            this.setState({regStatus: "failed"});
            console.log("failed");
          }
          console.log(res);
        } catch (error) {
          throw(error);
        }
      });
  }

  render() {
    return (
      <div className="form-wrapper">
        <div className="center-wrapper">
          {this.state.regStatus !== "success" &&
          <Button
            className="closeButton"
            icon="remove"
            onClick={this.props.toggle}
          />}
          {this.state.regStatus !== "success" &&
          <div className="steps">
            <button className={this.state.step === 1 ? "firstbtn btnactive" : "firstbtn"} onClick={() => this.steps(1)} disabled/>
            <button className={this.state.step === 2 ? "secondbtn btnactive" : "secondbtn"} onClick={() => this.steps(2)} disabled/>
            <button className={this.state.step === 3 ? "thirdbtn btnactive" : "thirdbtn"} onClick={() => this.steps(3)} disabled/>
          </div>}
          <Credentials next={this.saveCredentials} visible={this.state.step === 1 ? "contents visible" : "contents"}/>
          <PersonalInfo  next={this.savePersonalInfo} visible={this.state.step === 2 ? "contents visible" : "contents"}/>
          <Final submit={this.submitForm} visible={this.state.step === 3 ? "contents visible" : "contents"}/>
          {this.state.regStatus === "success" &&
            <div className="success-text">
              registration successful
            </div>}
        </div>
      </div>
    );
  }
}

class Credentials extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      highlight: "",
      icon1: "eye-close",
      icon2: "eye-close",
      username: "",
      email: "",
      password: "",
      rptpassword: "",
      miscPATH1: "none",
      miscPATH2: "none",
      miscPATH3: "none",
      miscPATH4: "none",
      nextEnabled: false
    }
    this.toggleHighlight = this.toggleHighlight.bind(this);
    this.toggleMask = this.toggleMask.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  toggleHighlight(type) {
    if(typeof type !== 'undefined') {
      this.setState({ highlight: type});
    } else {
      this.setState({ highlight: ""});
    }
  }

  toggleMask(number) {
    if (number === 1) {
      this.setState({ icon1: this.state.icon1 === "eye-close" ? "eye-open" : "eye-close"});
    } else {
      this.setState({ icon2: this.state.icon2 === "eye-close" ? "eye-open" : "eye-close"});
    }
  }

  handleChange(e, type) {
    var str = e.target.value;
    this.setState({nextEnabled: false});

    if(type !== "email") {
      str = str.replace(regex(type === "rptpassword" ? "password" : type), '');

      e.target.value = str;
    } else {
      var input = str.replace(regex(type === "rptpassword" ? "password" : type), 'ok');

      if(input === "ok") {
        this.setState({emailFieldStatus: "loading", miscPATH2: statusLoading, emailFieldValue: str});
      } else {
        this.setState({emailFieldStatus: "notOk", miscPATH2: statusNotOk, emailFieldValue: str});
        type = "none";
      }
    }

    switch(type) {
      case "none":
        break;
      case "basic":
        this.setState({userFieldValue: str});
        this.setState({username: str});
        setTimeout(() => {
          if(this.state.userFieldValue !== str || str === "") return;
          this.setState({userFieldStatus: "loading", miscPATH1: statusLoading});

          var url = "http://localhost:5000/register/usercheck";
          var params = {
            username: str
          };

          request
            .get(url)
            .query(params) // sends a JSON post body
            .set('Content-Type': 'application/json')
            .set('accept', 'json')
            .type('form')
            .end((err, res) => {
              // Calling the end function will send the request
              try {
                if (res.body.message === "userOK") {
                  this.setState({userFieldStatus: "ok", miscPATH1: statusOk});
                  console.log("hey");
                } else if (res.body.message === "userExists") {
                  this.setState({userFieldStatus: "notOk", miscPATH1: statusNotOk});
                }
              } catch (error) {
                throw(error);
              }
          });
        }, 1500);
        break;
      case "email":
        this.setState({emailFieldValue: str});
        this.setState({email: str});
        setTimeout(() => {
          if(this.state.emailFieldValue !== str || str === "") return;
          this.setState({emailFieldStatus: "loading", miscPATH2: statusLoading});

          var url = "http://localhost:5000/register/emailcheck";
          var params = {
            email: str
          };

          request
            .get(url)
            .query(params) // sends a JSON post body
            .set('Content-Type': 'application/json')
            .set('accept', 'json')
            .type('form')
            .end((err, res) => {
            // Calling the end function will send the request
              try {
                if(this.state.emailFieldValue !== str || str === "") return;
                if (res.body.message === "emailOK") {
                  this.setState({emailFieldStatus: "ok", miscPATH2: statusOk});
                  console.log("hey");
                } else if (res.body.message === "emailExists") {
                  this.setState({emailFieldStatus: "notOk", miscPATH2: statusNotOk});
                }
              } catch (error) {
                throw(error);
              }
            });
          }, 1500);
          break;
      case "password":
        this.setState({password: str});
        if(str.length < 8) {
          setTimeout(() => {
            if(this.state.password.length !== str.length) return;

            if(this.state.password.length < 8) {
              this.setState({passwordFieldStatus: "notOk", miscPATH3: statusNotOk});
            } else {
              this.setState({passwordFieldStatus: "ok", miscPATH3: statusOk});
            }
          },1500);
        } else {
          this.setState({passwordFieldStatus: "ok", miscPATH3: statusOk});
        }
        break;
      case "rptpassword":
        this.setState({rptpassword: str});

        if(this.state.password !== str) {
          this.setState({rptpasswordFieldStatus: "notOk", miscPATH4: statusNotOk});
        }
        else {
          this.setState({rptpasswordFieldStatus: "ok", miscPATH4: statusOk});
        }
        break;
      default:
        break;
    }


    setTimeout(() => {
      if(this.state.userFieldStatus === "ok"
        & this.state.emailFieldStatus === "ok"
        & this.state.passwordFieldStatus === "ok"
        & this.state.rptpasswordFieldStatus === "ok") {
          this.setState({nextEnabled: true});
      }
      else {
        this.setState({nextEnabled: false});
      }
    }, 1600);
  }

  handleClick = () => {
    var data = {
      username: this.state.username,
      email: this.state.email,
      password: this.state.password
    };
    this.props.next(data, 2);
  }

  render() {
    return (
      <div className={this.props.visible}>
        <InputBar
          placeholder="username..."
          className="bar"
          icon="user"
          highlight={this.state.highlight === "user" && "highlight"}
          onFocus={() => this.toggleHighlight("user")}
          onBlur={this.toggleHighlight}
          onChange={(e) => this.handleChange(e,"basic")}
        />
        {this.state.miscPATH1 !== "none" && <div className="FieldStatus user">
          <img className={this.state.userFieldStatus === "loading" ? "spining" : ""} src={this.state.miscPATH1} alt=""/>
        </div>}
        <InputBar
          placeholder="e-mail..."
          className="bar"
          icon="envelope"
          highlight={this.state.highlight === "email" && "highlight"}
          onFocus={() => this.toggleHighlight("email")}
          onBlur={this.toggleHighlight}
          onChange={(e) => this.handleChange(e,"email")}
        />
        {this.state.miscPATH2 !== "none" && <div className="FieldStatus email">
          <img className={this.state.emailFieldStatus === "loading" ? "spining" : ""} src={this.state.miscPATH2} alt=""/>
        </div>}
        <InputBar
          placeholder="password..."
          className="bar"
          icon="lock"
          type={this.state.icon1 === "eye-close" ? "password" : "text"}
          highlight={this.state.highlight === "pass" && "highlight"}
          onFocus={() => this.toggleHighlight("pass")}
          onBlur={this.toggleHighlight}
          onChange={(e) => this.handleChange(e,"password")}
        />
        {this.state.miscPATH3 !== "none" &&
          <div className="FieldStatus password">
            <img className={this.state.passwordFieldStatus === "loading" ? "spining" : ""} src={this.state.miscPATH3} alt=""/>
          </div>
        }
        <InputBar
          placeholder="repeat password..."
          className="bar"
          icon="lock"
          type={this.state.icon2 === "eye-close" ? "password" : "text"}
          highlight={this.state.highlight === "rptpass" && "highlight"}
          onFocus={() => this.toggleHighlight("rptpass")}
          onBlur={this.toggleHighlight}
          onChange={(e) => this.handleChange(e,"rptpassword")}
        />
        {this.state.miscPATH4 !== "none" &&
          <div className="FieldStatus rptpassword">
            <img className={this.state.rptpasswordFieldStatus === "loading" ? "spining" : ""} src={this.state.miscPATH4} alt=""/>
          </div>
        }
        <Button className={this.state.miscPATH3 === "none" ? "maskButton mask1" : "maskButton mask1 move"} onClick={() => this.toggleMask(1)} icon={this.state.icon1}/>
        <Button className={this.state.miscPATH4 === "none" ? "maskButton mask2" : "maskButton mask2 move"} onClick={() => this.toggleMask(2)} icon={this.state.icon2}/>
        {this.state.nextEnabled === true &&
          <Button
            className="confirm"
            value="next"
            onClick={this.handleClick}/>
        }
        </div>
    );
  }
}

class PersonalInfo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      highlight: "",
      firstname: "",
      lastname: "",
      country: "",
      city: ""
    }

    this.toggleHighlight = this.toggleHighlight.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  toggleHighlight(type) {
    if(typeof type !== 'undefined') {
      this.setState({ highlight: type});
    } else {
      this.setState({ highlight: ""});
    }
  }

  handleChange(e, name) {
    var str = e.target.value;
    e.target.value = str.replace(regex("name"), '');

    if(this.state.firstname !== "" &&
      this.state.lastname !== "" &&
      this.state.country !== "" &&
      this.state.city !== "") {
        this.setState({ nextEnabled: true });
    }
    else {
      this.setState({ nextEnabled: false });
    }

    switch(name) {
      case "first":
        this.setState({ firstname: str });
        break;

      case "last":
        this.setState({ lastname: str });
        break;

      case "country":
        this.setState({ country: str });
        break;

      case "city":
        this.setState({ city: str });
        break;

      default:
        break;
    }
    setTimeout(() => {
      if(this.state.firstname !== "" &&
        this.state.lastname !== "" &&
        this.state.country !== "" &&
        this.state.city !== "") {
          this.setState({ nextEnabled: true });
      }
      else {
        this.setState({ nextEnabled: false });
      }
    },200);
  }

  handleClick = () => {
    var data = {
      firstname: this.state.firstname,
      lastname: this.state.lastname,
      country: this.state.country,
      city: this.state.city
    };
    this.props.next(data, 3);
  }

  render() {
    return (
      <div className={this.props.visible}>
        <InputBar
          placeholder="first name..."
          className="bar"
          icon="user"
          highlight={this.state.highlight === "firstname" && "highlight"}
          onFocus={() => this.toggleHighlight("firstname")}
          onBlur={this.toggleHighlight}
          onChange={(e) => this.handleChange(e, "first")}
        />
        <InputBar
          placeholder="last name..."
          className="bar"
          icon="user"
          highlight={this.state.highlight === "lastname" && "highlight"}
          onFocus={() => this.toggleHighlight("lastname")}
          onBlur={this.toggleHighlight}
          onChange={(e) => this.handleChange(e, "last")}
        />
        <InputBar
          placeholder="country..."
          className="bar"
          icon="home"
          highlight={this.state.highlight === "country" && "highlight"}
          onFocus={() => this.toggleHighlight("country")}
          onBlur={this.toggleHighlight}
          onChange={(e) => this.handleChange(e, "country")}
        />
        <InputBar
          placeholder="city..."
          className="bar"
          icon="home"
          highlight={this.state.highlight === "city" && "highlight"}
          onFocus={() => this.toggleHighlight("city")}
          onBlur={this.toggleHighlight}
          onChange={(e) => this.handleChange(e, "city")}
        />

        {this.state.nextEnabled === true &&
          <Button
          className="confirm"
          value="next"
          onClick={this.handleClick}/>}
      </div>
    );
  }

}

class Final extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      terms: false
    }

    this.handleClick = this.handleClick.bind(this);
  }


  handleClick() {
    var newState = this.state.terms ? false : true;

    this.setState({ terms: newState });
  }

  render() {
    return (
      <div className={this.props.visible}>
        <Button
          className="checkbox"
          icon={this.state.terms ? "ok" : ""}
          onClick={this.handleClick} />
        <p className="text">
          I have read, and I accept
        </p>
        <a className="link" href="#">
          terms of use
        </a>
        {this.state.terms &&
          <Button
            className="confirm finishbtn"
            value="finish"
            onClick={this.props.submit}
          />}
      </div>
    );
  }
}

export default RegistrationForm;
