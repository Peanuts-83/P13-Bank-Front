import Header from './Header';
import Head from 'next/head';
import Footer from './Footer';

export default function Layout({ children }) {
    return (
        <div>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="theme-color" content="#000000" />
                <meta
                    name="description"
                    content="create-react-app migrated to NextJS"
                />
            </Head>
            <Header />
            {children}
            <Footer />
        </div>
    );
}