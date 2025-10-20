"use client";

import React, { useState, useEffect, useRef } from 'react';
import './CreatePackagePage.css';

interface Place {
  id: number;
  name: string;
  description: string;
  imagePath: string;
  category: string;
  duration: string;
  price: number;
  location: string;
  highlights: string[];
}

interface CustomPackage {
  id: string;
  name: string;
  description: string;
  places: Place[];
  totalDuration: string;
  totalPrice: number;
  preferences: {
    pace: string;
    transport: string;
    guide: boolean;
    meals: boolean;
    photography: boolean;
  };
  contactInfo: {
    name: string;
    email: string;
    phone: string;
    date: string;
    guests: number;
    specialRequests: string;
  };
}

const CreatePackagePage: React.FC = () => {
  const [selectedPlaces, setSelectedPlaces] = useState<Place[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [packageForm, setPackageForm] = useState({
    name: '',
    description: '',
    pace: 'moderate',
    transport: 'walking',
    guide: true,
    meals: false,
    photography: false,
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    preferredDate: '',
    guests: 2,
    specialRequests: ''
  });
  const sectionRef = useRef<HTMLDivElement>(null);

  const availablePlaces: Place[] = [
    {
      id: 1,
      name: 'Brooklyn Bridge',
      description: 'Iconic suspension bridge connecting Manhattan and Brooklyn with breathtaking skyline views.',
      imagePath: '/images/places/Arugam.jpg',
      category: 'landmark',
      duration: '2 hours',
      price: 0,
      location: 'DUMBO, Brooklyn',
      highlights: ['Skyline Views', 'Photo Opportunities', 'Historical Significance']
    },
    {
      id: 2,
      name: 'Brooklyn Heights Promenade',
      description: 'Famous elevated walkway offering stunning views of Manhattan skyline and Brooklyn Bridge.',
      imagePath: '/images/places/Sinharaja.jpg',
      category: 'scenic',
      duration: '1.5 hours',
      price: 0,
      location: 'Brooklyn Heights',
      highlights: ['Manhattan Views', 'Peaceful Walk', 'Architecture']
    },
    {
      id: 3,
      name: 'DUMBO Waterfront',
      description: 'Trendy neighborhood known for its cobblestone streets, art galleries, and Manhattan Bridge views.',
      imagePath: '/images/places/Kanneliya.jpg',
      category: 'cultural',
      duration: '2 hours',
      price: 0,
      location: 'DUMBO',
      highlights: ['Art Galleries', 'Cobblestone Streets', 'Bridge Views']
    },
    {
      id: 4,
      name: 'Brooklyn Botanic Garden',
      description: '52-acre garden featuring cherry esplanade, Japanese garden, and rose garden.',
      imagePath: '/images/places/Pasikudah.jpg',
      category: 'nature',
      duration: '3 hours',
      price: 18,
      location: 'Prospect Heights',
      highlights: ['Japanese Garden', 'Cherry Blossoms', 'Rose Garden']
    },
    {
      id: 5,
      name: 'Williamsburg',
      description: 'Hip neighborhood with vibrant street art, boutique shops, and diverse food scene.',
      imagePath: '/images/places/Sinharaja.jpg',
      category: 'cultural',
      duration: '3 hours',
      price: 0,
      location: 'Williamsburg',
      highlights: ['Street Art', 'Boutique Shopping', 'Food Scene']
    },
    {
      id: 6,
      name: 'Coney Island',
      description: 'Classic amusement area with boardwalk, amusement park, and beach activities.',
      imagePath: '/images/places/Pasikudah.jpg',
      category: 'entertainment',
      duration: '4 hours',
      price: 45,
      location: 'Coney Island',
      highlights: ['Amusement Park', 'Beach', 'Boardwalk']
    },
    {
      id: 7,
      name: 'Prospect Park',
      description: '526-acre urban park designed by the same architects as Central Park.',
      imagePath: '/images/places/Pasikudah.jpg',
      category: 'nature',
      duration: '2.5 hours',
      price: 0,
      location: 'Prospect Park',
      highlights: ['Long Meadow', 'Lake', 'Boat House']
    },
    {
      id: 8,
      name: 'Brooklyn Museum',
      description: 'World-class museum with extensive collections of art and historical artifacts.',
      imagePath: '/images/places/Pasikudah.jpg',
      category: 'cultural',
      duration: '2 hours',
      price: 16,
      location: 'Prospect Heights',
      highlights: ['Art Collections', 'Egyptian Art', 'Contemporary Exhibits']
    },
    {
      id: 9,
      name: 'Industry City',
      description: 'Revitalized industrial complex with food halls, shops, and creative studios.',
      imagePath: '/images/places/Pasikudah.jpg',
      category: 'shopping',
      duration: '2 hours',
      price: 0,
      location: 'Sunset Park',
      highlights: ['Food Halls', 'Local Shops', 'Creative Spaces']
    },
    {
      id: 10,
      name: 'Green-Wood Cemetery',
      description: 'Historic cemetery and arboretum with beautiful landscapes and notable graves.',
      imagePath: '/images/places/Pasikudah.jpg',
      category: 'historical',
      duration: '2 hours',
      price: 0,
      location: 'Sunset Park',
      highlights: ['Historical Graves', 'Beautiful Landscapes', 'Architecture']
    },
    {
      id: 11,
      name: 'Barclays Center',
      description: 'Multi-purpose arena hosting concerts, sports events, and entertainment shows.',
      imagePath: '/images/places/Pasikudah.jpg',
      category: 'entertainment',
      duration: '3 hours',
      price: 75,
      location: 'Prospect Heights',
      highlights: ['Concerts', 'Sports Events', 'Entertainment']
    },
    {
      id: 12,
      name: 'Smorgasburg',
      description: 'Open-air food market featuring dozens of local food vendors and artisans.',
      imagePath: '/images/places/Pasikudah.jpg',
      category: 'food',
      duration: '2 hours',
      price: 0,
      location: 'Williamsburg',
      highlights: ['Food Vendors', 'Local Artisans', 'Outdoor Market']
    }
  ];

  const filteredPlaces = activeCategory === 'all' 
    ? availablePlaces 
    : availablePlaces.filter(place => place.category === activeCategory);

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
  };

  const handleAddPlace = (place: Place) => {
    if (!selectedPlaces.find(p => p.id === place.id)) {
      setSelectedPlaces([...selectedPlaces, place]);
    }
  };

  const handleRemovePlace = (placeId: number) => {
    setSelectedPlaces(selectedPlaces.filter(place => place.id !== placeId));
  };

  const handleMovePlace = (index: number, direction: 'up' | 'down') => {
    const newPlaces = [...selectedPlaces];
    if (direction === 'up' && index > 0) {
      [newPlaces[index], newPlaces[index - 1]] = [newPlaces[index - 1], newPlaces[index]];
    } else if (direction === 'down' && index < newPlaces.length - 1) {
      [newPlaces[index], newPlaces[index + 1]] = [newPlaces[index + 1], newPlaces[index]];
    }
    setSelectedPlaces(newPlaces);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setPackageForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };


  
  const calculateTotalDuration = () => {
    // Simple calculation - you might want to make this more sophisticated
    const totalHours = selectedPlaces.reduce((total, place) => {
      const hours = parseFloat(place.duration.split(' ')[0]);
      return total + hours;
    }, 0);
    return `${totalHours} hours`;
  };

  const calculateTotalPrice = () => {
    return selectedPlaces.reduce((total, place) => total + place.price, 0);
  };

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // In the CreatePackagePage component, replace the places-grid section with this:

<div className="places-grid">
  {filteredPlaces.map((place, index) => (
    <div 
      key={place.id}
      className={`place-card fade-in ${isVisible ? 'appear' : ''}`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="place-image">
        <img src={place.imagePath} alt={place.name} />
        <button 
          className="add-place-btn"
          onClick={() => handleAddPlace(place)}
          disabled={selectedPlaces.find(p => p.id === place.id) !== undefined}
          title="Add to itinerary"
        >
          <i className="fas fa-plus"></i>
        </button>
        {place.price > 0 && (
          <div className="price-badge">${place.price}</div>
        )}
      </div>
      
      <div className="place-content">
        <div className="place-header">
          <h4>{place.name}</h4>
          <span className="duration">{place.duration}</span>
        </div>
        
        <p className="place-description">{place.description}</p>
        
        <div className="place-location">
          <i className="fas fa-map-marker-alt"></i>
          <span>{place.location}</span>
        </div>
        
        <div className="place-highlights">
          {place.highlights.map((highlight, idx) => (
            <span key={idx} className="highlight-tag">#{highlight}</span>
          ))}
        </div>
      </div>
    </div>
  ))}
</div>

  const handleSubmitPackage = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the package data to your backend/admin
    const customPackage: CustomPackage = {
      id: `custom-${Date.now()}`,
      name: packageForm.name,
      description: packageForm.description,
      places: selectedPlaces,
      totalDuration: calculateTotalDuration(),
      totalPrice: calculateTotalPrice(),
      preferences: {
        pace: packageForm.pace,
        transport: packageForm.transport,
        guide: packageForm.guide,
        meals: packageForm.meals,
        photography: packageForm.photography
      },
      contactInfo: {
        name: packageForm.contactName,
        email: packageForm.contactEmail,
        phone: packageForm.contactPhone,
        date: packageForm.preferredDate,
        guests: packageForm.guests,
        specialRequests: packageForm.specialRequests
      }
    };

    alert(`Thank you ${packageForm.contactName}! Your custom package "${packageForm.name}" has been submitted to our team. We'll contact you within 24 hours to finalize your tour!`);
    
    // Reset form
    setSelectedPlaces([]);
    setCurrentStep(1);
    setPackageForm({
      name: '',
      description: '',
      pace: 'moderate',
      transport: 'walking',
      guide: true,
      meals: false,
      photography: false,
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      preferredDate: '',
      guests: 2,
      specialRequests: ''
    });
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

  return (
    <div className="create-package-page">
      {/* Hero Section */}
      <section className="create-package-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>Create Your Dream Tour</h1>
          <p>Build your perfect Brooklyn experience by selecting your favorite places and customizing every detail.</p>
          <button className="cta-button">Start Building</button>
        </div>
        <div className="scroll-indicator">
          <span>Scroll Down</span>
          <div className="arrow"></div>
        </div>
      </section>

      <div className="container">
        {/* Progress Steps */}
        <div className="progress-steps">
          <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
            <div className="step-number">1</div>
            <span>Choose Places</span>
          </div>
          <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
            <div className="step-number">2</div>
            <span>Customize</span>
          </div>
          <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
            <div className="step-number">3</div>
            <span>Submit</span>
          </div>
        </div>

        {/* Step 1: Choose Places */}
        {currentStep === 1 && (
          <section className="places-section" ref={sectionRef}>
            <div className="section-header">
              <h2>Choose Your Places</h2>
              <p>Select the locations you want to visit by clicking the + button</p>
            </div>

            <div className="places-filters">
              <button 
                className={`filter-btn ${activeCategory === 'all' ? 'active' : ''}`}
                onClick={() => handleCategoryClick('all')}
              >
                All Places
              </button>
              <button 
                className={`filter-btn ${activeCategory === 'landmark' ? 'active' : ''}`}
                onClick={() => handleCategoryClick('landmark')}
              >
                Landmarks
              </button>
              <button 
                className={`filter-btn ${activeCategory === 'cultural' ? 'active' : ''}`}
                onClick={() => handleCategoryClick('cultural')}
              >
                Cultural
              </button>
              <button 
                className={`filter-btn ${activeCategory === 'nature' ? 'active' : ''}`}
                onClick={() => handleCategoryClick('nature')}
              >
                Nature
              </button>
              <button 
                className={`filter-btn ${activeCategory === 'food' ? 'active' : ''}`}
                onClick={() => handleCategoryClick('food')}
              >
                Food & Drink
              </button>
              <button 
                className={`filter-btn ${activeCategory === 'entertainment' ? 'active' : ''}`}
                onClick={() => handleCategoryClick('entertainment')}
              >
                Entertainment
              </button>
            </div>

            <div className="selection-area">
              <div className="available-places">
                <h3>Available Places ({filteredPlaces.length})</h3>
                <div className="places-grid">
                  {filteredPlaces.map((place, index) => (
                    <div 
                      key={place.id}
                      className={`place-card fade-in ${isVisible ? 'appear' : ''}`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="place-image">
                        <img src={place.imagePath} alt={place.name} />
                        <button 
                          className="add-place-btn"
                          onClick={() => handleAddPlace(place)}
                          disabled={selectedPlaces.find(p => p.id === place.id) !== undefined}
                        >
                          <i className="fas fa-plus"></i>
                        </button>
                        {place.price > 0 && (
                          <div className="price-badge">${place.price}</div>
                        )}
                      </div>
                      
                      <div className="place-content">
                        <div className="place-header">
                          <h4>{place.name}</h4>
                          <span className="duration">{place.duration}</span>
                        </div>
                        
                        <p className="place-description">{place.description}</p>
                        
                        <div className="place-location">
                          <i className="fas fa-map-marker-alt"></i>
                          <span>{place.location}</span>
                        </div>
                        
                        <div className="place-highlights">
                          {place.highlights.map((highlight, idx) => (
                            <span key={idx} className="highlight-tag">#{highlight}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="selected-places">
                <h3>Your Itinerary ({selectedPlaces.length})</h3>
                {selectedPlaces.length === 0 ? (
                  <div className="empty-itinerary">
                    <i className="fas fa-map-marked-alt"></i>
                    <p>No places selected yet</p>
                    <span>Click the + buttons to add places to your itinerary</span>
                  </div>
                ) : (
                  <div className="itinerary-list">
                    {selectedPlaces.map((place, index) => (
                      <div key={place.id} className="itinerary-item">
                        <div className="item-number">{index + 1}</div>
                        <div className="item-content">
                          <h4>{place.name}</h4>
                          <span className="item-duration">{place.duration}</span>
                          {place.price > 0 && <span className="item-price">${place.price}</span>}
                        </div>
                        <div className="item-actions">
                          <button 
                            className="move-btn"
                            onClick={() => handleMovePlace(index, 'up')}
                            disabled={index === 0}
                          >
                            <i className="fas fa-arrow-up"></i>
                          </button>
                          <button 
                            className="move-btn"
                            onClick={() => handleMovePlace(index, 'down')}
                            disabled={index === selectedPlaces.length - 1}
                          >
                            <i className="fas fa-arrow-down"></i>
                          </button>
                          <button 
                            className="remove-btn"
                            onClick={() => handleRemovePlace(place.id)}
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                    
                    <div className="itinerary-summary">
                      <div className="summary-item">
                        <span>Total Duration:</span>
                        <span>{calculateTotalDuration()}</span>
                      </div>
                      <div className="summary-item">
                        <span>Total Cost:</span>
                        <span>${calculateTotalPrice()}</span>
                      </div>
                      <div className="summary-item">
                        <span>Places:</span>
                        <span>{selectedPlaces.length}</span>
                      </div>
                    </div>

                    <button 
                      className="next-step-btn"
                      onClick={handleNextStep}
                      disabled={selectedPlaces.length === 0}
                    >
                      Continue to Customize
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Step 2: Customize Package */}
        {currentStep === 2 && (
          <section className="customize-section">
            <div className="section-header">
              <h2>Customize Your Experience</h2>
              <p>Tell us about your preferences to make your tour perfect</p>
            </div>

            <div className="customize-content">
              <div className="package-details">
                <h3>Package Details</h3>
                <div className="form-group">
                  <label htmlFor="packageName">Tour Name</label>
                  <input
                    type="text"
                    id="packageName"
                    name="name"
                    value={packageForm.name}
                    onChange={handleFormChange}
                    placeholder="Give your tour a name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="packageDescription">Description</label>
                  <textarea
                    id="packageDescription"
                    name="description"
                    value={packageForm.description}
                    onChange={handleFormChange}
                    placeholder="Describe what you want from this tour"
                    rows={4}
                  />
                </div>
              </div>

              <div className="preferences">
                <h3>Tour Preferences</h3>
                <div className="preferences-grid">
                  <div className="preference-group">
                    <label>Pace</label>
                    <div className="radio-group">
                      <label className="radio-option">
                        <input
                          type="radio"
                          name="pace"
                          value="relaxed"
                          checked={packageForm.pace === 'relaxed'}
                          onChange={handleFormChange}
                        />
                        <span>Relaxed</span>
                      </label>
                      <label className="radio-option">
                        <input
                          type="radio"
                          name="pace"
                          value="moderate"
                          checked={packageForm.pace === 'moderate'}
                          onChange={handleFormChange}
                        />
                        <span>Moderate</span>
                      </label>
                      <label className="radio-option">
                        <input
                          type="radio"
                          name="pace"
                          value="fast"
                          checked={packageForm.pace === 'fast'}
                          onChange={handleFormChange}
                        />
                        <span>Fast-paced</span>
                      </label>
                    </div>
                  </div>

                  <div className="preference-group">
                    <label>Transport</label>
                    <div className="radio-group">
                      <label className="radio-option">
                        <input
                          type="radio"
                          name="transport"
                          value="walking"
                          checked={packageForm.transport === 'walking'}
                          onChange={handleFormChange}
                        />
                        <span>Walking</span>
                      </label>
                      <label className="radio-option">
                        <input
                          type="radio"
                          name="transport"
                          value="public"
                          checked={packageForm.transport === 'public'}
                          onChange={handleFormChange}
                        />
                        <span>Public Transport</span>
                      </label>
                      <label className="radio-option">
                        <input
                          type="radio"
                          name="transport"
                          value="private"
                          checked={packageForm.transport === 'private'}
                          onChange={handleFormChange}
                        />
                        <span>Private Vehicle</span>
                      </label>
                    </div>
                  </div>

                  <div className="preference-group">
                    <label>Add-ons</label>
                    <div className="checkbox-group">
                      <label className="checkbox-option">
                        <input
                          type="checkbox"
                          name="guide"
                          checked={packageForm.guide}
                          onChange={handleFormChange}
                        />
                        <span>Professional Guide (+$50)</span>
                      </label>
                      <label className="checkbox-option">
                        <input
                          type="checkbox"
                          name="meals"
                          checked={packageForm.meals}
                          onChange={handleFormChange}
                        />
                        <span>Include Meals (+$30/person)</span>
                      </label>
                      <label className="checkbox-option">
                        <input
                          type="checkbox"
                          name="photography"
                          checked={packageForm.photography}
                          onChange={handleFormChange}
                        />
                        <span>Professional Photography (+$75)</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="step-actions">
                <button className="prev-step-btn" onClick={handlePrevStep}>
                  Back to Places
                </button>
                <button className="next-step-btn" onClick={handleNextStep}>
                  Continue to Submit
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Step 3: Submit Package */}
        {currentStep === 3 && (
          <section className="submit-section">
            <div className="section-header">
              <h2>Submit Your Custom Package</h2>
              <p>Almost done! Just provide your contact information and we'll get back to you within 24 hours.</p>
            </div>

            <div className="submit-content">
              <div className="package-summary">
                <h3>Package Summary</h3>
                <div className="summary-card">
                  <h4>{packageForm.name || 'My Custom Tour'}</h4>
                  <p>{packageForm.description || 'No description provided'}</p>
                  
                  <div className="summary-details">
                    <div className="detail-item">
                      <span>Total Duration:</span>
                      <span>{calculateTotalDuration()}</span>
                    </div>
                    <div className="detail-item">
                      <span>Total Places:</span>
                      <span>{selectedPlaces.length}</span>
                    </div>
                    <div className="detail-item">
                      <span>Pace:</span>
                      <span className="capitalize">{packageForm.pace}</span>
                    </div>
                    <div className="detail-item">
                      <span>Transport:</span>
                      <span className="capitalize">{packageForm.transport}</span>
                    </div>
                  </div>

                  <div className="selected-places-list">
                    <h5>Selected Places:</h5>
                    <ul>
                      {selectedPlaces.map((place, index) => (
                        <li key={place.id}>
                          <span className="place-number">{index + 1}.</span>
                          <span className="place-name">{place.name}</span>
                          <span className="place-duration">{place.duration}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <form className="contact-form" onSubmit={handleSubmitPackage}>
                <h3>Your Information</h3>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="contactName">Full Name *</label>
                    <input
                      type="text"
                      id="contactName"
                      name="contactName"
                      value={packageForm.contactName}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="contactEmail">Email *</label>
                    <input
                      type="email"
                      id="contactEmail"
                      name="contactEmail"
                      value={packageForm.contactEmail}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="contactPhone">Phone *</label>
                    <input
                      type="tel"
                      id="contactPhone"
                      name="contactPhone"
                      value={packageForm.contactPhone}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="preferredDate">Preferred Date</label>
                    <input
                      type="date"
                      id="preferredDate"
                      name="preferredDate"
                      value={packageForm.preferredDate}
                      onChange={handleFormChange}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="guests">Number of Guests</label>
                    <select
                      id="guests"
                      name="guests"
                      value={packageForm.guests}
                      onChange={handleFormChange}
                    >
                      {[1,2,3,4,5,6,7,8,9,10].map(num => (
                        <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="specialRequests">Special Requests</label>
                  <textarea
                    id="specialRequests"
                    name="specialRequests"
                    value={packageForm.specialRequests}
                    onChange={handleFormChange}
                    placeholder="Any special requirements or additional information?"
                    rows={4}
                  />
                </div>

                <div className="form-actions">
                  <button type="button" className="prev-step-btn" onClick={handlePrevStep}>
                    Back to Customize
                  </button>
                  <button type="submit" className="submit-package-btn">
                    Submit Package to Admin
                  </button>
                </div>
              </form>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default CreatePackagePage;