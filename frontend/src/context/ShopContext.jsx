/* eslint-disable react/prop-types */
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import axios from 'axios'


// eslint-disable-next-line react-refresh/only-export-components
export const ShopContext = createContext();

const ShopContextProvider = (props) => {

    const currency = '$';
    const delivery_fee = 10;
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [search,setSearch] = useState('');
    const [showSearch,setShowSearch] = useState(false);
    const [cartItems,setCartItems] = useState({});
    const [products, setProducts] = useState([]);
    const [token,setToken] = useState('');
    const navigate = useNavigate();


    //logic for Add To Cart
    const addToCart = async (itemId,size) => {

        if(!size) {
            toast.error('Select Product Size');
            return;
        }

        let cartData = structuredClone(cartItems);

        if(cartData[itemId]) {
            if(cartData[itemId][size]) {
                cartData[itemId][size] += 1;
            } else {
                cartData[itemId][size] = 1;
            }
        } else {
            cartData[itemId] = {} ;
            cartData[itemId][size] = 1;
        }
        setCartItems(cartData);

        if(token) {
            try {
                await axios.post(backendUrl + '/api/cart/add', {itemId,size}, {headers:{token}})

            } catch (error) {
                console.log(error);
                toast.error(error.message)
            }
        }
    }

    //logic for Cart count products we add it will show the nmbr in cart
    const getCartCount = () => {
        let totalCount = 0;
        for(const items in cartItems) {
            for(const item in cartItems[items]) {
                try {
                    if(cartItems[items][item] > 0) {
                        totalCount += cartItems[items][item];
                    }
                // eslint-disable-next-line no-empty, no-unused-vars
                } catch (error) {
                    
                }
            }
        }
        return totalCount;
    }

    //logic for deleting or updating product in cart 
    const updateQuantity = async (itemId,size,quantity) => {
        let cartData = structuredClone(cartItems);
        cartData[itemId][size] = quantity;
        setCartItems(cartData);

        if(token) {
            try {
                await axios.post(backendUrl + '/api/cart/update', {itemId, size, quantity}, {headers: {token}})
            } catch (error) {
                console.log(error);
                toast.error(error.message)
            }
        }
    }

    const getUserCart = async ( token ) => {
        try {
            const response = await axios.post(backendUrl + '/api/cart/get',{},{headers:{token}})
            if(response.data.success) {
                setCartItems(response.data.cartData)
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }
    }

    //logic for getting amount of the products
    const getCartAmount =  ()  => {
        let totalAmount = 0;
        for(const items in cartItems) {
            let itemsInfo = products.find((product)=> product._id === items);
            for(const item in cartItems[items]) {
                try {
                    if(cartItems[items][item] > 0) {
                        totalAmount += itemsInfo.price * cartItems[items][item]
                    }
                // eslint-disable-next-line no-unused-vars
                } catch (error) { /* empty */ }
            }
        }
        return totalAmount;
    }

    // Fetch products data from the backend
   const getProductsData = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/product/list');
            //console.log(response.data);
            if(response.data.success) {
                setProducts(response.data.products) 
            } else {
                toast.error(response.data.message)
            }
            
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
   }

   useEffect(() => {
    getProductsData()
   // eslint-disable-next-line react-hooks/exhaustive-deps
   },[])

    useEffect(() => { 
        if (!token && localStorage.getItem("token")) {
            setToken(localStorage.getItem("token")); // Set token from localStorage
            getUserCart(localStorage.getItem("token"))
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Empty dependency array ensures this runs once

    const value = {
        products, currency, delivery_fee, backendUrl,
        search, setSearch, showSearch, setShowSearch,
        cartItems,addToCart, getCartCount, setCartItems,
        updateQuantity, getCartAmount, navigate,
        token,setToken
    }

    return(
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider