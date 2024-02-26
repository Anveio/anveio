'use client';

export const SendMessageForm: React.FC = () => {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Create FormData from form
    const formData = new FormData(event.currentTarget);

    console.log(formData);

    try {
      const response = await fetch('/api/chat/send-message', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
      } else {
        console.error('Failed to send message');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='text-slate-700'>
      <div>
        <label htmlFor='username'>Username:</label>
        <input type='text' id='username' name='username' required />
      </div>
      <div>
        <label htmlFor='message'>Message:</label>
        <textarea id='message' name='message' required></textarea>
      </div>
      <button type='submit'>Send Message</button>
    </form>
  );
};
