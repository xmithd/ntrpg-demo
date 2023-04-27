import {createRoot} from 'react-dom/client';
import App from './components/App';

import './style.css';

// entry point for the React application.

const container = document.getElementById('app');
const root = createRoot(container!);
root.render(<App />);
