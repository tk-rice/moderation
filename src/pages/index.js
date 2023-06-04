import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import axios from 'axios'
import { useState } from 'react'

export default function Home() {

  function postAlpha(message) {
    const url = './api/alpha';
    const bodyData = {
      content: message,
    };
    axios.post(url, bodyData)
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }

  return (
    <>
      <Head>
        <title>Moderate</title>
        <meta name="description" content="For content moderation and analysis under 140 characters. This serves only as an API endpoint at /api/*endpoint*. For a full list of endpoints, visit /all" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main}`}>
        <ul>
          <li className='--lessen --legend'>
            <h5>URL</h5>
            <h6>Description</h6>
          </li>
          <li>
            <h5><span className='--lessen'>/api</span>
              /hidden
            </h5>
            <h6>Main filter</h6>
          </li>
        </ul>
      </main>
    </>
  )
}
