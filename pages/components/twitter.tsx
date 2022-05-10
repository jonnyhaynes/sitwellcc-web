const Twitter = () => {
    return (
        <div className="twitter flex flex-row flex-wrap w-full content-start mb-10 md:mb-0">
            <h3  className="w-full border-b-8 border-twitter"><a href="https://twitter.com/sitwellcc" className="inline-block bg-twitter text-white text-md font-ropa uppercase pt-2 px-3">Twitter</a></h3>
            {/* @foreach ($twitter_data as $tweet)
            <div className="w-full flex flex-row mt-5">
                <div className="flex-shrink-0">
                    @if (isset($tweet->retweeted_status))
                        <a href="https://www.twitter.com/{{ $tweet->retweeted_status->user->screen_name }}">
                            <img src="{{ $tweet->retweeted_status->user->profile_image_url_https }}" alt="The Twitter profile image of the account {{ $tweet->retweeted_status->user->screen_name }}" />
                        </a>
                    @else
                        <a href="https://www.twitter.com/{{ $tweet->user->screen_name }}">
                            <img src="{{ $tweet->user->profile_image_url_https }}"  alt="The Twitter profile image of the account {{ $tweet->user->screen_name }}" />
                        </a>
                    @endif

                </div>
                <div className="flex-grow-1">
                    <div className="text-sm ml-5">
                        <p className="mb-4">{!! $tweet->text !!}</p>
                        <p className="text-xs opacity-50 mb-3">
                            <a href="https://www.twitter.com/sitwellcc/status/{{ $tweet->id }}" className="text-current">{{ date('g:i a · j M Y', strtotime($tweet->created_at)) }}</a>
                        </p>
                        <span className="inline-flex flex-row mr-5">
                            <img src="/img/heart.svg" width="20" height="20" className="float-left mr-2" alt="Heart icon" style="width: 20px; height: 20px;" />
                            <strong>{{ $tweet->favorite_count }}</strong>
                        </span>
                        <span className="inline-flex flex-row mr-5">
                            <img src="/img/retweet.svg" width="20" height="20" className="float-left mr-2" alt="Retweet icon" style="width: 20px; height: 20px;" />
                            <strong>{{ $tweet->retweet_count }}</strong>
                        </span>
                    </div>
                </div>
            </div>
            @endforeach */}

        </div>
    );
};

export default Twitter;
