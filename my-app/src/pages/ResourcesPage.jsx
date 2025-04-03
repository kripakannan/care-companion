import React, { useState } from 'react';
import './ResourcesPage.css';
import Navbar from '../components/Navbar';

const ResourcesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    const input = e.target.value.toLowerCase();
    setSearchQuery(input);
    const items = document.querySelectorAll(".item, ul li");
    items.forEach((item) => {
      const title = item.querySelector('.title')
        ? item.querySelector('.title').innerText.toLowerCase()
        : item.getAttribute("data-title")?.toLowerCase() || '';
      item.style.display = title.includes(input) ? "block" : "none";
    });
  };

  const openArticle = (url) => {
    window.location.href = url;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container">
        <h1>Resources</h1>
        <input
          type="text"
          id="searchBar"
          placeholder="Search Resource Topics"
          value={searchQuery}
          onChange={handleSearch}
        />

        <section>
          <h2>Favorites</h2>
          <div className="carousel" id="favorites">
            <div className="item" onClick={() => openArticle('/articles/article1.html')}>
              <img src="/images/article1.png" alt="Mental Health Review Journal" />
              <div className="title">Mental Health Review Journal</div>
            </div>
            <div className="item" onClick={() => openArticle('/articles/article2.html')}>
              <img src="/images/article2.png" alt="Caregiving - The Passions Project" />
              <div className="title">Caregiving - The Passions Project</div>
            </div>
            <div className="item">
              <iframe
                src="https://www.youtube.com/embed/MA9s2vZflw4"
                allowFullScreen
                title="Favorite Video"
              ></iframe>
            </div>
            <div className="item" onClick={() => openArticle('/articles/article3.html')}>
              <img src="/images/article3.png" alt="Home Healthcare Now" />
              <div className="title">Home Healthcare Now</div>
            </div>
            <div className="item" onClick={() => openArticle('/articles/article4.html')}>
              <img src="/images/article4.png" alt="Mental Health and Physical Activity" />
              <div className="title">Mental Health and Physical Activity</div>
            </div>
          </div>
        </section>

        <section>
          <h2>Recommended</h2>
          <div className="carousel" id="recommended">
            <div className="item" onClick={() => openArticle('/articles/article5.html')}>
              <img src="/images/article5.png" alt="Mental Health and Technology" />
              <div className="title">Mental Health and Technology</div>
            </div>
            <div className="item">
              <iframe
                src="https://www.youtube.com/embed/oK8eYmJUt7Y"
                allowFullScreen
                title="Recommended Video"
              ></iframe>
            </div>
            <div className="item" onClick={() => openArticle('/articles/article6.html')}>
              <img src="/images/article6.png" alt="Caregiver Support Strategies" />
              <div className="title">Caregiver Support Strategies</div>
            </div>
            <div className="item" onClick={() => openArticle('/articles/article7.html')}>
              <img src="/images/article7.png" alt="Home Healthcare Systems" />
              <div className="title">Home Healthcare Systems</div>
            </div>
            <div className="item" onClick={() => openArticle('/articles/article8.html')}>
              <img src="/images/article8.png" alt="Caregiver Support for Arthritis" />
              <div className="title">Caregiver Support for Arthritis</div>
            </div>
          </div>
        </section>

        <section>
          <h2>Caregiver Support Groups</h2>
          <ul>
            <li data-title="Caring for Elderly Patients">
              <a href="https://aging.georgia.gov/tools-resources/caregiving" target="_blank" rel="noreferrer">
                Caring for Elderly Patients
              </a>
            </li>
            <li data-title="NAMI Northside Atlanta">
              <a href="https://naminorthsideatlanta.org/" target="_blank" rel="noreferrer">
                NAMI Northside Atlanta
              </a>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default ResourcesPage;