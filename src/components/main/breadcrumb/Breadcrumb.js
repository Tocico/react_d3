import React from 'react';

class Breadcrumb extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      crumbs: []
    };
  }

  componentDidMount() {
    this.setState({ crumbs: [this.props.clickedClient] });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.clickedClient.length === 0) return;
    if (!this.isEqual(prevProps.clickedClient, this.props.clickedClient)) {
      const crumbs = [...prevState.crumbs, this.props.clickedClient];
      this.setState({ crumbs });
    }
  }

  handleClick(index) {
    if (index + 1 === this.state.crumbs.length) return;
    const client = this.state.crumbs[index];
    this.props.breadcrumbClick(client, true);
    const crumbs = this.state.crumbs.slice(0, index + 1);
    this.setState({ crumbs });
  }

  isEqual(a, b) {
    if (b.id === '' && b.name === '' && b.type === '') return true;
    if (a.id === b.id && a.type === b.type && a.name === b.name) {
      if (a.type === 'category' || a.type === 'more') {
        if (a.list.length !== b.list.length) return false;
        for (let index in a.list) 
          if (!this.isEqual(a.list[index], b.list[index])) return false;
      } 
      return true;
    } 
    return false;
  }

  render() {
    const crumbs = this.state.crumbs.map((_, i) => (
      <span className='crumb' onClick={this.handleClick.bind(this, i)} key={i} />
    ));
    return (
      <div className='breadcrumbs'>
        {crumbs}
      </div>
    );
  }
}

export default Breadcrumb;