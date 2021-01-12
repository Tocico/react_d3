import axios from 'axios';

const apiRoute = 'http://localhost';
export async function fetchEmployee() {

  const requestURL = `${apiRoute}/employee/all/zero`;
  const options = {
    url: requestURL,
    responseType: "json",
    method: 'GET',
  };

  let response;
  try {
    response = await axios(options);
  } catch (error) {
    return {};
  }

  if (response.status === 200) {
    const employees = response.data;
    return { employees };
  }
}
export async function fetchCustomer() {

  const requestURL =`${apiRoute}/customer/all/zero`;
  const options = {
    url: requestURL,
    responseType: "json",
    method: 'GET',
  };

  let response;
  try {
    response = await axios(options);

  } catch (error) {
    return {};
  }

  if (response.status === 200) {
    const clients = response.data;
    return { clients};
  }
}

export async function fetchProject() {

  const requestURL =`${apiRoute}/project/all/zero`;
  const options = {
    url: requestURL,
    responseType: "json",
    method: 'GET',
  };

  let response;
  try {
    response = await axios(options);
  } catch (error) {
    return {};
  }

  if (response.status === 200) {
    const projects = response.data;
    return { projects};
  }
}

export async function fetchProjectCount() {

  const requestURL =`${apiRoute}/project/total`;
  const options = {
    url: requestURL,
    responseType: "json",
    method: 'GET',
  };

  let response;
  try {
    response = await axios(options);
  } catch (error) {
    return {};
  }

  if (response.status === 200) {
    const projectsCount = response.data;
    return { projectsCount};
  }
}
