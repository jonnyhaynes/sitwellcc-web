import { useState } from 'react';

type Props = {
    title: string;
    description: string;
};

const Accordion = ({ title, description } : Props) => {
    const [isActive, setIsActive] = useState(false);

    return (
        <article className="mb-5 pb-3 border-b border-black border-opacity-25">
            <h3 className="font-bold mb-2 cursor-pointer leading-tight" onClick={() => setIsActive(!isActive)}>{title}</h3>
            {isActive && <p className="text-sm mb-2" dangerouslySetInnerHTML={{__html: description}} />}
        </article>
    );
};

export default Accordion;
