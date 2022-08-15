const axios = require('axios').default;
export default async function searchImage(name, page, imagePerPage) {
    try {
        const API = '29165116-db33726688e81f885d73ac474';
        const response = await axios.get(`https://pixabay.com/api/?key=${API}&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${imagePerPage}`);
        return response
    } catch (error) {
        console.error(error);
    }
}