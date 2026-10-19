import { useEffect, useState } from 'react';
import { createInspiration, getInspirations } from '../services/inspirations.js';
import { sampleInspirations } from '../data/sampleInspirations.js';
import AddInspirationDialog from './AddInspirationDialog.jsx';
import InspirationCard from './InspirationCard.jsx';
import TagSearch from './TagSearch.jsx';

function InspirationBoard() {
  const [inspirations, setInspirations] = useState([]);
  const [tagQuery, setTagQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [connectionError, setConnectionError] = useState('');
  const [isUsingSamples, setIsUsingSamples] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

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

  async function handleAddInspiration(inspiration) {
    const createdInspiration = await createInspiration(inspiration);
    setInspirations((currentInspirations) => [createdInspiration, ...currentInspirations]);
  }

  const availableTags = [...new Set(
    inspirations.flatMap((inspiration) =>
      Array.isArray(inspiration.tags)
        ? inspiration.tags.filter((tag) => typeof tag === 'string' && tag.trim())
        : [],
    ),
  )].sort((first, second) => first.localeCompare(second));
  const normalizedQuery = tagQuery.trim().toLocaleLowerCase();
  const filteredInspirations = normalizedQuery
    ? inspirations.filter((inspiration) =>
      Array.isArray(inspiration.tags) && inspiration.tags.some(
        (tag) => typeof tag === 'string' && tag.toLocaleLowerCase().includes(normalizedQuery),
      ),
    )
    : inspirations;

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
        ) : (
          <>
            <div className="board-toolbar">
              <span className="item-count" role="status">
                {normalizedQuery
                  ? `${filteredInspirations.length} מתוך ${inspirations.length} משפטים`
                  : `${inspirations.length} משפטים באוסף`}
              </span>
              <button
                className="add-inspiration-button"
                type="button"
                onClick={() => setIsAddDialogOpen(true)}
              >
                <span aria-hidden="true">+</span>
                הוספת משפט
              </button>
            </div>
            {inspirations.length > 0 && (
              <TagSearch tags={availableTags} value={tagQuery} onChange={setTagQuery} />
            )}
            {inspirations.length > 0 && filteredInspirations.length > 0 ? (
              <div className="inspiration-grid">
                {filteredInspirations.map((inspiration) => {
                  const index = inspirations.indexOf(inspiration);
                  return (
                    <InspirationCard
                      key={inspiration.id ?? `${inspiration.content}-${index}`}
                      inspiration={inspiration}
                      index={index}
                      activeTag={tagQuery}
                      onTagSelect={setTagQuery}
                    />
                  );
                })}
              </div>
            ) : inspirations.length > 0 ? (
              <p className="board-message" role="status">
                לא נמצאו משפטים עם תגית „{tagQuery}”.{' '}
                <button className="clear-filter-link" type="button" onClick={() => setTagQuery('')}>
                  ניקוי החיפוש
                </button>
              </p>
            ) : (
              <p className="board-message">האוסף עדיין ריק. הוסיפו את המשפט הראשון.</p>
            )}
          </>
        )}
      </section>
      {isAddDialogOpen && (
        <AddInspirationDialog
          onClose={() => setIsAddDialogOpen(false)}
          onAdd={handleAddInspiration}
        />
      )}
    </main>
  );
}

export default InspirationBoard;
