import axios from 'axios';
import baseURL from './const';
export default axios.create({
	baseURL
});