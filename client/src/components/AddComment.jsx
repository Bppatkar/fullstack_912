import React, { useState } from 'react';

const AddComment = ({ onAddComment }) => {
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (comment) {
      onAddComment(comment);
      setComment('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Add a comment..."
      ></textarea>
      <button type="submit">Add Comment</button>
    </form>
  );
};

export default AddComment;
