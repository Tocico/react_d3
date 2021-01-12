import React, { Component } from 'react';
import { Navbar, Form, Button } from 'react-bootstrap';
import Search from 'components/main/search/Search';
import Breadcrumb from 'components/main/breadcrumb/Breadcrumb';
import TagList from 'components/main/tagList/tagList';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Navbar className='header' variant='header' expand='lg'>
        <div className='h-row'>
          <div>
            <img src='img/logos/FindOut.png' alt='FindOut' className='brandLogo'/>
            
            <Form inline className='searchForm' onSubmit={e => e.preventDefault()}>
              <Search
                clients={this.props.clients}
                projects={this.props.projects}
                employees={this.props.employees}
                skills={this.props.skills}
                showObjectInformation={this.props.showObjectInformation}
                toggleDialogue={this.props.toggleDialogue}
                addSelectedObject={this.props.addSelectedObject}
                removeSelectedObject={this.props.removeSelectedObject}
                selectedObjects={this.props.selectedObjects}
                getProjectLogo={this.props.getProjectLogo}
              />
            </Form>

            <TagList
              selectedObjects={this.props.selectedObjects}
              removeSelectedObject={this.props.removeSelectedObject}
            />
          </div>
          <div className='right'>
            <Button className='ml-auto p-2' variant='light'>
              <i className='far fa-question-circle'></i>
            </Button>
          </div>
        </div>
        <div className='h-row'>
          <Breadcrumb
            clickedClient={this.props.clickedClient}
            breadcrumbClick={this.props.breadcrumbClick}
          />
        </div>

      </Navbar>
    );
  }
}

export default Header;