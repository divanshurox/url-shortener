import React, { Component } from 'react'
import './App.css';
import axios from 'axios';

export class App extends Component {
  state = {
    url: '',
    slug: '',
    shortURL: ''
  }
  changeHandler = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }
  submitHandler = () => {
    const { url, slug } = this.state;
    this.setState({ shortURL: 'http://localhost:5000/' + slug });
    const config = {
      headers: {
        "content-type": "application/json"
      }
    }
    const body = JSON.stringify({ url, slug });
    axios.post('/url', body, config)
      .then(res => {
        console.log(res)
      })
    this.state.url = '';
    this.state.slug = '';
  }
  render() {
    return (
      <div className="App">
        <div className='card' style={{ backgroundColor: '#262626', width: '80%', margin: '200px auto' }}>
          <div className='card-body'>
            <h1 class="card-title">Butt.ly</h1>
            <form>
              <div class="form-group">
                <div className='col-3' style={{ margin: '50px auto' }}>
                  <input onChange={this.changeHandler} className="effect-2" type="text" name="url" placeholder="Enter URL" />
                  <span className="focus-border"></span>
                </div>
              </div>
              <div class="form-group">
                <div className='col-3' style={{ margin: '50px auto' }}>
                  <input className="effect-2" onChange={this.changeHandler} type="text" name="slug" placeholder="Enter Slug" />
                  <span className="focus-border"></span>
                </div>
              </div>
              <button onClick={this.submitHandler} type="button" class="btn btn-success" style={{ width: '50%', position: 'relative', left: '280px' }}>Success</button>
            </form>
            <h2 className='text-center h2 mt-5'>Your shortened URL is: <a target="_blank" href={this.state.shortURL} style={{ color: '#56bc58' }}>{this.state.shortURL}</a></h2>
          </div>
        </div>
      </div>
    );
  }
}

export default App
