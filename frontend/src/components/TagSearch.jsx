function TagSearch({ tags, value, onChange }) {
  return (
    <div className="tag-search">
      <label htmlFor="tag-search-input">חיפוש לפי תגית</label>
      <div className="tag-search-controls">
        <input
          id="tag-search-input"
          type="search"
          list="available-tags"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="הקלידו או בחרו תגית..."
          autoComplete="off"
        />
        <datalist id="available-tags">
          {tags.map((tag) => <option key={tag} value={tag} />)}
        </datalist>
        {value && (
          <button
            className="clear-tag-search"
            type="button"
            onClick={() => onChange('')}
          >
            ניקוי
          </button>
        )}
      </div>
    </div>
  );
}

export default TagSearch;
