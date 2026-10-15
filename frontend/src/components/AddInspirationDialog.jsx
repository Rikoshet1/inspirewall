import { useState } from 'react';

function AddInspirationDialog({ onClose, onAdd }) {
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    if (!content.trim()) {
      setError('יש לכתוב את המשפט לפני השמירה.');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      await onAdd({
        content: content.trim(),
        author: author.trim() || 'ללא ציון שם',
      });
      onClose();
    } catch (saveError) {
      setError(`לא הצלחנו לשמור את המשפט. ${saveError.message}`);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div
      className="dialog-backdrop"
      onClick={(event) => {
        if (event.target === event.currentTarget && !isSaving) onClose();
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && !isSaving) onClose();
      }}
    >
      <section
        className="inspiration-dialog"
        dir="rtl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-inspiration-title"
      >
        <button
          className="dialog-close"
          type="button"
          aria-label="סגירה"
          onClick={onClose}
          disabled={isSaving}
        >
          ×
        </button>
        <p className="eyebrow">מקום למילים שלך</p>
        <h2 id="add-inspiration-title">הוספת משפט</h2>
        <p className="dialog-description">שתפו מחשבה טובה שתישאר כאן להשראה.</p>
        <form className="inspiration-form" onSubmit={handleSubmit}>
          <label htmlFor="inspiration-content">המשפט</label>
          <textarea
            id="inspiration-content"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="כתבו כאן את המשפט שלכם..."
            rows="4"
            required
            maxLength="500"
            autoFocus
          />
          <label htmlFor="inspiration-author">שם הכותב (לא חובה)</label>
          <input
            id="inspiration-author"
            value={author}
            onChange={(event) => setAuthor(event.target.value)}
            placeholder="ללא ציון שם"
            maxLength="100"
          />
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="submit-inspiration" type="submit" disabled={isSaving}>
            {isSaving ? 'שומרים...' : 'הוספת המשפט'}
          </button>
        </form>
      </section>
    </div>
  );
}

export default AddInspirationDialog;
