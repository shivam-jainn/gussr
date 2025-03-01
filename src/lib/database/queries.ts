import { query } from "./db";

export async function getQuestion() {
    // Get total count of cities
    const countResult = await query('SELECT COUNT(*) FROM cities');
    const totalCities = parseInt(countResult.rows[0].count);
    
    // Generate random ID within range
    const cityId = Math.floor(Math.random() * totalCities) + 1;
    
    // Get random city
    const cityResult = await query('SELECT * FROM cities WHERE id = $1', [cityId]);

    const imageResult = await query('SELECT * FROM images WHERE city_id = $1', [cityId]);

    // If no city found, return null
    if (cityResult.rows.length === 0) {
        return null;
    }

    const city = cityResult.rows[0];
    const cluesResult = await query('SELECT * FROM clues WHERE city_id = $1', [city.id]);

    const randomCitiesResult = await query(
        'SELECT DISTINCT ON (c.id) c.*, i.url as image_url FROM cities c ' +
        'LEFT JOIN images i ON i.city_id = c.id ' +
        'WHERE c.id != $1 ' +
        'ORDER BY c.id, RANDOM() ' +
        'LIMIT 3',
        [city.id]
    );
    const randomCities = randomCitiesResult.rows;

    // Get the selected city with its image
    const cityWithImageResult = await query(
        'SELECT c.*, i.url as image_url FROM cities c ' +
        'LEFT JOIN images i ON i.city_id = c.id ' +
        'WHERE c.id = $1 ' +
        'LIMIT 1',
        [city.id]
    );

    const options = [cityWithImageResult.rows[0], ...randomCities];
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