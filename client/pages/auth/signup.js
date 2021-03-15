import { useState } from 'react';
import Router from 'next/router';
import useRequest from './../../hooks/use-request';

const SignUp = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { doRequest, errors } = useRequest({
        url: '/api/users/sign-up',
        method: 'post',
        body: { email, password },
        onSuccess: (data) => {
            Router.push('/');
        }
    });

    const onSubmit = async (e) => {
        e.preventDefault();
        await doRequest();
    }

    return (
       <form onSubmit={onSubmit}>
            <h1>Sign Up</h1>
            <div className="form-group">
                <label>Email Address</label>
                <input className="form-control" onChange={(e) => setEmail(e.target.value)} value={email}/>
            </div>
            <div className="form-group">
                <label>Password</label>
                <input type="password" className="form-control" onChange={(e) => setPassword(e.target.value)} value={password}/>
            </div>
            { errors }
            <button className="btn btn-primary">Sign Up</button>
       </form>
    )
}

export default SignUp;