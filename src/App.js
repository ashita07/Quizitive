import { useEffect, useReducer } from "react";
import "./App.css";
import Header from "./Header";
import Main from "./Main";
import Error from "./Error";
import Loader from "./Loader";
import Ready from "./Ready";

const initialState = {
  questions: [],
  //loading,error,ready,active,finished
  status: "loading",
};

function reducer(state, action) {
  switch (action.type) {
    case "dataReceived": // Fix the action type here
      return { ...state, questions: action.payload, status: "ready" };
    case "dataFailed":
      return { ...state, status: "error" };
    default:
      throw new Error("unknown error");
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const { questions, status } = state;

  const qLength = questions.length;

  useEffect(function () {
    async function fetchData() {
      try {
        const data = await fetch("http://localhost:8000/questions");
        const ans = await data.json();
        dispatch({ type: "dataReceived", payload: ans }); // Action type matches reducer
      } catch (err) {
        dispatch({ type: "dataFailed", payload: err }); // Pass the error as payload if needed
      }
    }

    fetchData();
  }, []); // Empty dependency array to run once when the component mounts

  return (
    <div className="app">
      <Header />
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && <Ready length={qLength} />}
      </Main>
    </div>
  );
}

export default App;
