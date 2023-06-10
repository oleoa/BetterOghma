import evaluations from './pages/evaluations';
import subscriptions from './pages/subscriptions';
import { page } from './url';

const sites: Map<string, () => void> = new Map([
  ['evaluations', evaluations],
  ['subscriptions', subscriptions],
]);

export const executeSite: () => void = () => {
  if (typeof page === 'string') {
    sites.get(page)?.();
  }
};
