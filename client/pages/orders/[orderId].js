
import { useEffect, useState } from 'react';

const Order = ({ order }) => {
    const [timeleft, setTimeleft] = useState(0);

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
        <div>{timeleft} seconds until order expires</div>
    )
}

Order.getInitialProps = async (context, client) => {
    const { orderId } = context.query;
    const { data } = await client.get(`/api/orders/${orderId}`);

    return { order: data };
}

export default Order;