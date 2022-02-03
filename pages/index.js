import FileBase64 from 'react-file-base64';
import React from 'react';
import Link from 'next/link';

class Home extends React.Component {
  constructor() {
    super()
    this.state = {
      files: []
    }
    this.handleSubmit = this.handleSubmit.bind(this)
  }
 
  // Callback~
  getFiles(files){
    this.setState({ files: files })
  }

  handleSubmit(){
    // ini fetch data
  }
  
  render(){
    return (
      <div>
        <form onSubmit={this.handleSubmit} className="flex items-center space-x-6">
          <FileBase64
            multiple={ true }
            onDone={ this.getFiles.bind(this) } 
          />
          <Link href="/dashboard">
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Generate Data</button>
          </Link>
        </form>
      </div>
    )
  }
}

export default Home;


