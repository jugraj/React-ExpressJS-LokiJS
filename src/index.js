import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import "./styles.scss";
const GATEWAY_URL = "http://localhost:8282";

function App() {
    const [state, setState] = useState({ fruit: "", quantity: 0, cart: {} });

    const addFruit = e => {
        e.preventDefault();
        if (e.target.fruit.value !== "")
            axios
                .post(`${GATEWAY_URL}/add-fruit`, {
                    name: e.target.fruit.value,
                    quantity: parseFloat(e.target.quantity.value)
                })
                .then(response => {
                    setState({
                        ...state,
                        fruit: response.data.FruitName,
                        quantity: response.data.Quantity
                    });
                })
                .catch(function(error) {
                    console.log(error);
                });
        e.target.fruit.value = "";
        e.target.quantity.value = "";
    };

    const removeFruit = fruit => {
        axios
            .post(`${GATEWAY_URL}/remove-fruit`, {
                name: fruit
            })
            .then(response => {
                setState({ ...state, cart: response.data });
            })
            .catch(function(error) {
                console.log(">>>>>>>>>", error);
            });
    };

    useEffect(() => {
        axios
            .get(`${GATEWAY_URL}/get-fruits`)
            .then(resp => {
                console.log(resp.data);
                setState({ ...state, cart: resp.data });
            })
            .catch(err => {
                console.log(err);
            });
    }, [state.fruit, state.quantity]);

    return (
        <div className="App">
            <header>Lunch and Learn - React + ExpressJS</header>
            <div className="main">
                <div>
                    <h1>Add some fruits to cart</h1>
                    <h2>
                        Go on, don't be shy! It's called 5-a-day for a reason
                    </h2>
                    <form onSubmit={addFruit} className="form">
                        <label htmlFor="fruit">Select a fruit</label>
                        <select id="fruit">
                            <option value="">Select a fruit</option>
                            <option value="apple">Apple</option>
                            <option value="orange">Orange</option>
                            <option value="banana">Banana</option>
                            <option value="jackfruit">Jackfruit</option>
                            <option value="katsucurry">Katsu Curry?</option>
                        </select>
                        <label htmlFor="quantity">Quantity</label>
                        <input type="number" id="quantity" placeholder="??" />
                        <button type="submit">
                            <i className="fas fa-plus" /> Go on, add it!
                        </button>
                    </form>
                </div>
                <div className="cart">
                    <ul>
                        {Object.keys(state.cart).map(val => (
                            <li key={val}>
                                <div className="cart__fruit-name">{val}</div>
                                <div className="cart__fruit-quantity">
                                    {state.cart[val]}
                                </div>
                                <button onClick={() => removeFruit(val)}>
                                    <i className="far fa-trash-alt" />
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
