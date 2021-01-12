import React from "react";
import "../styles/employee.scss"
import { Container, Col, Row } from "react-bootstrap";
import Header from "../components/employee/header/Header";
import Loader from "../components/employee/loader/Loader";
import Profile from "../components/employee/profile/Profile";
import BarChart from "../components/employee/barChart/BarChart";
import BubbleChart from "../components/employee/bubbleChart/BubbleChart"
import { CategoryPieChart } from "../components/employee/pieChart/CategoryPieChart";
import MobileView from "../components/employee/mobileView/MobileView";
import { getData } from "../server/employee/index";

class Employee extends React.Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = {
      isLoading: true,
      profile: {},
      projects: [],
      projectsBarChartData: [],
      technologies: []
    };
  }

  async componentDidMount() {
    this._isMounted = true; 
    const id = this.props.match.params.id; // this.props.match.params.id = employee´s id
    window.addEventListener("resize", this.resize.bind(this));
    this.resize();
    this.setState({ isLoading: true }); 
    const { employeeProfile, projects, projectsBarChart, technology } = await getData(id);
    this.setState({
      isLoading: false,
      profile: employeeProfile,
      projects: projects,
      projectsBarChartData : projectsBarChart,
      technologies : technology
    });
  }

  componentWillUnmount(){
    this._isMounted = false;
  }

  // Change value later when you make responsive 
  resize() {
    this.setState({ isMobileView: window.innerWidth <= 0 });
  }
  

  render() {

    return (
       <React.Fragment>
        {this.state.isMobileView ? (
          <MobileView />
        ) : this.state.isLoading ? (
          <Loader />
        ) : (
          <Container>
            <Header history={this.props.history}/>
            <Row>
              <Col xs={12} md={8}>
                <Profile
                  profile={this.state.profile}
                  projects={this.state.projects}
                />
              </Col>
              <Col xs={6} md={4}>
                <CategoryPieChart projects={this.state.projects} />
              </Col>
            </Row>
            {
              this.state.projectsBarChartData.length === 0 ? '' : 
            <BarChart data={this.state.projectsBarChartData} />
            }
            {
              Object.entries(this.state.technologies).length === 0 ? '' :
            <BubbleChart technologies={this.state.technologies}/>
            }
          </Container>
        )}
      </React.Fragment> 
    );
  }
}

export default Employee;
