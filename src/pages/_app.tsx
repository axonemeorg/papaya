import '@/assets/styles/main.scss'

import { AppProps } from 'next/app'
import Head from 'next/head'
import React from 'react'

const CustomApp = (props: AppProps) => {
    const { Component, pageProps } = props

    return (
        <>
            <Head>
                <meta charSet='UTF-8' />
                <meta name='description' content='Budgeting.' />
                <link rel="preconnect" href="https://fonts.gstatic.com" />
                <meta name='viewport' content='width=device-width, initial-scale=1' />
                <link rel="preconnect" href="https://fonts.gstatic.com" />
                <link href="https://fonts.googleapis.com/css2?family=Ubuntu:wght@400;500;700&display=swap" rel="stylesheet" />
                <link rel='stylesheet' href='https://fonts.googleapis.com/icon?family=Material+Icons'></link>
                <title>Budgeting</title>
            </Head>
            <div id='app'>
                <Component {...pageProps} />
            </div>
        </>
    )
}

export default CustomApp
