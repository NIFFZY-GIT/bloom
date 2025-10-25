"use client";

import React, { useState, useEffect, useRef } from 'react';
import './GalleryPage.css';

interface GalleryItem {
  id: number;
  category: string;
  imagePath: string;
  title: string;
  description: string;
}

interface Review {
  id: number;
  name: string;
  position: string;
  avatar: string;
  rating: number;
  text: string;
}

const GalleryPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const galleryItems: GalleryItem[] = [
    {
      id: 1,
      category: 'web',
      imagePath: '/images/gallery/web1.jpg',
      title: 'E-commerce Platform',
      description: 'Modern web design with seamless user experience'
    },
    {
      id: 2,
      category: 'branding',
      imagePath: '/images/gallery/branding1.png',
      title: 'Corporate Identity',
      description: 'Complete brand identity for a tech startup'
    },
    {
      id: 3,
      category: 'ui',
      imagePath: '/images/gallery/branding1.png',
      title: 'Dashboard Design',
      description: 'Intuitive user interface for a data analytics platform'
    },
    {
      id: 4,
      category: 'mobile',
      imagePath: '/images/gallery/branding1.png',
      title: 'Fitness App',
      description: 'Mobile application for tracking workouts and nutrition'
    },
    {
      id: 5,
      category: 'web',
      imagePath: '/images/gallery/branding1.png',
      title: 'Portfolio Website',
      description: 'Creative portfolio for a photographer'
    },
    {
      id: 6,
      category: 'branding',
      imagePath: '/images/gallery/branding1.png',
      title: 'Product Packaging',
      description: 'Eco-friendly packaging design for a skincare line'
    },
    {
      id: 7,
      category: 'ui',
      imagePath: '/images/gallery/branding1.png',
      title: 'Booking System',
      description: 'User-friendly interface for a hotel reservation system'
    },
    {
      id: 8,
      category: 'mobile',
      imagePath: '/images/gallery/branding1.png',
      title: 'Travel Companion',
      description: 'Mobile app for planning and tracking travel itineraries'
    }
  ];

  const reviews: Review[] = [
    {
      id: 1,
      name: 'Sarah Johnson',
      position: 'Marketing Director',
      avatar: '/images/avatars/avatar1.jpg',
      rating: 5,
      text: '"Working with HoloCM was a game-changer for our brand. Their attention to detail and creative approach transformed our online presence completely. We\'ve seen a 40% increase in engagement since launching our new website."'
    },
    {
      id: 2,
      name: 'Michael Chen',
      position: 'Startup Founder',
      avatar: '/images/avatars/avatar2.jpg',
      rating: 4.5,
      text: '"The team at HoloCM understood our vision from day one. They delivered a stunning mobile app that exceeded our expectations. Their professionalism and technical expertise made the entire process smooth and efficient."'
    },
    {
      id: 3,
      name: 'Emma Rodriguez',
      position: 'Creative Director',
      avatar: '/images/avatars/avatar3.jpg',
      rating: 5,
      text: '"I\'m blown away by the branding work HoloCM did for our agency. They captured our essence perfectly and delivered a cohesive identity system that has elevated our brand across all touchpoints. Highly recommended!"'
    }
  ];

  const filteredItems = activeFilter === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeFilter);

  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={i} className="fas fa-star"></i>);
    }

    if (hasHalfStar) {
      stars.push(<i key="half" className="fas fa-star-half-alt"></i>);
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="far fa-star"></i>);
    }

    return stars;
  };

  return (
    <div className="gallery-page">
      {/* Full Screen Hero Section */}
      <section className="gallery-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>Our Creative Gallery</h1>
          <p>Explore our portfolio of stunning projects and see what our clients have to say about their experiences with us.</p>
          <button className="cta-button">View Our Work</button>
        </div>
        <div className="scroll-indicator">
          <span>Scroll Down</span>
          <div className="arrow"></div>
        </div>
      </section>

      <div className="container">
        <section className="gallery-section" ref={sectionRef}>
          <div className="section-header">
            <h2>Featured Projects</h2>
            <p>Browse through our collection of creative work across different domains</p>
          </div>

          <div className="gallery-filters">
            <button 
              className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => handleFilterClick('all')}
            >
              All Projects
            </button>
            <button 
              className={`filter-btn ${activeFilter === 'web' ? 'active' : ''}`}
              onClick={() => handleFilterClick('web')}
            >
              Web Design
            </button>
            <button 
              className={`filter-btn ${activeFilter === 'branding' ? 'active' : ''}`}
              onClick={() => handleFilterClick('branding')}
            >
              Branding
            </button>
            <button 
              className={`filter-btn ${activeFilter === 'ui' ? 'active' : ''}`}
              onClick={() => handleFilterClick('ui')}
            >
              UI/UX
            </button>
            <button 
              className={`filter-btn ${activeFilter === 'mobile' ? 'active' : ''}`}
              onClick={() => handleFilterClick('mobile')}
            >
              Mobile Apps
            </button>
          </div>

          <div className="gallery-grid">
            {filteredItems.map((item, index) => (
              <div 
                key={item.id}
                className={`gallery-item fade-in ${isVisible ? 'appear' : ''}`}
                style={{ animationDelay: `${index * 0.1}s` }}
                data-category={item.category}
              >
                <div className="gallery-image">
                  <img src={item.imagePath} alt={item.title} />
                </div>
                <div className="gallery-overlay">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <button className="view-project-btn">View Project</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="reviews-section">
          <div className="section-header">
            <h2>What Our Clients Say</h2>
            <p>Hear from our satisfied customers about their experience working with us</p>
          </div>
          <div className="reviews-container">
            {reviews.map((review, index) => (
              <div 
                key={review.id}
                className={`review-card fade-in ${isVisible ? 'appear' : ''}`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="review-header">
                  <div className="review-avatar">
                    <img src={review.avatar} alt={review.name} />
                  </div>
                  <div className="review-info">
                    <h3>{review.name}</h3>
                    <div className="review-stars">
                      {renderStars(review.rating)}
                    </div>
                    <p>{review.position}</p>
                  </div>
                </div>
                <p className="review-text">{review.text}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default GalleryPage;