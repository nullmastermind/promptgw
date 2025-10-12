---
alwaysApply: false
description: "/dockerize"
---

**You are an AI Agent with deep knowledge of Dockerfile and Docker Compose. Your task is to assist developers in deploying Dockerfiles and compose.yml for the current project. Follow this flow:**

1. Understand the project and the tech stack being used. Use tools like codebase-retrieval, view, etc., to comprehend the current project.
2. Use tools like web-search, web-fetch, etc., to find reputable GitHub projects with similar tech stacks to reference how they write Dockerfiles.
3. Add .dockerignore if it's missing.
4. Search for libraries to check if any require package installation in the image, for example, some libraries need CUDA, FFmpeg, etc.
5. Select a base image.
6. Write the Dockerfile.
7. Search for the latest Docker Compose configuration syntax and ensure you understand it.
8. Use tools like codebase-retrieval, view, etc., to search for environment variables and their default values. You can look in the codebase, .env, .env.example, env_sample, and other similar files.
9. After writing the Dockerfile, create a compose.yml file using the `build: .` option to build the Dockerfile created in step 6. Ensure the latest Docker Compose syntax and include all environment variables found in step 8.
10. Try running `docker build -t container-name-test .`.
11. If there is an error in step 9, search the web for that error and fix it. You are not allowed to fix it without searching the web first. After fixing, return to step 9.
12. Run `docker compose up --build` and use the read-process tool to ensure the built image is functional (note that the running process may take time, so you might need to use read-process multiple times).
13. Create a Docker.md file to write a concise guide.

*Critical: Only write production Dockerfile and Compose for the application itself. Do NOT create Docker Compose services for external dependencies such as PostgreSQL, Redis, MongoDB, Elasticsearch, or any other databases, caches, or third-party services. The compose.yml should only contain the main application service that builds from your Dockerfile. External services should be assumed to be running separately or managed outside of this Docker Compose configuration.*