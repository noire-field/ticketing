import axios from 'axios';

const Index = ({ currentUser }) => {
    console.log("I am in the component: " + currentUser);
    return (
        <div>Home 4</div>
    )
}

Index.getInitialProps = async () => {

    const response = await axios.get('/api/users/current-user');

    return response.currentUser;
}

export default Index;