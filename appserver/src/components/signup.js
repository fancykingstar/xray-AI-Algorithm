import React from "react";
import "./css/main.css";
import "./css/util.css";
import lineImage from "./images/line.png";
import loginLogo from "./images/loginlogo.png";
import edisonLogo from "./images/edison-logo.png";

class SignUp extends React.Component {
  

  render() {
    return (
        
        <div className="limiter">
		<div className="container-signup100 bg" >
			<div className="wrap-login100 p-b-30" >
				<div className="col-12 displayflex" >

					<div className="col-9 leftside displayflex" >
						<div className="col-6 colH" >
								<h5 className="sup">SIGN UP</h5>
						<form className="login100-form validate-form frmv">
							<div className="wrap-input100 validate-input m-b-10" data-validate="First Name is required">
								<input className="input100" type="text" name="FirstName" placeholder="First Name"/>>
							</div>
							<div className="wrap-input100 validate-input m-b-10" data-validate="Last Name is required">
								<input className="input100" type="text" name="LastName" placeholder="Last Name"/>>

							</div>
							<div className="wrap-input100 validate-input m-b-10" data-validate="Title/Role is required">
								<select className="input100" id="Title/Role">
									<option value="">Title/Role</option>
									<option value="2">two</option>
									<option value="3">three</option>
									<option value="4">four</option>
								</select>

							</div>
							<div className="wrap-input100 validate-input m-b-10" data-validate="Other is required">
								<input className="input100" type="text" name="Other" placeholder="Other"/>

							</div>
							<div className="wrap-input100 validate-input m-b-10"
								data-validate="Institution Name is required">
								<input className="input100" type="text" name="InstitutionName"
									placeholder="Institution Name"/>

							</div>
							<div className="wrap-input100 validate-input m-b-10" data-validate="Email is required">
								<input className="input100" type="email" name="Email" placeholder="Email"/>

							</div>
							<div className="wrap-input100 validate-input m-b-10" data-validate="Username is required">
								<input className="input100" type="text" name="username" placeholder="Username"/>>

							</div>
							<div className="wrap-input100 validate-input m-b-10" data-validate="Password is required">
								<input className="input100" type="password" name="pass" placeholder="Password"/>

							</div>
							<div className="wrap-input100 validate-input m-b-10" data-validate="Password is required">
								<input className="input100" type="password" name="pass" placeholder="Re-enter Password"/>

							</div>

							<div className="container-login100-form-btn p-t-10">
								<button className="login100-form-btn">
									ENTER HERE
								</button>
							</div>

							<div className="w-full p-t-25 p-b-230">
								
							</div>

						</form>
					</div>
					<div className="col-6 colH" >
						<p className="tandc">
								Terms and conditions
						</p>
						<p  className="colorWhite">		
								Legal text goes here.  Lorem ipsum dolor sit amet, dicat facilisis evertitur
								an quo, ius populo aperiam lucilius eu, sapientem maiestatis
								interpretaris nam in. Sint audire alterum quo id. Eam doctus invidunt
								definitionem cu, an ipsum consul tibique qui. Sint audire alterum quo id.
							</p>
						<p className="colorWhite">
							Eam doctus invidunt definitionem cu, an ipsum consul tibique
							Legal text goes here. Lorem ipsum dolor sit amet, dicat facilisis evertitur
							an quo, ius populo aperiam lucilius eu, sapientem maiestatis
							interpretaris nam in. Sint audire alterum quo id. Eam doctus invidunt
							definitionem cu, an ipsum consul tibique qui. Sint audire alterum quo id.
							Eam doctus invidunt definitionem cu, an ipsum consul tibique
							</p>
							<p className="colorWhite">
								Legal text goes here.Lorem ipsum dolor sit amet, dicat facilisis evertitur 
								an quo, ius populo aperiam lucilius eu, sapientem maiestatis 
								interpretaris nam in. Sint audire alterum quo id. Eam doctus invidunt 
								definitionem cu, an ipsum consul tibique qui. Sint audire alterum quo id. 
								Eam doctus invidunt definitionem cu, an ipsum consul tibique
							</p>
							<p className="colorWhite">
								Legal text goes here.Lorem ipsum dolor sit amet, dicat facilisis evertitur 
								an quo, ius populo aperiam lucilius eu, sapientem maiestatis 
								interpretaris nam in. Sint audire alterum quo id. Eam doctus invidunt 
								definitionem cu, an ipsum consul tibique qui. Sint audire alterum quo id. 
								Eam doctus invidunt definitionem cu, an ipsum consul tibique
							</p>
							<p className="colorWhite">
								Legal text goes here.Lorem ipsum dolor sit amet, dicat facilisis evertitur 
								an quo, ius populo aperiam lucilius eu, sapientem maiestatis 
								interpretaris nam in. Sint audire alterum quo id. Eam doctus invidunt 
								definitionem cu, an ipsum consul tibique qui. Sint audire alterum quo id. 
								Eam doctus invidunt definitionem cu, an ipsum consul tibique
								
						</p>
						<div className="radio-item">
								<input type="radio" id="ritema" name="ritem"/>
								<label for="ritema">I accept Terms & Conditions above.</label>
							</div>
					</div>
					
				</div>
					<div className="rightside">
						<img src={lineImage}/>
					</div>
					
						
					<div className="col-3 rightside rside" >
							<img src={loginLogo}/>
                            <h7 className="logo1">GE Healthcare</h7>
							<h1 className="logo2">X-RAY AI</h1>
							<h3 className="logo3">EXPERIENCE</h3>
							</div>
					</div>
					
				</div>
				<div className="logoimg">
						<img src={edisonLogo}/>
				</div>
				
			</div>
		</div>
    );
  }
}

export default SignUp;
