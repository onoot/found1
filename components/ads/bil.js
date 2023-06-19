import { useState, useEffect, useRef } from "react";
import axios from "axios";
import styles from "../../styles/Home.module.css";

const Card = ({ ad }) => (
    <div className="cardBil">
        {ad.photo ? (
            <img src={ad.photo} alt={ad.name} className="photo" />
        ) : (
            <div className="noPhoto">
                <h3>{ad.name}</h3>
            </div>
        )}
        <div className="ads">
            <h3>{ad.name}</h3>
        </div>

        <style jsx>{`
      .cardBil {
        flex: 0 0 auto;
        width: 250px;
        border: 1px solid #ccc;
      }

      .photo {
        width: 100%;
        height: 250px;
        object-fit: cover;
      }

      .noPhoto {
        width: 100%;
        height: 250px;
        background-color: #f2f2f2;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
      }

      .noPhoto h3 {
        margin-left: 1rem;
      }
    `}</style>
    </div>
);

export const Bil = () => {
    const [ads, setAds] = useState([]);
    const [scrollPosition, setScrollPosition] = useState(0);
    const cardRef = useRef(null);

    useEffect(() => {
        const fetchAds = async () => {
            const { data } = await axios.get("https://jsonplaceholder.typicode.com/users");
            setAds(data);
        };
        fetchAds();
    }, []);

    const handleScroll = (direction) => {
        const delta = direction === "left" ? -cardRef.current.offsetWidth : cardRef.current.offsetWidth;
        setScrollPosition(scrollPosition + delta);
    };

    const ChevronLeft = () => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24}>
            <path fill="currentColor" d="M14.621 3.172l-1.414-1.414-8.485 8.485 8.485 8.485 1.414-1.414-7.071-7.071z" />
        </svg>
    );

    const ChevronRight = () => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24}>
            <path fill="currentColor" d="M9.379 2.828l1.414 1.414 7.071 7.071-7.071 7.071-1.414-1.414 8.485-8.485z" />
        </svg>
    );

    const showLeftArrow = scrollPosition < 0;
    const showRightArrow = scrollPosition > -(cardRef.current?.scrollWidth - cardRef.current?.offsetWidth);

    return (
        <div className={styles.container}>
            <div className={styles.gridBil} ref={cardRef} onScroll={(e) => setScrollPosition(e.target.scrollLeft)}>
                {ads.map((ad) => (
                    <Card ad={ad} key={ad.id} />
                ))}
            </div>
            {showLeftArrow && (
                <div className="leftArrow" onClick={() => handleScroll("left")}>
                    <ChevronLeft />
                </div>
            )}
            {showRightArrow && (
                <div className="rightArrow" onClick={() => handleScroll("right")}>
                    <ChevronRight />
                </div>
            )}

            <style jsx>{
                `
        .gridBil {
          display: flex;
          gap: 1rem;
          padding: 1rem;
          overflow-x: scroll;
          scroll-behavior: smooth;
          margin-top: 20px;
        }

        /* Стили для стрелок */
        .leftArrow,
        .rightArrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          font-size: 2rem;
          color: #fff;
          background-color: rgba(0, 0, 0, 0.2);
          padding: 8px;
          border-radius: 50%;
          cursor: pointer;
          transition: opacity 0.2s ease-in-out;
        }

        .leftArrow:hover,
        .rightArrow:hover {
          opacity: 0.8;
        }

        .leftArrow {
          left: 8px;
        }

        .rightArrow {
          right: 8px;
        }

        /* Показываем/скрываем стрелки в зависимости от положения скролла */
        .gridBil::-webkit-scrollbar {
          width: 16px; height: 16px; }
              .gridBil::-webkit-scrollbar-thumb {
      background-color: rgba(0, 0, 0, 0.3);
      border-radius: 8px;
      border: 4px solid transparent;
      background-clip: content-box;
    }

    .gridBil:hover::-webkit-scrollbar-thumb {
      background-color: rgba(0, 0, 0, 0.5);
    }

    .gridBil::-webkit-scrollbar-track-piece {
      background-color: #eee;
    }

    .gridBil::-webkit-scrollbar-button {
      display: none;
    }

    .gridBil-scrollbar:before,
    .gridBil-scrollbar:after {
      content: "";
      position: absolute;
      top: 50%;
      transform: translateY(-50%) rotate(45deg);
      width: 8px;
      height: 8px;
      background-color: rgba(0, 0, 0, 0.7);
      opacity: 0.5;
      pointer-events: none;
    }

    .gridBil-scrollbar:before {
      left: 0;
      opacity: ${(showLeftArrow && "0.5") || "0"};
    }

    .gridBil-scrollbar:after {
      right: 0;
      opacity: ${(showRightArrow && "0.5") || "0"};
    }

    @media (max-width: 600px) {
      .cardBil {
        width: 100%;
      }
    }
  `}</style>
</div>)
;
 };
