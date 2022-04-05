
import React from 'react';
import './App.css';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isSearch : false,
      fieldValue : "",
      showActive : true,
      showCompleted : true,
      tasks : [
        {
          id: 1,
          checked: true,
          title: "Learn Javascript"
        },
        {
          id: 2,
          checked: true,
          title: "Learn React"
        },
        {
          id: 3,
          checked: false,
          title: "Build react app"
        },
        {
          id: 4,
          checked: false,
          title: "Learn Next js"
        },
        {
          id: 5,
          checked: false,
          title: "Learn Flutter"
        },
        {
          id: 6,
          checked: false,
          title: "Learn React Native"
        }
      ]
    }

  }

  createTask(title) {
    return {
      id: this.state.tasks.length + 1,
      checked: false,
      title: title
    };
  }

  handleInputChange( {target} ) {
    this.setState({
      [target.name] : target.value 
    })
  }

  handleInputChecked( {target} ) {

    let tasks = this.state.tasks.slice();
    let index = parseInt(target.name);

    tasks[index - 1] = {
      id : index,
      checked : target.checked,
      title : tasks[index].title
    };
     
    this.setState({
      tasks : tasks
    });
  }

  search() {
    this.setState({
      isSearch : true
    });
  }

  add() {

    if (this.state.fieldValue.length > 0 && !this.state.isSearch) {
      let tasks = this.state.tasks.slice();

      tasks.push(this.createTask(this.state.fieldValue));
      
      this.setState({
        isSearch : false,
        fieldValue: "",
        tasks : tasks
      });
    }
    else {
      this.setState({
        fieldValue: "",
        isSearch : false
      });
    }
    
  }

  show(active, completed) {
    this.setState({
      showActive: active,
      showCompleted: completed
    });
  }

  checkActive(task) {
    return !task.checked;
  }

  checkCompleted(task) {
    return task.checked;
  }

  checkFound(task) {
    return (this.state.fieldValue.length > 0) ? task.title.search(new RegExp(this.state.fieldValue, "i")) !== -1 : true;
  }

  filter() {
    let data = this.state.tasks.slice();

    if (this.state.isSearch) {
      data = data.filter((value) => {return this.checkFound(value)});
    }

    if (this.state.showActive && !this.state.showCompleted) {
      let result = data.filter(this.checkActive);
      return result
    }

    if (!this.state.showActive && this.state.showCompleted) {
      let result = data.filter(this.checkCompleted);
      return result;
    }

    return data;
  }

  render() {
    return (
      <div className='container'>
        <div className='row justify-content-center mt-5'>
          <div className='col-6'>
            <div className='card'>
              <div className='card-body'>
                <h3 className='text-center'>THINGS TO DO</h3>
                <Form 
                  name= "fieldValue" 
                  value={this.state.fieldValue} 
                  placeholder={this.state.isSearch ? "Search" : "Add new"} 
                  onChange={(e) => {this.handleInputChange(e)}} />
                <TaskList onCheck={(e) => {this.handleInputChecked(e)}} tasks={this.filter()} />
                <ToolBar 
                  show={{
                    active : this.state.showActive,
                    completed : this.state.showCompleted
                  }}
                  nbItem={this.filter().length} 
                  onAdd={() => {this.add()}} 
                  onSearch={() => {this.search()}}
                  onFilter={(active, completed) => {this.show(active, completed)}} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class Form extends React.Component {

  render() {
    return (
      <div className='mb-3'>
        <input type="text" value={this.props.value} placeholder={this.props.placeholder} name={this.props.name} className='form-control' onChange={this.props.onChange} />
      </div>
    );
  }
}

class TaskList extends React.Component {

  render() {
    return (
      <ol className='list-group'>
        {this.props.tasks.map((task) => (
          <Task onCheck={this.props.onCheck} data={task} />
        ))}
      </ol>
    );
  }
}

class Task extends React.Component {

  render() {
    return (
      <label className='list-group-item'>
        <input type="checkbox" name={this.props.data.id} onChange={this.props.onCheck} className='form-check-input' checked={this.props.data.checked} />
        {
          this.props.data.checked ? (
            <span className='text-decoration-line-through'>{this.props.data.title}</span>
          ) : (
            <span>{this.props.data.title}</span>
          )
        }
        
      </label>
    );
  }
}

class ToolBar extends React.Component {

  render() {
    return (
      <div className='navbar'>
        <div>
          <button className='btn' onClick={this.props.onAdd}>
            <i class="bi bi-plus"></i>
          </button>
          <button className='btn' onClick={this.props.onSearch}>
            <i class="bi bi-search"></i>
          </button>
          <span>|</span>
          <span> {this.props.nbItem} {
            this.props.nbItem > 1 ? (<span>items</span>) : (<span>item</span>)
          } left</span>
        </div>
        <ul className='nav nav-pills'>
          <li className='nav-item'>
            {
              (this.props.show.active && this.props.show.completed) ? 
              (
                <button className='btn nav-link active' onClick={() => {this.props.onFilter(true, true)}}>All</button>
              ) :
              (
                <button className='btn nav-link' onClick={() => {this.props.onFilter(true, true)}}>All</button>
              )
            }
          </li>
          <li className='nav-item'>
            {
              (this.props.show.active && !this.props.show.completed) ? 
              (
                <button className='btn nav-link active' onClick={() => {this.props.onFilter(true, false)}}>Active</button>
              ) :
              (
                <button className='btn nav-link' onClick={() => {this.props.onFilter(true, false)}}>Active</button>
              )
            }
          </li>
          <li className='nav-item'>
            {
              (!this.props.show.active && this.props.show.completed) ? 
              (
                <button className='btn nav-link active' onClick={() => {this.props.onFilter(false, true)}}>Completed</button>
              ) :
              (
                <button className='btn nav-link' onClick={() => {this.props.onFilter(false, true)}}>Completed</button>
              )
            }
            
          </li>
        </ul>
      </div>
    );
  }
}

export default App;
