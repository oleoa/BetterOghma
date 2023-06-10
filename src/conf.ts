import { getItem, setItem } from './storage';

export const AVARAGE_DECIMAL_PARTS = 2;
setItem('DECREASE', getItem('DECREASE', 'true'));
