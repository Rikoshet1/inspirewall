import { useEffect, useState } from 'react';
import { getInspirations } from '../services/inspirations.js';
import { sampleInspirations } from '../data/sampleInspirations.js';
import InspirationCard from './InspirationCard.jsx';

function InspirationBoard() {
  const [inspirations, setInspirations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [connectionError, setConnectionError] = useState('');
  const [isUsingSamples, setIsUsingSamples] = useState(false);

  useEffect(() => {
    let isMounted = true;

    getInspirations()
      .then((items) => {
        if (!isMounted) return;
        setInspirations(items);
        setIsLoading(false);
      })
      .catch((error) => {
        if (!isMounted) return;
        setConnectionError(error.message);
        setInspirations(sampleInspirations);
        setIsUsingSamples(true);
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className="board-page">
      <header className="site-header">
        <a className="brand" href="/" aria-label="InspireWall - דף הבית">
          <span className="brand-mark" aria-hidden="true">״</span>
          <span>InspireWall</span>
        </a>
        <span className="header-note">אוסף של מחשבות טובות</span>
      </header>

      <section className="board-content" aria-labelledby="board-title">
        <div className="board-intro">
          <p className="eyebrow">מרחב קטן להשראה יומיומית</p>
          <h1 id="board-title">מילים שנשארות איתנו</h1>
          <p className="board-description">
            רעיונות, מחשבות ומשפטים שכדאי לעצור לרגע ולקרוא.
          </p>
        </div>

        {isUsingSamples && (
          <p className="connection-notice" role="status">
            לא הצלחנו להתחבר לשרת ({connectionError}). מוצגות דוגמאות לתצוגה.
          </p>
        )}

        {isLoading ? (
          <p className="board-message" role="status">טוען את אוסף ההשראה...</p>
        ) : inspirations.length > 0 ? (
          <>
            <div className="board-toolbar">
              <span className="item-count">{inspirations.length} משפטים באוסף</span>
            </div>
            <div className="inspiration-grid">
              {inspirations.map((inspiration, index) => (
                <InspirationCard
                  key={inspiration.id ?? `${inspiration.content}-${index}`}
                  inspiration={inspiration}
                  index={index}
                />
              ))}
            </div>
          </>
        ) : (
          <p className="board-message">האוסף עדיין ריק. בקרוב יופיעו כאן המשפטים שלך.</p>
        )}
      </section>
    </main>
  );
}

export default InspirationBoard;
