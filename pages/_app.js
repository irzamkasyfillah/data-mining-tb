import React from "react"
import '../styles/globals.css'
import "tailwindcss/tailwind.css";
import Head from 'next/head'
import Script from 'next/script'

function MyApp({Component, pageProps}) {
    const Layout = Component.Layout ? Component.Layout : React.Fragment;
    return (
        <>
            <div>
                <Head>
                    <title>Data Mining TB</title>
                    <meta charSet="UTF-8"/>
                    <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
                    <meta name="viewport" content="initial-scale=1.0, width=device-width"/>
                </Head>
            </div>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </>
    );
}

export default MyApp