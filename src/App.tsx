import "./App.css";
import Footer from "./components/Footer.tsx";
import Navbar from "./components/Navbar.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";

function App() {

  return <>
  <div className="container">
 <Navbar />

 {/* // main section for the app */}
 <main >
 <RegisterPage />
</main>



 <Footer />
 </div>
  </>;
}

export default App;
