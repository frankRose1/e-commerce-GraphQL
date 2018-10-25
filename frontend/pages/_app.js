import App, {Container} from 'next/app';
import Page from '../components/Page';
import {ApolloProvider} from 'react-apollo';
import withData from '../lib/withData';

class MyApp extends App {
  // allows fetching of any queries/mutations that may be on the page
  static async getInitialProps({Component, ctx}){
    let pageProps = {};
    if (Component.getInitialProps){
      pageProps = await Component.getInitialProps(ctx);
    }
    //expose the query to the user
    pageProps.query = ctx.query;
    return { pageProps };
  }

  render(){
    //this is the specific component being rendered out on each page (sell, home etc)
    //apollo is the apollo store
    const {Component, apollo, pageProps} = this.props;
    return (
      <Container>
        <ApolloProvider client={apollo}>
          <Page>
            <Component {...pageProps}/>
          </Page>
        </ApolloProvider>
      </Container>
    );

  }
}

export default withData(MyApp);