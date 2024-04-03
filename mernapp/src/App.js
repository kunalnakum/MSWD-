import './App.css';
import Home from './screens/Home';
import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";
import Login from './screens/Login';
import '../node_modules/bootstrap-dark-5/dist/css/bootstrap-dark.min.css'
import '../node_modules/bootstrap/dist/js/bootstrap.bundle';
import Signup from './screens/Signup';
import { CartProvider } from './components/ContextReducer';
import Cart from './screens/Cart';
import Navbar from './components/Navbar';
import MyOrder from './screens/MyOrder';


function App() {
  return (
    <CartProvider>
    <Router>
      
      <div>
        <Routes>
          <Route exact path='/' element={<Home/>}/> 
          <Route exact path='/login' element={<Login/>}/> 
          <Route exact path='/creatuser' element={<Signup/>}/> 
          <Route exact path='/myOrder' element={<MyOrder/>}/> 
          {/* <Route exact path='/cart' element={<Cart/>}/>  */}
        </Routes>
      </div>
    </Router>
    </CartProvider>
  );
}

export default App;
