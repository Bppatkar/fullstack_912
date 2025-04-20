const VideoCard = ({ video, comments }) => {
    return (
      <div className="video-card">
        <h2>{video.title}</h2>
        <p>{video.description}</p>
        <div className="comments-section">
          <h3>Comments</h3>
          {comments.map((comment) => (
            <div className="comment" key={comment.id}>
              <div className="author">{comment.author}</div>
              <div className="content">{comment.content}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  