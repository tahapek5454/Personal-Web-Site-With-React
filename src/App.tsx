import CustomAbout from "./components/customAbout/CustomAbout";
import CustomExperiece from "./components/customExperience/CustomExperiece";
import CustomHeader from "./components/customHeader/CustomHeader";
import CustomNavbar from "./components/customNavbar/CustomNavbar";
import CustomProject from "./components/customProject/CustomProject";

function App() {
  return (
    <div>
      <CustomNavbar/>
      <CustomHeader/>
      <CustomAbout/>
      <CustomExperiece/>
      <CustomProject/>
    </div>
  );
}

export default App;
