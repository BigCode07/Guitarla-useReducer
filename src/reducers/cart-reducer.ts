import { db } from "../data/db";
import { CartItem, Guitar } from "../types";

//Esta son las acciones que va a tener nuestra pagina
export type CartActions =
  | {
      type: "add-to-cart";
      payload: { item: Guitar };
    }
  | {
      type: "remove-from-cart";
      payload: { id: Guitar["id"] };
    }
  | {
      type: "decrease-quantity";
      payload: { id: Guitar["id"] };
    }
  | {
      type: "increase-quantity";
      payload: { id: Guitar["id"] };
    }
  | {
      type: "clear-cart";
    };

//Aca definimos como va arrancar nuestro State Inicial
export type CartState = {
  data: Guitar[];
  cart: CartItem[];
};

const initialCart = (): CartItem[] => {
  const localStorageCart = localStorage.getItem("cart");
  return localStorageCart ? JSON.parse(localStorageCart) : [];
};

//Asi arrancaria nuestra pagina web
export const initialState: CartState = {
  data: db,
  cart: initialCart(),
};

const MIN_ITEMS = 1;
const MAX_ITEMS = 5;

export const cartReducer = (
  state: CartState = initialState,
  action: CartActions
) => {
  if (action.type === "add-to-cart") {
    const itemExists = state.cart.find(
      (guitar) => guitar.id === action.payload.item.id
    );
    let updatedCart: CartItem[] = [];

    if (itemExists) {
      // Si el ítem ya existe en el carrito
      updatedCart = state.cart.map((item) => {
        if (item.id === action.payload.item.id) {
          // Si la cantidad es menor al máximo permitido, incrementamos
          if (item.quantity < MAX_ITEMS) {
            return { ...item, quantity: item.quantity + 1 };
          }
          return item; // Si ya alcanzó el límite, no hacemos cambios
        }
        return item; // Si no es el ítem que buscamos, lo dejamos sin cambios
      });
    } else {
      const newItem: CartItem = { ...action.payload.item, quantity: 1 };
      updatedCart = [...state.cart, newItem];
    }
    return {
      ...state,
      cart: updatedCart,
    };
  }
  if (action.type === "remove-from-cart") {
    //  setCart((staprevCart) => prevCart.filter((guitar) => guitar.id !== id));
    const cart = state.cart.filter((item) => item.id !== action.payload.id);
    return {
      ...state,
      cart,
    };
  }
  if (action.type === "decrease-quantity") {
    const cart = state.cart.map((item) => {
      if (item.id === action.payload.id && item.quantity > MIN_ITEMS) {
        return {
          ...item,
          quantity: item.quantity - 1,
        };
      }
      return item;
    });
    return {
      ...state,
      cart,
    };
  }

  if (action.type === "increase-quantity") {
    const cart = state.cart.map((item) => {
      if (item.id === action.payload.id && item.quantity < MAX_ITEMS) {
        return {
          ...item,
          quantity: item.quantity + 1,
        };
      }
      return item;
    });

    return {
      ...state,
      cart, // Return the updated cart directly
    };
  }

  if (action.type === "clear-cart") {
    return {
      ...state,
      cart: [],
    };
  }
  return state;
};
