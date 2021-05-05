
import { useEffect, useState } from 'react';
import Router from 'next/router'
import useRequest from './../../hooks/use-request';
import StripeCheckout from 'react-stripe-checkout';

const Order = ({ order, currentUser }) => {
    const [timeleft, setTimeleft] = useState(0);
    const {doRequest, errors} = useRequest({
        url: "/api/payments",
        method: "post",
        body: {
            orderId: order.id
        },
        onSuccess: (payment) => Router.push('/orders')
    })

    useEffect(() => {
        const findTimeleft = () => {
            const remainTime = new Date(order.expiresAt) - new Date();
            setTimeleft(Math.round(remainTime / 1000));
        }

        const timerId = setInterval(findTimeleft, 1000);
        findTimeleft();

        return () => {
            clearInterval(timerId);
        }
    }, [order]);

    if(timeleft < 0) { // Not equal
        return <div>Order is expired</div>
    }

    return (
        <div>
            {timeleft} seconds until order expires.
            <StripeCheckout 
                token={({ id }) => doRequest({ token: id })} 
                stripeKey='pk_test_51Ii8zqF9hR9sqoGwsN6XLPJTycPVoT61fdUXIll16rbFMxAVo1oua8Q9HJl77BVTHVMtx6RPWOao19vtQ9zyTjea00tvbeRkZs'
                amount={order.ticket.price * 100}
                email={currentUser.email}
            />
            {errors}
        </div>
    )
}

Order.getInitialProps = async (context, client) => {
    const { orderId } = context.query;
    const { data } = await client.get(`/api/orders/${orderId}`);

    return { order: data };
}

export default Order;