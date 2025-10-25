import { Category, Place } from '../Types';
import PlaceCard from './PlaceCard';

interface CategoryDetailsProps {
  category: Category;
  places: Place[];
}

export default function CategoryDetails({ category, places }: CategoryDetailsProps) {
  return (
    <section className="category-details">
      <div className="container mx-auto px-4">
        <div className="category-header">
          <div className="category-badge">
            <div 
              className="badge-icon"
              style={{ backgroundColor: category.color }}
            >
              <div 
                className="badge-image"
                style={{ backgroundImage: `url(${category.image})` }}
              />
            </div>
          </div>
          <div className="category-info">
            <h2 className="category-title">{category.name}</h2>
            <p className="category-description">{category.description}</p>
          </div>
        </div>

        {places.length > 0 ? (
          <div className="places-section">
            <h3 className="places-title">Featured Destinations</h3>
            <div className="places-grid">
              {places.map((place) => (
                <PlaceCard key={place.id} place={place} />
              ))}
            </div>
          </div>
        ) : (
          <div className="no-places">
            <div className="no-places-content">
              <div className="no-places-icon">🌴</div>
              <h3 className="no-places-title">Coming Soon</h3>
              <p className="no-places-text">
                We&apos;re adding more amazing places for {category.name}. 
                Check back soon for new destinations!
              </p>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .category-details {
          padding: 4rem 0;
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(20px);
          min-height: 60vh;
        }

        .category-header {
          display: flex;
          align-items: center;
          gap: 2rem;
          margin-bottom: 3rem;
          max-width: 1000px;
          margin-left: auto;
          margin-right: auto;
        }

        .category-badge {
          flex-shrink: 0;
        }

        .badge-icon {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          overflow: hidden;
          position: relative;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        }

        .badge-image {
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
          border-radius: 50%;
        }

        .category-info {
          flex: 1;
        }

        .category-title {
          font-size: 3rem;
          font-weight: 800;
          color: #1f2937;
          margin-bottom: 0.5rem;
          letter-spacing: -0.025em;
        }

        .category-description {
          font-size: 1.3rem;
          color: #6b7280;
          line-height: 1.6;
        }

        .places-section {
          max-width: 1200px;
          margin: 0 auto;
        }

        .places-title {
          font-size: 2rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 2rem;
          text-align: center;
        }

        .places-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
          gap: 2rem;
        }

        .no-places {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 300px;
        }

        .no-places-content {
          text-align: center;
          max-width: 400px;
        }

        .no-places-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .no-places-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .no-places-text {
          color: #6b7280;
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .category-header {
            flex-direction: column;
            text-align: center;
            gap: 1.5rem;
          }

          .category-title {
            font-size: 2.2rem;
          }

          .category-description {
            font-size: 1.1rem;
          }

          .places-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .badge-icon {
            width: 80px;
            height: 80px;
          }
        }

        @media (max-width: 480px) {
          .category-details {
            padding: 3rem 0;
          }

          .category-title {
            font-size: 1.8rem;
          }

          .places-title {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </section>
  );
}