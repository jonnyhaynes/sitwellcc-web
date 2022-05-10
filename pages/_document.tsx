import Document, { DocumentContext, Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
    static async getInitialProps(ctx: DocumentContext) {
        const initialProps = await Document.getInitialProps(ctx)

        return initialProps
    }

    render() {
        return (
            <Html>
                <Head />
                {/* <body className="font-arial antialiased h-screen bg-white flex flex-col text-black" :class="{ 'overflow-y-hidden': openmodal }" x-data="{ openmodal: false }"></Html> */}
                <body className="font-arial antialiased h-screen bg-white flex flex-col text-black">
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}

export default MyDocument
