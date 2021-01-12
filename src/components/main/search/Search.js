import React from 'react';
import { FormControl } from 'react-bootstrap';
import { search, removeItem } from './actions';
import Result from 'components/main/search/Result';
class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      searchWord: '',
      focus: false
    };
  }

  handleChange = (e) => {
    console.log(this.props)
    const results = search(e.target.value, this.props);
    this.setState({
      list: results,
      searchWord: e.target.value
    });
  }

  clearSearch = () => {
    this.setState({
      searchWord: '',
      list: []
    });
    this.setState({ focus: false });
    this.props.toggleDialogue(false);
  }

  removeFromResults = (item) => {
    const results = removeItem(item, this.state.list);
    this.setState({ list: results });
  }

  componentDidMount() {

  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClick, false);
  }

  handleClick = (e) => {
    if (!this.node.contains(e.target)) {
      this.handleClickOutside();
    }
  }

  handleClickOutside = () => {
    this.clearSearch();
    document.removeEventListener('mousedown', this.handleClick, false);
    document.removeEventListener('keydown', this.handleEsc, false);


  }

  handleEsc = (e) => {
    if (e.key === 'Escape') {
      this.clearSearch();
      document.removeEventListener('keydown', this.handleEsc, false);
      this.node.blur();
    }
  }

  focusElement = (e) => {
    document.addEventListener('mousedown', this.handleClick, false);
    document.addEventListener('keydown', this.handleEsc, false);
    this.setState({ focus: true });
  }



  render() {
    return (
      <React.Fragment>
        <div className="search-input">
          <FormControl
            ref={node => this.node = node}
            value={this.state.searchWord}
            type="text"
            placeholder="Search"
            className="search-bar"
            onChange={this.handleChange}
            onMouseDown={this.focusElement}
          />
          {this.state.focus &&
            <i className="fas fa-times-circle" onMouseDown={() => this.clearSearch()}></i>
          }
        </div>
        <div className="results">
          <ul>
            {this.state.list.map((item, index) =>
              <Result
                key={index}
                item={item}
                showObjectInformation={this.props.showObjectInformation}
                toggleDialogue={this.props.toggleDialogue}
                clickHandler={this.props.addSelectedObject}
                removeSelectedObject={this.props.removeSelectedObject}
                clearSearch={this.clearSearch}
                getProjectLogo={this.props.getProjectLogo}
              />)}
          </ul>
        </div>
      </React.Fragment >
    );
  }
}

export default Search;