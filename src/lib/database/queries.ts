import { query } from "./db";

export async function getQuestion() {
    // Get total count of cities
    const countResult = await query('SELECT COUNT(*) FROM cities');
    const totalCities = parseInt(countResult.rows[0].count);
    
    // Generate random ID within range
    const cityId = Math.floor(Math.random() * totalCities) + 1;
    
    // Get random city
    const cityResult = await query('SELECT * FROM cities WHERE id = $1', [cityId]);

    if (cityResult.rows.length === 0) {
        return null;
    }

    const city = cityResult.rows[0];
    const cluesResult = await query('SELECT * FROM clues WHERE city_id = $1', [city.id]);

    // Get 3 random cities different from the selected city
    const randomCitiesResult = await query(
        'SELECT * FROM cities WHERE id != $1 ORDER BY RANDOM() LIMIT 3',
        [city.id]
    );
    const randomCities = randomCitiesResult.rows;

    const options = [city, ...randomCities];
    return {
        city,
        clues: cluesResult.rows,
        options
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