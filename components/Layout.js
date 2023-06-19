// components/Layout.js
import Navigation from './Navigation'
import Head from "next/head";

const Layout = ({ children }) => {
    return (
        <>
            <Head>
                <title>Найдёныш</title>
                <link rel="icon" href="/svg.svg" />
                <link
                    rel="stylesheet"
                    href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
                    integrity="sha384-CLQmZCkafUAAJXZ+JUr0U6Qmk0WxMLPh0KT5oZrytMYG6WVX/9zoDjKwTqWMZ00U"
                    crossOrigin=""
                />
            </Head>
            <Navigation />
            {children}
        </>
    )
}

export default Layout
