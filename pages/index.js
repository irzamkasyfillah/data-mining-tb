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
      <div className="flex flex-col items-center md:pt-20">
        <div className="grid p-5 justify-items-center	max-w-full">
          <div className='max-w-xl p-16 shadow-xl rounded-lg bg-white'>
            <form onSubmit={this.handleSubmit} className="grid grid-rows-1 place-content-center">
              <div className='m-2 bg-slate-100 box-content p-4 border-2 rounded-lg border-dashed'>
                <div className='flex place-items-center'>
                  <FileBase64
                    multiple={ true }
                    onDone={ this.getFiles.bind(this) } 
                  />
                </div>
              </div>
              <div className='m-2 grid place-content-center'>
                <Link href="/dashboard">
                  <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Generate Data</button>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default Home;


