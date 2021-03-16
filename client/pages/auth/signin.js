import { useState } from 'react';
import Router from 'next/router';
import useRequest from './../../hooks/use-request';

const SignIn = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { doRequest, errors } = useRequest({
        url: '/api/users/sign-in',
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
            <h1>Sign In</h1>
            <div className="form-group">
                <label>Email Address</label>
                <input className="form-control" onChange={(e) => setEmail(e.target.value)} value={email}/>
            </div>
            <div className="form-group">
                <label>Password</label>
                <input type="password" className="form-control" onChange={(e) => setPassword(e.target.value)} value={password}/>
            </div>
            { errors }
            <button className="btn btn-primary">Sign In</button>
       </form>
    )
}

export default SignIn;