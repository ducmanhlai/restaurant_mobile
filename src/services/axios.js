import axios from 'axios';
import baseURL from './const';
console.log(baseURL)
export default axios.create({
	baseURL
});