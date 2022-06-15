import Header from './header'
import Footer from './footer'

type Props = {
    children: any;
};

export default function Layout({ children } : Props) {
    return (
        <>
            <Header />
                <main className="page-content flex-grow flex-shrink-0 w-full max-w-screen-xl flex flex-row justify-center flex-wrap mx-auto">
                    {children}
                </main>
            <Footer />
        </>
    )
}
