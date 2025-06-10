"use client";

import { useState, useEffect } from "react";
// import TodoForm from "./TodoForm";
// import TodoItem from "./TodoItem";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Set auth token for axios
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, []);

  // Fetch todos from API
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/todos");
        setTodos(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching todos:", err);
        setLoading(false);
      }
    };

    fetchTodos();
  }, []);

  // Add todo
  const addTodo = async (text) => {
    try {
      const res = await axios.post("http://localhost:5000/api/todos", { text });
      setTodos([res.data, ...todos]);
    } catch (err) {
      console.error("Error adding todo:", err);
    }
  };

  // Toggle complete
  const toggleComplete = async (id) => {
    try {
      const todoToUpdate = todos.find((todo) => todo._id === id);
      const updatedTodo = {
        ...todoToUpdate,
        completed: !todoToUpdate.completed,
      };

      await axios.put(`http://localhost:5000/api/todos/${id}`, updatedTodo);

      setTodos(
        todos.map((todo) =>
          todo._id === id ? { ...todo, completed: !todo.completed } : todo
        )
      );
    } catch (err) {
      console.error("Error updating todo:", err);
    }
  };

  // Delete todo
  const deleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/todos/${id}`);
      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (err) {
      console.error("Error deleting todo:", err);
    }
  };

  if (loading) {
    return <div className="loading">Loading your todos...</div>;
  }

  return (
    <div className="todo-container">
      <h2>Welcome back, {user?.name}!</h2>
      <p>Manage your personal todo list</p>
      <TodoForm addTodo={addTodo} />
      <div className="todo-list">
        {todos.length === 0 ? (
          <p className="no-todos">
            No todos yet! Add one above to get started.
          </p>
        ) : (
          todos.map((todo) => (
            <TodoItem
              key={todo._id}
              todo={todo}
              toggleComplete={toggleComplete}
              deleteTodo={deleteTodo}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TodoList;
