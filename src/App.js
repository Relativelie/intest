import './App.css';
import { ProjectName } from './Projectname';
import { CreateLists } from './Createlists';

function App() {
  return (
    <div className="App">
      <div className='plannerHeaderContainer'>
        <div className="plannerHeader">
          <h1>Your Planner</h1>
          <ProjectName />
        </div>
      </div>

      <CreateLists />
    </div>
  );
}

export default App;
