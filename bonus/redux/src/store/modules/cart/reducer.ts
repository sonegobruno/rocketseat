import { Reducer } from "redux";
import produce from 'immer';
import { ADD_PRODUCT_TO_CART_FAILURE, ADD_PRODUCT_TO_CART_SUCCESS } from "./keys";
import { ICartState } from "./types";

const INITIAL_STATE: ICartState = {
    items: [],
    failedStockCheck: []
}

const cart: Reducer<ICartState> = (state = INITIAL_STATE, action) => {
    return produce(state, draft => {
        switch(action.type) {
            case ADD_PRODUCT_TO_CART_SUCCESS: {
                const { product } = action.payload;

                const productInCartIndex = draft.items.findIndex(item => 
                    item.product.id === product.id    
                )

                if(productInCartIndex >= 0) {
                    draft.items[productInCartIndex].quantity++;
                    break;
                }

                draft.items.push({
                    product,
                    quantity: 1
                })

                break;
            }
            case ADD_PRODUCT_TO_CART_FAILURE: {
                draft.failedStockCheck.push(action.payload.productId)
                break;
            }
            default: {
                return draft;
            }
        }
    })
}

export default cart;