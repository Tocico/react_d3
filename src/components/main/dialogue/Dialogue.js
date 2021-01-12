import React from 'react';
import moment from 'moment';
import { Button } from "react-bootstrap";
import { Link } from 'react-router-dom';

const format = 'YYYY-MM-DD';
const placeholder = `${process.env.PUBLIC_URL}/img/employees/employee_placeholder.jpg`;

class Dialogue extends React.Component {

  setText(data, type) {
    switch (type) {
      case 'CLIENT':
        return (
          <div>
            <p><span className='bold'>Location: </span><br></br>{data.location}</p>
            <p>{data.description}</p>
          </div>
        );
      case 'EMPLOYEE':
        return (
          <div>
            <p><span className='bold'>Start date: </span><br></br>{data.dateInit}</p>
            <p><span className='bold'>End date: </span><br></br>{data.dateEnd}</p>
            <p><span className='bold'>Location: </span><br></br>{data.location}</p>
            <p><span className='bold'>Birthyear: </span><br></br>{data.birthYear}</p>
            <Link to={`/employeeview/${data.id}`}><Button>READ MORE</Button></Link>

          </div>
        );
      case 'PROJECT':
        return ( 
          <div>
            <p><span className='bold'>Client: </span><br></br>{data.clientName}</p>
            <p><span className='bold'>Start date: </span><br></br>{moment(data.dateInit).format(format)}</p>
            <p><span className='bold'>End date: </span><br></br>{moment(data.dateEnd).format(format)}</p>
            <p>{data.description}</p>
          </div>
        );
      default:  
        return <div/>;
    }
  }

  setName(data, type) {
    switch (type) {
      case 'CLIENT':
        return data.name;
      case 'EMPLOYEE':
      case 'PROJECT':
        return data.name;
      default:
        return '';
    }
  }

  setCategory(data, type) {
    switch (type) {
      case 'CLIENT':
        return data.category;
      case 'EMPLOYEE':
        return data.roll;
      case 'PROJECT':
        return data.type;
      default:
        return '';
    }
  }

  setImage(data, type) {
    switch (type) {
      case 'CLIENT':
      case 'PROJECT':
        return <img src={data.logo} alt={data.name} />;
      case 'EMPLOYEE':
        return <img src={data.img ? data.img : placeholder} alt={data.name} />;
      default:
        return <i className="fas fa-laptop-code"></i>;
    }
  }

  render() {
    const { dialogueIsShown, dialogueInfo } = this.props;
    const { data, type } = dialogueInfo;
    const imageDisplay = data ? this.setImage(data, type) : <i className="fas fa-laptop-code"></i> ;
    const text = data ? this.setText(data, type) : <div />;
    const category = data ? this.setCategory(data, type) : '';
    const name = data ? this.setName(data, type) : '';
    return (
      <div>
        <div className={dialogueIsShown ? 'dialogue' : 'dialogue hidden'}>
          <div className='identification'>
            {imageDisplay}
            <div className="spacing x-small"></div>
            <h2>{name}</h2>
            <p>{category}</p>
          </div>
          <div className='information'>
            {text}
          </div>
        </div>
      </div>
    );
  }
}

export default Dialogue;
