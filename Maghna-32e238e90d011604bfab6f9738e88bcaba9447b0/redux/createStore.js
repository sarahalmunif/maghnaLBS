/**
 * Reducers specify how the application's state changes in response to actions sent to the store.
 *
 * @see https://redux.js.org/basics/reducers
 */

import { createStore } from 'redux';
import reducers from './reducers';

export default function configureStore() {
	return createStore(
		reducers
    );
}
