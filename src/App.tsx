import CustomAbout from "./components/customAbout/CustomAbout";
import CustomHeader from "./components/customHeader/CustomHeader";
import CustomNavbar from "./components/customNavbar/CustomNavbar";
import CustomProject from "./components/customProject/CustomProject";

function App() {
  return (
    <div>
      <CustomNavbar/>
      <CustomHeader/>
      <CustomAbout/>
      <CustomProject/>
    </div>
  );
}

export default App;
