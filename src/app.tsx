// global CSS
import globalCss from './style.css';
document.head.append(VM.m(<style>{globalCss}</style>));

// CSS modules
import styles, { stylesheet } from './style.module.css';
