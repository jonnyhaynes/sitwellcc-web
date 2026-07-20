import { useState, useId } from 'react';

type Props = {
  title: string;
  description: string;
};

const Accordion = ({ title, description }: Props) => {
  const [isActive, setIsActive] = useState(false);
  const panelId = useId();

  return (
    <article className="mb-5 pb-3 border-b border-black/25">
      <h3 className="font-bold leading-tight mb-0">
        <button
          className="w-full text-left cursor-pointer font-bold leading-tight py-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
          onClick={() => setIsActive(!isActive)}
          aria-expanded={isActive}
          aria-controls={panelId}
        >
          {title}
        </button>
      </h3>
      {isActive && (
        <p id={panelId} className="mb-2" dangerouslySetInnerHTML={{ __html: description }} />
      )}
    </article>
  );
};

export default Accordion;
