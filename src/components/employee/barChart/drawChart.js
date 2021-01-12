function groupedProjects(data){
const grouped = {};
for (let client of data) {
  if (!(client.client in grouped)) grouped[client.client] = [client];
  else grouped[client.client].push(client);
}
return {grouped}
}


export { groupedProjects };