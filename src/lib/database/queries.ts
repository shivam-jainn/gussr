import { query } from "./db";

export async function getQuestion() {
    // Get a random city with its image
    const cityResult = await query(
        'SELECT c.*, i.url as image_url FROM cities c ' +
        'LEFT JOIN images i ON i.city_id = c.id ' +
        'ORDER BY RANDOM() ' +
        'LIMIT 1'
    );

    // If no city found, return null
    if (cityResult.rows.length === 0) {
        return null;
    }

    const city = cityResult.rows[0];
    const imageResult = await query('SELECT * FROM images WHERE city_id = $1', [city.id]);
    const cluesResult = await query('SELECT * FROM clues WHERE city_id = $1', [city.id]);

    // Get random cities for options, excluding the selected city
    const randomCitiesResult = await query(
        'SELECT c.*, i.url as image_url FROM cities c ' +
        'LEFT JOIN images i ON i.city_id = c.id ' +
        'WHERE c.id != $1 ' +
        'ORDER BY RANDOM() ' +
        'LIMIT 3',
        [city.id]
    );

    const options = [city, ...randomCitiesResult.rows];
    // Implement a more robust shuffling using crypto for better randomness
    const shuffleArray = (array: any[]) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / (0xffffffff + 1) * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };
    shuffleArray(options);
    return {
        city,
        clues: cluesResult.rows,
        options,
        image: imageResult.rows[0]
    }
}

export async function getCityInfo(cityId: number) {
    const [images, fun_facts, airbnb_listing, wiki_history, headout_links] = await Promise.all([
        query('SELECT * FROM images WHERE city_id = $1', [cityId]),
        query('SELECT * FROM fun_facts WHERE city_id = $1', [cityId]),
        query('SELECT * FROM airbnb_listings WHERE city_id = $1', [cityId]),
        query('SELECT * FROM wiki_history WHERE city_id = $1', [cityId]),
        query('SELECT * FROM headout_links WHERE city_id = $1', [cityId])
    ]);

    return {
        images: images.rows,
        fun_facts: fun_facts.rows,
        airbnb_listing: airbnb_listing.rows,
        wiki_history: wiki_history.rows,
        headout_links: headout_links.rows
    };
}