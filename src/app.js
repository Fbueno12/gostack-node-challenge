const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }
  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", ( request, response ) => {
  const { title, url, techs } = request.body;
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repo => repo.id == id);

  if( repositoryIndex < 0 ) {
    return response.status(400).json({message: "Repository not found"});
  }

  repositories[repositoryIndex].title = title;
  repositories[repositoryIndex].url = url;
  repositories[repositoryIndex].techs = techs;

  return response.json(repositories[repositoryIndex]);

});

app.delete("/repositories/:id", (request, response) => {
  const repoIndex = repositories.findIndex(repo => repo.id == request.params.id);

  if( repoIndex < 0 ) {
    return response.status(400).json({message: "Repository not found"});
  }

  repositories.splice(repoIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const repoIndex = repositories.findIndex(repo => repo.id == request.params.id);

  if( repoIndex < 0 ) {
    return response.status(400).json({message: "Repository not found"});
  }

  repositories[repoIndex].likes += 1;

  return response.json( repositories[repoIndex] );
});

module.exports = app;
