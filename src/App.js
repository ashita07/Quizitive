import { useEffect, useReducer } from "react";
import "./App.css";
import Header from "./components/Header";
import Main from "./components/Main";
import Error from "./components/Error";
import Loader from "./components/Loader";
import Ready from "./components/Ready";
import Question from "./components/Question";
import NextButton from "./components/NextButton";
import Progress from "./components/Progress";

const initialState = {
  questions: [],
  //loading,error,ready,active,finished
  status: "loading",
  index: 0,
  answer: null,
  score: 0,
};

function reducer(state, action) {
  switch (action.type) {
    case "dataReceived": // Fix the action type here
      return { ...state, questions: action.payload, status: "ready" };
    case "dataFailed":
      return { ...state, status: "error" };
    case "start":
      return { ...state, status: "active" };
    case "newAnswer":
      const question = state.questions[state.index];
      return {
        ...state,
        answer: action.paylaod,
        score:
          action.payload === question.correctOption
            ? state.score + question.points
            : state.score,
      };
    case "nextQuestion":
      return { ...state, index: state.index + 1, answer: null };

    default:
      throw new Error("unknown error");
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const { questions, status, index, answer, score } = state;

  const qLength = questions.length;
  const maxPossiblePoints = questions.reduce(
    (prev, cur) => prev + cur.points,
    0
  );

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
        {status === "ready" && <Ready length={qLength} dispatch={dispatch} />}
        {status === "active" && (
          <>
            <Progress
              index={index}
              numQuestions={qLength}
              points={score}
              max={maxPossiblePoints}
              answer={answer}
            />
            <Question
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />
            <NextButton dispatch={dispatch} answer={answer} />
          </>
        )}
      </Main>
    </div>
  );
}

export default App;
