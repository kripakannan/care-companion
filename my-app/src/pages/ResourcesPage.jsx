import React, { useState } from 'react';
import './ResourcesPage.css';
import Navbar from '../components/Navbar';

const ResourcesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [modalUrl, setModalUrl] = useState(null);

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

  const openModal = (url) => {
    setModalUrl(url);
  };

  const closeModal = () => {
    setModalUrl(null);
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
              <button
                className="text-blue-600 underline"
                onClick={() => openModal("https://aging.georgia.gov/tools-resources/caregiving")}
              >
                Caring for Elderly Patients
              </button>
            </li>
            <li data-title="NAMI Northside Atlanta">
              <button
                className="text-blue-600 underline"
                onClick={() => openModal("https://naminorthsideatlanta.org/")}
              >
                NAMI Northside Atlanta
              </button>
            </li>
          </ul>
        </section>

        {/* Modal */}
        {modalUrl && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-4 rounded-lg shadow-lg w-11/12 h-5/6 relative">
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 text-gray-600 hover:text-black text-lg"
              >
                &times;
              </button>
              <iframe
                src={modalUrl}
                title="Support Group Info"
                className="w-full h-full rounded"
              ></iframe>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourcesPage;