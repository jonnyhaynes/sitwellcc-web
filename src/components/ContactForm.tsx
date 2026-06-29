import { useState } from 'react';

const options = [
  '',
  'Club Rides',
  'Go-Ride coaching',
  'Races',
  'Charity work',
  'Membership',
  'Kit',
  'Welfare & Safeguarding',
  'Sponsorship',
  'Other',
];

type Errors = {
  name?: boolean;
  email?: boolean;
  query?: boolean;
  message?: boolean;
};

const ContactForm = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [query, setQuery] = useState('');
  const [message, setMessage] = useState('');

  const [errors, setErrors] = useState<Errors>({});
  const [buttonText, setButtonText] = useState('Send message');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleValidation = () => {
    const tempErrors: Errors = {};
    let isValid = true;

    if (name.length <= 0) {
      tempErrors.name = true;
      isValid = false;
    }
    if (email.length <= 0) {
      tempErrors.email = true;
      isValid = false;
    }
    if (query.length <= 0) {
      tempErrors.query = true;
      isValid = false;
    }
    if (message.length <= 0) {
      tempErrors.message = true;
      isValid = false;
    }

    setErrors({ ...tempErrors });
    return isValid;
  };

  const resetFormFields = () => {
    setButtonText('Send message');
    setEmail('');
    setName('');
    setQuery('');
    setMessage('');
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!handleValidation()) {
      setShowSuccess(false);
      setShowError(true);
      return;
    }

    setButtonText('Sending…');

    const res = await fetch('/api/sendgrid', {
      body: JSON.stringify({ email, name, query, message }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    });

    const { error } = await res.json();
    if (error) {
      setShowSuccess(false);
      setShowError(true);
      resetFormFields();
      return;
    }

    setShowSuccess(true);
    setShowError(false);
    resetFormFields();
  };

  const errorClasses = 'border-red bg-red/25 text-red';

  return (
    <>
      {showSuccess && (
        <p className="text-green bg-green/25 px-3.5 py-2 mb-5">Thanks for getting in touch.</p>
      )}
      {showError && (
        <p className="text-red bg-red/25 px-3.5 py-2 mb-5">Please correct the errors below.</p>
      )}
      <form onSubmit={onSubmit}>
        <fieldset className="mb-5">
          <label htmlFor="name" className="block mb-2">
            Name
          </label>
          <input
            name="name"
            type="text"
            id="name"
            aria-describedby="name"
            className={`w-1/2 ${showError && errors.name ? errorClasses : ''}`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </fieldset>
        <fieldset className="mb-5">
          <label htmlFor="email" className="block mb-2">
            Email address
          </label>
          <input
            name="email"
            type="email"
            id="email"
            aria-describedby="email"
            className={`w-1/2 ${showError && errors.email ? errorClasses : ''}`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </fieldset>
        <fieldset className="mb-5">
          <label htmlFor="query" className="block mb-2">
            Query
          </label>
          <select
            name="query"
            id="query"
            aria-describedby="query"
            className={`w-1/2 ${showError && errors.query ? errorClasses : ''}`}
            onChange={(e) => setQuery(e.target.value)}
            value={query}
            required
          >
            {options.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </fieldset>
        <fieldset className="mb-5">
          <label htmlFor="info" className="block mb-2">
            Message
          </label>
          <textarea
            name="info"
            id="info"
            rows={5}
            className={`w-full ${showError && errors.message ? errorClasses : ''}`}
            onChange={(e) => setMessage(e.target.value)}
            value={message}
            required
          />
        </fieldset>
        <button type="submit" className="btn" aria-label="Send message">
          {buttonText}
        </button>
      </form>
    </>
  );
};

export default ContactForm;
