import 'bootstrap/dist/css/bootstrap.min.css';

import './styles/style.scss';

import { setListeners, render } from './render';



document.addEventListener('DOMContentLoaded', function() {
    render();
 });

 setListeners();