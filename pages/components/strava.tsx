import useSWR from 'swr';

// const fetcher = (...args: any) => fetch(...args).then((res) => res.json())

const Strava = () => {
    // const { data, error } = useSWR('https://www.strava.com/clubs/93874/latest-rides/7edcdb120ed13329453ca71e308c10a6909611d8?show_rides=false', fetcher);

    return (
        <div className="strava flex flex-row flex-wrap w-full content-start">
            <h3  className="w-full border-b-8 border-strava mb-5"><a href="https://www.strava.com/clubs/sitwellcc" className="inline-block bg-strava text-white text-md font-ropa uppercase pt-2 px-3">Strava</a></h3>
            <div className="w-full">
                {/* {error && <p>Failed to load.</p>}
                {!data && <p>Loading &hellip;</p>} */}
                {/* <?php echo $strava_title ?>
                <?php echo $strava_data ?> */}
            </div>
        </div>
    );
};

export default Strava;
