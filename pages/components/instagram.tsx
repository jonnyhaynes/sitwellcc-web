const Instagram = () => {
    return (
        <div className="instagram md:col-span-2 flex flex-row flex-wrap content-start mb-10 lg:mb-0">
        <h3  className="w-full border-b-8 border-instagram mb-5"><a href="https://www.instagram.com/sitwellcc/" className="inline-block bg-instagram text-white text-md font-ropa uppercase pt-2 px-3">Instagram</a></h3>
        <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-2.5">
            {/* @foreach ($instagram_data as $post)
                <a href="https://www.instagram.com/p/{{ $post['url'] }}/" className="relative group">
                    <img src="{{ $post['img'] }}" alt="A photograph from the Instagram account of Sitwell Cycling Club" />
                    <div className="absolute opacity-0 group-hover:opacity-100 top-0 left-0 w-full h-full bg-white bg-opacity-75 flex content-center justify-center">
                        <span className="inline-flex flex-row mr-5 text-black">
                            <img src="/img/heart.svg" width="20" height="20" className="float-left mr-2" alt="Heart icon" style="width: 20px; height: 20px;" />
                            <strong className="self-center">{{ $post['likes'] }}</strong>
                        </span>
                        <span className="inline-flex flex-row text-black">
                            <img src="/img/chat.svg" width="20" height="20" className="float-left mr-2" alt="Chat icon" style="width: 20px; height: 20px;" />
                            <strong className="self-center">{{ $post['comments'] }}</strong>
                        </span>
                    </div>
                </a>
            @endforeach */}
        </div>
    </div>
    );
};

export default Instagram;
