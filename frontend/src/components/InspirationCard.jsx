const cardStyles = ['sage', 'sand', 'lavender', 'rose'];

function InspirationCard({ inspiration, index, activeTag, onTagSelect }) {
  const author = inspiration.author?.trim() || 'לא ידוע';
  const tags = Array.isArray(inspiration.tags)
    ? inspiration.tags.filter((tag) => typeof tag === 'string' && tag.trim())
    : [];
  const style = cardStyles[index % cardStyles.length];

  return (
    <article className={`inspiration-card ${style}`}>
      <span className="card-quote-mark" aria-hidden="true">״</span>
      <p className="card-content">{inspiration.content}</p>
      <div className="card-footer">
        <div className="card-author">
          <span className="author-avatar" aria-hidden="true">
            {author.slice(0, 1)}
          </span>
          <span>{author}</span>
        </div>
        {tags.length > 0 && (
          <ul className="card-tags" aria-label="תגיות">
            {tags.map((tag) => (
              <li key={tag}>
                <button
                  className="card-tag-button"
                  type="button"
                  aria-pressed={tag.trim().toLocaleLowerCase() === activeTag.trim().toLocaleLowerCase()}
                  onClick={() => onTagSelect(tag)}
                >
                  {tag}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}

export default InspirationCard;
