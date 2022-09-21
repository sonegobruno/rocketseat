import { applyMiddleware, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';

import { ICartState } from './modules/cart/types';
import rootReducer from './modules/rootReducer';
import rootSaga from './modules/rootSaga';

export interface IState {
    cart: ICartState
}

const sagaMiddleare = createSagaMiddleware();

const middlewares = [sagaMiddleare];

//Informação que estará disponivel em toda aplicação
const store = createStore(rootReducer,
    applyMiddleware(...middlewares))


sagaMiddleare.run(rootSaga)

export default store;