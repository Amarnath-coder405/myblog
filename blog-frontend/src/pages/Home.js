import React, { useEffect, useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Slider from 'react-slick';
import './Home.css';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const heroSlides = [
  {
    id: 1,
    title: "Welcome to Our Blog",
    subtitle: "Explore fresh insights and stories every week.",
    imageUrl: "https://source.unsplash.com/1600x900/?nature,water",
    ctaLink: "/about",
    ctaText: "Learn More About Us"
  },
  {
    id: 2,
    title: "Discover New Stories",
    subtitle: "Stay updated with the latest trends and ideas.",
    imageUrl: "https://source.unsplash.com/1600x900/?technology,code",
    ctaLink: "/posts",
    ctaText: "Read Our Posts"
  },
  {
    id: 3,
    title: "Join Our Community",
    subtitle: "Connect and grow with like-minded readers.",
    imageUrl: "https://source.unsplash.com/1600x900/?community,people",
    ctaLink: "/signup",
    ctaText: "Get Started"
  }
];

export default function Home() {
  // Manage URL search parameters for filters and pagination
  const [searchParams, setSearchParams] = useSearchParams();

  // State variables for posts data, loading, error handling, filters, and pagination
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  // Sync search parameters in URL whenever filters or pagination change
  useEffect(() => {
    setSearchParams({
      search: searchQuery || '',
      category: selectedCategory !== 'All' ? selectedCategory : '',
      page: currentPage.toString(),
    });
  }, [searchQuery, selectedCategory, currentPage, setSearchParams]);

  // Fetch posts from API on component mount
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('http://localhost:3001/posts');
        if (!res.ok) throw new Error('Failed to fetch posts');
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        setError('Failed to load posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // Reset to page 1 when category or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  // Extract unique categories from posts for filter buttons
  const allCategories = useMemo(() => {
    const unique = new Set(posts.flatMap((p) => p.categories || []));
    return ['All', ...unique];
  }, [posts]);

  // Filter posts based on category and search query
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesCategory =
        selectedCategory === 'All' || (post.categories || []).includes(selectedCategory);

      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (post.content || '').toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [posts, selectedCategory, searchQuery]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  // React Slick slider settings
  const sliderSettings = {
    dots: true,
    arrows: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 5000,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    pauseOnHover: true,
  };

  return (
    <div className="home">
      {/* ===== Hero Slider Section ===== */}
      <section className="hero-section">
        <Slider {...sliderSettings}>
          {heroSlides.map(({ id, title, subtitle, imageUrl, ctaLink, ctaText }) => (
            <div key={id} className="hero-slide" style={{ backgroundImage: `url(${imageUrl})` }}>
              <div className="hero-overlay"></div>
              <div className="hero-content container text-center">
                <h1 className="hero-title">{title}</h1>
                <p className="hero-subtitle">{subtitle}</p>
                <Link to={ctaLink} className="btn hero-cta">
                  {ctaText}
                </Link>
              </div>
            </div>
          ))}
        </Slider>
      </section>

      {/* ===== Search + Category Filter ===== */}
      <div className="container section-search-cat py-4">
        {/* Search Input */}
        <div className="search-wrapper mb-3">
          <input
            type="text"
            className="form-control search-input"
            placeholder="🔍 Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search posts"
          />
        </div>

        {/* Category Buttons */}
        <div className="category-wrapper text-center">
          {allCategories.map((cat) => (
            <button
              key={cat}
              className={`btn category-btn mx-1 mb-2 ${
                selectedCategory === cat ? 'btn-cat-active' : 'btn-cat-outline'
              }`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ===== Posts Grid Section ===== */}
      <section className="container pb-5">
        <h2 className="section-heading text-center mb-4">Latest Posts</h2>

        {/* Loading Spinner */}
        {loading ? (
          <div className="d-flex justify-content-center py-5">
            <div className="spinner-border text-primary" role="status" aria-label="Loading" />
          </div>

        // Error Message
        ) : error ? (
          <div className="alert alert-danger text-center">{error}</div>

        // No Results Message
        ) : paginatedPosts.length === 0 ? (
          <div className="alert alert-info text-center">No matching posts found.</div>

        // Posts List
        ) : (
          <>
            <div className="row g-4">
              {paginatedPosts.map((post) => (
                <div key={post.id} className="col-md-6 col-lg-4">
                  <div className="post-card h-100 shadow-sm border-0">
                    {post.imageUrl && (
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="card-img-top"
                      />
                    )}
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">{post.title}</h5>
                      <p className="card-text text-muted">
                        {post.excerpt || (post.content?.substring(0, 100) + '...')}
                      </p>
                      <div className="mt-auto">
                        <Link to={`/post/${post.id}`} className="btn btn-outline-primary btn-sm">
                          Read More →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ===== Pagination Controls ===== */}
            <div className="pagination-controls d-flex justify-content-center align-items-center mt-5">
              <button
                className="btn btn-outline-secondary"
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
              >
                ← Prev
              </button>
              {[...Array(totalPages)].map((_, idx) => {
                const page = idx + 1;
                return (
                  <button
                    key={page}
                    className={`btn mx-1 ${
                      page === currentPage ? 'btn-primary' : 'btn-outline-secondary'
                    }`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                );
              })}
              <button
                className="btn btn-outline-secondary"
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next →
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
