// profile/myads.js
import { useState, useEffect } from 'react'
import axios from 'axios'
import styles from '../../styles/Home.module.css'

const MyADS = () => {
    const [ads, setAds] = useState([])

    useEffect(() => {
        const fetchAds = async () => {
            const { data } = await axios.get('https://jsonplaceholder.typicode.com/users')
            setAds(data)
        }
        fetchAds()
    }, [])

    return (
            <div className={styles.gridP}>
                <h1>Мои Объявления</h1>
                {ads.map(ad => (
                    <div className={styles.cardProf} key={ad.id}>
                        {ad.photo ? (
                            <img src={ad.photo} alt={ad.name} className={styles.photo} />
                        ) : (
                            <img src='https://kartinkin.net/uploads/posts/2021-01/thumbs/1611412760_6-p-chernii-fon-so-znakom-voprosa-6.jpg' alt='Нет фото' className={styles.photo} />
                        )}
                        <div className='ads'>
                            <h3>{ad.name}</h3>
                            <p>{ad.username}</p>
                        </div>
                    </div>
                ))}
        </div>

    )
}

export default MyADS
