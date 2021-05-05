import { useState } from 'react';
import axios from 'axios';

const UseRequest = ({ url, method, body, onSuccess }) => {
    const [errors, setErrors] = useState(null);

    const doRequest = async (props = {}) => {
        try {
            setErrors(null);
            const response = await axios[method](url, {
                ...body,
                ...props
            })

            if(onSuccess) onSuccess(response.data);
            return response.data;
        } catch(err) {
            console.log(err);
            if(err.response) {
                setErrors(
                    <div className="alert alert-danger">
                        <h4>Oops...</h4>
                        <ul className="my-0">
                        {err.response.data.errors.map((error, index) => {
                            return <li key={index}>{error.message}</li>
                        })}
                        </ul>
                    </div>
                );
            } else {
                setErrors('Unknown error, check console');
            }
            
        }
    }

    return {doRequest, errors};
}

export default UseRequest;