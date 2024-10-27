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
import Finished from "./components/Finished";
import Footer from "./components/Footer";
import Timer from "./components/Timer";

const SEC_PERQ = 15;

const initialState = {
  questions: [],
  //loading,error,ready,active,finished
  status: "loading",
  index: 0,
  answer: null,
  score: 0,
  highscore: 0,
  secondsRemaining: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "dataReceived": // Fix the action type here
      return { ...state, questions: action.payload, status: "ready" };
    case "dataFailed":
      return { ...state, status: "error" };
    case "start":
      return {
        ...state,
        status: "active",
        secondsRemaining: state.questions.length * SEC_PERQ,
      };
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
    case "finish":
      return {
        ...state,
        status: "finished",
        highscore:
          state.score > state.highscore ? state.score : state.highscore,
      };
    case "reset":
      return {
        ...initialState,
        questions: state.questions,
        status: "ready",
        highscore: state.highscore,
      };
    case "tick":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? "finished" : state.status,
      };
    default:
      throw new Error("unknown error");
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const {
    questions,
    status,
    index,
    answer,
    score,
    highscore,
    secondsRemaining,
  } = state;

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
            <Footer>
              <Timer dispatch={dispatch} remaining={secondsRemaining} />
              <NextButton
                dispatch={dispatch}
                answer={answer}
                index={index}
                numQuestions={qLength}
              />
            </Footer>
          </>
        )}
        {status === "finished" && (
          <Finished
            points={score}
            maxPoints={maxPossiblePoints}
            highscore={highscore}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  );
}

export default App;
