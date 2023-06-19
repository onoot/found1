// pages/index.js
import { useState, useEffect } from 'react'
import axios from 'axios'
import styles from '../styles/Home.module.css'
import withLayout from "../hoc/withLayout";
import Map from "../components/map/map";
import MyBulletins from "../components/bulletins/bulletins";

const Bulletins = () => {

    return (
        <div className={styles.container}>
            <MyBulletins/>
        </div>
    )
}

export default withLayout(Bulletins)
