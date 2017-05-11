// Header Component
class HeaderBox extends React.Component {
  render() {
    let logoTitle = "React JS";
    let listMenu = ["Home", "About", "Services", "Contact"];  
    return (
          <div className="container-fluid">
            <div className="navbar-header">
              <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
              <a className="navbar-brand" href="#">{logoTitle}</a>
            </div>
            <div id="navbar" className="navbar-collapse collapse">
              <ul className="nav navbar-nav navbar-right">
                {listMenu.map((menu, index) =><li key={index}><a href="#">{menu}</a></li>)}        
              </ul>
              <form className="navbar-form navbar-right">
                <input type="text" className="form-control" placeholder="Search..."/>
              </form>
            </div>
          </div>
    );
  }
}

let target = document.getElementById('header');
ReactDOM.render(<HeaderBox />, target);

// Body Component
class MainContent extends React.Component {
    
  constructor() {
      super();
      this.state = {
          showBoxies: true,
          infoBox: []
      };
  }    

  componentWillMount() {
    this._fetchBoxies();
  }    
 
  render() {
    const mainTitle = "Dashboard";
    const listBox = this._listBox();
    let boxNode;
    if(this.state.showBoxies) {
          boxNode = <div className="row mainbox">{listBox}</div>;
    }
    let textButton;  
    this.state.showBoxies? textButton = "Hide Boxies" :  textButton = "Show Boxies"; 
    return (
            <div>
                <h1 className="page-header">{mainTitle}
                    <button type="button" onClick={this._handleClick.bind(this)} className="btn btn-primary pull-right">{textButton}</button>
                </h1>
                {boxNode}                                     
                <hr className="divider" /> 
                <FooterBoxies number={listBox.length}/>
                <hr className="divider" />        
                <AddBox addbox={this._addbox.bind(this)}/>                        
            </div> 
        
    );
  }
  
  _listBox() {
    return this.state.infoBox.map((info)=>{
        return(
            <MainBox 
            icon={info.icon} 
            title={info.title} 
            description={info.description} 
            onDelete={this._deleteBox.bind(this)}
            id={info.id} />
        );
    }); 
  }   

  _handleClick() {
       this.setState({
           showBoxies: !this.state.showBoxies
       });  
  }  

  _addbox(title, description) {
      const box = {
          id: Math.floor(Math.random() * (9999 - this.state.infoBox.length + 1)) + this.state.infoBox.length,
          title: title,
          description: description
      };
      this.setState({infoBox:this.state.infoBox.concat([box])});
      
  }

  _fetchBoxies() {
    jQuery.ajax({
      method: 'GET',
      url: 'data/boxies.json',
      success: (infoBox) => {
        this.setState({ infoBox });
      }
    });
  }

  _deleteBox(boxID) {
    const infoBox = this.state.infoBox.filter(
      info => info.id !== boxID
    );
    this.setState({ infoBox });
  }

}

class MainBox extends React.Component {
  render() {
    return (
            <div className="col-md-4" key="{this.props.id}">
                   <i className="glyphicon {this.props.title}"></i>
                   <h2>{this.props.title} {this.props.id}</h2>
                   <p>{this.props.description}</p>
                   <RemoveCommentConfirmation onDelete={this._handleDelete.bind(this)} />
            </div>
    );
  }
  _handleDelete() {
    this.props.onDelete(this.props.id);
  }  
}

class FooterBoxies extends React.Component {
  render() {
    return (
            <div className="row text-left text-left">
                <div className="col-md-12">
                    <em>We have {this.props.number} Boxies</em>
                </div>        
            </div>        
    );
  }
}

class AddBox extends React.Component {
  constructor() {
    super();
    this.state = {
      characters: 0,
      errorMessage: false    
    };
  }    
    
  render() {
    let errorhtml;    
    if(this.state.errorMessage) {
       errorhtml = <div className="alert alert-danger">Please enter your title and description.</div>;    
    } else {
       errorhtml = ''; 
    }        
    return (
            <div className="row text-left text-left">
                <div className="col-md-12">
                    <h1 className="sub-header">Add/Edit Box</h1>
                    <form onSubmit={this._handleSubmit.bind(this)}>
                        {errorhtml}
                        <fieldset className="form-group">
                            <label>Title Box</label>
                            <input type="text" className="form-control" ref={(input)=> this._title = input}  placeholder="Enter Title" />
                        </fieldset>
                        <fieldset className="form-group">
                            <label>Description Box</label>
                            <textarea className="form-control" onKeyUp={this._getCharacterCount.bind(this)} ref={(textarea)=> this._description = textarea} rows="3" placeholder="Enter Description"></textarea>
                            <p>{this.state.characters} characters</p>
                        </fieldset>
                        <button type="submit" className="btn btn-primary">Add Box</button>
                        <p>{this.state.errorMessage}</p>
                    </form> 
                </div>        
            </div>         
    );
  }
  _handleSubmit(event){
     event.preventDefault();
      
     if (!this._title.value || !this._description.value) {
        this.setState({
          errorMessage: true   
        });         
      return;
     } else {
        this.setState({
          errorMessage: false   
        }); 
     }         
      
     this.props.addbox(this._title.value, this._description.value); 
     this._title.value = '';  
     this._description.value = ''; 
      
     this.setState({ characters: 0 });  
  }
  _getCharacterCount() {
    this.setState({
      characters: this._description.value.length
    });
  }
}

class RemoveCommentConfirmation extends React.Component {
  constructor() {
    super();
    this.state = {
      showConfirm: false
    };
  }
  
  render() {
    let confirmNode;
    if (this.state.showConfirm) {
      return (
        <span>
          <a href="" onClick={this._confirmDelete.bind(this)}>Yes </a> - or - <a href="" onClick={this._toggleConfirmMessage.bind(this)}> No</a>
        </span>
      );
    } else {
      confirmNode = <a href="" onClick={this._toggleConfirmMessage.bind(this)}>Delete comment?</a>;
    }
    return (
      <span>{confirmNode}</span>
    );
  }
  _toggleConfirmMessage(e) {
    e.preventDefault();
    
    this.setState({
      showConfirm: !this.state.showConfirm
    });
  }
  _confirmDelete(e) {
    e.preventDefault();
    this.props.onDelete();
    this.setState({
      showConfirm: !this.state.showConfirm
    });      
    
  }
}

let targetcontent = document.getElementById('maincontent');
ReactDOM.render(<MainContent />, targetcontent);