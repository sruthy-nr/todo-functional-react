// src/components/Todo.tsx
import React, { useState,useEffect } from 'react';
import './style.css';
import axios from 'axios';


interface Todo {
  id: number;
  text: string;
  fromtime: string;
  totime: string;
  date: string;
  completed: boolean;
}

const TodoApp: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [inputFromTime, setInputFromTime] = useState<string>('');
  const [inputToTime, setInputToTime] = useState<string>('');
  const [inputDate, setInputDate] = useState<string>('');
  const [editText, setEditText] = useState<string>('');
  const [editFromTime, setEditFromTime] = useState<string>('');
  const [editToTime, setEditToTime] = useState<string>('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDate, setEditDate] = useState<string>('');
  const [filterDate, setFilterDate] = useState<string>('');

  const today = new Date().toISOString().split('T')[0];
useEffect(()=>{
  const fetchData=async () => {
    await axios.get("http://localhost:5001/api/").then(res=>{
      setTodos(res.data)
      console.log(res.data)
    }).catch(error=>console.log(error.message))
  }


  fetchData();
},[])
  const addTodo = async() => {
    if (inputText.trim() === '' || inputFromTime.trim() === '' || inputToTime.trim() === '' || inputDate.trim() === '') return;

    const newTodo: Todo = {
      id: todos.length+1,
      text: inputText,
      fromtime: inputFromTime,
      totime: inputToTime,
      date: inputDate,
      completed: false,
    };
    console.log(newTodo);
   await axios.post("http://localhost:5001/api",newTodo)
      .then(response => {
        console.log('New ToDo item created:', response.data);
        setTodos(response.data);
        setInputText('');
        // Add your logic to handle the response
      })
      .catch(error => {
        console.log('Error creating ToDo item:', error.message);
      });
    console.log(todos);
  };

  const toggleTodo = async(id: number) => {
    await axios.patch(`http://localhost:5001/api/${id}`)
      .then(response => {
        console.log('ToDo item edited:', response.data);
        setTodos(response.data);
        // setInputText('');
        // Add your logic to handle the response
      })
      .catch(error => {
        console.log('Error editing ToDo item:', error.message);
      });
    console.log(todos);
    // setTodos((prevTodos) =>
    //   prevTodos.map((todo) =>
    //     todo.id === id ? { ...todo, completed: !todo.completed } : todo
    //   )
    // );
  };

  const startEditing = (id: number, text: string, fromtime: string, totime: string, date: string) => {
    setEditingId(id);
    setEditText(text);
    setEditFromTime(fromtime);
    setEditToTime(totime);
    setEditDate(date);
  };
 
  const saveEditing = async(id: number) => {

    const editTodo: Todo = {
      id: id,
      text: editText,
      fromtime: editFromTime,
      totime: editToTime,
      date: editDate,
      completed: false,
    };
    console.log(editTodo);
    await axios.put(`http://localhost:5001/api/${id}`,editTodo)
      .then(response => {
        console.log('ToDo item edited:', response.data);
        setTodos(response.data);
        // setInputText('');
        // Add your logic to handle the response
      })
      .catch(error => {
        console.log('Error editing ToDo item:', error.message);
      });
    console.log(todos);
    // setTodos((prevTodos) =>
    //   prevTodos.map((todo) =>
    //     todo.id === id ? { ...todo, text: editText, fromtime: editFromTime, totime: editToTime, date: editDate } : todo
    //   )
    // );
    setEditingId(null);
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterDate(e.target.value);
    setInputDate(e.target.value);
  };

  const filteredTodos = filterDate
    ? todos.filter((todo) => todo.date === filterDate)
    : [];


    console.log(filterDate,filteredTodos);
//   const deleteTodo = (id: number) => {
//     setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
//   };
  

  return (
    <div>
      <div>
      <h1>Todo App</h1>
      <div>
        {/* <input
          type="date"
          value={inputDate}
          min={today}
          onChange={(e) => setInputDate(e.target.value)}
        />  */}
        DATE: 
        <input
          type="date"
          min={today}
          value={filterDate}
          onChange={handleFilterChange}
        />
        &nbsp;&nbsp;&nbsp;&nbsp;
        <input
          type="text"
          placeholder="Add a todo"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        /> <br /><br />
        FROM:<input
          type="time"
          value={inputFromTime}
          onChange={(e) => setInputFromTime(e.target.value)}
        />&nbsp;&nbsp;&nbsp;&nbsp;
        TO:<input
          type="time"
          value={inputToTime}
          onChange={(e) => setInputToTime(e.target.value)}
        />&nbsp;&nbsp;&nbsp;&nbsp; <br /><br />
        <button onClick={addTodo} className='button'>Add</button>
      </div>
      </div>
      <div className='xyz'>
        {filteredTodos.map((todo) => (
          <span key={todo.id}>
          {editingId === todo.id ? (
            <div>
                <div className="card">
                    <div className="container">
                        <br />
              <input
                type="date"
                min={editDate}
                value={editDate}
                onChange={(e) => setEditDate(e.target.value)}
              /> <br /><br />
              Task: <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
              /> <br /><br />
             From: <input
                type="time"
                value={editFromTime}
                onChange={(e) => setEditFromTime(e.target.value)}
              />&nbsp;&nbsp;
             To: <input
                type="time"
                value={editToTime}
                onChange={(e) => setEditToTime(e.target.value)}
              />
              <br /><br /><br />
              <button onClick={() => saveEditing(todo.id)} className='button'>Save</button>&nbsp;&nbsp;
              <button onClick={cancelEditing} className='button'>Cancel</button>
              </div>
              </div>
            </div>
          ) : (
            <div>
                <div className="card">
                    <div className="container">
                    {todo.date}
              <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
                        <h4><b>Task:  {todo.text}</b>
                        <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => toggleTodo(todo.id)}
                        />
                        </h4>
                            <p>Time: {todo.fromtime} - {todo.totime}</p>
              </span>
                    </div>
                    {!todo.completed&&<button className='button' onClick={() => startEditing(todo.id, todo.text, todo.fromtime, todo.totime, todo.date)}>Edit</button>}
              {todo.completed&& <b className='done'>DONE</b>}
                </div>
              
              {/* <button onClick={() => deleteTodo(todo.id)}>Delete</button> */}
            </div>
          )}
        </span>
        ))}
      </div>
    </div>
  );
};

export default TodoApp;

