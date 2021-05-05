
const Orders = ({ orders }) => {
    const orderList = orders.map((o) => <li key={o.id}>{o.ticket.title} - {o.status}</li>);

    return (
        <ul>
           {orderList}
        </ul>
    )
}

Orders.getInitialProps = async (context, client) => {
    const { data } = await client.get('/api/orders');

    return { orders: data }
}

export default Orders;