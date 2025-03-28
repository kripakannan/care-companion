import React, { useState } from 'react';

const Resource = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const openArticle = (fileName) => {
    window.location.href = `/assets/${fileName}`;
  };

  const filtered = (title) =>
    title.toLowerCase().includes(searchTerm.toLowerCase());

  return (
    <div className="container">
      <style>{`
        body {
          font-family: 'Arial', sans-serif;
          margin: 0;
          padding: 0;
          background-color: #f7f8fa;
          color: #444;
        }

        .container {
          max-width: 1000px;
          margin: 40px auto;
          padding: 30px;
          background: #fff;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
          border-radius: 15px;
          overflow: hidden;
        }

        h1 {
          text-align: center;
          font-size: 2.8em;
          margin-bottom: 30px;
          color: #6c63ff;
          letter-spacing: 2px;
        }

        #searchBar {
          width: 100%;
          padding: 14px 22px;
          border: 1px solid #ddd;
          border-radius: 25px;
          font-size: 1.1em;
          margin-bottom: 40px;
          outline: none;
          box-sizing: border-box;
          transition: all 0.3s ease;
        }

        #searchBar:focus {
          border-color: #6c63ff;
          box-shadow: 0 0 10px rgba(108, 99, 255, 0.3);
        }

        h2 {
          color: #333;
          font-size: 2em;
          margin-top: 40px;
          margin-bottom: 20px;
          text-align: left;
          border-bottom: 3px solid #6c63ff;
          padding-bottom: 10px;
          letter-spacing: 1px;
        }

        .carousel {
          display: flex;
          overflow-x: auto;
          scroll-behavior: smooth;
          gap: 20px;
          padding: 20px 0;
        }

        .carousel::-webkit-scrollbar {
          display: none;
        }

        .item {
          flex: 0 0 auto;
          width: 300px;
          border-radius: 15px;
          overflow: hidden;
          position: relative;
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
        }

        .item:hover {
          transform: translateY(-8px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
        }

        .item img {
          width: 100%;
          height: 220px;
          object-fit: cover;
          transition: opacity 0.3s ease;
        }

        .item .title {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          text-align: center;
          padding: 15px;
          font-size: 1.2em;
          font-weight: bold;
          transition: opacity 0.3s ease;
        }

        .item:hover img {
          opacity: 0.85;
        }

        .item:hover .title {
          opacity: 1;
        }

        ul {
          list-style: none;
          padding: 0;
          margin-top: 30px;
        }

        ul li {
          background: #6c63ff;
          margin: 15px 0;
          padding: 20px;
          border-radius: 12px;
          text-align: center;
          font-size: 1.2em;
          font-weight: 600;
          color: white;
          transition: background 0.3s ease, transform 0.3s ease;
          cursor: pointer;
        }

        ul li a {
          text-decoration: none;
          color: white;
          font-weight: 600;
          display: inline-block;
          padding: 5px;
        }

        ul li:hover {
          background: #5148d1;
          transform: translateY(-3px);
        }

        iframe {
          width: 100%;
          height: 220px;
          border: none;
          border-radius: 15px;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
          transition: box-shadow 0.3s ease;
        }

        iframe:hover {
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }
      `}</style>

      <h1>Resources</h1>
      <input
        type="text"
        id="searchBar"
        placeholder="Search Resource Topics"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <h2>Favorites</h2>
      <div className="carousel" id="favorites">
        {filtered("Mental Health Review Journal") && (
          <div className="item" onClick={() => openArticle('article1.html')}>
            <img src="./assets/article1.png" alt="Mental Health Review Journal" />
            <div className="title">Mental Health Review Journal</div>
          </div>
        )}
        {filtered("Caregiving - The Passions Project") && (
          <div className="item" onClick={() => openArticle('article2.html')}>
            <img src="/assets/article2.png" alt="Caregiving - The Passions Project" />
            <div className="title">Caregiving - The Passions Project</div>
          </div>
        )}
        <div className="item">
          <iframe
            src="https://www.youtube.com/embed/MA9s2vZflw4"
            allowFullScreen
            title="Favorite Video 1"
          ></iframe>
        </div>
        {filtered("Home Healthcare Now") && (
          <div className="item" onClick={() => openArticle('article3.html')}>
            <img src="/assets/article3.png" alt="Home Healthcare Now" />
            <div className="title">Home Healthcare Now</div>
          </div>
        )}
        {filtered("Mental Health and Physical Activity") && (
          <div className="item" onClick={() => openArticle('article4.html')}>
            <img src="/assets/article4.png" alt="Mental Health and Physical Activity" />
            <div className="title">Mental Health and Physical Activity</div>
          </div>
        )}
      </div>

      <h2>Recommended</h2>
      <div className="carousel" id="recommended">
        {filtered("Mental Health and Technology") && (
          <div className="item" onClick={() => openArticle('article5.html')}>
            <img src="/assets/article5.png" alt="Mental Health and Technology" />
            <div className="title">Mental Health and Technology</div>
          </div>
        )}
        <div className="item">
          <iframe
            src="https://www.youtube.com/embed/oK8eYmJUt7Y"
            allowFullScreen
            title="Recommended Video 1"
          ></iframe>
        </div>
        {filtered("Caregiver Support Strategies") && (
          <div className="item" onClick={() => openArticle('article6.html')}>
            <img src="/assets/article6.png" alt="Caregiver Support Strategies" />
            <div className="title">Caregiver Support Strategies</div>
          </div>
        )}
        {filtered("Home Healthcare Systems") && (
          <div className="item" onClick={() => openArticle('article7.html')}>
            <img src="/assets/article7.png" alt="Home Healthcare Systems" />
            <div className="title">Home Healthcare Systems</div>
          </div>
        )}
        {filtered("Caregiver Support for Arthritis") && (
          <div className="item" onClick={() => openArticle('article8.html')}>
            <img src="/assets/article8.png" alt="Caregiver Support for Arthritis" />
            <div className="title">Caregiver Support for Arthritis</div>
          </div>
        )}
      </div>

      <h2>Caregiver Support Groups</h2>
      <ul>
        {filtered("Caring for Elderly Patients") && (
          <li data-title="Caring for Elderly Patients">
            <a href="https://aging.georgia.gov/tools-resources/caregiving" target="_blank" rel="noopener noreferrer">
              Caring for Elderly Patients
            </a>
          </li>
        )}
        {filtered("NAMI Northside Atlanta") && (
          <li data-title="NAMI Northside Atlanta">
            <a href="https://naminorthsideatlanta.org/" target="_blank" rel="noopener noreferrer">
              NAMI Northside Atlanta
            </a>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Resource;
