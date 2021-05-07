import Link from 'next/link';

const LandingPage = ({ tickets }) => {
    const ticketList = tickets.map((t) => {
        return (
            <tr key={t.id}>
                <td>{t.title}</td>
                <td>{t.price}</td>
                <td><Link href='/tickets/[ticketId]' as={`/tickets/${t.id}`}><a>Link</a></Link></td>
            </tr>
        )
    })

    return (
        <div>
            <h1>Gix Tickets</h1>
            <table className="table table-bordered table-striped table-hover">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Price</th>
                        <th>Link</th>
                    </tr>
                </thead>
                <tbody>
                    {ticketList}
                </tbody>
            </table>
        </div>
    )
}

LandingPage.getInitialProps = async (context, client, currentUser) => {
    const { data } = await client.get('/api/tickets');
    return { tickets: data };
}

export default LandingPage;