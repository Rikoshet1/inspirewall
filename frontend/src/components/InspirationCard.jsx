const cardStyles = ['sage', 'sand', 'lavender', 'rose'];

function InspirationCard({ inspiration, index }) {
  const author = inspiration.author?.trim() || 'לא ידוע';
  const tags = Array.isArray(inspiration.tags) ? inspiration.tags : [];
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
            {tags.slice(0, 3).map((tag) => <li key={tag}>{tag}</li>)}
          </ul>
        )}
      </div>
    </article>
  );
}

export default InspirationCard;
