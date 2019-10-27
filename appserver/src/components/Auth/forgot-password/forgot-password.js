import React, { Component } from 'react';
import './forgot.css'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { Link } from "react-router-dom";

class ForgotPassword extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className='container'>
                <div className='row tst'>
{/* form */}
                    <div className='col-lg-4 col-md-4 col-sm-6 col-7 border-right mb-5'>
                        <Form>
                            <h4>FORGOT PASSWORD</h4>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Control className='inp' type="email" placeholder="Enter email" />
                            </Form.Group>

                            <Button className="mt-2 btn small" variant="primary" type="submit">
                                SEND REQUEST
                            </Button>

                            <div className='row mt-2 ml-1'>
                            <Link to="/signup">
                                <span className='txt'>New User ? </span>
                                <span className='txt ml-1'>Register Here</span>
</Link>
                            </div>
                            <Link to="/login">
                            <p className='txt mb-4'>Back to Login</p>
                            </Link>

                        </Form>

                    </div>
                    {/* one section end */}
                    <div className='col-lg-4 col-md-4 col-sm-6 col-10'>
                        <div className='row ml-3'>
                            <img alt="" src="/ge.png"
                                width="40" height="40"
                                style={{ color: 'white' }}
                                className="d-inline-block align-top" />
                            <h5 className='ml-3'>GE Healthcare</h5>
                        </div>

                        <div className='mt-3 ml-4'>
                            <h1>X_RAY AI</h1>
                            <h3>E X P E R I E N C E</h3>
                        </div>
                    </div>

                    {/* second section end */}
                </div>
                        {/* right logo */}
                <div>
                    <img alt="" src={require('../../../assets/edison-logo.png')}
                        width="180" height="80"
                        style={{
                            color: 'white',
                            position: "fixed",
                            bottom: 50,
                            right: 45
                        }}
                    />
                </div>




            </div>
        )

    }
}

export default ForgotPassword