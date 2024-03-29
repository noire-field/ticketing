import 'bootstrap/dist/css/bootstrap.css';

import Header from './../components/Header';

import BuildClient from './../api/build-client';

const AppComponent = ({ Component, pageProps, currentUser }) => {
    return (
        <div>
            <Header currentUser={currentUser}/>
            <div className="container">
                <Component currentUser={currentUser} {...pageProps}/>
            </div>
        </div>
    );
}

AppComponent.getInitialProps = async (appContent) => {
    const client = BuildClient(appContent.ctx);
    const { data } = await client.get('/api/users/current-user');

    let pageProps = {};
    if(appContent.Component.getInitialProps)
        pageProps = await appContent.Component.getInitialProps(appContent.ctx, client, data.currentUser);


    return { pageProps, ...data };
}

export default AppComponent;