import logo from "./logo.svg";
import "./App.css";
import Navbar from "./components/navbar";
import About from "./components/about";
import Footer from "./components/footer";
import List from "./components/list";
import TaskForm from "./components/createTask";

function App() {
  return (
    <div>
      <Navbar />
      {/* <About /> */}
      <List />
      <TaskForm />
      <Footer />
    </div>
  );
}

export default App;
