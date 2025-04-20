import React, { useState } from 'react';

const AddNotes = ({ onSaveNotes }) => {
  const [notes, setNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (notes) {
      onSaveNotes(notes);
      setNotes('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Add notes for this video..."
      ></textarea>
      <button type="submit">Save Notes</button>
    </form>
  );
};

export default AddNotes;
