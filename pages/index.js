// pages/index.js
import { useState, useEffect } from 'react'
import axios from 'axios'
import styles from '../styles/Home.module.css'
import withLayout from "../hoc/withLayout";
import Map from "../components/map/map";

const Home = () => {

    return (
        <div className={styles.container}>
            <Map/>
        </div>
    )
}

export default withLayout(Home)
